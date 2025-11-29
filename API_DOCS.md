# 📘 Documentación de API (Simulada) - MotoRIDE MVP

Esta documentación describe la interfaz de programación lógica utilizada en el MVP de MotoRIDE. Actualmente, la capa de persistencia es **LocalStorage**, gestionada a través de las clases `AuthService` y `TripService` ubicadas en la carpeta `js/`.

---

## 🛠️ Tabla de Contenidos
1. [Autenticación](#1-autenticación-authservice)
2. [Gestión de Viajes](#2-gestión-de-viajes-tripservice)
3. [Modelos de Datos](#3-modelos-de-datos)

---

## 1. Autenticación (AuthService)

Gestiona el registro y control de sesión de usuarios.

### 🟢 Registrar Usuario
Crea una nueva cuenta de cliente o conductor.

* **Endpoint Lógico:** `POST /auth/register`
* **Función JS:** `auth.register(name, email, password, role)`

**Ejemplo Request Body:**
```json
{
  "name": "Juan Pérez",
  "email": "juan@example.com",
  "password": "securePass123",
  "role": "client"
}