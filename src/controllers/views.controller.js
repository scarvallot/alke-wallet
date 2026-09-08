const redireccionarInicio = (req, res) => {
  if (req.session.usuario) return res.redirect("/menu");
  res.redirect("/login");
};

const mostrarMenu = (req, res) => {
  res.render("menu/menu", {
    tituloPagina: "Menú Principal - Mi Wallet",
    jsFile: "/js/menu.js",
  });
};

const mostrarDeposit = (req, res) => {
  res.render("deposit/deposit", {
    tituloPagina: "Depositar Dinero - Mi Wallet",
    jsFile: "/js/deposit.js",
  });
};

const mostrarSendMoney = (req, res) => {
  res.render("sendmoney/sendmoney", {
    tituloPagina: "Enviar Dinero - Mi Wallet",
    jsFile: "/js/sendmoney.js",
  });
};

const mostrarTransaction = (req, res) => {
  res.render("transaction/transaction", {
    tituloPagina: "Historial de Transacciones - Mi Wallet",
    jsFile: "/js/transaction.js",
  });
};

const verificarStatus = (req, res) => {
  res.status(200).json({
    estado: "activo",
    mensaje: "Servidor funcionando correctamente",
    fecha: new Date().toISOString(),
  });
};

module.exports = {
  redireccionarInicio,
  mostrarMenu,
  mostrarDeposit,
  mostrarSendMoney,
  mostrarTransaction,
  verificarStatus,
};
