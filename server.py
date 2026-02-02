from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from llama_cpp import Llama
import os
from datetime import datetime
# ======================
# CONFIG
# ======================
MODEL_PATH = r"A:\GITGIT\ripudamanss.github.io\AI MODELS\tinyllama-1.1b-chat-v1.0.Q8_0.gguf"
MAX_CHARS = 400
MAX_ROUNDS = 5  # how many times model can "continue"

# ======================
# APP
# ======================
print("Model exists:", os.path.exists(MODEL_PATH))

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# ======================
# MODEL
# ======================
print("Loading TinyLlama...")
llm = Llama(
    model_path=MODEL_PATH,
    n_ctx=512,
    n_threads=6
)
print("TinyLlama ready 🚀")

# ======================
# TUNING
# ======================
SYSTEM_PROMPT = """
You are Ripudaman Singh Shekhawat’s personal AI assistant embedded in his portfolio website.

ALLOWED TOPICS ONLY:
- Ripudaman Singh Shekhawat
- His AI, trading, IoT, and software projects
- His skills, experience, tools, and this website

STRICT RULES:
- If a question is NOT about the above, respond exactly:
"I'm only allowed to answer questions about Ripudaman’s work and this website."
- Keep answers under 80 words
- Tone: professional, technical, confident
- Use bullet points for lists
- End with a short follow-up question
"""

GREETINGS = [
    "hi", "hello", "hey", "yo", "hola", "namaste",
    "good morning", "good evening", "good afternoon",
    "thanks", "thank you"
]

KEYWORDS = [
    "ripudaman", "shekhawat", "portfolio", "project", "ai",
    "trading", "iot", "website", "developer", "software",
    "system", "automation", "model", "app", "engine", "hello"
]

def allowed_question(text: str) -> bool:
    t = text.lower().strip()
    
    # Allow Greetings
    if any(g in t for g in GREETINGS):
        return True
    
    # Allow Portfolio Topics
    return any(k in t for k in KEYWORDS)

# ======================
# SMART GENERATOR
# ======================
def generate_full_answer(prompt: str, max_rounds=MAX_ROUNDS):
    full_text = ""
    current_prompt = prompt

    for _ in range(max_rounds):
        output = llm.create_completion(
            prompt=current_prompt,
            temperature=0.3,
            max_tokens=120,
            stop=["User:", "System:"]
        )

        chunk = output["choices"][0]["text"]
        full_text += chunk

        # If model finished cleanly, stop
        if chunk.strip().endswith((".", "?", "!", "\n")):
            break

        # Otherwise, ask it to continue
        current_prompt += chunk + "\nContinue:\n"

    return full_text.strip()


# ======================
# ROUTES
# ======================
@app.get("/")
def home():
    return {"status": "Personal AI backend running 🔒"}

@app.post("/api/ask")
async def ask(data: dict):
    question = data.get("question", "").strip()

    if not question:
        return {"answer": "Ask me about Ripudaman’s projects or this website."}

    if len(question) > MAX_CHARS:
        return {"answer": "Message too long. Keep it short and related to Ripudaman’s work."}

    # HARD FILTER
    if not allowed_question(question):
        return {
            "answer": "I'm only allowed to answer questions about Ripudaman’s work and this website."
        }

    prompt = f"""
System:
{SYSTEM_PROMPT}

User:
{question}

Assistant:
"""

    answer = generate_full_answer(prompt)

    return {
        "answer": answer
    }

@app.get("/api/greet")
def greet():
    hour = datetime.now().hour

    if hour < 12:
        time_greeting = "Good morning"
    elif hour < 18:
        time_greeting = "Good afternoon"
    else:
        time_greeting = "Good evening"

    return {
        "answer": f"""{time_greeting}! I’m Ripudaman’s personal AI assistant 🤖

You can ask me about his projects and skills:

What would you like to explore first?"""
    }
