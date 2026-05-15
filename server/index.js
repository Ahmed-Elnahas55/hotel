import express from "express";
import cors from "cors";
import fs from "fs/promises";
import path from "path";
import crypto from "crypto";

const app = express();
const PORT = process.env.PORT || 4000;
const dbPath = path.resolve("server", "users.json");

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:4173",
  "https://ahmed-elnahas55.github.io",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
  })
);
app.use(express.json());

const hashPassword = (password) =>
  crypto.createHash("sha256").update(password + "rh4ll4-salt-2025").digest("hex");

const verifyPassword = (password, hash) =>
  hashPassword(password) === hash;

const readUsers = async () => {
  try {
    const data = await fs.readFile(dbPath, "utf-8");
    const parsed = JSON.parse(data);
    return Array.isArray(parsed.users) ? parsed.users : [];
  } catch {
    await fs.writeFile(dbPath, JSON.stringify({ users: [] }, null, 2));
    return [];
  }
};

const saveUsers = async (users) => {
  await fs.writeFile(dbPath, JSON.stringify({ users }, null, 2));
};

const safeUser = (user) => {
  const { password, ...rest } = user;
  return rest;
};

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.post("/api/register", async (req, res) => {
  const { email, password, firstName, lastName, phone } = req.body;
  if (!email || !password || !firstName || !lastName) {
    return res.status(400).json({ message: "Missing required fields" });
  }
  if (password.length < 6) {
    return res.status(400).json({ message: "Password must be at least 6 characters" });
  }
  const users = await readUsers();
  if (users.some((u) => u.email === email)) {
    return res.status(409).json({ message: "Email already exists" });
  }
  const newUser = {
    id: `user-${Date.now()}`,
    email,
    password: hashPassword(password),
    firstName,
    lastName,
    phone: phone || "",
  };
  users.push(newUser);
  await saveUsers(users);
  res.status(201).json(safeUser(newUser));
});

app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "Missing login credentials" });
  }
  const users = await readUsers();
  const found = users.find((u) => u.email === email);
  if (!found || !verifyPassword(password, found.password)) {
    return res.status(401).json({ message: "Invalid credentials" });
  }
  res.json(safeUser(found));
});

app.put("/api/users/:id", async (req, res) => {
  const { id } = req.params;
  const { firstName, lastName, phone } = req.body;
  const users = await readUsers();
  const idx = users.findIndex((u) => u.id === id);
  if (idx === -1) {
    return res.status(404).json({ message: "User not found" });
  }
  users[idx] = {
    ...users[idx],
    firstName: firstName ?? users[idx].firstName,
    lastName: lastName ?? users[idx].lastName,
    phone: phone ?? users[idx].phone,
  };
  await saveUsers(users);
  res.json(safeUser(users[idx]));
});

app.listen(PORT, () => {
  console.log(`Auth API running on http://localhost:${PORT}`);
});
