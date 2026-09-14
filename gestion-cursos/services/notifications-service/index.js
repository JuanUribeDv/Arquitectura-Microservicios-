import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4004;

const notifications = [
  { id: 1, userId: 1, message: 'Tienes una nueva calificación' },
  { id: 2, userId: 2, message: 'Tu inscripción fue confirmada' },
];

app.use(cors());
app.use(express.json());

app.get('/ping', (req, res) => {
  res.json({ ok: true, message: 'Notifications Service funcionando' });
});

app.get('/api/notifications', (req, res) => {
  res.json({ ok: true, data: notifications });
});

app.post('/api/notifications', (req, res) => {
  const notification = { id: Date.now(), ...req.body };
  notifications.push(notification);
  res.status(201).json({ ok: true, data: notification });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ ok: false, message: 'Error interno del servicio de notificaciones' });
});

app.listen(PORT, () => {
  console.log(`✅ Notifications Service corriendo en http://localhost:${PORT}`);
});
