const express = require('express');
const fs = require('fs');
const path = require('path');

const router = express.Router();
const scoresFile = path.join(__dirname, 'data', 'scores.json'); // ✅ Variable scoresFile

// NOTA: Estas rutas están montadas en /api, por lo que la ruta aquí es solo '/'

// GET /api
router.get('/', (req, res) => {
  // ... (Tu lógica existente para leer y ordenar)
  fs.readFile(scoresFile, (err, data) => {
    if (err) return res.status(500).json({ error: 'Error leyendo archivo' });
    let scores = JSON.parse(data);
    scores.sort((a, b) => b.score - a.score);
    res.json(scores);
  });
});

// POST /api
router.post('/', (req, res) => {
  // ... (Tu lógica existente para guardar)
  const { name, score, level } = req.body;
  if (!name || typeof score !== 'number' || typeof level !== 'number') {
    return res.status(400).json({ error: 'Datos inválidos' });
  }

  fs.readFile(scoresFile, (err, data) => {
    if (err) return res.status(500).json({ error: 'Error leyendo archivo' });

    const scores = JSON.parse(data);
    scores.push({ name, score, level, date: new Date().toISOString() });

    fs.writeFile(scoresFile, JSON.stringify(scores, null, 2), (err) => {
      if (err) return res.status(500).json({ error: 'Error guardando score' });
      res.json({ success: true });
    });
  });
});

// 🚨 CORRECCIÓN 6: Ruta DELETE /api (debe ser '/')
router.delete('/', (req, res) => {
  try {
    // 🚨 CORRECCIÓN 7: Usar la variable local 'scoresFile'
    fs.writeFileSync(scoresFile, '[]', 'utf8');
    console.log("Puntajes reseteados en scores.json");

    res.status(200).json({ message: 'Todos los puntajes han sido reseteados.' });
  } catch (error) {
    console.error("Error al resetear scores.json:", error);
    res.status(500).json({ message: 'Error interno del servidor al resetear puntajes.' });
  }
});

// --- NUEVO ENDPOINT: DELETE /api/scores ---
router.delete('/scores', (req, res) => {
    try {
        // Borrar el contenido del archivo JSON (estableciéndolo a un array vacío)
        fs.writeFileSync(SCORES_FILE, '[]', 'utf8');
        console.log("Puntajes reseteados en scores.json");

        // Responder con éxito
        res.status(200).json({ message: 'Todos los puntajes han sido reseteados.' });
    } catch (error) {
        console.error("Error al resetear scores.json:", error);
        res.status(500).json({ message: 'Error interno del servidor al resetear puntajes.' });
    }
});

module.exports = router;