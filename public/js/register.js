$(document).ready(function () {
  function mostrarAlerta(mensaje, tipo) {
    $("#alertContainer").html(
      `<div class="alert alert-${tipo} alert-dismissible fade show" role="alert">
        ${mensaje}
        <button type="button" class="close" data-dismiss="alert"><span>&times;</span></button>
      </div>`,
    );
  }

  $("#registerForm").submit(async function (event) {
    event.preventDefault();

    const first_name = $("#firstName").val().trim();
    const last_name = $("#lastName").val().trim();
    const user_name = $("#username").val().trim();
    const email = $("#email").val().trim();
    const password = $("#password").val().trim();
    const confirm_password = $("#confirm_password").val().trim();

    if (
      !first_name ||
      !last_name ||
      !user_name ||
      !email ||
      !password ||
      !confirm_password
    ) {
      mostrarAlerta(
        "Falta rellenar datos. Todos los campos son obligatorios.",
        "warning",
      );
      return;
    }

    if (password !== confirm_password) {
      mostrarAlerta("Las contraseñas no coinciden.", "danger");
      return;
    }

    const btnSubmit = $("#registerSubmitBtn");
    btnSubmit
      .prop("disabled", true)
      .html('<i class="fas fa-spinner fa-spin mr-2"></i>Registrando...');

    try {
      const response = await fetch("/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          first_name,
          last_name,
          user_name,
          email,
          password,
        }),
      });

      const data = await response.json();

      if (data.success) {
        mostrarAlerta("¡Registro exitoso! Redirigiendo al login...", "success");
        setTimeout(() => (window.location.href = "/login"), 2000);
      } else {
        mostrarAlerta(
          data.message || "Ocurrió un error al registrar el usuario.",
          "danger",
        );
        btnSubmit
          .prop("disabled", false)
          .html('<i class="fas fa-user-plus mr-2"></i>Registrarse');
      }
    } catch (error) {
      mostrarAlerta("Error al conectar con el servidor.", "danger");
      btnSubmit
        .prop("disabled", false)
        .html('<i class="fas fa-user-plus mr-2"></i>Registrarse');
    }
  });
});
