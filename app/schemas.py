from pydantic import BaseModel, Field # type: ignore
from typing import Optional

# Summarization

class SummarizationRequest(BaseModel):
    text: str = Field(
        ..., 
        min_length = 50,
        max_length = 10000,
        example = "Artificial intelligence is transforming how companies build software. "
                  "Large language models can now generate code, write documentation, "
                  "and debug complex issues in seconds.",
    )
    max_length: int = Field(default=80, ge=20, le=300)
    min_length: int = Field(default=25, ge=10, le=100)

class SummarizeResponse(BaseModel):
    summary: str
    Original_word_count: int
    Summary_word_count: int
    compression_ratio: float

# Sentiment Analysis

class SentimentRequest(BaseModel):
    text: str = Field(
        ..., 
        min_length = 3,
        max_length = 512,
        example = "I absolutely love how HuggingFace makes NLP so accessible!",
    )

class SentimentScore(BaseModel):
    label: str
    score: float

class SentimentResponse(BaseModel):
    label: str
    confidence: float
    low_confidence: bool
    all_scores:list[SentimentScore]


# Zero-Shot Classification

class ZeroShotRequest(BaseModel):
    text: str = Field(
        ..., 
        min_length = 5,
        max_length = 1000,
        example = "The new transformer architecture reduces inference time by 40%.",
    )

    labels: list[str] = Field(
        ..., 
        min_items = 2,
        example = ["technology", "politics", "sports", "business", "science"],
    )

    multi_label: bool = Field(
        default=False,  
    )

class labelScore(BaseModel):
    label: str
    score: float

class ZeroShotResponse(BaseModel):
    top_label: str
    top_score: float
    all_labels: list[labelScore]
    multi_label: bool

# Named Entity Recognition

class NERRequest(BaseModel):
    text: str = Field(
        ..., 
        min_length = 5,
        max_length = 512,
        example = "Elon Musk announced that Tesla will open a new factory in Berlin.",
    )

class Entity(BaseModel):
    word: str
    entity_type: str
    score: float
    start: int
    end: int

class NERResponse(BaseModel):
    entities: list[Entity]
    entity_count: int
    annotated_text: str


# Question Answering

class QARequest(BaseModel):
    question: str = Field(
        ..., 
        min_length = 5,
        max_length = 500,
        example = "Who founded HuggingFace?",
    )

    context: str = Field(
        ..., 
        min_length = 20,
        max_length = 2000,
        example = "HuggingFace was founded in 2016 by Clement Delangue, "
                "Julien Chaumond, and Thomas Wolf.",
    )

    top_k: int = Field(
        default=1, 
        ge=1, 
        le=20,
    )

class AnswerCandidate(BaseModel):
    answer: str
    score: float
    start: int
    end: int

class QAResponse(BaseModel):
    answerable: bool
    answer: Optional[str]
    confidence: float
    candiates: list[AnswerCandidate]

# Batch 

class BatchRequest(BaseModel):
    text: str = Field(
        ..., 
        min_length = 5,
        max_length = 10000,
        example = "Sam Altman, CEO of OpenAI, announced a $10 billion partnership "
                "with Microsoft to accelerate AGI research in Seattle.",
    )

    summary_max_length: int = Field(default=80, ge=20, le=300)
    zs_labels: list[str] = Field(
        ..., 
        min_items = 2,
        example = ["technology", "politics", "sports", "business", "science"],
    )
    qa_question: Optional[str] = Field(
        default=None,      
        example="How much is the partnership worth?",
    )
    qa_context: Optional[str] = Field(
        default=None
    )

class BatchResponse(BaseModel):
    input_preview: str
    summarization:Optional[SummarizeResponse]
    sentiment: SentimentResponse
    classification: ZeroShotResponse
    ner: NERResponse
    question_answering: Optional[QAResponse]

    