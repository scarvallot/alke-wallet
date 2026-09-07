SELECT * FROM alkewallet.users;-- =====================================================
-- Migraciones — alke_wallet_db
-- Vacío: CHECK y restricciones están en schema/01_alke_wallet_schema.sql
-- =====================================================

 -- Alkawallet DB
USE alkewallet; /* Se selecciona la base de datos alkewallet para realizar las migraciones. */

ALTER TABLE alkewallet.users ADD COLUMN first_name VARCHAR(255) NOT NULL;   /* Se agrega la columna first_name a la tabla users para almacenar el primer nombre del usuario.*/  
ALTER TABLE alkewallet.users ADD COLUMN last_name VARCHAR(255) NOT NULL;    /* Se agrega la columna last_name a la tabla users para almacenar el apellido del usuario.*/
ALTER TABLE alkewallet.users ADD COLUMN is_active TINYINT(1) NOT NULL DEFAULT 1;    /* Se agrega la columna is_active a la tabla users para indicar si el usuario está activo o no. Por defecto, se establece en 1 (activo).*/
ALTER TABLE alkewallet.users MODIFY COLUMN created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP; /* Se modifica la columna created_at de la tabla users para establecer un valor predeterminado de CURRENT_TIMESTAMP, lo que significa que se registrará automáticamente la fecha y hora de creación del registro. */
ALTER TABLE alkewallet.users ADD COLUMN updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;    /* Se agrega la columna updated_at a la tabla users para almacenar la fecha y hora de la última actualización del registro. Se establece un valor predeterminado de CURRENT_TIMESTAMP y se actualiza automáticamente cada vez que se modifica el registro. */

#	Modificación de la tabla users para cambiar el orden de las columnas y establecer restricciones NOT NULL en first_name y last_name.
ALTER TABLE alkewallet.users MODIFY COLUMN first_name VARCHAR(255) NOT NULL AFTER user_name;
ALTER TABLE alkewallet.users MODIFY COLUMN last_name VARCHAR(255) NOT NULL AFTER first_name;
ALTER TABLE users MODIFY COLUMN created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP AFTER is_active;



INSERT INTO alkewallet.users (user_name, first_name, last_name, email, password, is_active) 
VALUES('admin', 'system', 'Administrator', 'admin@alkewallet.com',12345,1); /* Se inserta un registro en la tabla users con los valores especificados para user_name, first_name, last_name, email, password e is_active. Esto crea un usuario administrador con los datos proporcionados. */
