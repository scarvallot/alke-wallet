# Decisiones de Diseño — AlkeWallet Approach

## 1. Evolución desde el modelo Received

Su objetivo es corregir las limitaciones identificadas sin modificar la esencia del esquema (tres tablas principales). A continuación, se resumen los cambios aplicados:

## 2. Resumen de mejoras (Comparativa directa)

La siguiente tabla resume, de forma clara y concisa, todas las decisiones de diseño tomadas en este modelo, contrastándolas con el estado inicial:

| Aspecto                             | Modelo Received (Inicial)                   | Modelo Approach (Mejorado)                                                        | Justificación                                                                                                     |
| :---------------------------------- | :------------------------------------------ | :-------------------------------------------------------------------------------- | :----------------------------------------------------------------------------------------------------------------- |
| **Identificadores (PK)**      | `INT NOT NULL` (asignación manual)       | `INT AUTO_INCREMENT`                                                            | Evita errores de duplicación y simplifica los`INSERT`.                                                          |
| **Campos monetarios**         | `INT` (sin decimales)                     | `DECIMAL(15,2)`                                                                 | Permite manejar centavos y montos con precisión (ej. $12.50).                                                     |
| **Campos obligatorios**       | `NULL` permitido en casi todos los campos | `NOT NULL` en todos los campos                                                  | Garantiza integridad mínima: un usuario siempre tiene nombre, correo y saldo.                                     |
| **Restricciones de unicidad** | No definidas                                | `UNIQUE(email)`, `UNIQUE(currency_name)`, `UNIQUE(currency_symbol)`         | Previene duplicados lógicos (dos usuarios con el mismo correo, dos monedas con el mismo nombre).                  |
| **Relación con moneda**      | `Monedas` completamente aislada            | `currency_id` (FK) en `Transactions`                                           | Cada transacción queda asociada a su divisa, permitiendo trazabilidad financiera.                                 |
| **Fecha de transacción**     | `DATE` (solo día)                        | `DATETIME` (día + hora)                                                        | Permite auditoría precisa y ordenamiento cronológico exacto.                                                     |
| **Índices de rendimiento**   | Solo los implícitos de las PK              | Índices explícitos en`sender_user_id`, `receiver_user_id` y `currency_id` | Acelera las consultas más frecuentes (historial de envíos/recepciones y filtros por moneda).                     |
| **Acción referencial**       | `ON DELETE NO ACTION`                     | `ON DELETE CASCADE` / `ON UPDATE CASCADE`                                     | Mantiene la consistencia: al eliminar un usuario, sus transacciones se borran automáticamente (evita huérfanos). |

---

## 3. Análisis detallado de cada decisión

### 3.1. `AUTO_INCREMENT` en todas las PK

- **Antes**: `user_id`, `currency_id` y `transaction_id` eran `INT NOT NULL` sin auto-incremento. Esto obligaba a la aplicación a generar y asignar manualmente los IDs, aumentando el riesgo de errores y colisiones.
- **Ahora**: Todas las PK son `AUTO_INCREMENT`, lo que garantiza valores únicos y secuenciales sin intervención manual.

### 3.2. `DECIMAL(15,2)` para campos monetarios

- **Antes**: `saldo` e `importe` eran `INT`, limitando los valores a números enteros (sin decimales).
- **Ahora**: Se usa `DECIMAL(15,2)`, soportando hasta 999,999,999,999,999.99, suficiente para cualquier operación financiera. Los campos afectados son:
  - `User.balance`
  - `Transaction.importe`

### 3.3. `NOT NULL` en todos los campos

- **Antes**: Todos los campos permitían `NULL`, lo que permitía registrar usuarios sin nombre o transacciones sin importe.
- **Ahora**: Todos los campos son `NOT NULL`, garantizando que cada registro contenga información completa y válida. Esto es esencial para la confiabilidad de los datos.

### 3.4. `UNIQUE` en `email`, `currency_name` y `currency_symbol`

- **Antes**: No había restricciones de unicidad, permitiendo correos o nombres de moneda duplicados.
- **Ahora**: Se aplica `UNIQUE` para evitar duplicados lógicos:
  - `User.email` → Asegura que cada usuario tenga un correo único.
  - `Currency.currency_name` y `Currency.currency_symbol` → Evita monedas con el mismo nombre o símbolo.

### 3.5. FK `currency_id` en `Transactions`

- **Antes**: `Monedas` estaba desconectada del resto del modelo. No era posible saber en qué moneda se realizaba una transacción.
- **Ahora**: Se agrega `currency_id` como clave foránea en `Transactions`, vinculando cada movimiento a una divisa específica. Esto permite responder consultas como: *"¿Cuánto se ha gastado en USD?"*.

### 3.6. `DATETIME` en lugar de `DATE`

- **Antes**: `transaction_date` era `DATE`, lo que solo almacenaba el día (YYYY-MM-DD).
- **Ahora**: Se usa `DATETIME` (YYYY-MM-DD HH:MM:SS), permitiendo registrar la hora exacta de la transacción. Esto es fundamental para la auditoría y el ordenamiento preciso (ej. mostrar transacciones del día en orden cronológico).

### 3.7. Índices explícitos en FK

- **Antes**: Solo existían índices implícitos por las PK. Las consultas por `sender_user_id` o `receiver_user_id` no estaban optimizadas.
- **Ahora**: Se crean índices explícitos para todas las columnas que son claves foráneas o que se usan frecuentemente en cláusulas `WHERE`, `JOIN` y `ORDER BY`:
  - `idx_sender_user_id`
  - `idx_receiver_user_id`
  - `idx_currency_id`
  - `idx_transaction_date`

### 3.8. `ON DELETE CASCADE` / `ON UPDATE CASCADE`

- **Antes**: `ON DELETE NO ACTION`. Si se eliminaba un usuario, sus transacciones quedaban huérfanas.
- **Ahora**: Se utiliza `ON DELETE CASCADE` y `ON UPDATE CASCADE` en las FKs de `Transactions`. Si un usuario se elimina, todas sus transacciones se eliminan automáticamente, manteniendo la integridad referencial sin dejar basura en la base de datos.
- **Trade-off**: Esta decisión simplifica la limpieza de datos, pero en un entorno productivo podría preferirse `ON DELETE RESTRICT` para evitar eliminaciones accidentales (ver modelo `03_Scalable`).

---

## 4. Limitaciones pendientes (no resueltas en Approach)

A pesar de las mejoras, el modelo Approach aún presenta las siguientes limitaciones, que serán abordadas en la versión **Scalable**:

| Limitación                                 | Impacto                                                                                 | Solución en Scalable                                                                        |
| :------------------------------------------ | :-------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------- |
| **Saldo en `Users`**                 | El usuario solo puede tener un saldo en una moneda base. No soporta múltiples divisas. | Extraer`saldo` a una tabla `Cuenta` (Account) que permita múltiples saldos por usuario. |
| **Ausencia de `CHECK` constraints** | No se valida que`importe > 0` o que `balance >= 0`.                                 | Agregar`CHECK` constraints para garantizar valores positivos y no negativos.               |
| **CASCADE en producción**            | `ON DELETE CASCADE` puede borrar datos históricos accidentalmente.                   | Cambiar a`ON DELETE RESTRICT` o implementar un borrado lógico (soft delete).              |

---

## 5. Conclusión

El modelo **Approach** representa un salto cualitativo importante respecto al modelo Received, corrigiendo sus principales deficiencias en cuanto a tipos de datos, integridad referencial y rendimiento. Es una base sólida para un sistema transaccional y es directamente implementable en entornos de prueba o producción con requerimientos moderados.

Para sistemas que requieran multi-divisa, auditoría avanzada o una normalización completa, se recomienda avanzar al modelo **Scalable**.
