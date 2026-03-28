const toggleBtn = document.getElementById("themeToggle");
const body = document.body;

// Auto detect system theme FIRST
if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
    body.classList.add("dark");
}

// Load saved preference (overrides system)
if (localStorage.getItem("theme") === "dark") {
    body.classList.add("dark");
}
if (localStorage.getItem("theme") === "light") {
    body.classList.remove("dark");
}

// Update button text
function updateButton() {
    toggleBtn.innerText = body.classList.contains("dark")
        ? "☀️ Light"
        : "🌙 Dark";
}

updateButton();

// Toggle manually
toggleBtn.addEventListener("click", () => {
    body.classList.toggle("dark");

    const theme = body.classList.contains("dark") ? "dark" : "light";
    localStorage.setItem("theme", theme);

    updateButton();
});

const statusDiv = document.getElementById("status");
const input = document.getElementById("urlInput");

// Input typing detection
input.addEventListener("input", () => {
    if (input.value.trim() === "") {
        statusDiv.className = "status idle";
        statusDiv.innerText = "💤 AI is waiting for a URL...";
    } else {
        statusDiv.className = "status idle";
        statusDiv.innerText = "📄 Ready to summarize...";
    }
});

async function summarizeArticle() {
    const url = input.value;
    const resultDiv = document.getElementById("result");

    if (!url) {
        statusDiv.className = "status idle";
        statusDiv.innerText = "⚠️ Please enter a URL first...";
        return;
    }

    // Start loading state
    statusDiv.className = "status loading";
    statusDiv.innerText = "⏳ AI is summarizing the article...";
    
    resultDiv.classList.add("hidden");

    try {
        const response = await fetch("/summarize", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ url: url })
        });

        const data = await response.json();

        if (data.summary) {
            statusDiv.className = "status success";
            statusDiv.innerText = "✅ Summary complete";

            resultDiv.classList.remove("hidden");
            resultDiv.innerHTML = `
                <strong>✨ Summary:</strong><br><br>
                ${data.summary}
            `;
        } else {
            statusDiv.className = "status idle";
            statusDiv.innerText = "❌ Error: " + data.error;
        }

    } catch (error) {
        statusDiv.className = "status idle";
        statusDiv.innerText = "⚠️ Failed to fetch summary.";
    }
}
