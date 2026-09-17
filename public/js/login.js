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
    event.preventDefault(); // Evita la recarga de la página

    const username = $("#username").val().trim();
    const password = $("#password").val().trim();

    if (!username || !password) {
      mostrarAlerta(
        "Falta rellenar datos. Ingresa usuario y contraseña.",
        "warning",
      );
      return;
    }

    // Deshabilitar botón mientras carga
    const btnSubmit = $("#loginSubmitBtn");
    btnSubmit
      .prop("disabled", true)
      .html('<i class="fas fa-spinner fa-spin mr-2"></i>Verificando...');

    try {
      const response = await fetch("/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      // Dependemos estrictamente del boolean que envía tu backend
      if (data.success) {
        mostrarAlerta("¡Login exitoso! Redirigiendo...", "success");

        // Guardamos el token JWT que manda tu backend en el almacenamiento local
        if (data.token) localStorage.setItem("token", data.token);

        // Redirigimos usando la ruta que dictó el backend (data.redirect)
        setTimeout(
          () => (window.location.href = data.redirect || "/menu"),
          1500,
        );
      } else {
        mostrarAlerta(
          data.message || "Usuario o contraseña incorrectos.",
          "danger",
        );
        btnSubmit
          .prop("disabled", false)
          .html('<i class="fas fa-sign-in-alt mr-2"></i>Iniciar Sesión');
      }
    } catch (error) {
      console.error(error);
      mostrarAlerta("Error al conectar con el servidor.", "danger");
      btnSubmit
        .prop("disabled", false)
        .html('<i class="fas fa-sign-in-alt mr-2"></i>Iniciar Sesión');
    }
  });
});
