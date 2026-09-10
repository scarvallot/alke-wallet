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

  $("#registerForm").submit(async function (event) {
    event.preventDefault();

    const formData = {
      first_name: $("#firstName").val().trim(),
      last_name: $("#lastName").val().trim(),
      user_name: $("#username").val().trim(),
      email: $("#email").val().trim(),
      password: $("#password").val().trim(),
    };

    const confirmPassword = $("#confirm_password").val().trim();

    // Validaciones
    if (formData.password !== confirmPassword) {
      mostrarAlerta("Las contraseñas no coinciden.", "danger");
      return;
    }

    try {
      const response = await fetch("/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        mostrarAlerta("Registro exitoso. Redirigiendo...", "success");
        setTimeout(
          () => (window.location.href = data.redirect || "/login"),
          2000,
        );
      } else {
        mostrarAlerta(data.message, "danger");
      }
    } catch (error) {
      mostrarAlerta("Ocurrió un error en el registro.", "danger");
    }
  });
});
