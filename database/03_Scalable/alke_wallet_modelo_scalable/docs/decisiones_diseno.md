# Decisiones de Diseño — AlkeWallet Scalable

## 1. Evolución desde Approach

El modelo **Approach** sentó las bases con mejoras en tipos de datos, restricciones y relaciones. Sin embargo, mantenía el saldo dentro de la tabla `Users`, limitando a los usuarios a una única moneda. El modelo **Scalable** da un paso adelante al introducir el concepto de **cuentas por moneda**, permitiendo que un usuario tenga múltiples saldos en diferentes divisas y estableciendo reglas de negocio más estrictas para garantizar la integridad financiera.

---

## 2. Resumen de mejoras (Comparativa Approach → Scalable)

| Aspecto                              | Modelo Approach                     | Modelo Scalable                                                                   | Justificación                                                                |
| :----------------------------------- | :---------------------------------- | :-------------------------------------------------------------------------------- | :---------------------------------------------------------------------------- |
| **Saldo del usuario**          | En`User.current_balance` (único) | En`Account.balance` (uno por moneda)                                            | Permite múltiples divisas y evita duplicar datos de usuario.                 |
| **Relación User ↔ Currency** | Indirecta (vía`Transactions`)     | Directa (vía`Accounts`)                                                         | Cada cuenta asocia un usuario con una moneda de forma explícita.             |
| **Transacciones**              | Entre usuarios (con`currency_id`) | Entre cuentas (origen y destino)                                                  | La moneda se deduce de la cuenta, simplificando la lógica.                   |
| **Acción referencial**        | `ON DELETE CASCADE`               | `ON DELETE RESTRICT` / `ON UPDATE RESTRICT`                                   | Impide borrar usuarios con historial financiero (seguridad).                  |
| **Validaciones de negocio**    | Ninguna (`CHECK` no definidos)    | `CHECK (balance >= 0)`, `CHECK (importe > 0)`, `CHECK (sender <> receiver)` | Garantiza que los datos cumplan reglas financieras básicas.                  |
| **Cuenta predeterminada**      | No existía                         | `is_default` en `Accounts`                                                     | Permite identificar la cuenta principal del usuario (lógica de aplicación). |
| **Fecha de transacción**      | `DATETIME` (con hora)             | `DATETIME` con `DEFAULT CURRENT_TIMESTAMP`                                    | Simplifica la inserción y asegura auditoría precisa.                        |
| **Unicidad de cuenta**         | No aplica                           | `UNIQUE (user_id, currency_id)`                                                 | Evita que un usuario tenga dos cuentas con la misma moneda.                   |

---

## 3. Análisis detallado de cada decisión

### 3.1. Tabla `Accounts` (Cuenta por moneda)

- **Problema original**: En Approach, cada usuario tenía un único `current_balance`. Si un usuario quería tener saldo en CLP y USD, no era posible.
- **Solución**: Se crea la tabla `Accounts`, que actúa como una **entidad débil** entre `Users` y `Currencies`. Cada registro representa el saldo de un usuario en una moneda específica.
- **Ventajas**:
  - Soporte nativo para multi‑moneda.
  - Escalabilidad: se pueden agregar nuevas monedas sin modificar la estructura.
  - Normalización 3FN (el saldo ya no es un atributo de `Users`).
- **Restricción clave**: `UNIQUE (user_id, currency_id)` evita que un usuario tenga dos cuentas en la misma moneda.

### 3.2. Transacciones entre cuentas (en lugar de entre usuarios)

- **Cambio**: En lugar de `sender_user_id` y `receiver_user_id`, la tabla `Transactions` ahora usa `sender_account_id` y `receiver_account_id`.
- **Ventaja**: La moneda de la transacción es implícita (es la de la cuenta origen y destino). Esto simplifica la lógica y evita inconsistencias (ej. una transacción que intente enviar CLP desde una cuenta USD).
- **Impacto**: La consulta *"¿Cuánto dinero ha enviado el usuario X?"* ahora requiere unir `Transactions` con `Accounts` para obtener el `user_id`.

### 3.3. `ON DELETE RESTRICT` en lugar de `CASCADE`

- **Razón**: En sistemas financieros, el historial de transacciones es **evidencia crítica** y no debe eliminarse accidentalmente. `CASCADE` permitía que al borrar un usuario se borraran todas sus transacciones (pérdida de auditoría).
- **Nueva política**: `ON DELETE RESTRICT` impide eliminar un usuario que tenga transacciones asociadas (como emisor o receptor). Para "borrar" un usuario, se recomienda un **borrado lógico** (ej. columna `is_active`) en lugar de un `DELETE` físico.
- **Excepción**: `ON DELETE CASCADE` se mantiene en `Accounts` → `Transactions`? **No**, también se usa `RESTRICT` para proteger el historial.

### 3.4. Restricciones `CHECK` (Integridad de negocio)

A diferencia de Approach, ahora se aplican reglas directamente en la base de datos:

| Tabla           | Restricción                                                                 | Propósito                                                                   |
| :-------------- | :--------------------------------------------------------------------------- | :--------------------------------------------------------------------------- |
| `Accounts`     | `CHECK (balance >= 0)`                                                     | Evita saldos negativos (no se puede deber dinero al sistema).                |
| `Transactions` | `CHECK (importe > 0)`                                                      | El monto debe ser positivo (no se permiten transferencias de 0 o negativas). |
| `Transactions` | `CHECK (sender_account_id <> receiver_account_id)`                         | Evita que una cuenta se transfiera dinero a sí misma.                       |
| `Users`        | `CHECK (email REGEXP '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$')` | (Opcional) Valida formato de correo.                                         |

### 3.5. `is_default` en `Accounts`

- **Propósito**: Identificar la cuenta principal (o preferida) del usuario para mostrar saldos predeterminados en la interfaz.
- **Decisión**: Solo se permite una cuenta con `is_default = TRUE` por usuario. Esto se puede garantizar mediante:
  - Un **índice único condicional** (MySQL 8.0+): `CREATE UNIQUE INDEX uq_account_default ON Account (user_id) WHERE is_default = TRUE;`
  - O lógica en la aplicación (más común).
- **Valor por defecto**: `FALSE`, para que el usuario elija explícitamente su cuenta favorita.

### 3.6. Defaults en el esquema

- `Account.balance` → `0` (al crear una nueva cuenta, el saldo inicia en cero).
- `Transaction.transaction_date` → `CURRENT_TIMESTAMP` (se registra automáticamente al insertar).
- `User.created_at` → `CURRENT_TIMESTAMP` (auditoría de creación de usuarios).

---

## 4. Comparativa de modelos (Received vs Approach vs Scalable)

| Característica                             | Received      | Approach          | Scalable            |
| :------------------------------------------ | :------------ | :---------------- | :------------------ |
| **Multi‑moneda**                     | ❌            | ❌                | ✅ (Tabla Account)  |
| **Tipos monetarios**                  | `INT`       | `DECIMAL(15,2)` | `DECIMAL(15,2)`   |
| **PK AUTO_INCREMENT**                 | ❌            | ✅                | ✅                  |
| **NOT NULL**                          | ❌            | ✅                | ✅                  |
| **UNIQUE**                            | ❌            | ✅                | ✅                  |
| **Relación Currency → Transaction** | ❌            | ✅                | ✅ (vía Account)   |
| **Índices explícitos**              | ❌            | ✅                | ✅                  |
| **CHECK constraints**                 | ❌            | ❌                | ✅                  |
| **ON DELETE**                         | `NO ACTION` | `CASCADE`       | `RESTRICT`        |
| **Cuenta predeterminada**             | ❌            | ❌                | ✅ (`is_default`) |
| **Normalización**                    | 1FN           | 2FN               | **3FN**       |

---

## 5. Limitaciones resueltas respecto a Approach

| Limitación en Approach              | Solución en Scalable                                     |
| :----------------------------------- | :-------------------------------------------------------- |
| **Soporte multi‑divisa**      | Tabla`Accounts` (saldo por moneda).                      |
| **Sin validaciones `CHECK`** | Restricciones de negocio en`Accounts` y `Transactions`. |
| **`CASCADE` peligroso**      | `RESTRICT` para proteger historial financiero.          |
| **Sin cuenta predeterminada**  | `is_default` para identificar la cuenta principal.      |

## 6. Limitaciones pendientes (fuera del alcance)

- **Conversión de monedas**: Aunque el modelo soporta multi‑moneda, no incluye tasas de cambio ni conversión automática.
- **Auditoría avanzada**: No se registran quién/modificó cuándo (se puede agregar con triggers o tablas de auditoría).
- **Borrado lógico**: No se implementa `is_active` en `Users`; la eliminación física está restringida pero no se ofrece una alternativa de desactivación.

---

## 7. Conclusión

El modelo **Scalable** representa la culminación de la evolución del esquema AlkeWallet, alcanzando la **Tercera Forma Normal (3FN)** y proporcionando una base sólida para un sistema financiero real. Las decisiones de diseño priorizan:

- **Integridad**: `CHECK` y `RESTRICT` protegen los datos.
- **Flexibilidad**: Multi‑moneda y cuentas por usuario.
- **Seguridad**: Prevención de borrados accidentales.

Este modelo está listo para entornos productivos con requerimientos complejos y sirve como referencia para futuras extensiones (ej. conversión de divisas, microservicios).
