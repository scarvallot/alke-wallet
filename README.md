# Alke Wallet: Aplicación de billetera digital.

[![In Progress](<https://img.shields.io/badge/In%20Progress-magenta>)](https://github.com/scarvallot/alke-wallet.git)

---

## Contexto

El equipo de desarrollo recibió la solicitud de crear una wallet digital completa: primero un Front-end dinámico, y luego un Back-end que le dé soporte real con persistencia de datos. La problemática a resolver es brindar a los usuarios una solución segura y fácil de usar para administrar sus activos financieros de manera digital. La wallet permite a los usuarios:

- Loguearse en la plataforma.
- Agendar contactos para futuras transferencias.
- Realizar movimientos y transacciones dentro de la aplicación.

---

## Objetivo

Desarrollar una aplicación de billetera digital, **Alke Wallet**, que permita a los usuarios gestionar sus activos financieros de manera segura y conveniente.

El propósito del desafío es entregar una solución **funcional, segura y fácil de usar**, que evolucione desde una vista estática hasta una aplicación con servidor propio, rutas dinámicas y persistencia de datos.

---

## Escalamiento del proyecto

El proyecto se desarrolla de forma progresiva, ampliando su alcance en cada etapa:

| Etapa                                    | Alcance                                                                                                                                    |
| ---------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| **Front-end**                      | Interfaz de usuario con HTML, CSS, JavaScript, Bootstrap y jQuery: login, saldo, envío/recepción de fondos e historial de transacciones. |
| **Back-end (actual)**              | Servidor propio con Node.js y Express: rutas, vistas dinámicas con EJS, y persistencia inicial en archivos mediante el módulo`fs`.     |
| **Base de datos (próxima etapa)** | Integración con base de datos relacional/documental y ORM para reemplazar la persistencia en archivos planos.                             |

---

## Requerimientos

### Generales

| Requerimiento                 | Descripción                                                                                                       |
| ----------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| Registro e inicio de sesión  | Se asigna una cuenta a cada usuario, quien accede a la aplicación mediante credenciales seguras.                  |
| Administración de fondos     | Los usuarios pueden ver su saldo disponible, y realizar depósitos y retiros de fondos.                            |
| Envío y recepción de fondos | Los usuarios pueden simular el envío de fondos a otras cuentas dentro de la aplicación y recibir fondos propios. |
| Historial de transacciones    | Se mantiene un registro completo de todas las transacciones realizadas en la aplicación.                          |

---

## Requisitos del sistema

- Node.js v18 o superior
- npm v9 o superior

## Instalación y ejecución

```bash
# 1. Clonar el repositorio
git clone https://github.com/scarvallot/alke-wallet.git

# 2. Ingresar a la carpeta del proyecto
cd alke-wallet

# 3. Instalar dependencias
npm install

# 4. Levantar el servidor en modo desarrollo (con recarga automática)
npm run dev

# Alternativa: levantar el servidor en modo producción
npm start
```

Por defecto la aplicación queda disponible en `http://localhost:3000` (o el puerto definido en la variable de entorno `PORT`).

### Variables de entorno

Crear un archivo `.env` en la raíz del proyecto:

```
PORT=3000
```

## Scripts disponibles

| Comando         | Descripción                                                                                                              |
| --------------- | ------------------------------------------------------------------------------------------------------------------------- |
| `npm start`   | Ejecuta`node server.js`. Pensado para entorno de producción, sin recarga automática.                                  |
| `npm run dev` | Ejecuta`nodemon server.js`. Pensado para desarrollo: reinicia el servidor automáticamente ante cada cambio de código. |

**Por qué estos scripts:** se mantienen los nombres estándar `start` y `dev` en lugar de nombres personalizados, siguiendo la convención del ecosistema Node.js/npm. Esto permite que cualquier persona que clone el repositorio sepa de antemano cómo levantar el proyecto sin necesidad de leer configuración adicional, y facilita la integración futura con herramientas de despliegue que asumen `npm start` como comando por defecto.

## Acceso de prueba

Para ingresar a la aplicación, utiliza las credenciales de prueba disponibles en la pantalla de login: `admin` como usuario y `12345` como contraseña. Una vez autenticado, podrás navegar por el menú principal y probar los módulos de depósito, envío de dinero y transacciones.

---

## Stack

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white) ![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white) ![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black) ![Bootstrap](https://img.shields.io/badge/Bootstrap-7952B3?style=for-the-badge&logo=bootstrap&logoColor=white) ![jQuery](https://img.shields.io/badge/jQuery-0769AD?style=for-the-badge&logo=jquery&logoColor=white) ![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white) ![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white) ![EJS](https://img.shields.io/badge/EJS-B4CA65?style=for-the-badge&logo=ejs&logoColor=black)

---

## Arquitectura de la aplicación

```markdown
alke-wallet/
├── data/                                   # Persistencia en archivos y registro de errores
├── database/                               # Modelos de datos, esquema y documentación SQL
│   ├── alke_wallet_db/                     # Base de datos SQL del proyecto
│   └── modelos_db/                         # Modelos conceptuales y relacionales
├── Docs/                                   # Documentación del proyecto y entregas
├── public/                                 # Recursos estáticos servidos por Express
│   ├── css/                                # Hojas de estilo de la interfaz
│   └── js/                                 # Scripts frontend de la interfaz
├── src/                                    # Código de la aplicación Node.js/Express
│   ├── config/                             # Configuración de entorno y conexión a MySQL
│   ├── controllers/                        # Controladores HTTP y manejo de requests
│   ├── middlewares/                         # Middleware de autenticación y validación
│   ├── models/                             # Modelos de acceso a datos y persistencia
│   ├── routes/                              # Definición de rutas de la aplicación
│   ├── services/                            # Lógica de negocio y servicios transaccionales
│   └── views/                               # Plantillas EJS de la interfaz
├── tests/                                  # Pruebas y validaciones del proyecto
├── .gitignore                              # Archivos y carpetas ignorados por Git
├── .env                                    # Variables de entorno locales no versionadas
├── LICENSE                                 # Licencia del proyecto
├── README.md                               # Documentación principal del proyecto
├── package.json                            # Dependencias y scripts de ejecución
├── package-lock.json                       # Lockfile de npm
├── server.js                               # Punto de entrada del servidor HTTP
└── tareas.md                               # Tareas y entregas del módulo
```

### Descripción de los directorios

- `data/`: almacena archivos de persistencia plana y el archivo `log.txt` para registrar eventos de acceso, errores de rutas y trazas de fallos transaccionales con evidencia de `rollback`.
- `database/`: contiene el modelo relacional, scripts SQL, migraciones, seeds y documentación de la base de datos del proyecto.
- `Docs/`: agrupa la documentación de entregas y los materiales del trabajo integrador.
- `public/`: aloja los recursos estáticos de la interfaz como CSS, JavaScript y otros assets servidos a través de Express.
- `src/`: concentra la lógica del backend en Express: configuración, rutas, controladores, servicios, middlewares y vistas EJS.
- `src/config/`: centraliza la conexión y el pool de MySQL mediante `mysql2/promise` y la lectura de variables de entorno.
- `src/controllers/`: recibe las peticiones HTTP, valida entrada y delega la lógica de negocio hacia el servicio correspondiente.
- `src/middlewares/`: agrupa los middleware de autenticación, acceso y control de sesión.
- `src/models/`: encapsula la persistencia de archivos y sirve de base para futuras implementaciones sobre datos relacionales.
- `src/routes/`: define las rutas públicas y privadas de la API y las vistas de la aplicación.
- `src/services/`: implementa la lógica de negocio, validaciones y operaciones transaccionales.
- `src/views/`: contiene las plantillas EJS utilizadas para renderizar páginas y formularios.
- `tests/`: guarda pruebas y scripts de validación del comportamiento de la aplicación.

## Decisiones técnicas

**Separación entre `app.js` y `server.js`:** se optó por dividir la configuración de la aplicación (`src/app.js`) del arranque del servidor (`server.js`) en lugar de usar un único `index.js`. `app.js` define y exporta la instancia de Express con sus middlewares, rutas y motor de vistas, mientras que `server.js` es el único responsable de levantar el servidor HTTP en el puerto configurado. Esta separación facilita las pruebas automatizadas (se puede importar `app.js` sin levantar un servidor real) y deja el proyecto preparado para escalar hacia la integración con base de datos sin reestructurar el punto de entrada.

**Persistencia en archivos planos (`data/`):** en esta etapa la persistencia se resuelve con el módulo `fs` de Node.js sobre archivos en `data/`, ya que aún no se integra una base de datos real. Además de mantener el archivo de registro de eventos, se incorpora una nueva funcionalidad de **registro de errores** para dejar evidencia de fallos de acceso, rutas no encontradas y resultados de transacciones con `rollback`, con trazas aisladas en `data/log.txt`. Esta capa vive en `src/models/`, de modo que al migrar a base de datos (carpeta `database/`) solo sea necesario reemplazar la implementación interna de los modelos, sin tocar controladores ni rutas.

**Uso de Motor de Plantillas (EJS):** Se optó por implementar EJS en lugar de servir archivos HTML puramente estáticos para las vistas principales. Esta decisión responde a dos motivos: primero, permite inyectar datos dinámicos desde el servidor (como títulos y variables de configuración); segundo, habilita el uso de *partials* (fragmentos modulares como el `<head>` o el footer). Esto evita la duplicación de código y facilitará la renderización de información específica del usuario directamente desde el backend.

**Proyección futura (Diseño MVC):** La estructura actual de directorios (`/routes`, `/controllers`, `/models`) sienta las bases de un patrón de arquitectura MVC (Modelo-Vista-Controlador) escalable. La decisión de aislar la persistencia actual basada en `fs` dentro de `/models` asegura que, durante la próxima etapa del proyecto, la integración de una base de datos real se realizará sin afectar ni modificar las rutas ni la lógica de las vistas.

## Servidor y Contenido Estático

El servidor utiliza el middleware `express.static()` apuntando al directorio `/public`. Se eligió esta arquitectura porque permite entregar los recursos del frontend (HTML, CSS, JS, imágenes) directamente al navegador de la forma más optimizada posible sin sobrecargar las rutas del backend. Las rutas API separadas (`/status`) se encargan de la transferencia de datos en formato JSON.

---

## Persistencia en archivos planos

El sistema de registro (logger) se implementó utilizando el módulo nativo `fs` de Node.js, específicamente el método `fs.appendFile()`. La nueva funcionalidad de **registro de errores** se persistirá en `data/log.txt` para dejar evidencia de fallos de acceso, rutas no encontradas y errores de transacción con `rollback`, además de conservar el historial de eventos de la aplicación.

**Justificación del evento registrado:**
Se decidió registrar el evento de **"acceso a rutas"** (HTTP requests) para todas las peticiones entrantes. Se eligió este evento por sobre otras alternativas (como registro de errores o inicios de sesión) porque permite monitorear el tráfico real de la aplicación, auditar qué endpoints son los más consultados (ej. `/` vs `/status`) y proporcionar una base para futuras métricas de uso de la billetera digital.

**Justificación del evento registrado (Manejo de Errores - 404):**
Para el sistema de logs (`log.txt`), se eligió registrar el evento de **errores de acceso (rutas no encontradas / 404)**. Desde la perspectiva de la arquitectura y seguridad del backend, registrar los intentos de acceso a endpoints inexistentes aporta mayor valor operativo que registrar simples visitas exitosas. Esto permite identificar rápidamente enlaces rotos en la aplicación, comportamientos inusuales o posibles escaneos de vulnerabilidades.

**Registro de errores transaccionales:**
Además del registro de rutas y accesos, el flujo de transacciones ahora escribe entradas de error en `data/log.txt` con el formato de fallo y motivo, dejando evidencia física para auditoría y facilitando el diagnóstico cuando un `rollback` se dispara por validaciones, saldo insuficiente o una excepción forzada en pruebas.

---

## Módulo 7

### Acceso a Datos (Lección 1 - Conexión a Base de Datos)

Se implementó la conexión entre el servidor Node.js y la base de datos relacional cumpliendo con los estándares de seguridad:

1. **Base de datos y tablas:** Se utilizó el script SQL oficial para generar el esquema `AlkeWallet` y la tabla principal `Users`.
2. **Conexión segura y modular:** Se utilizó el paquete `mysql2/promise` para establecer un Pool de conexiones asíncrono en el archivo `src/config/db.js`.
3. **Variables de entorno:** Todas las credenciales sensibles (host, usuario, contraseña, base de datos) fueron extraídas a un archivo `.env`, protegiendo el acceso al servidor.
4. **Verificación de estado:** Se implementó una promesa al inicializar el Pool que verifica la disponibilidad del motor MySQL, emitiendo un log de éxito (`console.log`) en la terminal o capturando posibles errores de conexión.

### Acceso a Datos (Lección 2 - Obtención de Información y Paginación)

Se integró la capa de servicios y controladores con la base de datos relacional para la gestión y exposición de los datos de usuarios:

1. **Consulta optimizada y segura:** Se implementó la ruta `GET /usuarios` conectada al controlador para extraer los registros de la base de datos MySQL, excluyendo de manera estricta el campo `password` para salvaguardar la información sensible de los usuarios.
2. **Manejo de Errores:** Se integraron bloques `try/catch` para capturar fallos de conectividad o de sintaxis en el servidor, retornando respuestas HTTP informativas y ordenadas en formato JSON.
3. **Tarea PLUS (Filtros y Paginación):** Se desarrolló soporte dinámico mediante parámetros en la URL (`query params`) permitiendo filtrar registros por nombre u alias, además de estructurar un sistema de paginación con límites y offsets escalables.

### Acceso a Datos (Lección 3 - Modificación de datos en una base de datos)

Se incorporó la capacidad de modificar y eliminar de manera controlada los registros de usuarios existentes en la base de datos relacional.

1. **Ruta de actualización:** se implementó la ruta `PUT /usuarios/:id` con el controlador `actualizarUsuario`, que recibe en el cuerpo del request los campos `user_name`, `first_name`, `last_name` e `email`, y valida que los datos esenciales lleguen completos antes de persistir la modificación.
2. **Ruta de eliminación controlada:** se implementó la ruta `DELETE /usuarios/:id` con el controlador `eliminarUsuario`, que utiliza el `id` recibido por parámetro y ejecuta una baja lógica sobre el registro mediante el cambio de `is_active` a `0`, en lugar de eliminar físicamente el usuario.
3. **Validación previa de existencia:** el servicio `actualizarUsuarioService()` y el servicio `eliminarUsuarioAdmin()` verifican que el `user_id` exista en `AlkeWallet.Users` antes de ejecutar la actualización o la desactivación.
4. **Manejo de errores y mensajes útiles:** cuando el `id` no existe o la solicitud llega incompleta, la API responde con mensajes comprensibles y códigos HTTP adecuados (`400`, `404` o `500`) para orientar al cliente y facilitar el diagnóstico del fallo.
5. **Confirmación de éxito:** las respuestas exitosas se devuelven con `success: true` y mensajes claros como `Usuario actualizado correctamente.` o `Usuario desactivado correctamente.`, cumpliendo el requisito mínimo de confirmación de ambas operaciones.

### Acceso a Datos (Lección 4 - Transaccionalidad)

Se incorporó una capa de transaccionalidad para proteger operaciones sensibles y asegurar consistencia de datos en la base de datos relacional.

1. **Registro transaccional de usuario y cuenta:** el servicio `registrarUsuarioService()` ejecuta una secuencia atómica con dos acciones consecutivas: primero inserta el usuario en `Users` y, luego, usando `insertId` del registro recién creado, crea la cuenta principal en `Accounts` con el `cbu` generado y el `current_balance` inicial en `0`. Si cualquiera de las dos acciones falla, el bloque `catch` ejecuta `rollback()` para dejar la base sin datos parciales.
2. **Transferencia transaccional:** el servicio `procesarTransferencia()` trabaja sobre la misma conexión y ejecuta tres acciones consecutivas protegidas por `beginTransaction()`: descuenta el saldo del remitente, acredita el saldo al destinatario y registra el movimiento en `transactions`. Si el monto es insuficiente o alguna validación falla, el flujo se aborta y se reutiliza `rollback()`.
3. **Registro de errores y evidencia de rollback:** en el `catch` del flujo transaccional se capturan los mensajes de error y se escribe una traza estructurada en `data/log.txt` con el formato `FALLO TRANSACCIÓN - Remitente ID, Destinatario ID, Monto, Motivo`, mostrando el motivo claro del fallo y dejando evidencia física para auditoría.
4. **Evidencia de operación con rollback forzado:** disponible en la prueba de regresión `tests/transaccionalidad.test.js`, donde la ejecución de `simularOperacionTransaccional({ forceError: true })` fuerza la excepción y el servicio responde con la misma causa de error dejando la base de datos sin registros parciales gracias al rollback.

---

<br>
  <div align="center">
    <p>Crafted by <b><a href="https://github.com/scarvallot">whiterabbit 🕳🐇</a></b></p>
    <p>2026</p>
  </div>
<br>
