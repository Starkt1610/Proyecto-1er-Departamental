// backend/server.js
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

// Rutas
const scoresRoutes = require('./scores.routes');
app.use('/scores', scoresRoutes);

// Salud (para probar que vive)
app.get('/health', (req, res) => {
  res.json({ ok: true, time: new Date().toISOString() });
});

// Mensaje en la raíz (evitar Cannot GET /)
app.get('/', (req, res) => {
  res.send('Backend RunnerJS corriendo. Usa /scores para ver puntuaciones.');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`Runner backend escuchando en http://localhost:${PORT}`)
);
