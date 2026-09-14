import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import admin, { auth, db, FieldValue } from "../../shared/firebase-admin-config/firebase.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 4003;
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

const requireRole = (...roles) => (req, res, next) => roles.includes(req.user.role) ? next() : res.status(403).json({ message: "Permisos insuficientes" });

app.get("/ping", (_req, res) => res.json({ ok: true, message: "Enrollments Service funcionando" }));

app.get("/api/enrollments", authenticatedUser, async (req, res) => {
  let query = db.collection("enrollments");
  if (req.user.role === "estudiante") query = query.where("studentUid", "==", req.user.uid);
  if (req.user.role === "docente") query = query.where("teacherUid", "==", req.user.uid);
  const snapshot = await query.get();
  res.json(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
});

app.post("/api/enrollments", authenticatedUser, requireRole("admin", "estudiante"), async (req, res) => {
  const { courseId, studentUid = req.user.uid } = req.body;
  if (!courseId) return res.status(400).json({ message: "courseId es obligatorio" });
  const course = await db.collection("courses").doc(courseId).get();
  if (!course.exists) return res.status(404).json({ message: "Curso no encontrado" });
  if (req.user.role === "estudiante" && studentUid !== req.user.uid) return res.status(403).json({ message: "No puedes matricular a otro estudiante" });
  const existing = await db.collection("enrollments").where("courseId", "==", courseId).where("studentUid", "==", studentUid).limit(1).get();
  if (!existing.empty) return res.status(409).json({ message: "El estudiante ya está matriculado" });
  const record = { courseId, studentUid, teacherUid: course.data().teacherUid, createdAt: FieldValue.serverTimestamp() };
  const reference = await db.collection("enrollments").add(record);
  res.status(201).json({ id: reference.id, courseId, studentUid, teacherUid: record.teacherUid });
});

app.post("/api/enrollments/grades", authenticatedUser, requireRole("docente"), async (req, res) => {
  const { courseId, cursoId, studentUid, estudianteUid, grade, calificacion } = req.body;
  const resolvedCourseId = courseId || cursoId;
  const resolvedStudentUid = studentUid || estudianteUid;
  const value = Number(grade ?? calificacion);
  if (!resolvedCourseId || !resolvedStudentUid || !Number.isFinite(value) || value < 0 || value > 5) return res.status(400).json({ message: "Estudiante, curso y calificación entre 0 y 5 son obligatorios" });
  const course = await db.collection("courses").doc(resolvedCourseId).get();
  if (!course.exists || course.data().teacherUid !== req.user.uid) return res.status(403).json({ message: "El curso no pertenece al docente" });
  const enrollment = await db.collection("enrollments").where("courseId", "==", resolvedCourseId).where("studentUid", "==", resolvedStudentUid).limit(1).get();
  if (enrollment.empty) return res.status(400).json({ message: "El estudiante no está matriculado en este curso" });
  const record = { courseId: resolvedCourseId, studentUid: resolvedStudentUid, teacherUid: req.user.uid, grade: value, updatedAt: FieldValue.serverTimestamp() };
  const reference = await db.collection("grades").add(record);
  res.status(201).json({ id: reference.id, courseId: resolvedCourseId, studentUid: resolvedStudentUid, grade: value });
});

app.get("/api/enrollments/my-grades", authenticatedUser, requireRole("estudiante"), async (req, res) => {
  const snapshot = await db.collection("grades").where("studentUid", "==", req.user.uid).get();
  res.json(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
});

app.listen(port, () => console.log(`Enrollments Service corriendo en http://localhost:${port}`));
