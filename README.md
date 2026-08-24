# Alke Wallet: Aplicación de billetera digital.

[![In Progress](https://img.shields.io/badge/In%20Progress-magenta)](https://github.com/scarvallot/alke-wallet.git)

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

| Etapa | Alcance |
|---|---|
| **Front-end** | Interfaz de usuario con HTML, CSS, JavaScript, Bootstrap y jQuery: login, saldo, envío/recepción de fondos e historial de transacciones. |
| **Back-end (actual)** | Servidor propio con Node.js y Express: rutas, vistas dinámicas con EJS, y persistencia inicial en archivos mediante el módulo `fs`. |
| **Base de datos (próxima etapa)** | Integración con base de datos relacional/documental y ORM para reemplazar la persistencia en archivos planos. |

---

## Requerimientos

### Generales

| Requerimiento | Descripción |
|---|---|
| Registro e inicio de sesión | Se asigna una cuenta a cada usuario, quien accede a la aplicación mediante credenciales seguras. |
| Administración de fondos | Los usuarios pueden ver su saldo disponible, y realizar depósitos y retiros de fondos. |
| Envío y recepción de fondos | Los usuarios pueden simular el envío de fondos a otras cuentas dentro de la aplicación y recibir fondos propios. |
| Historial de transacciones | Se mantiene un registro completo de todas las transacciones realizadas en la aplicación. |

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

| Comando | Descripción |
|---|---|
| `npm start` | Ejecuta `node server.js`. Pensado para entorno de producción, sin recarga automática. |
| `npm run dev` | Ejecuta `nodemon server.js`. Pensado para desarrollo: reinicia el servidor automáticamente ante cada cambio de código. |

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
├── data/                       # Almacenamiento simple de datos (Sistema de archivos)
├── public/                     # Contenido estático
├── src/                        # Código del servidor (Node.js/Express)
│   ├── controllers/
│   ├── models/                 # Lógica para leer/escribir usando módulo 'fs' de Node
│   ├── routes/
│   ├── views/                  # Plantillas dinámicas EJS
│   └── app.js                  # Configuración de la aplicación Express (middlewares, rutas, vistas)
├── database/                   # Modelos de base de datos (Diseño y Scripts) — próxima etapa
├── package.json
├── server.js                   # Punto de entrada: levanta el servidor HTTP
└── README.md
```

## Decisiones técnicas

**Separación entre `app.js` y `server.js`:** se optó por dividir la configuración de la aplicación (`src/app.js`) del arranque del servidor (`server.js`) en lugar de usar un único `index.js`. `app.js` define y exporta la instancia de Express con sus middlewares, rutas y motor de vistas, mientras que `server.js` es el único responsable de levantar el servidor HTTP en el puerto configurado. Esta separación facilita las pruebas automatizadas (se puede importar `app.js` sin levantar un servidor real) y deja el proyecto preparado para escalar hacia la integración con base de datos sin reestructurar el punto de entrada.

**Persistencia en archivos planos (`data/`):** en esta etapa la persistencia se resuelve con el módulo `fs` de Node.js sobre archivos en `data/`, ya que aún no se integra una base de datos real. Esta capa vive en `src/models/`, de modo que al migrar a base de datos (carpeta `database/`) solo sea necesario reemplazar la implementación interna de los modelos, sin tocar controladores ni rutas.

## Servidor y Contenido Estático

El servidor utiliza el middleware `express.static()` apuntando al directorio `/public`. Se eligió esta arquitectura porque permite entregar los recursos del frontend (HTML, CSS, JS, imágenes) directamente al navegador de la forma más optimizada posible sin sobrecargar las rutas del backend. Las rutas API separadas (`/status`) se encargan de la transferencia de datos en formato JSON.

---
## Persistencia en archivos planos 

El sistema de registro (logger) se implementó utilizando el módulo nativo `fs` de Node.js, específicamente el método `fs.appendFile()`. 

**Justificación del evento registrado:**
Se decidió registrar el evento de **"acceso a rutas"** (HTTP requests) para todas las peticiones entrantes. Se eligió este evento por sobre otras alternativas (como registro de errores o inicios de sesión) porque permite monitorear el tráfico real de la aplicación, auditar qué endpoints son los más consultados (ej. `/` vs `/status`) y proporcionar una base para futuras métricas de uso de la billetera digital.

**Justificación del evento registrado (Manejo de Errores - 404):**
Para el sistema de logs (`log.txt`), se eligió registrar el evento de **errores de acceso (rutas no encontradas / 404)**. Desde la perspectiva de la arquitectura y seguridad del backend, registrar los intentos de acceso a endpoints inexistentes aporta mayor valor operativo que registrar simples visitas exitosas. Esto permite identificar rápidamente enlaces rotos en la aplicación, comportamientos inusuales o posibles escaneos de vulnerabilidades. 

---

<br>
  <div align="center">
    <p>Crafted by <b><a href="https://github.com/scarvallot">whiterabbit 🕳🐇</a></b></p>
    <p>2026</p>
  </div>
<br>