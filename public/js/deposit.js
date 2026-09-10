$(document).ready(function () {
  function mostrarAlerta(mensaje, tipo) {
    $("#alertContainer").html(
      `<div class="alert alert-${tipo} alert-dismissible fade show" role="alert">
        ${mensaje}
        <button type="button" class="close" data-dismiss="alert"><span>&times;</span></button>
      </div>`,
    );
  }

  $("#depositForm").submit(async function (event) {
    event.preventDefault(); // Detenemos el envío clásico de HTML

    var monto = parseInt($("#depositAmount").val());

    // Validaciones preventivas de UX
    if (!monto || monto <= 0) {
      mostrarAlerta("Por favor, ingresa un monto válido.", "danger");
      return;
    }
    if (monto < 1000) {
      mostrarAlerta("El monto mínimo de depósito es $1.000.", "warning");
      return;
    }

    try {
      const response = await fetch("/deposit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: monto }),
      });

      const data = await response.json();

      if (data.success) {
        mostrarAlerta(data.message, "success");
        $("#depositForm")[0].reset(); // Limpiamos el input

        // Redirigimos al menú tras 2 segundos para ver el saldo actualizado
        setTimeout(
          () => (window.location.href = data.redirect || "/menu"),
          2000,
        );
      } else {
        mostrarAlerta(data.message, "danger");
      }
    } catch (error) {
      mostrarAlerta("Error al procesar el depósito en el servidor.", "danger");
    }
  });
});
