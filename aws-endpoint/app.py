from flask import Flask, request, jsonify
from model import predict

app = Flask(__name__)

@app.route('/predict', methods=['POST'])
def predict_endpoint():
    data = request.json
    text = data['text']
    prediction = predict(text)
    return jsonify(prediction.tolist())

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5242)
