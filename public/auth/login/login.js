$(document).ready(function () {
  // Función para mostrar alertas Bootstrap con jQuery
  function mostrarAlerta(mensaje, tipo) {
    $("#alertContainer").html(
      '<div class="alert alert-' +
        tipo +
        ' alert-dismissible fade show" role="alert">' +
        mensaje +
        '<button type="button" class="close" data-dismiss="alert"><span>&times;</span></button>' +
        "</div>",
    );
  }

  // Evento submit del formulario con jQuery
  $("#loginForm").submit(function (event) {
    event.preventDefault();

    // Selectores jQuery para obtener valores
    var username = $("#username").val().trim();
    var password = $("#password").val().trim();

    // Validar campos vacíos
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

    // Validar credenciales
    if (username === "admin" && password === "12345") {
      mostrarAlerta("Sesión iniciada. Redirigiendo...", "success");
      // Redirigir al menú principal con jQuery
      setTimeout(function () {
        window.location.href = "../../menu/menu.html";
      }, 2000);
    } else {
      mostrarAlerta(
        "Usuario o contraseña incorrectos. Inténtalo de nuevo.",
        "danger",
      );
    }
  });
});
