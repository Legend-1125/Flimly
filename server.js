const express = require("express");
const fs = require("fs");
const path = require("path");
const bcrypt = require("bcrypt");
const cors = require("cors");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

let users = []; // In-memory user store
const usersFilePath = path.join(__dirname, "users.json");

// Load users from JSON if exists
if (fs.existsSync(usersFilePath)) {
    const data = fs.readFileSync(usersFilePath);
    users = JSON.parse(data);
}

// Save users
function saveUsers() {
    fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));
}

// Sign-up route
app.post("/signup", async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ message: "Username and password required" });

    const existingUser = users.find(u => u.username === username);
    if (existingUser) return res.status(400).json({ message: "Username already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = { id: users.length + 1, username, password: hashedPassword };
    users.push(newUser);
    saveUsers();
    res.status(201).json({ message: "User created successfully" });
});

// Sign-in route
app.post("/signin", async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ message: "Username and password required" });

    const user = users.find(u => u.username === username);
    if (!user) return res.status(400).json({ message: "Invalid username or password" });

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) return res.status(400).json({ message: "Invalid username or password" });

    res.json({ message: "Sign-in successful", username: user.username });
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
