# Seguridad con Bcrypt en PetConnect

Este documento explica cómo implementamos el hash de contraseñas en la API de **PetConnect** para garantizar la seguridad de los datos de nuestros usuarios.

## 1. ¿Por qué usamos Bcrypt?
Guardar contraseñas en texto plano es un riesgo crítico de seguridad. **Bcrypt** es una función de hashing diseñada para ser lenta y segura, lo que protege contra ataques de fuerza bruta.

* **Salt:** Bcrypt genera una cadena aleatoria única para cada contraseña antes de hashearla.
* **Cost Factor (SALT_ROUNDS):** Hemos configurado un nivel de seguridad de `10`.

---

## 2. Configuración e Instalación

Primero, instalamos la librería en nuestro proyecto:
```bash
npm install bcrypt
```
En el servidor se definimos las rondas:
```javascript
const bcrypt = require('bcrypt');
const SALT_ROUNDS = 10;
```
## 3. Proceso de Registro
Cuando un usuario se registra no se guarda la contraseña original, se transforma en un "hash".
```javascript
// Hashear la contraseña antes de guardar el usuario
const passwordHash = await bcrypt.hash(clave, SALT_ROUNDS);

const nuevoUsuario = new Usuario({
    nombre,
    apellidos,
    email,
    clave: passwordHash // Se guarda el hash, no la clave original
});

await nuevoUsuario.save();
```
En mongo la contraseña se vería así desde la aplicación de estritorio:

![Previsualización Validacion](./images/bcrypt.png)

## 4. Autenticación con JSON Web Token (JWT)

Una vez que **Bcrypt** confirma que la contraseña es correcta, la API genera un token firmado. Este token es el que el frontend (Vue) almacenará para realizar peticiones protegidas.

### En la API funciona de la siguiente manera:

1. **Firma:** Usamos una clave secreta (`JWT_SECRET`) guardada en el archivo `.env`.
2. **Payload:** Guardamos el `id` y el `role` del usuario dentro del token.
3. **Expiración:** El token tiene una validez de **2 horas**.

### 5. Implementación del Token

En nuestro código de `login`, tras validar con Bcrypt, generamos el token de la siguiente manera:

```javascript
// Generar el Token
const token = jwt.sign(
    { id: usuario._id, role: usuario.role }, // Datos que viajan en el token
    JWT_SECRET,                             // Clave secreta del servidor
    { expiresIn: '2h' }                     // EL tiempo antes de que expire
);

// Respuesta al cliente
res.json({
    token,
    usuario: {
        id: usuario._id,
        nombre: usuario.nombre,
        role: usuario.role
    }
});
```
## 9. Consideraciones sobre el almacenamiento del Token
Actualmente, el proyecto almacena el JWT en `localStorage`. Aunque es una solución funcional para desarrollo, presenta vulnerabilidades ante ataques. Por lo que habría otras alternativas como Cookies `httpOnly`.
