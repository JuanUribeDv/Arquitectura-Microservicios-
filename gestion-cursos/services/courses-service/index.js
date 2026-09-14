import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import admin, { auth, db, FieldValue } from "../../shared/firebase-admin-config/firebase.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 4002;
app.use(cors());
app.use(express.json());

async function authenticatedUser(req, res, next) {
  try {
    const authorization = req.headers.authorization || "";
    if (!authorization.startsWith("Bearer ")) return res.status(401).json({ message: "Token requerido" });
    const decoded = await auth.verifyIdToken(authorization.slice(7));
    const profile = await db.collection("users").doc(decoded.uid).get();
    req.user = { uid: decoded.uid, role: profile.data()?.role || decoded.role };
    next();
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
}

const requireAdmin = (req, res, next) => req.user.role === "admin" ? next() : res.status(403).json({ message: "Permisos insuficientes" });

app.get("/ping", (_req, res) => res.json({ ok: true, message: "Courses Service funcionando" }));

app.get("/api/courses", authenticatedUser, async (req, res) => {
  let query = db.collection("courses");
  if (req.user.role === "docente") query = query.where("teacherUid", "==", req.user.uid);
  const snapshot = await query.get();
  res.json(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
});

app.get("/api/courses/:id", authenticatedUser, async (req, res) => {
  const snapshot = await db.collection("courses").doc(req.params.id).get();
  if (!snapshot.exists) return res.status(404).json({ message: "Curso no encontrado" });
  res.json({ id: snapshot.id, ...snapshot.data() });
});

app.post("/api/courses", authenticatedUser, requireAdmin, async (req, res) => {
  const { name, nombre, teacherUid, docenteUid, description = "", credits = 0, creditos = 0 } = req.body;
  const course = { name: name || nombre, teacherUid: teacherUid || docenteUid || "", description, credits: Number(credits || creditos), createdAt: FieldValue.serverTimestamp() };
  if (!course.name || !course.teacherUid) return res.status(400).json({ message: "Nombre y docente son obligatorios" });
  const reference = await db.collection("courses").add(course);
  res.status(201).json({ id: reference.id, name: course.name, teacherUid: course.teacherUid, description: course.description, credits: course.credits });
});

app.listen(port, () => console.log(`Courses Service corriendo en http://localhost:${port}`));
