const BACKEND =
  location.hostname === "localhost" || location.hostname === "127.0.0.1"
    ? "http://127.0.0.1:8010"
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

// CHATBOT TOGGLE
const chatbot = document.getElementById("chatbot-container");
const openBtn = document.getElementById("chatbot-open");
const closeBtn = document.getElementById("chatbot-close");

// Start with chatbot open
openBtn.style.display = "none";
// SLIDE TOGGLE
closeBtn.addEventListener("click", () => {
  chatbot.classList.add("hidden");
  openBtn.style.display = "block";
});

openBtn.addEventListener("click", () => {
  chatbot.classList.remove("hidden");
  openBtn.style.display = "none";
});
const canvas = document.getElementById("nodes");
const ctx = canvas.getContext("2d");

// responsive canvas
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

let particles = [];

function initParticles() {
  particles = [];
  for (let i = 0; i < 35; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.6,
      vy: (Math.random() - 0.5) * 0.6
    });
  }
}

initParticles();

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // draw particles
  particles.forEach(p => {
    p.x += p.vx;
    p.y += p.vy;

    // bounce
    if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
    if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

    ctx.fillStyle = "rgba(0,255,200,0.8)";
    ctx.beginPath();
    ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
    ctx.fill();
  });

  // draw connections
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      let dx = particles[i].x - particles[j].x;
      let dy = particles[i].y - particles[j].y;
      let dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < 120) {
        ctx.strokeStyle = "rgba(0,255,200,0.08)";
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.stroke();
      }
    }
  }

  requestAnimationFrame(animate);
}

animate();