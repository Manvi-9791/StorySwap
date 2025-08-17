document.addEventListener("DOMContentLoaded", () => {
  const loginStatus = document.getElementById("loginStatus");

  // Handle signup
  const signupForm = document.getElementById("signupForm");
  signupForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const formData = new FormData(signupForm);
    const name = formData.get("name");
    const email = formData.get("email");
    const password = formData.get("password");

    const res = await fetch("/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password })
    });

    const data = await res.json();
    alert(data.message);
  });

  // Handle signin
  const signinForm = document.getElementById("signinForm");
  signinForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const formData = new FormData(signinForm);
    const email = formData.get("email");
    const password = formData.get("password");

    const res = await fetch("/signin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();
    if (data.success) {
      loginStatus.textContent = `✅ Logged in as ${data.user.name}`;
      alert("Welcome, " + data.user.name);
    } else {
      alert(data.message);
    }
  });

  // Add Line feature
  document.querySelectorAll(".addLineBtn").forEach(button => {
    button.addEventListener("click", function () {
      const card = this.closest(".story-card");
      const textarea = card.querySelector(".add-line textarea");
      const content = card.querySelector(".story-content");
      if (textarea.value.trim() !== "") {
        content.innerHTML += "<br>" + textarea.value;
        textarea.value = "";
      }
    });
  });

  // Save new story
  document.getElementById("saveStoryBtn").addEventListener("click", () => {
    const title = document.getElementById("storyTitle").value.trim();
    const contentText = document.getElementById("storyContent").value.trim();
    const storiesSection = document.getElementById("stories");

    if (contentText !== "") {
      const newCard = document.createElement("div");
      newCard.classList.add("story-card");
      newCard.innerHTML = `
        <h4>${title || "✨ New Story"}</h4>
        <p class="story-content">${contentText}</p>
        <div class="add-line">
          <textarea placeholder="Add your line..."></textarea><br>
          <button class="btn addLineBtn">Add Line</button>
        </div>
      `;

      storiesSection.appendChild(newCard);

      newCard.querySelector(".addLineBtn").addEventListener("click", function () {
        const textarea = newCard.querySelector(".add-line textarea");
        const content = newCard.querySelector(".story-content");
        if (textarea.value.trim() !== "") {
          content.innerHTML += "<br>" + textarea.value;
          textarea.value = "";
        }
      });

      document.getElementById("storyTitle").value = "";
      document.getElementById("storyContent").value = "";
    }
  });
});
