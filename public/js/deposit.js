$(document).ready(function () {
  function mostrarSaldo() {
    var saldo = parseInt(localStorage.getItem("walletBalance")) || 0;
    $("#balance").text("$" + saldo.toLocaleString("es-CL"));
  }

  mostrarSaldo();

  // Evento submit del formulario de depósito
  $("#depositForm").submit(function (event) {
    event.preventDefault();

    var monto = parseInt($("#depositAmount").val());

    // 1. Validaciones frontend
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
    // Por ahora mantenemos la simulación con localStorage para que no se rompa la UI
    var saldoActual = parseInt(localStorage.getItem("walletBalance")) || 0;
    localStorage.setItem("walletBalance", saldoActual + monto);
    mostrarSaldo();

    // Feedback visual
    $("#depositAmount").after(
      '<p class="text-success font-weight-bold mt-2">Monto depositado: $' +
        monto.toLocaleString("es-CL") +
        "</p>",
    );
    $("#depositAmount").val("").prop("disabled", true);

    $("#alertContainer").html(
      '<div class="alert alert-success">¡Depósito realizado con éxito! Redirigiendo al menú...</div>',
    );

    // 2. Redirección actualizada al endpoint de Express
    setTimeout(function () {
      window.location.href = "/menu";
    }, 2000);
  });

  // 3. Botones de navegación actualizados a rutas del Router
  $("#menuBtn").click(function () {
    window.location.href = "/menu";
  });

  $("#sendMoneyBtn").click(function () {
    window.location.href = "/sendmoney";
  });

  $("#transactionBtn").click(function () {
    window.location.href = "/transaction";
  });

  // Redirige a /logout para que Express destruya la sesión correctamente
  $("#btnCerrarSesion").click(function () {
    window.location.href = "/logout";
  });
});
