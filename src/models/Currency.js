const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Currency = sequelize.define(
  "Currency",
  {
    currency_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    currency_name: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },
    currency_symbol: {
      type: DataTypes.STRING(5),
      allowNull: false,
      unique: true,
    },
  },
  { tableName: "currencies" },
);

module.exports = Currency;
