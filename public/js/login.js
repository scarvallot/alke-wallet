$(document).ready(function () {
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

  $("#loginForm").submit(function (event) {
    event.preventDefault();

    var username = $("#username").val().trim();
    var password = $("#password").val().trim();

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

    // Delega la autenticación real al backend Node.js
    this.submit();
  });
});
