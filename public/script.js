const form = document.getElementById("confessionForm");
const input = document.getElementById("confessionInput");
const container = document.getElementById("confessionsContainer");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const text = input.value.trim();
  if (!text) return;

  try {
    const res = await fetch("/api/confessions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text })
    });

    const data = await res.json();
    addConfessionToDOM(data);
    input.value = "";
  } catch (err) {
    console.error(err);
  }
});

async function loadConfessions() {
  const res = await fetch("/api/confessions");
  const data = await res.json();
  container.innerHTML = "";
  data.reverse().forEach(addConfessionToDOM);
}

function addConfessionToDOM(confession) {
  const card = document.createElement("div");
  card.className = "confession-card";
  card.innerHTML = `
    <p>${confession.text}</p>
    <button class="like-btn">❤️ Like</button>
  `;
  container.prepend(card);
}

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
      color: "#00ffff"
    }
  }
});
