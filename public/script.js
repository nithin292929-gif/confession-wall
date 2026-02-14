const form = document.getElementById("confessionForm");
const input = document.getElementById("confessionInput");
const container = document.getElementById("confessionsContainer");
const toggle = document.getElementById("themeToggle");

/* ================= SUBMIT ================= */
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const text = input.value.trim();
  if (!text) return;

  try {
    const res = await fetch("/api/confessions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });

    const data = await res.json();
    addConfessionToDOM(data);
    input.value = "";
  } catch (err) {
    console.error("Error posting confession:", err);
  }
});

/* ================= LOAD ================= */
async function loadConfessions() {
  try {
    const res = await fetch("/api/confessions");
    const data = await res.json();

    container.innerHTML = "";
    data.forEach(addConfessionToDOM);
  } catch (err) {
    console.error("Error loading confessions:", err);
  }
}

/* ================= RENDER ================= */
function addConfessionToDOM(confession) {
  const card = document.createElement("div");
  card.className = "confession-card";

  card.innerHTML = `
    <div class="card-header">
      <span class="time">
        ${new Date(confession.createdAt).toLocaleString()}
      </span>
    </div>

    <p>${confession.text}</p>

    <button class="like-btn">
      ❤️ <span>${confession.likes}</span>
    </button>
  `;

  const likeBtn = card.querySelector(".like-btn");
  const likeCount = likeBtn.querySelector("span");

  likeBtn.addEventListener("click", async () => {
    try {
      const res = await fetch(
        \`/api/confessions/\${confession._id}/like\`,
        { method: "PUT" }
      );

      const updated = await res.json();
      likeCount.textContent = updated.likes;
    } catch (err) {
      console.error("Like failed:", err);
    }
  });

  container.appendChild(card);
}

/* ================= THEME TOGGLE ================= */
if (toggle) {
  toggle.addEventListener("click", () => {
    document.body.classList.toggle("light-mode");

    toggle.textContent =
      document.body.classList.contains("light-mode") ? "☀️" : "🌙";
  });
}

/* ================= INIT ================= */
loadConfessions();
