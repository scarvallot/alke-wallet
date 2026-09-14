const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Payee = sequelize.define(
  "Payee",
  {
    payee_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: { type: DataTypes.INTEGER, allowNull: false },
    full_name: { type: DataTypes.STRING(255), allowNull: false },
    cbu: { type: DataTypes.STRING(50), allowNull: false },
    alias: { type: DataTypes.STRING(100), allowNull: true },
    currency_id: { type: DataTypes.INTEGER, allowNull: false },
  },
  { tableName: "payees" },
);

module.exports = Payee;
