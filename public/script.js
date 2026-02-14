
const form = document.getElementById("confessionForm");
const input = document.getElementById("confessionInput");
const container = document.getElementById("confessionsContainer");

/* Submit */
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const text = input.value.trim();
  if (!text) return;

  const res = await fetch("/api/confessions", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });

  const data = await res.json();
  addConfessionToDOM(data);
  input.value = "";
});

/* Load */
async function loadConfessions() {
  const res = await fetch("/api/confessions");
  const data = await res.json();

  container.innerHTML = "";
  data.forEach(addConfessionToDOM);
}

/* Render Card */
function addConfessionToDOM(confession) {
  const card = document.createElement("div");
  card.className = "confession-card";

  card.innerHTML = `
    <div class="card-header">
      <span class="avatar">${confession.avatar}</span>
      <span class="time">${new Date(confession.createdAt).toLocaleString()}</span>
    </div>

    <p>${confession.text}</p>

    <div class="ai-reply">
      🤖 ${confession.reply}
    </div>

    <button class="like-btn">
      ❤️ <span>${confession.likes}</span>
    </button>
  `;

  const likeBtn = card.querySelector(".like-btn");
  const likeCount = likeBtn.querySelector("span");

  likeBtn.addEventListener("click", async () => {
    const res = await fetch(`/api/confessions/${confession._id}/like`, {
      method: "PUT",
    });

    const updated = await res.json();
    likeCount.textContent = updated.likes;
  });

  container.appendChild(card);
}

loadConfessions();
/* DARK / LIGHT MODE */
const toggle = document.getElementById("themeToggle");

toggle.addEventListener("click", () => {
  document.body.classList.toggle("light-mode");

  if (document.body.classList.contains("light-mode")) {
    toggle.textContent = "☀️";
  } else {
    toggle.textContent = "🌙";
  }
});
