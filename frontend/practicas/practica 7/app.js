/**
 * App de Clima Local - Forzar Ecatepec
 * - Siempre muestra Ecatepec, MX
 * - Consume OpenWeatherMap API
 * - Muestra temperatura, sensación, humedad, viento, descripción
 * - Cambia fondo según clima y añade animaciones (lluvia/nieve)
 */

const API_KEY = '9015de58351d269e7c054495ccb72f78';
const API_BASE = 'https://api.openweathermap.org/data/2.5/weather';

const $location = document.getElementById('location');
const $time = document.getElementById('time');
const $temp = document.getElementById('temp');
const $desc = document.getElementById('desc');
const $feels = document.getElementById('feels');
const $humidity = document.getElementById('humidity');
const $wind = document.getElementById('wind');
const $icon = document.getElementById('weatherIcon');
const $overlay = document.getElementById('overlay');
const $message = document.getElementById('message');
const $rain = document.getElementById('rain');
const $snow = document.getElementById('snow');
const $refreshBtn = document.getElementById('refreshBtn');

// Mostrar/ocultar overlay
function showOverlay(show = true) {
    $overlay.classList.toggle('show', show);
}

// Mostrar mensajes
function showMessage(text, show = true) {
    $message.style.display = show ? 'block' : 'none';
    $message.textContent = text;
}

// Mapear clima a clase CSS
function mapWeatherToClass(main) {
    const m = main.toLowerCase();
    if (m.includes('rain') || m.includes('drizzle') || m.includes('thunderstorm')) return 'rain';
    if (m.includes('cloud')) return 'clouds';
    if (m.includes('snow')) return 'snow';
    if (m.includes('clear')) return 'clear';
    return 'default';
}

// Mapear clima a icono
function mapWeatherToIcon(main, iconCode) {
    const m = main.toLowerCase();
    if (m.includes('clear')) return '<i class="fas fa-sun"></i>';
    if (m.includes('cloud')) return '<i class="fas fa-cloud"></i>';
    if (m.includes('rain') || m.includes('drizzle')) return '<i class="fas fa-cloud-rain"></i>';
    if (m.includes('thunderstorm')) return '<i class="fas fa-bolt"></i>';
    if (m.includes('snow')) return '<i class="fas fa-snowflake"></i>';
    if (m.includes('mist') || m.includes('fog') || m.includes('haze')) return '<i class="fas fa-smog"></i>';
    return `<img src="https://openweathermap.org/img/wn/${iconCode}@2x.png" alt="icon" style="width:48px;height:48px">`;
}

// Formatear hora local
function formatLocalTime(dt, tzOffsetSeconds) {
    const local = new Date((dt + tzOffsetSeconds) * 1000);
    return local.toLocaleString('es-ES', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: 'short' });
}

// Limpiar animaciones previas
function clearWeatherEffects() {
    document.body.className = 'default';
    $rain.innerHTML = '';
    $snow.innerHTML = '';
}

// Animaciones lluvia / nieve
function createRain() {
    clearWeatherEffects();
    document.body.classList.add('rain');
    for (let i = 0; i < 40; i++) {
        const d = document.createElement('div');
        d.className = 'raindrop';
        d.style.left = Math.random() * 100 + 'vw';
        d.style.animationDuration = (0.7 + Math.random() * 0.8) + 's';
        d.style.height = (20 + Math.random() * 80) + 'px';
        d.style.opacity = 0.2 + Math.random() * 0.6;
        d.style.bottom = (Math.random() * 40 + 100) + '%';
        $rain.appendChild(d);
    }
}

function createSnow() {
    clearWeatherEffects();
    document.body.classList.add('snow');
    for (let i = 0; i < 30; i++) {
        const f = document.createElement('div');
        f.className = 'snowflake';
        f.style.left = Math.random() * 100 + 'vw';
        f.style.animationDuration = (6 + Math.random() * 6) + 's';
        f.style.opacity = 0.6 + Math.random() * 0.4;
        f.style.transform = `translateY(-10vh) rotate(${Math.random() * 360}deg)`;
        f.style.width = f.style.height = 6 + Math.random() * 10 + 'px';
        $snow.appendChild(f);
    }
}

function applyWeatherEffects(main) {
    clearWeatherEffects();
    const cls = mapWeatherToClass(main);
    if (cls === 'rain') createRain();
    else if (cls === 'snow') createSnow();
    else document.body.classList.add(cls);
}

// Fetch API por coordenadas
async function fetchWeatherByCoords(lat, lon) {
    showOverlay(true);
    showMessage('', false);
    try {
        const url = `${API_BASE}?lat=${lat}&lon=${lon}&units=metric&lang=es&appid=${API_KEY}`;
        const res = await fetch(url);
        if (!res.ok) throw new Error('Error en la petición: ' + res.status);
        const data = await res.json();
        renderWeather(data);
    } catch (err) {
        console.error(err);
        showMessage('No se pudo obtener el clima: ' + err.message, true);
    } finally {
        showOverlay(false);
    }
}

// Renderizar datos en la tarjeta
function renderWeather(data) {
    const weather = data.weather && data.weather[0] ? data.weather[0] : null;
    if (!weather) { showMessage('Respuesta de API inesperada'); return; }

    $location.textContent = `${data.name || ''}${data.sys && data.sys.country ? ', ' + data.sys.country : ''}`;
    $time.textContent = formatLocalTime(data.dt, data.timezone || 0);
    $temp.innerHTML = Math.round(data.main.temp) + '°C';
    $desc.textContent = weather.description || '';
    $feels.textContent = Math.round(data.main.feels_like) + '°C';
    $humidity.textContent = data.main.humidity + '%';
    $wind.textContent = (data.wind && data.wind.speed != null) ? data.wind.speed + ' m/s' : '--';
    $icon.innerHTML = mapWeatherToIcon(weather.main, weather.icon);

    applyWeatherEffects(weather.main);
}

// Inicializar app: forzar Ecatepec
function init() {
    const ecatepecLat = 19.6010;
    const ecatepecLon = -99.0500;
    fetchWeatherByCoords(ecatepecLat, ecatepecLon);
}

// Refrescar al pulsar
$refreshBtn.addEventListener('click', () => init());

// Ejecutar app al cargar
init();
