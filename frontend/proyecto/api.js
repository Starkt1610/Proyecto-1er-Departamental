// Guarda el score en el backend o en localStorage si falla
async function saveScoreAPI(name, score, level) {
  try {
    const res = await fetch('http://localhost:3000/scores', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, score, level })
    });
    if (!res.ok) throw new Error('Error en API');
    return await res.json();
  } catch (err) {
    // fallback localStorage
    const localScores = JSON.parse(localStorage.getItem('offlineScores') || '[]');
    localScores.push({ name, score, level, date: new Date().toISOString() });
    localStorage.setItem('offlineScores', JSON.stringify(localScores));
    console.warn('Score guardado localmente', err);
  }
}

async function getScoresAPI() {
  try {
    const res = await fetch('http://localhost:3000/scores');
    return await res.json();
  } catch (err) {
    // fallback localStorage
    return JSON.parse(localStorage.getItem('offlineScores') || '[]');
  }
}

// Borra todos los puntajes del backend y del localStorage de respaldo
export async function clearScoresAPI() {
    try {
        // Intenta borrar del servidor
        const response = await fetch(`${API_BASE_URL}/scores`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            throw new Error(`Error al borrar. Status: ${response.status}`);
        }
        
        // **IMPORTANTE**: Borrar también el respaldo local (localStorage)
        localStorage.removeItem('localScores');

        return true; // Éxito en el borrado

    } catch (error) {
        console.error("Error al borrar en el servidor. Borrando localmente...", error);
        
        // Borrar solo el respaldo local si falla el servidor
        localStorage.removeItem('localScores');

        return false; // Falló el borrado en el servidor
    }
}