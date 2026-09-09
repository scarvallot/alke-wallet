$(document).ready(function () {
  function mostrarAlerta(mensaje, tipo) {
    $("#alertContainer").html(
      `<div class="alert alert-${tipo} alert-dismissible fade show" role="alert">
        ${mensaje}
        <button type="button" class="close" data-dismiss="alert"><span>&times;</span></button>
      </div>`,
    );
  }
  $("#updateProfileForm").submit(async function (event) {
    event.preventDefault();

    const first_name = $("#firstName").val().trim();
    const last_name = $("#lastName").val().trim();
    const email = $("#email").val().trim();

    if (!first_name || !last_name || !email) {
      mostrarAlerta("Todos los campos son obligatorios.", "warning");
      return;
    }

    try {
      const response = await fetch("/profile/update", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({ first_name, last_name, email }),
      });

      const data = await response.json();

      if (data.success) {
        mostrarAlerta(data.message, "success");
        setTimeout(() => window.location.reload(), 1500);
      } else {
        mostrarAlerta(data.message, "danger");
      }
    } catch (error) {
      console.error("Error al actualizar perfil:", error);
      mostrarAlerta("Error de conexión al actualizar el perfil.", "danger");
    }
  });

  $("#updatePasswordForm").submit(async function (event) {
    event.preventDefault();

    const current_password = $("#current_password").val().trim();
    const new_password = $("#new_password").val().trim();
    const confirm_new_password = $("#confirm_new_password").val().trim();

    if (!current_password || !new_password || !confirm_new_password) {
      mostrarAlerta(
        "Por favor, completa todos los campos de contraseña.",
        "warning",
      );
      return;
    }

    if (new_password !== confirm_new_password) {
      mostrarAlerta("Las contraseñas nuevas no coinciden.", "danger");
      return;
    }

    try {
      const response = await fetch("/profile/password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({ current_password, new_password }),
      });

      const data = await response.json();

      if (data.success) {
        mostrarAlerta(data.message, "success");
        $("#updatePasswordForm")[0].reset();
      } else {
        mostrarAlerta(data.message, "danger");
      }
    } catch (error) {
      console.error("Error al actualizar contraseña:", error);
      mostrarAlerta("Error al intentar actualizar la contraseña.", "danger");
    }
  });
});
