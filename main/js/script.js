const BACKEND =
  location.hostname === "localhost" || location.hostname === "127.0.0.1"
    ? "http://localhost:8000"
    : "https://server-for-js.vercel.app";

// SCROLL BAR
window.addEventListener("scroll", () => {
  const scrollTop = document.documentElement.scrollTop;
  const height =
    document.documentElement.scrollHeight -
    document.documentElement.clientHeight;

  const progress = (scrollTop / height) * 100;
  document.getElementById("scroll-bar").style.width = progress + "%";
});

// SCROLL REVEAL
const reveals = document.querySelectorAll(".reveal");

function revealOnScroll() {
  const windowHeight = window.innerHeight;
  reveals.forEach(el => {
    const top = el.getBoundingClientRect().top;
    if (top < windowHeight - 100) {
      el.classList.add("active");
    }
  });
}

window.addEventListener("scroll", revealOnScroll);
revealOnScroll();

// TYPING EFFECT
const text = "Ripudaman Singh Shekhawat";
const speed = 100;
const target = document.getElementById("type-text");

let i = 0;
function typeLoop() {
  if (i < text.length) {
    target.textContent += text.charAt(i);
    i++;
    setTimeout(typeLoop, speed);
  } else {
    setTimeout(() => {
      target.textContent = "";
      i = 0;
      typeLoop();
    }, 2000);
  }
}

typeLoop();


// AI Chatbot
async function askAI() {
  const input = document.getElementById("ai-question");
  const messages = document.getElementById("ai-messages");

  const userText = input.value;
  if (!userText) return;

  messages.innerHTML += `<div class="msg-user">${userText}</div>`;
  input.value = "";

  // Thinking effect
  const thinking = document.createElement("div");
  thinking.className = "msg-ai";
  thinking.innerText = "Thinking...";
  messages.appendChild(thinking);


  const res = await fetch(`${BACKEND}/api/ask`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question: userText })
  });
  thinking.remove();

  const data = await res.json();
  messages.innerHTML += `<div class="msg-ai">${data.answer}</div>`;
  messages.scrollTop = messages.scrollHeight;
}


// Server bot handler
async function askBackend(question) {
  try {
    const res = await fetch(`${BACKEND}/api/ask`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ question })
    });

    const data = await res.json();
    console.log("Backend says:", data.answer);

  
    document.getElementById("ai-response").innerText = data.answer;
  } catch (err) {
    console.error("Backend error:", err);
  }
}
// Auto greet of chatbot on load
window.addEventListener("load", async () => {
  const messages = document.getElementById("ai-messages");

  try {
    const res = await fetch(`${BACKEND}/api/greet`);
    const data = await res.json();

    messages.innerHTML += `<div class="msg-ai">${data.answer}</div>`;
    messages.scrollTop = messages.scrollHeight;
  } catch (err) {
    console.log("Greeting failed");
  }
});



// Enter Key Support
document.getElementById("ai-question").addEventListener("keydown", e => {
  if (e.key === "Enter") {
    e.preventDefault(); // stops form reload if inside a form
    askAI();
  }  
});  





