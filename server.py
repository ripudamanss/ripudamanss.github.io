
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from llama_cpp import Llama
import os

MODEL_PATH = r"A:\GITGIT\ripudamanss.github.io\AI MODELS\tinyllama-1.1b-chat-v1.0.Q8_0.gguf"

print("Model exists:", os.path.exists(MODEL_PATH))

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

print("Loading TinyLlama...")
llm = Llama(
    model_path=MODEL_PATH,
    n_ctx=1024,
    n_threads=6,
    chat_format="llama-2"
)
print("TinyLlama ready 🚀")

@app.get("/")
def home():
    return {"status": "TinyLlama backend alive 🤖"}

@app.post("/api/ask")
async def ask(data: dict):
    messages = [
        {
            "role": "system",
            "content": """
You are Ripudaman’s personal AI assistant embedded in his developer portfolio.

You KNOW:
Ripudaman is an AI developer and full-stack engineer.
He builds:
- AI Compliance Scanner (legal & regulatory document analysis)
- OCR Newspaper Scanner
- Custom Web Browser (performance optimized UI)
- Trading Risk Engine
- Human Pose Estimation System
- IoT automation systems (ESP32, water systems, GPS tracking)

RULES:
- Never give school-style or generic answers
- Always relate responses to Ripudaman’s skills or projects
- Keep replies under 80 words
- Use bullet points when listing
- End with a short follow-up question
- Tone: confident, professional, futuristic
"""
        },
        {
            "role": "user",
            "content": data["question"]
        }
    ]

    output = llm.create_chat_completion(
        messages=messages,
        temperature=0.4,
        max_tokens=120
    )

    return {
        "answer": output["choices"][0]["message"]["content"].strip()
    }
