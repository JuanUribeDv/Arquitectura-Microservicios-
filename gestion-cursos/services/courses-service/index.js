import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4002;

const courses = [
  { id: 1, title: 'Arquitectura de Microservicios', teacher: 'Dr. Pérez' },
  { id: 2, title: 'Base de Datos', teacher: 'Dra. Gómez' },
];

app.use(cors());
app.use(express.json());

app.get('/ping', (req, res) => {
  res.json({ ok: true, message: 'Courses Service funcionando' });
});

app.get('/api/courses', (req, res) => {
  res.json({ ok: true, data: courses });
});

app.get('/api/courses/:id', (req, res) => {
  const course = courses.find((item) => item.id === Number(req.params.id));
  if (!course) {
    return res.status(404).json({ ok: false, message: 'Curso no encontrado' });
  }
  res.json({ ok: true, data: course });
});

app.post('/api/courses', (req, res) => {
  const course = { id: Date.now(), ...req.body };
  courses.push(course);
  res.status(201).json({ ok: true, data: course });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ ok: false, message: 'Error interno del servicio de cursos' });
});

app.listen(PORT, () => {
  console.log(`✅ Courses Service corriendo en http://localhost:${PORT}`);
});
