class TripService {
    createTrip(clientId, origin, destination, description, price) {
        const trips = StorageDB.get('trips');
        const newTrip = {
            id: 'TRIP-' + Date.now(),
            clientId,
            driverId: null,
            origin,
            destination,
            description,
            price,
            status: 'SOLICITADA', // Estado inicial
            createdAt: new Date().toISOString()
        };
        trips.push(newTrip);
        StorageDB.save('trips', trips);
        return newTrip;
    }

    getAvailableTrips() {
        // Solo viajes que no tienen conductor asignado
        const trips = StorageDB.get('trips');
        return trips.filter(t => t.status === 'SOLICITADA');
    }

    getMyTrips(userId, role) {
        const trips = StorageDB.get('trips');
        if (role === 'client') {
            return trips.filter(t => t.clientId === userId);
        } else if (role === 'driver') {
            return trips.filter(t => t.driverId === userId);
        }
        return [];
    }

    updateStatus(tripId, newStatus, driverId = null) {
        const trips = StorageDB.get('trips');
        const tripIndex = trips.findIndex(t => t.id === tripId);
        
        if (tripIndex === -1) throw new Error('Viaje no encontrado');

        // Lógica de transición de estados (PDF Pág 11)
        if (newStatus === 'ASIGNADA' && driverId) {
            trips[tripIndex].driverId = driverId;
        }

        trips[tripIndex].status = newStatus;
        StorageDB.save('trips', trips);
    }
}