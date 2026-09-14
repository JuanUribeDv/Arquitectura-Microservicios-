import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4003;

const enrollments = [
  { id: 1, studentId: 2, courseId: 1, status: 'active' },
  { id: 2, studentId: 1, courseId: 2, status: 'active' },
];

app.use(cors());
app.use(express.json());

app.get('/ping', (req, res) => {
  res.json({ ok: true, message: 'Enrollments Service funcionando' });
});

app.get('/api/enrollments', (req, res) => {
  res.json({ ok: true, data: enrollments });
});

app.get('/api/enrollments/:id', (req, res) => {
  const enrollment = enrollments.find((item) => item.id === Number(req.params.id));
  if (!enrollment) {
    return res.status(404).json({ ok: false, message: 'Matrícula no encontrada' });
  }
  res.json({ ok: true, data: enrollment });
});

app.post('/api/enrollments', (req, res) => {
  const enrollment = { id: Date.now(), ...req.body };
  enrollments.push(enrollment);
  res.status(201).json({ ok: true, data: enrollment });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ ok: false, message: 'Error interno del servicio de matrículas' });
});

app.listen(PORT, () => {
  console.log(`✅ Enrollments Service corriendo en http://localhost:${PORT}`);
});
