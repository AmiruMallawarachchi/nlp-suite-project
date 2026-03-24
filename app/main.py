from fastapi import FastAPI, HTTPException # type: ignore
from fastapi.middleware.cors import CORSMiddleware # type: ignore

from app.schemas import (
    SummarizationRequest, SummarizeResponse,
    SentimentRequest, SentimentResponse,SentimentScore,
    ZeroShotRequest, ZeroShotResponse, labelScore,
    NERRequest, NERResponse, Entity,
    QARequest, QAResponse, AnswerCandidate,
    BatchRequest, BatchResponse,
)

from app.pipelines import (
    summarizer, sentiment, zero_shot, ner, qa,
    SENTIMENT_CONFIDENCE_THRESHOLD, 
    QA_ANSWERABLE_THRESHOLD,
)

# App Setup

app = FastAPI(
    title="Multi-Task NLP Intelligence Suite",
    description="A FastAPI application that provides NLP services using HuggingFace models.",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Helper functions

def chuck_and_summarize(text: str,max_length: int, min_length: int) -> str:
    """
    Splits long text into chunks and summarises each one.
    Handles BART's 1024 token limit.
    """
    # BART's max input length is around 1024 tokens, which is roughly 900 words.
    # To be safe, we use 900 words as the chunk size.
    words = text.split()
    chunks = [ " ".join(words[i:i + 900]) for i in range(0, len(words), 900) ]
    
    summaries = []
    for chunk in chunks:
        summary = summarizer(
            chunk, 
            max_length=max_length, 
            min_length=min_length, 
            do_sample=False,
        )
        summaries.append(summary[0]['summary_text'])

    if len(summaries) == 1:
        combined = " ".join(summaries)
        final = summarizer(
            combined, 
            max_length=max_length, 
            min_length=min_length, 
            do_sample=False,
        )
        return final[0]['summary_text']
    
    return summaries[0]


def build_annotated_text(text: str, entities: list) -> str:
    """
    Injects entity labels into the original text.
    Input:  "Elon Musk works at Tesla"
    Output: "[Elon Musk/PER] works at [Tesla/ORG]"
    Processes right to left so character positions stay accurate.
    """
    sorted_entities = sorted(entities, key=lambda x: x['start'], reverse=True)
    for ent in sorted_entities:
        s, e = ent['start'], ent['end']
        label = ent['entity_type']
        text = text[:s] + f"[{text[s:e]}/{label}]" + text[e:]
    return text

# Info routes

@app.get("/")
def root ():
    return {"name": "Multi-Task NLP Intelligence Suite",
            "version": "1.0.0",
            "author": "Amiru AI Lab",
            "docs": "http://127.0.0.1:8000/docs",
    }

@app.get("/health")
def health():
    return {"status": "ok", "models_loaded": 5}

# Routes

@app.post("/summarize", response_model=SummarizeResponse)
def summarize(req: SummarizationRequest):
    try:
        summary = chuck_and_summarize(
            req.text,
            req.max_length,
            req.min_length,
        )

        original_words = len(req.text.split())
        summary_words = len(summary.split())

        return SummarizeResponse(
            summary=summary,
            original_word_count=original_words,
            summary_word_count=summary_words,
            compression_ratio=round(summary_words / original_words, 3),
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/sentiment", response_model=SentimentResponse)
def analyze_sentiment(req: SentimentRequest):
    try:
        results = sentiment(req.text)[0]  # Get the list of label scores

        all_scores = [
            SentimentScore(label=s['label'], score=round(s['score'],4)) 
            for s in results
        ]

        top = max(results, key=lambda x: x['score'])

        return SentimentResponse(
            label=top['label'],
            confidence=round(top['score'],4),
            low_confidence=top['score'] < SENTIMENT_CONFIDENCE_THRESHOLD,
            all_scores=all_scores,
        )
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@app.post("/zero-shot", response_model=ZeroShotResponse)
def zero_shot_classification(req: ZeroShotRequest):
    try:
        result = zero_shot(
            sequences=req.text,
            candidate_labels=req.labels,
            multi_label=req.multi_label,
        )

        all_labels = [
            labelScore(label=l, score=round(s,4)) 
            for l, s in zip(result['labels'], result['scores'])
        ]

        return ZeroShotResponse(
            top_label=result['labels'][0],
            top_score=round(result['scores'][0],4),
            all_labels=all_labels,
            multi_label=req.multi_label,
        )
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    

@app.post("/ner", response_model=NERResponse)
def named_entity_recognition(req: NERRequest):
    try:
        result = ner(req.text)

        entities = [
            Entity(
                word=e['word'],
                entity_type=e['entity_group'],
                score=round(e['score'],4),
                start=e['start'],
                end=e['end'],
            )
            for e in result
        ]

        annotated = build_annotated_text(req.text, result)

        return NERResponse(
            entities=entities,
            entity_count=len(entities),
            annotated_text=annotated,
        )
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    

@app.post("/qa", response_model=QAResponse)
def question_answering(req: QARequest):
    try:
        result = qa(
            question=req.question,
            context=req.context,
            top_k=req.top_k,
        )

        candiadates_raw = result if isinstance(result, list) else [result]

        candiadates = [
            AnswerCandidate(
                answer=c['answer'],
                score=round(c['score'],4),
                start=c['start'],
                end=c['end'],
            )
            for c in candiadates_raw
        ]

        best = candiadates[0]
        answerable = best.score >= QA_ANSWERABLE_THRESHOLD

        return QAResponse(
            answerable=answerable,
            answer=best.answer if answerable else None,
            confidence=best.score,
            candiadates=candiadates,
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@app.post("/batch", response_model=BatchResponse)
def batch(req: BatchRequest):
    try:

        # Summarization - only if the test is long enough
        if len(req.text.split()) > 50:
            summary_text = chuck_and_summarize(
                req.text,
                req.summary_max_length,
                20,
            )
            ow = len(req.text.split())
            sw = len(summary_text.split())
            summ = SummarizeResponse(
                summary=summary_text,
                original_word_count=ow,
                summary_word_count=sw,
                compression_ratio=round(sw / ow, 3),
            )
        else:
            summ = None

        # Sentiment
        sr = sentiment(req.text)[0]
        top_sent = max(sr, key=lambda x: x['score'])
        sent = SentimentResponse(
            label=top_sent['label'],
            confidence=round(top_sent['score'],4),
            low_confidence=top_sent['score'] < SENTIMENT_CONFIDENCE_THRESHOLD,
            all_scores=[
                SentimentScore(label=s['label'], score=round(s['score'],4)) 
                for s in sr
            ],
        )

        # Zero-Shot
        zr = zero_shot(
            req.text,
            candidate_labels=req.zs_labels,
            multi_label=False,
        )
        cls = ZeroShotResponse(
            top_label=zr['labels'][0],
            top_score=round(zr['scores'][0],4),
            all_labels=[
                labelScore(label=l, score=round(s,4)) 
                for l, s in zip(zr['labels'], zr['scores'])
            ],
            multi_label=False,
        )

        # NER
        nr = ner(req.text)
        ner_res = NERResponse(
            entities=[
                Entity(
                    word=e['word'],
                    entity_type=e['entity_group'],
                    score=round(e['score'],4),
                    start=e['start'],
                    end=e['end'],
                )
                for e in nr
            ],
            entity_count=len(nr),
            annotated_text=build_annotated_text(req.text,nr),
        )

        # QA - only if question and context are provided
        qa_res = None
        if req.qa_question:
            ctx = req.qa_context or req.text
            qr = qa(question=req.qa_question,context=ctx,top_k=1,)
            cr = qr if isinstance(qr, list) else [qr]
            best = cr[0]
            answerable = best['score'] >= QA_ANSWERABLE_THRESHOLD
            qa_res = QAResponse(
                answerable=answerable,
                answer=best['answer'] if answerable else None,
                confidence=round(best['score'],4),
                candiadates=[
                    AnswerCandidate(
                        answer=c['answer'],
                        score=round(c['score'],4),
                        start=c['start'],
                        end=c['end'],
                    )
                    for c in cr
                ],
            )

        return BatchResponse(
            input_preview=req.text[:100] + ("..." if len(req.text) > 100 else ""),
            summarization=summ,
            sentiment=sent,
            zero_shot=cls,
            ner=ner_res,
            question_answering=qa_res,
        )
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    

