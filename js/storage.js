// Capa de Abstracción para LocalStorage
const StorageDB = {
    get: (table) => {
        const data = localStorage.getItem(table);
        return data ? JSON.parse(data) : [];
    },
    save: (table, data) => {
        localStorage.setItem(table, JSON.stringify(data));
    },
    // Inicializar datos de prueba si está vacío
    init: () => {
        if (!localStorage.getItem('users')) StorageDB.save('users', []);
        if (!localStorage.getItem('trips')) StorageDB.save('trips', []);
    }
};

StorageDB.init();