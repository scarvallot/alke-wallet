# Alke Wallet: Aplicación de billetera digital

[![Completed](https://img.shields.io/badge/Completed-brightgreen)](https://github.com/scarvallot/alke-wallet.git)

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

## Stack

### Front-end

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white) ![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white) ![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black) ![Bootstrap](https://img.shields.io/badge/Bootstrap-7952B3?style=for-the-badge&logo=bootstrap&logoColor=white) ![jQuery](https://img.shields.io/badge/jQuery-0769AD?style=for-the-badge&logo=jquery&logoColor=white)

### Backend y servidor

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white) ![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white) ![EJS](https://img.shields.io/badge/EJS-B4CA65?style=for-the-badge&logo=ejs&logoColor=black) ![Multer](https://img.shields.io/badge/Multer-333333?style=for-the-badge&logo=npm&logoColor=white) ![Nodemon](https://img.shields.io/badge/Nodemon-76D04B?style=for-the-badge&logo=nodemon&logoColor=white)

### Datos y persistencia

![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white) ![MySQL2](https://img.shields.io/badge/mysql2-4479A1?style=for-the-badge&logo=mysql&logoColor=white) ![Sequelize](https://img.shields.io/badge/Sequelize-52B0E7?style=for-the-badge&logo=sequelize&logoColor=white)

### Seguridad y documentación

![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white) ![Swagger](https://img.shields.io/badge/Swagger%2FOpenAPI-85EA2D?style=for-the-badge&logo=swagger&logoColor=black) ![dotenv](https://img.shields.io/badge/dotenv-ECD53F?style=for-the-badge&logo=dotenv&logoColor=black) ![Express Session](https://img.shields.io/badge/Express--Session-000000?style=for-the-badge&logo=express&logoColor=white)

---

## Escalamiento del proyecto

El proyecto se desarrolla de forma progresiva, ampliando su alcance en cada etapa:

| Etapa                               | Estado               | Alcance                                                                                                                                                               |
| ----------------------------------- | -------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Front-end**                 | **Completada** | Interfaz de usuario con HTML, CSS, JavaScript, Bootstrap y jQuery: login, saldo, envío/recepción de fondos e historial de transacciones.                            |
| **Back-end**                  | **Completada** | Servidor propio con Node.js y Express, rutas, vistas dinámicas con EJS y registro de eventos y errores mediante el módulo`fs`.                                    |
| **Base de datos**             | **Completada** | Conexión a MySQL con`mysql2/promise`, operaciones CRUD, transaccionalidad con `rollback` y capa ORM con Sequelize, incluyendo la relación `User`/`Account`. |
| **API REST + autenticación** | **Completada** | Endpoints RESTful seleccionados protegidos mediante sesión o JWT, subida controlada de archivos y documentación Swagger/OpenAPI.                                    |

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

## Requisitos previos / Prerequisites

La aplicación se ejecuta localmente y **no requiere Docker ni contenedores**.

- Windows, macOS o Linux.
- Node.js v18 o superior y npm v9 o superior.
- MySQL Server 8 o una versión compatible instalada localmente.
- MySQL Workbench, opcional, para ejecutar los scripts SQL mediante una interfaz gráfica.
- Git, opcional, para clonar el repositorio.
- Un usuario de MySQL con permiso para crear la base de datos. En una instalación local se puede utilizar `root`.

> [!IMPORTANT]
> Antes de continuar, inicia el servicio **MySQL80** desde los servicios de Windows o abre MySQL Workbench y confirma que la conexión local esté activa en el puerto `3306`.

---

## Guía de instalación / Installation Guide

### 1. Descargar el proyecto

Con Git:

```bash
git clone https://github.com/scarvallot/alke-wallet.git
cd alke-wallet
```

También se puede descargar el repositorio como archivo ZIP, descomprimirlo y abrir una terminal dentro de la carpeta `alke-wallet`.

### 2. Instalar las dependencias de la aplicación

```bash
npm install
```

### 3. Configurar las variables de entorno

Crea un archivo llamado `.env` en la raíz del proyecto, junto a `package.json`, con los siguientes valores. Reemplaza `TU_PASSWORD_MYSQL` por la contraseña de tu instalación local:

```env
PORT=3000
DATABASE_URL=mysql://root:TU_PASSWORD_MYSQL@localhost:3306/AlkeWallet
JWT_SECRET=una-clave-secreta-larga-para-desarrollo
SESSION_SECRET=otra-clave-secreta-larga-para-desarrollo
```

Si el usuario no tiene contraseña, utiliza `DATABASE_URL=mysql://root:@localhost:3306/AlkeWallet`. No compartas el archivo `.env` ni subas contraseñas reales al repositorio.

### 4. Crear y poblar la base de datos

La documentación técnica del modelo se encuentra en [Modelo final de base de datos](#modelo-final-de-base-de-datos-scalable). Para instalar y poblar completamente la base de datos, ejecuta los scripts en este orden: esquema, migraciones y seeds. Este orden es obligatorio porque las migraciones agregan columnas, restricciones y la tabla `payees` que necesitan los datos de prueba.

> [!WARNING]
> Importante: el script de esquema elimina y recrea la base de datos `AlkeWallet`. Ejecútalo únicamente durante una instalación de prueba o después de realizar un respaldo, ya que eliminará los datos existentes.

Desde **MySQL Workbench**:

1. Abre una conexión local.
2. Abre `database/alke_wallet_db/schema/01_alke_wallet_schema.sql` y ejecuta todo el script.
3. Abre `database/alke_wallet_db/migrations/alke_wallet_migrations.sql` y ejecútalo para agregar las columnas de auditoría, campos adicionales, restricciones y la tabla `payees`.
4. Abre `database/alke_wallet_db/seeds/02_alke_wallet_seed.sql` y ejecútalo para cargar usuarios, monedas, cuentas, contactos y transacciones de prueba.
5. Comprueba que aparezca el esquema `AlkeWallet` y que contenga las tablas `Users`, `Currencies`, `Accounts`, `Transactions` y `payees`.

Desde una terminal con el cliente `mysql` disponible:

```bash
mysql -u root -p < database/alke_wallet_db/schema/01_alke_wallet_schema.sql
mysql -u root -p < database/alke_wallet_db/migrations/alke_wallet_migrations.sql
mysql -u root -p < database/alke_wallet_db/seeds/02_alke_wallet_seed.sql
```

En Windows PowerShell, si el comando `mysql` no está en el PATH, utiliza la ruta completa de la instalación, por ejemplo `C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe`.

### 5. Iniciar la aplicación

En la carpeta raíz del proyecto ejecuta:

```bash
npm run dev
```

Mantén esa terminal abierta. Como alternativa, para iniciar sin recarga automática:

```bash
npm start
```

> [!NOTE]
> Accesos rápidos a la aplicación:
>
> - Aplicación principal: http://localhost:3000
> - Estado del servidor: http://localhost:3000/status
> - Documentación de la API: http://localhost:3000/api-docs

### 6. Probar la aplicación

1. Abre http://localhost:3000/login.
2. Utiliza las credenciales de prueba `admin` y `12345`.
3. Prueba el saldo, depósitos, transferencias, contactos e historial.
4. Para probar la API, utiliza Postman o Swagger UI.

Si la pantalla no carga, revisa que MySQL siga activo, que el puerto `3306` esté disponible y que `DATABASE_URL` coincida con la contraseña configurada en MySQL.

### Scripts disponibles

| Comando         | Descripción                                                                                                              |
| --------------- | ------------------------------------------------------------------------------------------------------------------------- |
| `npm start`   | Ejecuta`node server.js`. Pensado para entorno de producción, sin recarga automática.                                  |
| `npm run dev` | Ejecuta`nodemon server.js`. Pensado para desarrollo: reinicia el servidor automáticamente ante cada cambio de código. |

> [!NOTE]
> Por qué estos scripts: se mantienen los nombres estándar `start` y `dev` en lugar de nombres personalizados, siguiendo la convención del ecosistema Node.js/npm. Esto permite que cualquier persona que clone el repositorio sepa de antemano cómo levantar el proyecto sin necesidad de leer configuración adicional, y facilita la integración futura con herramientas de despliegue.

## Acceso de prueba

> [!TIP]
> Para ingresar a la aplicación, utiliza las credenciales de prueba disponibles en la pantalla de login: Usuario: `admin` | Contraseña: `12345`.
> Una vez autenticado, podrás navegar por el menú principal y probar los módulos de depósito, envío de dinero y transacciones.

## Arquitectura de la aplicación

```markdown
alke-wallet/
├── data/                                   # Persistencia en archivos y registro de errores
├── database/                               # Modelos de datos, esquema y documentación SQL
│   ├── docs/                               # Documentación general del modelo de datos
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
│   ├── models/                              # Modelos de acceso a datos y persistencia
│   ├── routes/                              # Definición de rutas de la aplicación
│   ├── services/                            # Lógica de negocio y servicios transaccionales
│   ├── views/                               # Plantillas EJS de la interfaz
│   └── app.js                               # Configuración de la aplicación Express (middlewares, rutas, vistas)
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

## Modelo final de base de datos (Scalable)

Esta sección describe la estructura técnica del modelo final. Para instalar y poblar la base de datos, utiliza únicamente el punto **4. Crear y poblar la base de datos** de la guía de instalación.

El modelo final se encuentra en `database/alke_wallet_db/` y está compuesto por:

- `schema/`: crea la base `AlkeWallet` y sus tablas principales.
- `migrations/`: agrega columnas de auditoría, campos adicionales, restricciones y la tabla de contactos.
- `seeds/`: carga datos de prueba.
- `tests/`: contiene consultas SQL para verificar restricciones e integridad.

La validación técnica del modelo se realiza mediante `tests/validaciones.sql`, que comprueba restricciones, relaciones e integridad de los datos. El archivo puede ejecutarse siguiendo el procedimiento descrito en la guía de instalación.

### Diagrama Entidad-Relación (modelo final)

```mermaid
erDiagram
    Users {
        int user_id PK
        string user_name
        string first_name
        string last_name
        string email UK
        string password
        boolean is_active
        datetime created_at
        datetime updated_at
    }

    Currencies {
        int currency_id PK
        string currency_name UK
        string currency_symbol UK
        datetime created_at
        datetime updated_at
    }

    Accounts {
        int account_id PK
        int user_id FK
        int currency_id FK
        string cbu UK
        decimal current_balance
        boolean is_default
        datetime created_at
        datetime updated_at
    }

    Transactions {
        int transaction_id PK
        decimal importe
        datetime transaction_date
        int sender_account_id FK
        int receive_account_id FK
        datetime created_at
        datetime updated_at
    }

    Payees {
        int payee_id PK
        int user_id FK
        string full_name
        string cbu
        string alias
        int currency_id FK
        datetime created_at
        datetime updated_at
    }

    Users ||--o{ Accounts : "tiene"
    Currencies ||--o{ Accounts : "se usa en"
    Accounts ||--o{ Transactions : "envía (sender)"
    Accounts ||--o{ Transactions : "recibe (receiver)"
    Users ||--o{ Payees : "agenda"
    Currencies ||--o{ Payees : "se usa en"
```

## Decisiones técnicas

**Separación entre `app.js` y `server.js`:** se optó por dividir la configuración de la aplicación (`src/app.js`) del arranque del servidor (`server.js`) en lugar de usar un único `index.js`. `app.js` define y exporta la instancia de Express con sus middlewares, rutas y motor de vistas, mientras que `server.js` es el único responsable de levantar el servidor HTTP en el puerto configurado. Esta separación facilita las pruebas automatizadas (se puede importar `app.js` sin levantar un servidor real) y deja el proyecto preparado para escalar hacia la integración con base de datos sin reestructurar el punto de entrada.

**Persistencia en archivos planos (`data/`):** en esta etapa la persistencia se resuelve con el módulo `fs` de Node.js sobre archivos en `data/`, ya que aún no se integra una base de datos real. Además de mantener el archivo de registro de eventos, se incorpora una nueva funcionalidad de registro de errores para dejar evidencia de fallos de acceso, rutas no encontradas y resultados de transacciones con rollback, con trazas aisladas en `data/log.txt`. Esta capa vive en `src/models/`, de modo que al migrar a base de datos (carpeta `database/`) solo sea necesario reemplazar la implementación interna de los modelos, sin tocar controladores ni rutas.

**Uso de Motor de Plantillas (EJS):** Se optó por implementar EJS en lugar de servir archivos HTML puramente estáticos para las vistas principales. Esta decisión responde a dos motivos: primero, permite inyectar datos dinámicos desde el servidor (como títulos y variables de configuración); segundo, habilita el uso de partials (fragmentos modulares como el `<head>` o el footer). Esto evita la duplicación de código y facilitará la renderización de información específica del usuario directamente desde el backend.

**Proyección futura (Diseño MVC):** La estructura actual de directorios (`/routes`, `/controllers`, `/models`) sienta las bases de un patrón de arquitectura MVC (Modelo-Vista-Controlador) escalable. La decisión de aislar la persistencia actual basada en `fs` dentro de `/models` asegura que, durante la próxima etapa del proyecto, la integración de una base de datos real se realizará sin afectar ni modificar las rutas ni la lógica de las vistas.

**Separación entre rutas y controladores**

La separación entre rutas y controladores se decidió aplicando el **Principio de Responsabilidad Única (SRP)** y el patrón **MVC**, complementado con una capa de servicios.

- **Rutas (`src/routes/`):** definieron el método HTTP, la URL del endpoint y los middlewares correspondientes, como la protección mediante sesión, la autorización administrativa, la validación JWT o la carga de archivos. No concentraron la lógica de negocio.
- **Controladores (`src/controllers/`):** recibieron las solicitudes HTTP, extrajeron datos de `req.body`, `req.params` y `req.query`, delegaron el procesamiento a los servicios y construyeron la respuesta con su código HTTP y formato JSON o vista EJS.
- **Servicios (`src/services/`):** concentraron las reglas de negocio, las consultas a MySQL, las operaciones con Sequelize y la lógica transaccional, evitando controladores demasiado extensos.

Esta separación permitió mantener un código más predecible, legible y escalable, además de facilitar las pruebas y las modificaciones aisladas sin afectar otras capas de la aplicación.

**Validaciones antes de insertar o modificar datos**

Las validaciones se distribuyeron en tres niveles para proteger la integridad de la aplicación y de la base de datos:

1. **Controladores y middlewares:** se verificó la presencia de los campos obligatorios antes de ejecutar operaciones de registro, actualización, depósito o transferencia. La carga de avatares se validó mediante Multer, que aceptó únicamente imágenes `jpeg`, `jpg`, `png` y `webp` de hasta 2 MB.
2. **Servicios y reglas de negocio:** se comprobó la existencia de usuarios y cuentas antes de actualizarlos o desactivarlos. En las transferencias se validó que la cuenta de destino existiera, que las cuentas fueran diferentes y que el saldo disponible fuera suficiente para cubrir el monto solicitado.
3. **Base de datos y modelos:** se aplicaron restricciones `UNIQUE` para evitar correos y CBUs duplicados, claves foráneas para preservar las relaciones entre entidades y restricciones `CHECK` para impedir saldos negativos, importes no positivos y transferencias entre la misma cuenta. Los conflictos de integridad se capturaron y se respondieron con mensajes y códigos HTTP apropiados, como `409 Conflict`.

Las operaciones que modificaron varias entidades se ejecutaron dentro de transacciones ACID. Cuando una validación o consulta falló, se realizó `ROLLBACK` para evitar datos parciales o inconsistentes.

**Justificación de la protección de rutas JWT**

Se protegieron `/perfil`, `/api/transfer` y `/profile/password` porque expusieron información personal o permitieron operaciones sensibles sobre la cuenta del usuario. La ruta `/perfil` entregó información asociada al usuario autenticado; `/api/transfer` modificó saldos y registró movimientos financieros; y `/profile/password` permitió cambiar una credencial. Exigir un JWT válido redujo el riesgo de accesos no autorizados y permitió asociar cada operación con el `user_id` incluido en el token.

Las rutas de la interfaz web y otras operaciones de la aplicación utilizaron además `protegerRuta`, que validó la sesión almacenada en la cookie. De esta forma, la sesión se utilizó para la navegación EJS y el JWT se aplicó como mecanismo adicional en los endpoints JSON que requirieron una autenticación explícita.

**Almacenamiento y transporte del token JWT**

El backend generó el JWT durante `POST /login` y lo devolvió en el campo `token` de la respuesta JSON. El servidor no lo almacenó en una tabla ni en un archivo; únicamente conservó `JWT_SECRET` en las variables de entorno para firmar y verificar el token. El cliente debía conservar el token en memoria o en un almacenamiento seguro del navegador y enviarlo en cada solicitud protegida mediante la cabecera:

```http
Authorization: Bearer <token>
```

El middleware `verificarToken` leyó esa cabecera, comprobó la firma con `JWT_SECRET` y rechazó tokens ausentes, inválidos o expirados. En un entorno productivo, el intercambio debía realizarse mediante HTTPS y el almacenamiento del navegador debía seleccionarse considerando el riesgo de exposición a scripts maliciosos.

### Reflexión breve sobre decisiones técnicas

- **Conexión a base de datos:** se eligió `mysql2/promise` por su compatibilidad con MySQL y su capacidad para operar con un pool de conexiones asíncrono. La configuración se centralizó en `src/config/db.js`, usando variables de entorno para alojar credenciales sensibles y evitar exponerlas en el código fuente.
- **Obtención de información:** se diseñó una capa de servicios y controladores para consultar usuarios sin filtrar ni revelar el campo `password`. Además, se incorporó soporte para filtros y paginación mediante query params como `?nombre=Juan`, manteniendo la salida ordenada y escalable.
- **Modificación de datos:** se decidió actualizar solo los campos necesarios (`user_name`, `first_name`, `last_name`, `email`) para evitar sobrescribir información no solicitada. Antes de persistir, la validación comprueba existencia del usuario y exige datos mínimos para evitar errores de integridad.
- **Transaccionalidad:** la lógica de transacciones se protegió con `beginTransaction()` y `rollback()` para que una operación sensible no deje registros parciales. Cuando llega un error, se deja evidencia en `data/log.txt` para auditar el motivo del fallo y conservar una traza del rollback.
- **ORM con Sequelize:** se incorporó Sequelize para comparar el acceso declarativo y mantenible del ORM frente a consultas SQL manuales, reduciendo la concatenación de sentencias y trabajando con modelos y asociaciones de manera más legible.
- **Relaciones en ORM:** la relación entre `User` y `Account` se modeló con `hasMany`/`belongsTo` y se expuso con `include` para obtener un arreglo anidado de cuentas por usuario, generando una estructura jerárquica clara y ordenada.

## Servidor y contenido estático

El servidor utiliza el middleware `express.static()` apuntando al directorio `/public`. Se eligió esta arquitectura porque permite entregar los recursos del frontend (HTML, CSS, JS, imágenes) directamente al navegador de la forma más optimizada posible sin sobrecargar las rutas del backend. Las rutas API separadas (`/status`) se encargan de la transferencia de datos en formato JSON.

## Persistencia en archivos planos

El sistema de registro (logger) se implementó utilizando el módulo nativo `fs` de Node.js, específicamente el método `fs.appendFile()`. La nueva funcionalidad de registro de errores se persistirá en `data/log.txt` para dejar evidencia de fallos de acceso, rutas no encontradas y errores de transacción con rollback, además de conservar el historial de eventos de la aplicación.

**Justificación del evento registrado:**
Se decidió registrar el evento de "acceso a rutas" (HTTP requests) para todas las peticiones entrantes. Se eligió este evento por sobre otras alternativas (como registro de errores o inicios de sesión) porque permite monitorear el tráfico real de la aplicación, auditar qué endpoints son los más consultados (ej. `/` vs `/status`) y proporcionar una base para futuras métricas de uso de la billetera digital.

**Justificación del evento registrado (Manejo de Errores - 404):**
Para el sistema de logs (`log.txt`), se eligió registrar el evento de errores de acceso (rutas no encontradas / 404). Desde la perspectiva de la arquitectura y seguridad del backend, registrar los intentos de acceso a endpoints inexistentes aporta mayor valor operativo que registrar simples visitas exitosas. Esto permite identificar rápidamente enlaces rotos en la aplicación, comportamientos inusuales o posibles escaneos de vulnerabilidades.

**Registro de errores transaccionales:**
Además del registro de rutas y accesos, el flujo de transacciones ahora escribe entradas de error en `data/log.txt` con el formato de fallo y motivo, dejando evidencia física para auditoría y facilitando el diagnóstico cuando un rollback se dispara por validaciones, saldo insuficiente o una excepción forzada en pruebas.

## Módulo 7

**Objetivo del módulo:** Se implementó una capa de acceso a datos segura y reutilizable, integrando MySQL, consultas parametrizadas, transacciones y Sequelize.

Cada lección del módulo documenta la misma secuencia: implementación, validaciones y respuesta o evidencia.

### Respuestas y evidencias

Las consultas y operaciones del módulo entregaron respuestas JSON con `success: true` cuando finalizaron correctamente. Las consultas incluyeron los datos en `data` y las operaciones de modificación confirmaron el resultado mediante `message`. Ante un fallo se utilizó `success: false`, un código HTTP apropiado y un mensaje descriptivo; las operaciones transaccionales agregaron la evidencia del rollback en `data/log.txt`.

```json
{
    "success": true,
    "data": []
}
```

```json
{
    "success": false,
    "message": "No se pudo completar la operación."
}
```

### Lección 1: Conexión a base de datos

Se implementó la conexión entre el servidor Node.js y la base de datos relacional cumpliendo con los estándares de seguridad:

- **Base de datos y tablas:** Se utilizó el script SQL oficial para generar el esquema `AlkeWallet` y la tabla principal `Users`.
- **Conexión segura y modular:** Se utilizó el paquete `mysql2/promise` para establecer un Pool de conexiones asíncrono en el archivo `src/config/db.js`.
- **Variables de entorno:** Todas las credenciales sensibles (host, usuario, contraseña, base de datos) fueron extraídas a un archivo `.env`, protegiendo el acceso al servidor.
- **Verificación de estado:** Se implementó una promesa al inicializar el Pool que verificó la disponibilidad del motor MySQL, emitió un log de éxito (`console.log`) en la terminal y capturó posibles errores de conexión.

### Lección 2: Obtención de información y paginación

Se integró la capa de servicios y controladores con la base de datos relacional para la gestión y exposición de los datos de usuarios:

- **Consulta optimizada y segura:** Se implementó la ruta `GET /usuarios` conectada al controlador para extraer los registros de la base de datos MySQL, excluyendo de manera estricta el campo `password` para salvaguardar la información sensible de los usuarios.
- **Manejo de Errores:** Se integraron bloques `try/catch` para capturar fallos de conectividad o de sintaxis en el servidor, retornando respuestas HTTP informativas y ordenadas en formato JSON.

> [!TIP]
> **Tarea PLUS opcional — Filtros y paginación por query params:** Se desarrolló soporte dinámico mediante parámetros en la URL (query params) permitiendo filtrar registros por nombre u alias, además de estructurar un sistema de paginación con límites y offsets escalables.

### Lección 3: Modificación de datos en una base de datos

Se incorporó la capacidad de modificar y eliminar de manera controlada los registros de usuarios existentes en la base de datos relacional.

- **Ruta de actualización:** se implementó la ruta `PUT /usuarios/:id` con el controlador `actualizarUsuario`, que recibió en el cuerpo del request los campos `user_name`, `first_name`, `last_name` e `email`, y validó que los datos esenciales llegaran completos antes de persistir la modificación.
- **Ruta de eliminación controlada:** se implementó la ruta `DELETE /usuarios/:id` con el controlador `eliminarUsuario`, que utilizó el `id` recibido por parámetro y ejecutó una baja lógica sobre el registro mediante el cambio de `is_active` a `0`, en lugar de eliminar físicamente el usuario.
- **Validación previa de existencia:** el servicio `actualizarUsuarioService()` y el servicio `eliminarUsuarioAdmin()` verificaron que el `user_id` existiera en `AlkeWallet.Users` antes de ejecutar la actualización o la desactivación.
- **Manejo de errores y mensajes útiles:** cuando el `id` no existió o la solicitud llegó incompleta, la API respondió con mensajes comprensibles y códigos HTTP adecuados (400, 404 o 500) para orientar al cliente y facilitar el diagnóstico del fallo.
- **Confirmación de éxito:** las respuestas exitosas se devolvieron con `success: true` y mensajes claros como `Usuario actualizado correctamente.` o `Usuario desactivado correctamente.`, cumpliendo el requisito mínimo de confirmación de ambas operaciones.

### Lección 4: Transaccionalidad

Se incorporó una capa de transaccionalidad para proteger operaciones sensibles y asegurar consistencia de datos en la base de datos relacional.

- **Registro transaccional de usuario y cuenta:** el servicio `registrarUsuarioService()` ejecutó una secuencia atómica con dos acciones consecutivas: primero insertó el usuario en `Users` y, luego, usando `insertId` del registro recién creado, creó la cuenta principal en `Accounts` con el `cbu` generado y el `current_balance` inicial en `0`. Si cualquiera de las dos acciones falló, el bloque `catch` ejecutó `rollback()` para dejar la base sin datos parciales.
- **Transferencia transaccional:** el servicio `procesarTransferencia()` trabajó sobre la misma conexión y ejecutó tres acciones consecutivas protegidas por `beginTransaction()`: descontó el saldo del remitente, acreditó el saldo al destinatario y registró el movimiento en `transactions`. Si el monto fue insuficiente o alguna validación falló, el flujo se abortó y se reutilizó `rollback()`.
- **Evidencia de operación con rollback forzado:** disponible en la prueba de regresión `tests/transaccionalidad.test.js`, donde la ejecución de `simularOperacionTransaccional({ forceError: true })` fuerza la excepción y el servicio responde con la misma causa de error dejando la base de datos sin registros parciales gracias al rollback.

> [!TIP]
> **Tarea PLUS opcional — Registro de fallos transaccionales en archivo de log:** En el `catch` del flujo transaccional se capturan los mensajes de error y se escribe una traza estructurada en `data/log.txt` con el formato `FALLO TRANSACCIÓN - Remitente ID, Destinatario ID, Monto, Motivo`, mostrando el motivo claro del fallo y dejando evidencia física para auditoría.

### Lección 5: ORM con Sequelize

Se complementó el acceso manual a SQL con una capa de abstracción basada en ORM para explorar una alternativa más declarativa y mantenible para consultar usuarios.

- **Inicialización e instalación del ORM:** se configuró la instancia de Sequelize en `src/config/sequelize.js`, usando `dotenv` para cargar el contexto de entorno y conectarse a la base `AlkeWallet` mediante el dialecto `mysql`.
- **Definición del modelo User:** se incorporó el modelo `src/models/User.js` con el esquema de la tabla `Users`, que definió campos como `user_name`, `first_name`, `last_name`, `email`, `password`, `is_active` y los timestamps de creación/actualización.
- **Ruta ORM para listar usuarios:** se agregó una ruta `GET /api/orm/users` en `src/routes/user.routes.js` conectada al servicio `obtenerUsuariosORM()` en `src/services/user.orm.service.js`, cuyo flujo se apoya en `User.findAll({ attributes: { exclude: ['password'] }, where: { is_active: 1 }, order: [['created_at', 'DESC']] })`.
- **Comparación de resultados:** la salida entregada por el servicio ORM se comparó de manera funcional con la vista obtenida por consultas SQL manuales, verificando que la lista de usuarios excluyera la contraseña y mostrara el mismo conjunto de registros activos, ordenados por fecha de creación.

**Justificación esperada:** el uso de ORM aportó una ventaja clara frente a SQL tradicional porque redujo el acoplamiento con sentencias literales, permitió reutilizar modelos de dominio y hizo más legible el acceso a los datos al trabajar con objetos y atributos en vez de manejar consultas concatenadas y cadenas de texto.

### Lección 6: Manejo de relaciones en un ORM

Se extendió la capa ORM para modelar relaciones entre entidades y responder con datos anidados en una sola consulta.

- **Relación principal entre modelos:** se definieron relaciones sobre los modelos `User` y `Account`, donde un usuario puede tener muchas cuentas y cada cuenta pertenece a un usuario. La asociación se expresa con `hasMany` y `belongsTo`, usando el alias `cuentas` para mantener la estructura de acceso legible dentro del JSON de respuesta.
- **Ruta de relación con include:** se incorporó la ruta `GET /api/orm/users/:id/accounts`, conectada al servicio `User.findByPk(id, { attributes: ['user_id', 'first_name', 'last_name', 'email'], include: [{ model: Account, as: 'cuentas', attributes: ['account_id', 'cbu', 'current_balance', 'is_default'] }] })`.
- **Consulta única y anidada:** la respuesta entregó el objeto del usuario con el arreglo `cuentas` dentro de la estructura principal, permitiendo recuperar el perfil del usuario y sus cuentas relacionadas mediante una sola operación de lectura.
- **Requisito mínimo de include:** el flujo utilizó `include` de Sequelize para traer relaciones desde el modelo `Account` y mantener la salida ordenada para análisis y depuración.

> [!TIP]
> **Tarea PLUS opcional — JSON/HTML con relaciones anidadas:** El JSON ordenado de la ruta permitió visualizar el contenido anidado como un objeto estructurado o renderizarlo en una tabla HTML cuando la capa de vistas se enlazó con el servicio ORM.

---

## Módulo 8: APIs RESTful

**Objetivo del módulo:** Se diseñaron e implementaron endpoints RESTful, se documentaron y se entregaron respuestas HTTP consistentes para clientes web, Postman y Swagger UI.

Cada lección del módulo documenta la misma secuencia: implementación, validaciones y respuesta o evidencia.

### Respuestas y evidencias

Los endpoints JSON comunicaron el resultado mediante una estructura consistente. Las operaciones exitosas utilizaron `success: true` y entregaron el resultado en `data` o una confirmación en `message`; los errores utilizaron `success: false` y describieron el problema en `message`.

```json
{
    "success": true,
    "data": {}
}
```

```json
{
    "success": false,
    "message": "Descripción del error."
}
```

Los códigos principales fueron `200` para consultas y actualizaciones exitosas, `201` para registros creados, `400` para datos inválidos, `401` para autenticación ausente, `403` para tokens inválidos o permisos insuficientes, `404` para recursos inexistentes, `409` para conflictos y `500` para errores internos.

### Lección 1: Diseño de APIs RESTful

Se comprendieron y aplicaron los principios del diseño RESTful en los recursos principales de Alke Wallet.

**Tareas realizadas:**

- Se diseñaron y esquematizaron los endpoints de usuarios, autenticación, saldo, transferencias, contactos y transacciones.
- Se aplicaron convenciones REST en los nombres de recursos, métodos HTTP y parámetros de ruta.
- Se preparó la API para ser probada con Postman y se incorporó Swagger UI para consultar su estructura.

**Requerimientos mínimos cumplidos:**

- Se definieron más de cuatro endpoints funcionales, entre ellos `/usuarios`, `/api/contacts`, `/api/transactions` y `/api/transfer`.
- Se aplicaron correctamente los métodos `GET`, `POST`, `PUT` y `DELETE` según la operación del recurso.

> [!TIP]
> **Tarea PLUS:** Se incorporó documentación generada mediante Swagger/OpenAPI. Para consultarla, inicia primero el servidor y abre Swagger UI. La URL solo estará disponible mientras la aplicación esté ejecutándose.

> [!IMPORTANT]
> Documentación de la API: http://localhost:3000/api-docs

**Implementación y endpoints definidos**

El diseño de la API siguió convenciones REST: los recursos se expresaron mediante sustantivos en las rutas y los métodos HTTP indicaron la operación. Las respuestas de los endpoints JSON utilizaron códigos HTTP para distinguir solicitudes exitosas, errores de validación, falta de autenticación y recursos inexistentes.

| Método | Endpoint              | Descripción                                                      | Protección         |
| ------- | --------------------- | ----------------------------------------------------------------- | ------------------- |
| POST    | `/login`            | Valida las credenciales y genera un JWT con una hora de vigencia. | Pública            |
| GET     | `/usuarios`         | Lista usuarios para la administración.                           | Ruta administrativa |
| PUT     | `/usuarios/:id`     | Actualiza los datos permitidos de un usuario.                     | Ruta administrativa |
| DELETE  | `/usuarios/:id`     | Elimina un usuario y valida sus dependencias.                     | Ruta administrativa |
| GET     | `/api/saldo`        | Consulta el saldo de la cuenta autenticada.                       | Sesión             |
| POST    | `/api/transfer`     | Ejecuta una transferencia transaccional entre cuentas.            | Sesión + JWT       |
| GET     | `/api/transactions` | Obtiene el historial de transacciones.                            | Sesión             |
| GET     | `/api/contacts`     | Lista los contactos del usuario.                                  | Sesión             |
| POST    | `/api/contacts`     | Agrega un contacto para futuras transferencias.                   | Sesión             |
| GET     | `/perfil`           | Devuelve la información incluida en el JWT.                      | JWT                 |

La estructura se probó con Postman y quedó documentada mediante Swagger UI en http://localhost:3000/api-docs. El archivo generado se conservó en `swagger-output.json` y el generador se ejecutó con `node swagger-auto.js`.

### Lección 2: Implementación de una API REST

Las rutas se concentraron en `src/routes/routes.js` y delegaron la responsabilidad en controladores separados:

- `src/controllers/`: recibió la solicitud, validó el contexto HTTP y entregó la respuesta.
- `src/services/`: concentró reglas de negocio, consultas y operaciones transaccionales.
- `src/models/`: definió los modelos Sequelize y las relaciones entre `User`, `Account`, `Currency`, `Payee` y `Transaction`.
- `src/middlewares/`: gestionó sesión, autorización de administrador, JWT, carga de archivos y registro de visitas.

Esta separación evitó mezclar el enrutamiento con la persistencia y permitió reutilizar la lógica de negocio desde distintos endpoints. Antes de insertar o modificar datos se comprobó la presencia de los campos obligatorios, la existencia del usuario o cuenta, la unicidad de usuario y correo, el formato de los datos y las reglas de la operación. Las transferencias se ejecutaron dentro de una transacción de base de datos y se realizó rollback cuando ocurrió un error, para evitar saldos o registros parciales.

### Lección 3: Subida de archivos al servidor

La carga de avatares utilizó `multer` y el endpoint:

```http
POST /upload
Content-Type: multipart/form-data
Cookie: sesión autenticada
```

El campo del formulario se definió como `avatar`. La ruta exigió una sesión web activa y no validó JWT. Los archivos se guardaron en `public/uploads/`, quedaron disponibles como recursos estáticos bajo `/uploads/` y su URL se almacenó en el registro del usuario. El middleware aceptó únicamente imágenes `jpeg`, `jpg`, `png` o `webp`, con un tamaño máximo de 2 MB. Cuando no se envió un archivo o no cumplió las restricciones, la API respondió con un error controlado. Al reemplazar un avatar, se eliminó el archivo anterior para evitar residuos en el servidor.

### Lección 4: Securización mediante JWT

El flujo de autenticación es el siguiente:

1. Enviar las credenciales a `POST /login` como JSON: `{"username":"admin","password":"12345"}`.
2. Recibir el campo `token` de la respuesta exitosa.
3. Enviar el token en las rutas protegidas mediante la cabecera `Authorization: Bearer <token>`.

Como mínimo, `/perfil`, `/api/transfer` y `/profile/password` validaron el JWT mediante `verificarToken`. El middleware devolvió `401` cuando faltó la cabecera y `403` cuando el token fue inválido o expiró. El token se firmó con `JWT_SECRET` y expiró en una hora; el cliente debía conservarlo en memoria o en un almacenamiento seguro del navegador y enviarlo solo por HTTPS en producción. Las vistas web mantuvieron además una sesión basada en cookie, porque la interfaz EJS utilizó `protegerRuta`; el JWT se reservó para validar las operaciones de API que lo requirieron.

**Variables adicionales de entorno:**

```env
JWT_SECRET=una-clave-secreta-larga-y-no-versionada
SESSION_SECRET=otra-clave-secreta-larga-y-no-versionada
```

La separación entre sesión y JWT permitió mantener la navegación web y, al mismo tiempo, ofrecer endpoints JSON verificables desde Postman o cualquier cliente REST.

---

<br>
  <div align="center">
    <p>Crafted by <b><a href="https://github.com/scarvallot">whiterabbit 🕳🐇</a></b></p>
    <p>2026</p>
  </div>
<br>
