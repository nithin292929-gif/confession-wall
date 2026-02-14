const input = document.getElementById("confessionInput");
const confessionsDiv = document.getElementById("confessions");
const charCount = document.getElementById("charCount");

// Character counter
input.addEventListener("input", () => {
  charCount.textContent = `${input.value.length} / 200`;
});

// Add confession
async function addConfession() {
  const text = input.value.trim();
  if (!text) return alert("Write something!");

  await fetch("/api/confessions", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });

  input.value = "";
  charCount.textContent = "0 / 200";
  loadConfessions();
}

// Delete confession
async function deleteConfession(id) {
  const confirmDelete = confirm("Are you sure you want to delete?");
  if (!confirmDelete) return;

  await fetch(`/api/confessions/${id}`, {
    method: "DELETE",
  });

  loadConfessions();
}

// Like confession
async function likeConfession(id) {
  await fetch(`/api/confessions/${id}/like`, {
    method: "PUT",
  });

  loadConfessions();
}

// Format time
function timeAgo(date) {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);

  if (seconds < 60) return "Just now";
  if (minutes < 60) return `${minutes} min ago`;
  if (hours < 24) return `${hours} hrs ago`;
  return new Date(date).toLocaleDateString();
}

// Load confessions
async function loadConfessions() {
  const response = await fetch("/api/confessions");
  const data = await response.json();

  confessionsDiv.innerHTML = "";

  data.forEach((item) => {
    const div = document.createElement("div");
    div.className = "confession";

    div.innerHTML = `
      <p>${item.text}</p>
      <div class="card-footer">
        <span class="time">${timeAgo(item.createdAt)}</span>
        <div class="actions">
          <button onclick="likeConfession('${item._id}')">
            ❤️ ${item.likes}
          </button>
          <button onclick="deleteConfession('${item._id}')">
            🗑
          </button>
        </div>
      </div>
    `;

    confessionsDiv.appendChild(div);
  });
}

loadConfessions();
