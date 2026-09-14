import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { db } from "../../../shared/firebase-admin-config/firebase.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4001;

const users = [
  { id: 1, name: "Ana", role: "admin" },
  { id: 2, name: "Luis", role: "estudiante" },
  { id: 3, name: "María", role: "docente" },
];

app.use(cors());
app.use(express.json());

app.get("/ping", (req, res) => {
  res.json({ ok: true, message: "pong" });
});

app.get("/api/users", (req, res) => {
  res.json({ ok: true, data: users });
});

app.get("/api/users/:id", (req, res) => {
  const user = users.find((item) => item.id === Number(req.params.id));
  if (!user) {
    return res.status(404).json({ ok: false, message: "Usuario no encontrado" });
  }
  res.json({ ok: true, data: user });
});

app.post("/api/users", (req, res) => {
  const newUser = {
    id: Date.now(),
    ...req.body,
  };
  users.push(newUser);
  res.status(201).json({ ok: true, data: newUser });
});

app.get("/test-firestore", async (req, res) => {
  try {
    const snapshot = await db.collection("test").get();
    const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    res.json({ ok: true, data });
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message });
  }
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ ok: false, message: "Error interno del servicio de usuarios" });
});

app.listen(PORT, () => {
  console.log(`✅ users-service corriendo en http://localhost:${PORT}`);
});