// src/routes/user.routes.js
const express = require("express");
const router = express.Router();
const { User, Account } = require("../models"); // Importamos los modelos relacionados

// Tarea PLUS: Ruta que devuelve el usuario y sus cuentas en un JSON anidado
router.get("/api/orm/users/:id/accounts", async (req, res) => {
  try {
    const { id } = req.params;

    const usuarioConCuentas = await User.findByPk(id, {
      attributes: ["user_id", "first_name", "last_name", "email"],
      include: [
        {
          model: Account,
          as: "cuentas",
          attributes: ["account_id", "cbu", "current_balance", "is_default"],
        },
      ],
    });

    if (!usuarioConCuentas) {
      return res.status(404).json({
        success: false,
        message: "El usuario no existe.",
      });
    }

    // Retorna el JSON estructurado automáticamente por el ORM
    res.status(200).json({
      success: true,
      data: usuarioConCuentas,
    });
  } catch (error) {
    console.error("Error ORM Relacional:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
