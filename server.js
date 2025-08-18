const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// Users JSON
const USERS_FILE = path.join(__dirname, "users.json");

// Helpers
function readUsers() {
  if (!fs.existsSync(USERS_FILE)) return [];
  const raw = fs.readFileSync(USERS_FILE, "utf8");
  return raw ? JSON.parse(raw) : [];
}

function writeUsers(users) {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), "utf8");
}

// SIGN UP
app.post("/signup", (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) return res.json({ success: false });

  let users = readUsers();
  if (users.find(u => u.email === email)) return res.json({ success: false });

  const newUser = { name, email, password, stories: [] };
  users.push(newUser);
  writeUsers(users);

  res.json({ success: true, user: { name, email } });
});

// SIGN IN
app.post("/signin", (req, res) => {
  const { email, password } = req.body;
  const users = readUsers();
  const user = users.find(u => u.email === email && u.password === password);
  res.json({ success: !!user, user: user ? { name: user.name, email: user.email } : null });
});

// SAVE STORY
app.post("/save-story", (req, res) => {
  const { email, title, content } = req.body;
  if (!email || !content) return res.json({ success: false });

  let users = readUsers();
  const user = users.find(u => u.email === email);
  if (!user) return res.json({ success: false });

  const story = { id: Date.now(), title: title || "✨ Untitled Story", content };
  user.stories.push(story);
  writeUsers(users);

  res.json({ success: true, story });
});

// GET STORIES
app.get("/stories", (req, res) => {
  const { email } = req.query;
  const users = readUsers();
  const user = users.find(u => u.email === email);
  res.json({ success: !!user, stories: user ? user.stories : [] });
});

// Start server
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
