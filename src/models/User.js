const { DataTypes } = require("sequelize");
const sequelize = require("../config/sequelize");
//  Definición del modelo User
const User = sequelize.define(
  "User",
  {
    user_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_name: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },
    first_name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    last_name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(150),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true, // Validación automática a nivel de aplicación
      },
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    is_active: {
      type: DataTypes.TINYINT,
      defaultValue: 1,
    },
  },
  {
    tableName: "Users",
    timestamps: true, // Maneja created_at y updated_at automáticamente
    createdAt: "created_at",
    updatedAt: "updated_at",
  },
);

module.exports = User;
