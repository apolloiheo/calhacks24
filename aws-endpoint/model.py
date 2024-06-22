from transformers import BertTokenizer, BertForSequenceClassification
import torch

tokenizer = BertTokenizer.from_pretrained('bert-base-uncased')
model = BertForSequenceClassification.from_pretrained('bert-base-uncased')

# Example function to preprocess input
def preprocess(text):
    inputs = tokenizer(text, return_tensors="pt", truncation=True, padding=True)
    return inputs

# Example function to predict
def predict(text):
    inputs = preprocess(text)
    outputs = model(**inputs)
    return torch.nn.functional.softmax(outputs.logits, dim=-1)
