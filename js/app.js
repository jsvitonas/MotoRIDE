const auth = new AuthService();
const trips = new TripService();

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    if (auth.isAuthenticated()) {
        renderDashboard();
    }
});

// Manejo de UI Forms
function showForm(type) {
    document.getElementById('login-form').style.display = type === 'login' ? 'block' : 'none';
    document.getElementById('register-form').style.display = type === 'register' ? 'block' : 'none';
}

// Event Listeners: Login & Registro
document.getElementById('login-form').addEventListener('submit', (e) => {
    e.preventDefault();
    try {
        const email = document.getElementById('login-email').value;
        const pass = document.getElementById('login-pass').value;
        auth.login(email, pass);
        renderDashboard();
    } catch (error) { alert(error.message); }
});

document.getElementById('register-form').addEventListener('submit', (e) => {
    e.preventDefault();
    try {
        const name = document.getElementById('reg-name').value;
        const email = document.getElementById('reg-email').value;
        const pass = document.getElementById('reg-pass').value;
        const role = document.getElementById('reg-role').value;
        
        auth.register(name, email, pass, role);
        alert('Registro exitoso, por favor inicia sesión');
        showForm('login');
    } catch (error) { alert(error.message); }
});

// Lógica de Dashboards
function renderDashboard() {
    const user = auth.currentUser;
    document.getElementById('auth-section').style.display = 'none';
    document.getElementById('nav-auth').style.display = 'flex';
    document.getElementById('user-name').innerText = `${user.name} (${user.role})`;

    if (user.role === 'client') {
        document.getElementById('client-dashboard').style.display = 'block';
        loadClientTrips();
    } else if (user.role === 'driver') {
        document.getElementById('driver-dashboard').style.display = 'block';
        loadDriverTrips();
    }
}

// Crear Viaje (Cliente)
document.getElementById('trip-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const user = auth.currentUser;
    trips.createTrip(
        user.id,
        document.getElementById('trip-origin').value,
        document.getElementById('trip-dest').value,
        document.getElementById('trip-desc').value,
        document.getElementById('trip-price').value
    );
    loadClientTrips();
    e.target.reset();
});

// Renderizar listas (Helpers)
function loadClientTrips() {
    const myTrips = trips.getMyTrips(auth.currentUser.id, 'client');
    const container = document.getElementById('client-trips-list');
    container.innerHTML = myTrips.map(t => `
        <div class="card">
            <strong>${t.origin} -> ${t.destination}</strong><br>
            Estado: <span class="status-badge">${t.status}</span><br>
            <small>${t.description} - $${t.price}</small>
        </div>
    `).join('');
}

function loadDriverTrips() {
    // 1. Viajes disponibles
    const available = trips.getAvailableTrips();
    document.getElementById('available-trips-list').innerHTML = available.map(t => `
        <div class="card">
            <strong>${t.origin} -> ${t.destination}</strong> ($${t.price})<br>
            <button onclick="acceptTrip('${t.id}')">Aceptar Viaje</button>
        </div>
    `).join('');

    // 2. Mis viajes activos
    const myTrips = trips.getMyTrips(auth.currentUser.id, 'driver');
    document.getElementById('driver-trips-list').innerHTML = myTrips.map(t => `
        <div class="card">
            <strong>${t.origin} -> ${t.destination}</strong><br>
            Estado: ${t.status}<br>
            ${getDriverActionButtons(t)}
        </div>
    `).join('');
}

// Acciones del Conductor
window.acceptTrip = (tripId) => {
    trips.updateStatus(tripId, 'ASIGNADA', auth.currentUser.id);
    loadDriverTrips();
};

window.updateTripStatus = (tripId, status) => {
    trips.updateStatus(tripId, status);
    loadDriverTrips();
};

function getDriverActionButtons(trip) {
    if (trip.status === 'ASIGNADA') return `<button onclick="updateTripStatus('${trip.id}', 'EN_CAMINO')">Marcar En Camino</button>`;
    if (trip.status === 'EN_CAMINO') return `<button onclick="updateTripStatus('${trip.id}', 'ENTREGADO')">Marcar Entregado</button>`;
    return '<span>Finalizado</span>';
}

window.app = { logout: () => auth.logout() };