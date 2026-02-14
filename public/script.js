// Connect socket (auto connects to same deployed domain)
const socket = io();

const confessionForm = document.getElementById("confessionForm");
const confessionInput = document.getElementById("confessionInput");
const confessionList = document.getElementById("confessionList");

// Load existing confessions on page load
async function loadConfessions() {
  try {
    const res = await fetch("/confessions");
    const data = await res.json();

    confessionList.innerHTML = "";
    data.forEach(addConfessionToDOM);
  } catch (err) {
    console.error("Error loading confessions:", err);
  }
}

loadConfessions();

// Submit confession
confessionForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const text = confessionInput.value.trim();
  if (!text) return;

  try {
    await fetch("/confessions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ text })
    });

    confessionInput.value = "";
  } catch (err) {
    console.error("Error posting confession:", err);
  }
});

// Real-time listener
socket.on("newConfession", (confession) => {
  addConfessionToDOM(confession);
});

// Add confession to UI
function addConfessionToDOM(confession) {
  const div = document.createElement("div");
  div.classList.add("confession-card");
  div.innerText = confession.text;

  confessionList.prepend(div);
}
