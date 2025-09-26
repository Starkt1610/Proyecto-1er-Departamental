// api.js

// Define la URL base de tu servidor backend.
const API_BASE_URL = 'http://localhost:3000'; 
const OFFLINE_KEY = 'offlineScores';

// --- Funciones de la API ---

/**
 * Guarda el score en el backend o en localStorage si falla.
 */
export async function saveScore(name, score, level) {
    try {
        const res = await fetch(`${API_BASE_URL}/scores`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, score, level })
        });
        
        // Si el servidor Node.js responde, asumimos éxito (incluso si la operación falla con un 400/500)
        // Pero si no está ok, forzamos el error para ir al fallback
        if (!res.ok) throw new Error(`Server Error: ${res.status}`);
        
        // Si hay scores guardados offline, intenta subirlos ahora (opcional, pero buena práctica)
        // NOTA: Esta lógica compleja se omite por ahora, pero aquí se intentaría sincronizar.
        
        return await res.json();
    } catch (err) {
        // Fallback: guardar en localStorage
        const localScores = JSON.parse(localStorage.getItem(OFFLINE_KEY) || '[]');
        localScores.push({ name, score, level, date: new Date().toISOString() });
        localStorage.setItem(OFFLINE_KEY, JSON.stringify(localScores));
        console.warn('Score guardado localmente (servidor no disponible o error):', err);
    }
}

/**
 * Obtiene los scores del backend o de localStorage si falla.
 */
export async function getLeaderboard() {
    try {
        // 1. Intenta obtener del servidor
        const res = await fetch(`${API_BASE_URL}/scores`);
        if (!res.ok) throw new Error('Error al conectar con el servidor.');
        
        return await res.json();
    } catch (err) {
        // 2. Fallback: obtener de localStorage
        console.warn('Error al obtener scores del servidor, usando respaldo local.', err);
        // Devolvemos el respaldo local y los scores en línea que se hayan guardado ahí
        return JSON.parse(localStorage.getItem(OFFLINE_KEY) || '[]');
    }
}

/**
 * Borra todos los puntajes del backend y del localStorage de respaldo.
 */
export async function clearScoresAPI() {
    let apiSuccess = false;
    try {
        // 1. Intenta borrar del servidor
        const response = await fetch(`${API_BASE_URL}/scores`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            throw new Error(`Error al borrar en el servidor. Status: ${response.status}`);
        }
        apiSuccess = true;
        return true; 
    } catch (error) {
        console.error("Error al borrar en el servidor. Limpiando respaldo local...", error);
        return false; // Indicamos que el borrado remoto falló
    } finally {
        // 2. Borrar el respaldo local (siempre se borra, ya sea que la API falle o tenga éxito)
        localStorage.removeItem(OFFLINE_KEY);
    }
}