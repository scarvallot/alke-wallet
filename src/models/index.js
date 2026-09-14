const User = require("./User");
const Currency = require("./Currency");
const Account = require("./Account");
const Payee = require("./Payee");
const Transaction = require("./Transaction");

// Relaciones User -> Accounts y Payees
User.hasMany(Account, { foreignKey: "user_id" });
Account.belongsTo(User, { foreignKey: "user_id" });

User.hasMany(Payee, { foreignKey: "user_id", onDelete: "CASCADE" });
Payee.belongsTo(User, { foreignKey: "user_id" });

// Relaciones Currency -> Accounts y Payees
Currency.hasMany(Account, { foreignKey: "currency_id" });
Account.belongsTo(Currency, { foreignKey: "currency_id" });

Currency.hasMany(Payee, { foreignKey: "currency_id" });
Payee.belongsTo(Currency, { foreignKey: "currency_id" });

// Relaciones Transaction -> Accounts (Sender y Receiver)
Account.hasMany(Transaction, {
  foreignKey: "sender_account_id",
  as: "SentTransactions",
});
Transaction.belongsTo(Account, {
  foreignKey: "sender_account_id",
  as: "SenderAccount",
});

Account.hasMany(Transaction, {
  foreignKey: "receive_account_id",
  as: "ReceivedTransactions",
});
Transaction.belongsTo(Account, {
  foreignKey: "receive_account_id",
  as: "ReceiverAccount",
});

module.exports = { User, Currency, Account, Payee, Transaction };
