class AuthService {
    constructor() {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;
    }

    register(name, email, password, role, extraData = {}) {
        const users = StorageDB.get('users');
        if (users.find(u => u.email === email)) {
            throw new Error('El correo ya está registrado.');
        }

        const newUser = { 
            id: Date.now(), 
            name, 
            email, 
            password, // En producción, esto debe ir encriptado
            role, 
            ...extraData 
        };
        
        users.push(newUser);
        StorageDB.save('users', users);
        return newUser;
    }

    login(email, password) {
        const users = StorageDB.get('users');
        const user = users.find(u => u.email === email && u.password === password);
        
        if (user) {
            this.currentUser = user;
            localStorage.setItem('currentUser', JSON.stringify(user));
            return user;
        } else {
            throw new Error('Credenciales inválidas.');
        }
    }

    logout() {
        this.currentUser = null;
        localStorage.removeItem('currentUser');
        window.location.reload();
    }

    isAuthenticated() {
        return !!this.currentUser;
    }
}