$(document).ready(function () {
  // Validar formulario de depósito antes de enviar al backend
  $("#depositForm").submit(function (event) {
    var monto = parseInt($("#depositAmount").val());

    // Validaciones preventivas de UX
    if (!monto || monto <= 0) {
      event.preventDefault(); // Frenar envío
      $("#alertContainer").html(
        '<div class="alert alert-danger">Por favor, ingresa un monto válido.</div>',
      );
      return;
    }
    if (monto < 1000) {
      event.preventDefault(); // Frenar envío
      $("#alertContainer").html(
        '<div class="alert alert-warning">El monto mínimo de depósito es $1.000.</div>',
      );
      return;
    }
  });
});
