import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { db } from "../../../shared/firebase-admin-config/firebase.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.get("/ping", (req, res) => {
  res.json({ message: "pong" });
});

app.get("/test-firestore", async (req, res) => {
  try {
    const snapshot = await db.collection("test").get();
    const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json({ ok: true, data });
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message });
  }
});

const PORT = process.env.PORT || 4001;
app.listen(PORT, () => {
  console.log(`✅ users-service corriendo en http://localhost:${PORT}`);
});