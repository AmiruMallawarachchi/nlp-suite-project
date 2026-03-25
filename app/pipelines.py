# app/pipelines.py
# Loads all 5 HuggingFace models once when the server starts.

from transformers import pipeline # type: ignore
from transformers.pipelines import QuestionAnsweringPipeline # type: ignore
import torch # type: ignore

# Detect GPu automatically and use it if available, otherwise fall back to CPU.
# GPU = 0 means the first GPU, -1 means CPU.
# Check if a GPU is available and set the device accordingly

DEVICE = 0 if torch.cuda.is_available() else -1

print(f"[pipeline] Running on: {'GPU' if DEVICE == 0 else 'CPU'}")

# Confindence threshold for all pipelines  
SENTIMENT_CONFIDENCE_THRESHOLD = 0.5
QA_ANSWERABLE_THRESHOLD = 0.10

# Loading all 5 models.

print("[pipelines] Loading summarization model...")
summarizer = pipeline(
    "summarization", 
    model="facebook/bart-large-cnn", 
    device=DEVICE,
)

print("[pipelines] Loading sentiment analysis model...")
sentiment = pipeline(
    "sentiment-analysis",
    model="cardiffnlp/twitter-roberta-base-sentiment-latest",
    return_all_scores=True,
    device=DEVICE,
)

print("[pipelines] Loading Zero-shot classification model...")
zero_shot = pipeline(
    "zero-shot-classification",
    model="facebook/bart-large-mnli",
    device=DEVICE,
)

print("[pipelines] Loading NER model...")
ner = pipeline(
    "ner",
    model="dslim/bert-base-NER",
    aggregation_strategy="simple",
    device=DEVICE,
)

print("[pipelines] Loading question-answering model...")
qa = pipeline(
    "question-answering",
    model="deepset/roberta-base-squad2",
    device=DEVICE,
)

print("[pipelines] All 5 models loaded successfully!")
