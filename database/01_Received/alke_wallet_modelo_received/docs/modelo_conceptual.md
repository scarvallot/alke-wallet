# Modelo Conceptual — AlkeWallet Received

Modelo conceptual inicial recibido para el sistema **AlkeWallet**, identificando las entidades, atributos, relaciones y las principales decisiones de diseño. Sirve como base para comprender las limitaciones del modelo original y las mejoras propuestas en versiones posteriores.

---

## 1. Propósito del modelo

El modelo busca representar un sistema de wallet digital donde los usuarios pueden realizar transacciones financieras entre sí. La versión inicial se enfoca en la gestión básica de usuarios, monedas y movimientos, sin establecer relaciones complejas entre las entidades.

---

## 2. Entidades y atributos

### 2.1. Usuarios

Representa a cada usuario registrado en el sistema.

| Atributo | Tipo | Descripción |
| :--- | :--- | :--- |
| `user_id` | `INT` | Identificador único del usuario (**PK**). |
| `nombre` | `VARCHAR(150)` | Nombre completo del usuario. |
| `correo_electronico` | `VARCHAR(150)` | Correo electrónico (debe ser único en la práctica). |
| `contraseña` | `VARCHAR(255)` | Hash de la contraseña del usuario. |
| `saldo` | `INT` | Saldo disponible en la moneda base del sistema. |

**Nota**: Todos los atributos excepto `user_id` permiten valores `NULL` en el modelo original.

### 2.2. Monedas

Representa las divisas disponibles en el monedero virtual.

| Atributo | Tipo | Descripción |
| :--- | :--- | :--- |
| `currency_id` | `INT` | Identificador único de la moneda (**PK**). |
| `currency_name` | `VARCHAR(50)` | Nombre de la moneda (ej. "Dólar Americano"). |
| `currency_symbol` | `VARCHAR(50)` | Símbolo monetario (ej. "$", "€"). |

**Nota**: La tabla `Monedas` no tiene ninguna relación con `Usuarios` ni `Transacciones` en este modelo inicial.

### 2.3. Transacciones

Registra las transferencias de dinero entre usuarios.

| Atributo | Tipo | Descripción |
| :--- | :--- | :--- |
| `transaction_id` | `INT` | Identificador único de la transacción (**PK**). |
| `importe` | `INT` | Monto transferido (en la moneda base del sistema). |
| `transaction_date` | `DATE` | Fecha en que se realizó la operación. |
| `receiver_user_id` | `INT` | Identificador del usuario receptor (**FK** → `Usuarios.user_id`). |
| `sender_user_id` | `INT` | Identificador del usuario emisor (**FK** → `Usuarios.user_id`). |

---

## 3. Relaciones entre entidades

La siguiente tabla resume las relaciones identificadas en el modelo original:

| Relación | Cardinalidad | PK/FK | Descripción |
| :--- | :--- | :--- | :--- |
| **Usuarios → Transacciones (sender)** | 1 : N | `sender_user_id` → `user_id` | Un usuario puede enviar **muchas** transacciones. Cada transacción tiene un **único** emisor. |
| **Usuarios → Transacciones (receiver)** | 1 : N | `receiver_user_id` → `user_id` | Un usuario puede recibir **muchas** transacciones. Cada transacción tiene un **único** receptor. |
| **Monedas → (ninguna)** | — | — | La entidad `Monedas` está desconectada: no se relaciona con `Usuarios` ni `Transacciones`. |

---

## 4. Diagrama Entidad-Relación

El diagrama ER correspondiente a este modelo se encuentra disponible en:

```markdown
![Diagrama ER de AlkeWallet](./diagrams/alke_wallet_diagram_inicial.png)
```

*Figura 1: Representación gráfica del modelo conceptual inicial.*

---

## 5. Limitaciones y decisiones de diseño

A continuación, se enumeran las principales decisiones de diseño adoptadas en el modelo original y sus implicaciones:

| Decisión | Implicación / Limitación |
| :--- | :--- |
| **Monedas como tabla aislada** | No es posible asociar una transacción a una divisa concreta, ni conocer la moneda preferida de un usuario. |
| **Saldo e importe como `INT`** | No se admiten valores decimales (centavos), lo que impide representar montos como $12.50 o $0.99. |
| **Campos `NULL`** | Permite la creación de registros incompletos (ej. un usuario sin nombre). |
| **Sin `AUTO_INCREMENT` en PKs** | Los identificadores deben asignarse manualmente al insertar datos, aumentando el riesgo de errores. |
| **`ON DELETE NO ACTION`** | Si se elimina un usuario, las transacciones asociadas quedan huérfanas (referencias rotas). |
| **Sin índices adicionales** | Las consultas frecuentes por `sender_user_id` o `receiver_user_id` no estarán optimizadas. |

---

## 6. Evolución del modelo

Para superar estas limitaciones, se han diseñado dos versiones mejoradas:

- **[02_Approach](../02_Approach/README.md)** — Mejoras incrementales: tipos de datos, restricciones, índices y relación con moneda.
- **[03_Scalable](../03_Scalable/README.md)** — Normalización completa (3FN) y soporte para múltiples monedas por usuario.

---

## 7. Notas finales

Este modelo inicial, aunque funcional para demostrar conceptos básicos, presenta carencias significativas que deben ser corregidas antes de su implementación en un entorno productivo. Las versiones posteriores abordan cada una de las limitaciones aquí descritas, proporcionando una base de datos robusta, escalable y alineada con los requisitos del negocio.