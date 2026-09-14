const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const User = sequelize.define(
  "User",
  {
    user_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    user_name: { type: DataTypes.STRING(150), allowNull: false },
    first_name: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: "",
    },
    last_name: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: "",
    },
    email: { type: DataTypes.STRING(150), allowNull: false, unique: true },
    password: { type: DataTypes.STRING(255), allowNull: false },
    is_active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  { tableName: "users" },
);

module.exports = User;
