from transformers import pipeline
import torch

# Setting up the model
sentiment = pipeline(
    "sentiment-analysis",
    model="cardiffnlp/twitter-roberta-base-sentiment-latest",
    return_all_scores=True,
    device=-1  # use CPU for test
)

# Test cases
test_texts = ["I love this update!", "AI will die in 2030"]

for text in test_texts:
    result = sentiment(text)
    print(f"--- Text: {text} ---")
    print(f"Type: {type(result)}")
    print(f"Result: {result}")
    
    # Simulate current backend flattening logic
    if isinstance(result, list) and len(result) > 0 and isinstance(result[0], list):
        flattened = result[0]
        print(f"Flattened (1 level): {flattened}")
        if isinstance(flattened, list) and len(flattened) > 0 and isinstance(flattened[0], dict):
             print(f"Final results: {flattened}")
    else:
        print("Flattening logic failed to detect nested list")
