from fastapi import FastAPI, HTTPException # type: ignore
from fastapi.middleware.cors import CORSMiddleware # type: ignore

from app.schemas import (
    SummarizationRequest, SummarizeResponse,
    SentimentRequest, SentimentResponse,SentimentScore,
    ZeroShotRequest, ZeroShotResponse, LabelScore,
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
        if summary and isinstance(summary, list) and isinstance(summary[0], dict):
            summaries.append(summary[0].get('summary_text', ''))

    if len(summaries) > 1:
        combined = " ".join(summaries)
        final = summarizer(
            combined, 
            max_length=max_length, 
            min_length=min_length, 
            do_sample=False,
        )
        if final and isinstance(final, list) and isinstance(final[0], dict):
            return final[0].get('summary_text', '')
    
    return summaries[0] if summaries else ""


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
        label = ent['entity_group']
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
        sentiment_result = sentiment(req.text)
        results = list(sentiment_result) if sentiment_result is not None else []
        
        # Filter to only dictionary results
        results = [s for s in results if isinstance(s, dict)]
        
        if not results:
            results = [{'label': 'NEUTRAL', 'score': 0.0}]

        all_scores = [
            SentimentScore(label=str(s.get('label', '')), score=round(float(s.get('score', 0)),4)) 
            for s in results
        ]
        
        top = max(results, key=lambda x: x.get('score', 0))

        return SentimentResponse(
            label=str(top.get('label', 'NEUTRAL')),
            confidence=round(float(top.get('score', 0)),4),
            low_confidence=float(top.get('score', 0)) < SENTIMENT_CONFIDENCE_THRESHOLD,
            all_scores=all_scores,
        )
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@app.post("/zero-shot", response_model=ZeroShotResponse)
def zero_shot_classification(req: ZeroShotRequest):
    try:
        result = zero_shot(
            req.text,
            candidate_labels=req.labels,
            multi_label=req.multi_label,
        )

        labels = list(result.get('labels', [])) if isinstance(result, dict) else []
        scores = list(result.get('scores', [])) if isinstance(result, dict) else []
        
        all_labels = [
            LabelScore(label=str(l), score=round(float(s),4)) 
            for l, s in zip(labels, scores)
        ]

        return ZeroShotResponse(
            top_label=str(labels[0]) if labels else '',
            top_score=round(float(scores[0]),4) if scores else 0.0,
            all_labels=all_labels,
            multi_label=req.multi_label,
        )
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    

@app.post("/ner", response_model=NERResponse)
def named_entity_recognition(req: NERRequest):
    try:
        result = ner(req.text)
        result_list = list(result) if result else []
        result_list = [e for e in result_list if isinstance(e, dict)]
        
        entities = [
            Entity(
                word=str(e.get('word', '')),
                entity_type=str(e.get('entity_group', '')),
                score=round(float(e.get('score', 0)), 4),
                start=int(e.get('start', 0)),
                end=int(e.get('end', 0)),
            )
            for e in result_list
        ]

        annotated = build_annotated_text(req.text, result_list)

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
            top_k=req.top_k
        )
        
        candidates_raw = result if isinstance(result, list) else [result]

        candidates = [
            AnswerCandidate(
                answer=str(c.get('answer', '')),
                score=round(float(c.get('score', 0)), 4),
                start=int(c.get('start', 0)),
                end=int(c.get('end', 0)),
            )
            for c in candidates_raw if isinstance(c, dict)
        ]

        if not candidates:
            return QAResponse(
                answerable=False,
                answer=None,
                confidence=0.0,
                candidates=[],
            )

        best = candidates[0]
        answerable = best.score >= QA_ANSWERABLE_THRESHOLD

        return QAResponse(
            answerable=answerable,
            answer=best.answer if answerable else None,
            confidence=best.score,
            candidates=candidates,
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"QA Error: {str(e)}")
    
@app.post("/batch", response_model=BatchResponse)
def batch(req: BatchRequest):
    try:
        # Summarization - only if the text is long enough
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
        sentiment_result = sentiment(req.text)
        sr = list(sentiment_result) if sentiment_result is not None else []
        sr = [s for s in sr if isinstance(s, dict)]
        top_sent = max(sr, key=lambda x: x.get('score', 0)) if sr else {'label': 'NEUTRAL', 'score': 0.0}
        top_sent_dict = top_sent if isinstance(top_sent, dict) else {'label': 'NEUTRAL', 'score': 0.0}
        top_label = str(top_sent_dict.get('label', 'NEUTRAL'))
        top_score = float(top_sent_dict.get('score', 0.0))
        sent = SentimentResponse(
            label=top_label,
            confidence=round(top_score, 4),
            low_confidence=top_score < SENTIMENT_CONFIDENCE_THRESHOLD,
            all_scores=[
                SentimentScore(label=str(s.get('label', '')), score=round(float(s.get('score', 0)),4)) 
                for s in sr
            ],
        )

        # Zero-Shot
        zr = zero_shot(
            req.text,
            candidate_labels=req.zs_labels,
            multi_label=False,
        )
        zr_labels = list(zr.get('labels', [])) if isinstance(zr, dict) else []
        zr_scores = list(zr.get('scores', [])) if isinstance(zr, dict) else []
        cls = ZeroShotResponse(
            top_label=str(zr_labels[0]) if zr_labels else '',
            top_score=round(float(zr_scores[0]),4) if zr_scores else 0.0,
            all_labels=[
                LabelScore(label=str(l), score=round(float(s),4)) 
                for l, s in zip(zr_labels, zr_scores)
            ],
            multi_label=False,
        )

        # NER
        nr = ner(req.text)
        nr_list = list(nr) if nr else []
        nr_list = [e for e in nr_list if isinstance(e, dict)]
        ner_res = NERResponse(
            entities=[
                Entity(
                    word=str(e.get('word', '')),
                    entity_type=str(e.get('entity_group', '')),
                    score=round(float(e.get('score', 0)),4),
                    start=int(e.get('start', 0)),
                    end=int(e.get('end', 0)),
                )
                for e in nr_list
            ],
            entity_count=len(nr_list),
            annotated_text=build_annotated_text(req.text, nr_list),
        )

        # QA - only if question and context are provided
        qa_result = None
        if req.qa_question and req.qa_context:
            qa_output = qa(
                question=req.qa_question,
                context=req.qa_context,
                top_k=1
            )

            qa_output_list = qa_output if isinstance(qa_output, list) else [qa_output]

            candidates = [
                AnswerCandidate(
                    answer=str(c.get("answer", "")),
                    score=round(float(c.get("score", 0)), 4),
                    start=int(c.get("start", 0)),
                    end=int(c.get("end", 0)),
                )
                for c in qa_output_list if isinstance(c, dict)
            ]

            if candidates:
                best = candidates[0]
                qa_result = QAResponse(
                    answerable=True,
                    answer=best.answer,
                    confidence=best.score,
                    candidates=candidates,
                )

        return BatchResponse(
            input_preview=req.text[:100] + ("..." if len(req.text) > 100 else ""),
            summarization=summ,
            sentiment=sent,
            classification=cls,
            ner=ner_res,
            question_answering=qa_result,
        )
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Batch Error: {str(e)}")
    

