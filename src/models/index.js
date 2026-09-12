const User = require("./User");
const Account = require("./Account");

// Establecer relaciones entre modelos
// Relación 1:N -> Un Usuario tiene muchas Cuentas
User.hasMany(Account, {
  foreignKey: "user_id",
  as: "cuentas", // Este alias es la clave para anidar el JSON
});

// Relación 1:1 -> Una Cuenta pertenece a un solo Usuario
Account.belongsTo(User, {
  foreignKey: "user_id",
  as: "propietario",
});

module.exports = { User, Account };
