import asyncio
import base64
import tempfile
import threading
import time
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.concurrency import asynccontextmanager
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Any, List, Optional
import starlette.websockets as ws
import uvicorn

from hume_agent import LOCK, add_file, hume_main
from hume.models.config import BurstConfig
from hume.models.config import ProsodyConfig, FaceConfig

from openai_agent import get_paragraphs

app = FastAPI()

def print_emotions(emotions: list[dict[str, Any]]) -> None:
    emotion_map = {e["name"]: e["score"] for e in emotions}
    for emotion in ["Joy", "Sadness", "Anger"]:
        print(f"- {emotion}: {emotion_map[emotion]:4f}")

origins = [
    "http://localhost:8010",
    "ws://localhost:8010",
    "http://localhost:3001",
    "http://localhost",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def read_root():
    return {"message": "Welcome to FastAPI!"}

@app.get("/health")
def get_health():
    return {"status": 200}

class RequestModel(BaseModel):
    paragraphs: list[str]
    emotions: List[str]

@app.post("/process-text")
def process_text(request: RequestModel):
    paragraphs = request.paragraphs
    emotions = request.emotions
    
    # Example logic for processing text and emotions
    # result = [f"Processed with emotion '{emotion}'" for emotion in emotions]
    
    return {"result": get_paragraphs(emotions, paragraphs)}

from hume_agent import configs, hume_client

def start_background_task():
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    loop.run_until_complete(hume_main())

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Start the background task
    thread = threading.Thread(target=start_background_task, daemon=True)
    thread.start()
    yield
    # Clean up or stop background tasks if needed here
    print("Lifespan context manager is exiting")

app.router.lifespan_context = lifespan
@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    print("WebSocket connected")
    await websocket.accept()
    async with hume_client.connect([FaceConfig()]) as socket:
        while True:
            await websocket.send_json({"hi": "hi"})
            try:
                data = await websocket.receive_json()
                
                if 'ss' in data:
                    print('got ss')
                    ss = data['ss']
                    # add_file(ss)
                    # Remove data URL prefix if present
                    if ss.startswith("data:"):
                        ss = ss.split(",")[1]
                    # Decode the base64 string
                    file_content = base64.b64decode(ss)
                    
                    # Create a temporary file
                    with tempfile.NamedTemporaryFile(delete=False) as temp_file:
                        temp_file.write(file_content)
                        temp_file_path = temp_file.name
                    
                    # Send the file via socket
                    with open(temp_file_path, 'rb') as temp_file:
                        result = await socket.send_file(temp_file_path)
                
                    emotions = result["face"]["predictions"][0]["emotions"]
                    # print_emotions(emotions)
                    # print(emotions)

                    resp = {
                        "emotions": emotions
                    }
                    await websocket.send_json(resp)
            except ws.WebSocketDisconnect:
                print("WebSocket connection closed")
                await asyncio.sleep(10)

@app.websocket("/ws-audio")
async def websocket_endpoint(websocket: WebSocket):
    print("WebSocket connected")
    await websocket.accept()
    async with hume_client.connect([ProsodyConfig()]) as socket:
        while True:
            await websocket.send_json({"hi": "hi"})
            try:
                data = await websocket.receive_json()
                
                if 'audio' in data:
                    print('got ss')
                    ss = data['ss']
                    # add_file(ss)
                    # Remove data URL prefix if present
                    if ss.startswith("data:"):
                        ss = ss.split(",")[1]
                    # Decode the base64 string
                    file_content = base64.b64decode(ss)
                    
                    # Create a temporary file
                    with tempfile.NamedTemporaryFile(delete=False) as temp_file:
                        temp_file.write(file_content)
                        temp_file_path = temp_file.name
                    
                    # Send the file via socket
                    with open(temp_file_path, 'rb') as temp_file:
                        result = await socket.send_file(temp_file_path)
                
                    emotions = result["face"]["predictions"][0]["emotions"]
                    # print_emotions(emotions)
                    print(emotions)

                    resp = {
                        "emotions": emotions,
                        "time": time.time()
                    }
                    await websocket.send_json(resp)
            except ws.WebSocketDisconnect:
                print("WebSocket connection closed")
                await asyncio.sleep(1)
            except Exception as e:
                print('error', e)
                await asyncio.sleep(0.5)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8010, reload=True)
