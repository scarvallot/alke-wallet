const { DataTypes } = require("sequelize");
const sequelize = require("../config/sequelize");
//  Definición del modelo Account
const Account = sequelize.define(
  "Account",
  {
    account_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    cbu: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },
    currency_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    current_balance: {
      type: DataTypes.DECIMAL(15, 2),
      defaultValue: 0,
    },
    is_default: {
      type: DataTypes.TINYINT,
      defaultValue: 0,
    },
  },
  {
    tableName: "Accounts",
    timestamps: false,
  },
);

module.exports = Account;
