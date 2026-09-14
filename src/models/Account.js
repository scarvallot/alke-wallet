const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Account = sequelize.define(
  "Account",
  {
    account_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: { type: DataTypes.INTEGER, allowNull: false },
    cbu: { type: DataTypes.STRING(50), allowNull: false, unique: true },
    currency_id: { type: DataTypes.INTEGER, allowNull: false },
    current_balance: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
      defaultValue: 0.0,
    },
    is_default: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    tableName: "accounts",
    indexes: [{ unique: true, fields: ["user_id", "currency_id"] }],
  },
);

module.exports = Account;
