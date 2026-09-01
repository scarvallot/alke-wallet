$(document).ready(function () {
  // Mostrar saldo actual desde localStorage
  var saldo = parseInt(localStorage.getItem("walletBalance")) || 0;
  $("#balance").text("$" + saldo.toLocaleString("es-CL"));

  // Función para mostrar alerta de redirección
  function redirigir(mensaje, url) {
    $("#alertContainer").html(
      '<div class="alert alert-success">Redirigiendo a ' +
        mensaje +
        "...</div>",
    );
    setTimeout(function () {
      window.location.href = url;
    }, 1500);
  }

  // Eventos de los botones de navegación
  $("#depositBtn").click(function () {
    redirigir("Depósito", "../deposit/deposit.html");
  });

  $("#sendMoneyBtn").click(function () {
    redirigir("Envío de Dinero", "../sendmoney/sendmoney.html");
  });

  $("#transactionBtn").click(function () {
    redirigir("Últimos Movimientos", "../transaction/transaction.html");
  });

  $("#btnCerrarSesion").click(function () {
    window.location.href = "../auth/login/login.html";
  });
});
