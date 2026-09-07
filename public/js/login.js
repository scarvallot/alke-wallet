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
    // Frenamos el envío un segundo para validar que no haya campos vacíos
    event.preventDefault();

    // Selectores jQuery para obtener valores
    var username = $("#username").val().trim();
    var password = $("#password").val().trim();

    // 1. Validaciones Frontend (Evitan peticiones innecesarias al servidor)
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

    // 2. Delegar la seguridad al Backend
    // Si los campos no están vacíos, reanudamos el envío nativo del formulario.
    // Esto enviará un POST a tu ruta '/login' de Express, donde procesarLogin
    // verificará las credenciales reales en la Base de Datos y creará la sesión.
    this.submit();
  });
});
