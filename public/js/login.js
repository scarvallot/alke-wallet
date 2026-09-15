$(document).ready(function () {
  function mostrarAlerta(mensaje, tipo) {
    $("#alertContainer").html(
      `<div class="alert alert-${tipo} alert-dismissible fade show" role="alert">
        ${mensaje}
        <button type="button" class="close" data-dismiss="alert"><span>&times;</span></button>
      </div>`,
    );
  }

  $("#loginForm").submit(async function (event) {
    event.preventDefault(); // Siempre detenemos el envío clásico

    const username = $("#username").val().trim();
    const password = $("#password").val().trim();

    // Validaciones
    if (username === "") {
      mostrarAlerta("Por favor, ingresa tu usuario.", "warning");
      $("#username").focus();
      return;
    }
    if (password === "") {
      mostrarAlerta("Por favor, ingresa tu contraseña.", "warning");
      $("#password").focus();
      return;
    }
    try {
      // Envío asíncrono vía Fetch API
      const response = await fetch("/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();
      if (data.success) {
        // 1. ¡NUEVO! Guardamos el token en el navegador
        if (data.token) {
          localStorage.setItem("token", data.token);
        }
        // 2. Redirigimos al menú
        window.location.href = data.redirect;
      } else {
        mostrarAlerta(data.message, "danger");
      }
    } catch (error) {
      mostrarAlerta("Error de conexión con el servidor", "danger");
    }
  });
});
