const form = document.getElementById("confessionForm");
const input = document.getElementById("confessionInput");
const container = document.getElementById("confessionsContainer");

/* Submit confession */
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

/* Load all confessions */
async function loadConfessions() {
  const res = await fetch("/api/confessions");
  const data = await res.json();

  container.innerHTML = "";
  data.forEach(addConfessionToDOM);
}

/* Add confession to UI */
function addConfessionToDOM(confession) {
  const card = document.createElement("div");
  card.className = "confession-card";

  card.innerHTML = `
    <p>${confession.text}</p>
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

/* Load on start */
loadConfessions();

/* PARTICLES */
tsParticles.load("tsparticles", {
  particles: {
    number: { value: 60 },
    size: { value: 2 },
    move: { speed: 1 },
    links: {
      enable: true,
      distance: 150,
      color: "#00ffff",
    },
  },
});
