$(document).ready(function () {
  // Mostrar saldo actual desde localStorage
  function mostrarSaldo() {
    var saldo = parseInt(localStorage.getItem("walletBalance")) || 0;
    $("#balance").text("$" + saldo.toLocaleString("es-CL"));
  }

  mostrarSaldo();

  // Evento submit del formulario de depósito
  $("#depositForm").submit(function (event) {
    event.preventDefault();

    var monto = parseInt($("#depositAmount").val());

    // Validar monto
    if (!monto || monto <= 0) {
      $("#alertContainer").html(
        '<div class="alert alert-danger">Por favor, ingresa un monto válido.</div>',
      );
      return;
    }
    if (monto < 1000) {
      $("#alertContainer").html(
        '<div class="alert alert-warning">El monto mínimo de depósito es $1.000.</div>',
      );
      return;
    }

    // Actualizar saldo en localStorage
    var saldoActual = parseInt(localStorage.getItem("walletBalance")) || 0;
    localStorage.setItem("walletBalance", saldoActual + monto);
    mostrarSaldo();

    // Agregar leyenda con el monto depositado (jQuery)
    $("#depositAmount").after(
      '<p class="text-success font-weight-bold mt-2">Monto depositado: $' +
        monto.toLocaleString("es-CL") +
        "</p>",
    );
    $("#depositAmount").val("").prop("disabled", true);

    // Alerta Bootstrap de éxito
    $("#alertContainer").html(
      '<div class="alert alert-success">¡Depósito realizado con éxito! Redirigiendo al menú...</div>',
    );

    // Redirigir al menú después de 2 segundos
    setTimeout(function () {
      window.location.href = "../menu/menu.html";
    }, 2000);
  });

  // Botones de navegación
  $("#menuBtn").click(function () {
    window.location.href = "../menu/menu.html";
  });
  $("#sendMoneyBtn").click(function () {
    window.location.href = "../sendmoney/sendmoney.html";
  });
  $("#transactionBtn").click(function () {
    window.location.href = "../transaction/transaction.html";
  });
  $("#btnCerrarSesion").click(function () {
    window.location.href = "../auth/login/login.html";
  });
});
