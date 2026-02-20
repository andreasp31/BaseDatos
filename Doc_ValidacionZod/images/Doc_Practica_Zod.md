# Validación de Esquemas con Zod en PetConnect

Este documento describe el protocolo para garantizar que los datos de entrada en la API de **PetConnect** sean íntegros, correctos y consistentes.

## 1. Uso de Zod
Se utiliza la librería **Zod** para realizar validaciones en tiempo de ejecución. Su implementación permite:

1 **Reducir errores de servidor:** Filtrando peticiones con campos vacíos o tipos de datos incorrectos antes de procesarlos.
2 **Mejorar la experiencia de usuario:** Devolviendo mensajes informativos y estructurados sobre los errores detectados.

---

## 2. Definición de Esquemas de Validación

### Esquema Registro:
Para el registro de nuevos usuarios, se aplican las siguientes reglas:
* **Nombre y apellidos:** Mínimo 2 caracteres para evitar campos vacíos.
* **Email:** Debe cumplir con un formato de correo electrónico válido.
* **Clave:** Mínimo 6 caracteres por razones de seguridad.
* **Confirmación:** Se asegura que `clave` y `clave2` sean idénticas.

### Esquema Login:
* Se valida que el **email** tenga un formato correcto antes de realizar cualquier consulta a la base de datos, optimizando recursos del servidor.

---

## 3. Validación de Datos en el Servidor

La validación se ejecuta mediante el método `.safeParse()`, que permite manejar los errores de forma controlada sin detener la ejecución del servidor.

### Endpoint de Registro
Si hay errores, devuelve un JSON con los detalles para la vista (Desktop o Mobile).
```javascript
const validacion = RegistroSchema.safeParse(req.body);

if (!validacion.success) {
    const erroresFormateados = validacion.error.format();
    return res.status(400).json({ 
        message: "Error de validación",
        detalles: erroresFormateados 
    });
} 
```
## 4. Gestión de Errores en el Frontend de la app de Escritorio(Vue.js)
Para enseñar al usuario los errores directamente, el servidor devuelve un error de validación y se extrae el mensaje específico para mostrarlo en al interfaz.
### Proceso:
1. ##Petición:## se envían los datos del formulario mediante `axios`.
2. ##Catch:## si el servidor responde con un error, se accede al objeto `error.response.data.detalles`.
3. ##Datos formateados:## según como Zod devuelve se extrae el primer mensaje para enseñarlo.

#### Ejemplo de implementación en Vue:
```javascript
catch (error) {
    let mensajeFinal = "Error al registrar";

    if (error.response && error.response.data) {
        const data = error.response.data;

        // Si el backend envió el objeto 'detalles' de Zod
        if (data.detalles) {
            // Buscamos el primer campo que falló (ej: "email" o "clave")
            const primerCampoConError = Object.keys(data.detalles).find(key => key !== '_errors');
            
            if (primerCampoConError) {
                // Extraemos el primer mensaje del array de errores de ese campo
                mensajeFinal = data.detalles[primerCampoConError]._errors[0];
            }
        } else if (data.message) {
            mensajeFinal = data.message;
        }
    }
    // Mostramos el mensaje en la variable reactiva
    errorMensaje.value = mensajeFinal;
}
```
Y en el tamplate hay un `p` que va a enseñar el mensaje de error: 
```javascript
<p v-if="errorMensaje" class="mensajError">{{ errorMensaje }}</p>
```
Ejemplo visual de ver el error al equivocarme en un campo del formulario: 
![Previsualización Validacion](./images/validacionZod.png)

## 5. Gestión de Errores en el Frontend de la app Móvil(React Native)
La base es la misma, lo único que cambia es como reflejar esos datos de error en el front de la app móvil.
