$(document).ready(function () {
  function mostrarAlerta(mensaje, tipo) {
    $("#alertContainer").html(
      `<div class="alert alert-${tipo} alert-dismissible fade show" role="alert">
        ${mensaje}
        <button type="button" class="close" data-dismiss="alert"><span>&times;</span></button>
      </div>`,
    );
  }

  $("#updatePasswordForm").submit(async function (event) {
    event.preventDefault(); // Prevenir envío clásico

    const current_password = $("#current_password").val().trim();
    const new_password = $("#new_password").val().trim();
    const confirm_new_password = $("#confirm_new_password").val().trim();

    // Validaciones iniciales...
    if (new_password !== confirm_new_password) {
      mostrarAlerta("Las contraseñas nuevas no coinciden.", "danger");
      return;
    }

    const payload = {
      current_password: current_password,
      new_password: new_password,
    };

    try {
      const response = await fetch("/profile/password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (data.success) {
        mostrarAlerta(data.message, "success");
        // Opcional: Redirigir al menú luego de un tiempo o limpiar el formulario
        setTimeout(() => (window.location.href = "/menu"), 2000);
      } else {
        mostrarAlerta(data.message, "danger");
      }
    } catch (error) {
      mostrarAlerta("Error al intentar actualizar la contraseña", "danger");
    }
  });
});
