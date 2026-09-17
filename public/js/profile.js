$(document).ready(function () {
  // Función global para mostrar alertas en esta vista
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

  // Guardamos la imagen original al cargar la página
  const imagenOriginal = $("#avatarPreview").attr("src");

  // A. Mostrar la previsualización y revelar el botón "Guardar Foto"
  $("#avatarInput").on("change", function (event) {
    const file = event.target.files[0];

    if (file) {
      // Validar formato
      const tiposValidos = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/webp",
      ];
      if (!tiposValidos.includes(file.type)) {
        mostrarAlerta(
          "Formato no válido. Solo se permiten imágenes JPG, PNG o WEBP.",
          "warning",
        );
        $(this).val(""); // Limpiar el input oculto
        return;
      }

      // Validar tamaño (Máximo 2MB)
      if (file.size > 2 * 1024 * 1024) {
        mostrarAlerta(
          "La imagen es muy pesada. El tamaño máximo es 2MB.",
          "warning",
        );
        $(this).val(""); // Limpiar el input oculto
        return;
      }

      // Previsualizar la imagen
      const reader = new FileReader();
      reader.onload = function (e) {
        $("#avatarPreview").attr("src", e.target.result);
        $("#btnGuardarFoto").removeClass("d-none");
      };
      reader.readAsDataURL(file);
    } else {
      // Si el usuario presiona "Cancelar" en la ventana de archivos
      $("#avatarPreview").attr("src", imagenOriginal);
      $("#btnGuardarFoto").addClass("d-none");
    }
  });

  // B. Manejar el clic en "Guardar Foto" y enviar al backend
  $("#avatarForm").submit(async function (event) {
    event.preventDefault();

    const fileInput = document.getElementById("avatarInput");
    if (fileInput.files.length === 0) return;

    const btnGuardar = $("#btnGuardarFoto");
    btnGuardar
      .prop("disabled", true)
      .html('<i class="fas fa-spinner fa-spin"></i> Guardando...');

    const formData = new FormData();
    formData.append("avatar", fileInput.files[0]);

    try {
      const response = await fetch("/upload", {
        method: "POST",
        credentials: "same-origin",
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        mostrarAlerta("¡Foto de perfil actualizada exitosamente!", "success");
        setTimeout(() => window.location.reload(true), 1200);
      } else {
        mostrarAlerta(data.message, "danger");
        btnGuardar
          .prop("disabled", false)
          .html('<i class="fas fa-save mr-1"></i> Guardar Foto');
      }
    } catch (error) {
      console.error("Error al subir avatar:", error);
      mostrarAlerta("Error al intentar subir la imagen.", "danger");
      btnGuardar
        .prop("disabled", false)
        .html('<i class="fas fa-save mr-1"></i> Guardar Foto');
    }
  });
});
