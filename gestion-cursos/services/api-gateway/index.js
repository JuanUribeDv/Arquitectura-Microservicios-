import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

const SERVICES = {
  users: process.env.USERS_SERVICE_URL || 'http://localhost:4001',
  courses: process.env.COURSES_SERVICE_URL || 'http://localhost:4002',
  enrollments: process.env.ENROLLMENTS_SERVICE_URL || 'http://localhost:4003',
  notifications: process.env.NOTIFICATIONS_SERVICE_URL || 'http://localhost:4004',
};

app.use(cors());
app.use(express.json());

async function proxyToService(serviceName, req, res) {
  const baseUrl = SERVICES[serviceName];
  const targetPath = req.originalUrl.replace(/^\/api\/(users|courses|enrollments|notifications)/, '');
  const url = new URL(`${targetPath || '/'}${req.originalUrl.includes('?') ? '' : ''}`, baseUrl);

  try {
    const response = await fetch(`${baseUrl}${targetPath || '/'}`, {
      method: req.method,
      headers: {
        'Content-Type': 'application/json',
        ...(req.headers.authorization ? { Authorization: req.headers.authorization } : {}),
      },
      body: ['GET', 'HEAD'].includes(req.method) ? undefined : JSON.stringify(req.body),
    });

    const text = await response.text();
    const data = text ? JSON.parse(text) : {};

    res.status(response.status).json(data);
  } catch (error) {
    console.error(`Error en ${serviceName}:`, error.message);
    res.status(502).json({ ok: false, message: `Servicio ${serviceName} no disponible` });
  }
}

app.get('/ping', (req, res) => {
  res.json({ ok: true, message: 'API Gateway funcionando' });
});

app.get('/api/users', (req, res) => proxyToService('users', req, res));
app.get('/api/users/:id', (req, res) => proxyToService('users', req, res));
app.post('/api/users', (req, res) => proxyToService('users', req, res));

app.get('/api/courses', (req, res) => proxyToService('courses', req, res));
app.get('/api/courses/:id', (req, res) => proxyToService('courses', req, res));
app.post('/api/courses', (req, res) => proxyToService('courses', req, res));

app.get('/api/enrollments', (req, res) => proxyToService('enrollments', req, res));
app.get('/api/enrollments/:id', (req, res) => proxyToService('enrollments', req, res));
app.post('/api/enrollments', (req, res) => proxyToService('enrollments', req, res));

app.get('/api/notifications', (req, res) => proxyToService('notifications', req, res));
app.post('/api/notifications', (req, res) => proxyToService('notifications', req, res));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ ok: false, message: 'Error interno del servidor' });
});

app.listen(PORT, () => {
  console.log(`✅ API Gateway corriendo en http://localhost:${PORT}`);
});
