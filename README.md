# Alke Wallet: Aplicación de billetera digital.

[![In Progress](<https://img.shields.io/badge/In Progress-magenta>)](https://github.com/scarvallot/taskflow.git)

---

## Contexto

El equipo de desarrollo recibió la solicitud de crear un Front-end dinámico para una wallet digital. La problemática a resolver es brindar a los usuarios una solución segura y fácil de usar para administrar sus activos financieros de manera digital. La wallet permite a los usuarios:

* Loguearse en la plataforma.
* Agendar contactos para futuras transferencias.
* Realizar movimientos y transacciones dentro de la aplicación.

---

## Objetivo

Desarrollar una aplicación de billetera digital, **Alke Wallet**, que permita a los usuarios gestionar sus activos financieros de manera segura y conveniente.

El propósito del desafío es entregar una vista **funcional, segura y fácil de usar**, que proporcione a los usuarios una solución confiable para administrar sus activos financieros de manera digital.

---

# Requerimientos

### Generales

| Requerimiento                 | Descripción                                                                                                       |
| ----------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| Registro e inicio de sesión  | Se asigna una cuenta a cada usuario, quien accede a la aplicación mediante credenciales seguras.                  |
| Administración de fondos     | Los usuarios pueden ver su saldo disponible, y realizar depósitos y retiros de fondos.                            |
| Envío y recepción de fondos | Los usuarios pueden simular el envío de fondos a otras cuentas dentro de la aplicación y recibir fondos propios. |
| Historial de transacciones    | Se mantiene un registro completo de todas las transacciones realizadas en la aplicación.                          |

---

## Entregables

- Código fuente documentado.
- Demostración funcional.
- Explicación del código en un informe breve.

## Acceso de prueba

Para ingresar a la aplicación, utiliza las credenciales de prueba disponibles en la pantalla de login: `admin` como usuario y `12345` como contraseña. Una vez autenticado, podrás navegar por el menú principal y probar los módulos de depósito, envío de dinero y transacciones.

---

## Stack

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white) ![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white) ![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black) ![Bootstrap](https://img.shields.io/badge/Bootstrap-7952B3?style=for-the-badge&logo=bootstrap&logoColor=white) ![jQuery](https://img.shields.io/badge/jQuery-0769AD?style=for-the-badge&logo=jquery&logoColor=white)

---

## Arquitectura de la Aplicación

```markdown
  alke-wallet/
  ├── auth/
  │   └── login/
  │       ├── login.css
  │       ├── login.html
  │       └── login.js
  ├── deposit/
  │   ├── deposit.css
  │   ├── deposit.html
  │   └── deposit.js
  ├── menu/
  │   ├── menu.css
  │   ├── menu.html
  │   └── menu.js
  ├── sendmoney/
  │   ├── sendmoney.css
  │   ├── sendmoney.html
  │   └── sendmoney.js
  ├── transaction/
  │   ├── transaction.css
  │   ├── transaction.html
  │   └── transaction.js
  ├── .gitignore
  ├── LICENSE
  └── README.md
```

---

<br>
  <div align="center">
    <p>Crafted by <b><a href="https://github.com/scarvallot">whiterabbit 🕳🐇</a></p>
    <a href="https://github.com/scarvallot/taskflow.git"></a>
  </div>
<br>
