const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Transaction = sequelize.define(
  "Transaction",
  {
    transaction_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    importe: { type: DataTypes.DECIMAL(15, 2), allowNull: false },
    transaction_date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    sender_account_id: { type: DataTypes.INTEGER, allowNull: false },
    receive_account_id: { type: DataTypes.INTEGER, allowNull: false },
  },
  { tableName: "transactions" },
);

module.exports = Transaction;
