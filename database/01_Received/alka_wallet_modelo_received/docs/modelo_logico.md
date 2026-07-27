# Modelo Lógico — AlkaWallet Received

Implementación lógica del modelo conceptual inicial para el sistema **AlkaWallet**. Se presentan las tablas, sus atributos, restricciones, claves foráneas y las cardinalidades resultantes. También se incluyen observaciones sobre las decisiones de diseño y sus implicaciones prácticas.

---

## 1. Tablas y atributos

### 1.1. `Usuario`

Almacena la información de los usuarios del monedero virtual.

| Columna                | Tipo             | Restricciones | Descripción                                                 |
| :--------------------- | :--------------- | :------------ | :----------------------------------------------------------- |
| `user_id`            | `INT`          | **PK**  | Identificador único del usuario.                            |
| `nombre`             | `VARCHAR(150)` | `NULL`      | Nombre completo del usuario.                                 |
| `correo_electronico` | `VARCHAR(150)` | `NULL`      | Correo electrónico (no se aplica`UNIQUE` en este modelo). |
| `contraseña`        | `VARCHAR(255)` | `NULL`      | Hash de la contraseña.                                      |
| `saldo`              | `INT`          | `NULL`      | Saldo actual en la moneda base del sistema.                  |

> **Nota**: Todos los atributos (excepto la PK) permiten valores nulos, lo que puede comprometer la integridad de los datos.

### 1.2. `Moneda`

Catálogo de las divisas admitidas en el monedero.

| Columna             | Tipo            | Restricciones | Descripción                                  |
| :------------------ | :-------------- | :------------ | :-------------------------------------------- |
| `currency_id`     | `INT`         | **PK**  | Identificador único de la moneda.            |
| `currency_name`   | `VARCHAR(50)` | `NULL`      | Nombre de la moneda (ej. "Dólar Americano"). |
| `currency_symbol` | `VARCHAR(50)` | `NULL`      | Símbolo monetario (ej. "$", "€").           |

> **Nota**: Esta tabla no tiene ninguna relación con `Usuario` ni `Transaccion` en el modelo actual.

### 1.3. `Transaccion`

Registra cada transferencia de dinero entre usuarios.

| Columna              | Tipo     | Restricciones     | Descripción                             |
| :------------------- | :------- | :---------------- | :--------------------------------------- |
| `transaction_id`   | `INT`  | **PK**      | Identificador único de la transacción. |
| `importe`          | `INT`  | `NULL`          | Monto transferido (sin decimales).       |
| `transaction_date` | `DATE` | `NULL`          | Fecha en que se realizó la operación.  |
| `receiver_user_id` | `INT`  | `FK → Usuario` | Identificador del usuario receptor.      |
| `sender_user_id`   | `INT`  | `FK → Usuario` | Identificador del usuario emisor.        |

---

## 2. Claves foráneas

Las siguientes restricciones mantienen la integridad referencial entre `Transaccion` y `Usuario`:

| Nombre de la FK                     | Tabla origen    | Columna              | Tabla destino | Columna ref. | `ON DELETE` | `ON UPDATE` |
| :---------------------------------- | :-------------- | :------------------- | :------------ | :----------- | :------------ | :------------ |
| `fk_transaction_receiver_user_id` | `Transaccion` | `receiver_user_id` | `Usuario`   | `user_id`  | `NO ACTION` | `NO ACTION` |
| `fk_transaction_sender_user_id`   | `Transaccion` | `sender_user_id`   | `Usuario`   | `user_id`  | `NO ACTION` | `NO ACTION` |

> **Implicación**: Con `NO ACTION`, si se elimina un usuario, las transacciones asociadas quedarán huérfanas (referencias rotas), lo que no es deseable en un sistema financiero.

---

## 3. Cardinalidades

Las relaciones entre las entidades, expresadas en términos de cardinalidad, son:

| Relación                                            | Cardinalidad      | Explicación                                                                               |
| :--------------------------------------------------- | :---------------- | :----------------------------------------------------------------------------------------- |
| `Usuario → Transaccion` (como **emisor**)   | **1 : N**   | Un usuario puede enviar muchas transacciones. Cada transacción tiene un único emisor.    |
| `Usuario → Transaccion` (como **receptor**) | **1 : N**   | Un usuario puede recibir muchas transacciones. Cada transacción tiene un único receptor. |
| `Moneda`                                           | **Aislada** | No existe ninguna relación con`Usuario` ni `Transaccion`.                             |

---

## 4. Motor y juego de caracteres

- **Motor de almacenamiento**: `InnoDB` (soporta transacciones ACID y claves foráneas).
- **Character set**: `utf8`
- **Collation**: `utf8_bin` (distingue mayúsculas/minúsculas en comparaciones).

---

## 5. Observaciones y limitaciones

| Aspecto                            | Decisión actual                                       | Limitación / Riesgo                                                                                   |
| :--------------------------------- | :----------------------------------------------------- | :----------------------------------------------------------------------------------------------------- |
| **Tipo de dato para montos** | `INT`                                                | No admite decimales, por lo que no se pueden representar valores fraccionarios (ej. $12.50).           |
| **Campos `NULL`**          | La mayoría de los campos permiten`NULL`.            | Permite la inserción de registros incompletos (ej. transacciones sin importe o fecha).                |
| **Claves primarias**         | `INT` sin `AUTO_INCREMENT`.                        | Obliga a asignar manualmente los IDs al insertar, aumentando el riesgo de duplicados y errores.        |
| **Relación con `Moneda`** | No existe conexión con`Usuario` ni `Transaccion`. | No se puede determinar en qué moneda opera un usuario ni en qué divisa se realizó una transacción. |
| **Acción referencial**      | `ON DELETE NO ACTION`                                | Al eliminar un usuario, las transacciones quedan huérfanas, comprometiendo la auditoría.             |
| **Índices**                 | Solo los implícitos de las PK.                        | Las consultas por`sender_user_id` o `receiver_user_id` no estarán optimizadas.                    |

---

## 6. Recomendaciones de mejora

Para superar estas limitaciones, se sugieren los siguientes cambios en futuras iteraciones:

1. **Cambiar `saldo` e `importe` a `DECIMAL(15,2)`** para manejar centavos.
2. **Agregar `AUTO_INCREMENT`** a todas las PK.
3. **Establecer `NOT NULL` y `UNIQUE`** en campos como `correo_electronico`.
4. **Incorporar `currency_id` en `Transaccion`** como FK a `Moneda`.
5. **Definir `ON DELETE RESTRICT`** en las FKs para evitar transacciones huérfanas.
6. **Crear índices explícitos** para `sender_user_id` y `receiver_user_id`.
7. **Agregar una tabla `Cuenta` o `UserCurrency`** para permitir múltiples saldos por usuario.

Estas mejoras se detallan en los documentos de los modelos `02_Approach` y `03_Scalable`.

---

## 7. Relación con el modelo conceptual

Este modelo lógico es la traducción directa del [modelo conceptual](../01_Received/README.md) recibido. Las tablas, atributos y relaciones aquí definidos reflejan fielmente las entidades y conexiones identificadas en esa etapa, manteniendo las mismas limitaciones. Las versiones posteriores corrigen progresivamente estos aspectos.
