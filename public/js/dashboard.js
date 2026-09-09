$(document).ready(function () {
  let formularioActivo = null;
  let usuarioIdActivo = null;

  // 1. Detectar cuando el Modal se va a abrir
  $("#modalConfirmacion").on("show.bs.modal", function (event) {
    // 'boton' es exactamente el botón rojo de la tabla que el usuario clickeó
    var boton = $(event.relatedTarget);
    usuarioIdActivo = boton.data("userid"); // Extrae el número del data-userid

    // Conecta la variable con el formulario correcto
    formularioActivo = document.getElementById(
      "form-delete-" + usuarioIdActivo,
    );
  });

  // 2. Evento de confirmación en el Modal
  $("#btnConfirmarAccion").click(async function () {
    if (formularioActivo && usuarioIdActivo) {
      // Cambia el estado del botón a procesando
      $(this)
        .prop("disabled", true)
        .html('<i class="fas fa-spinner fa-spin mr-2"></i>Procesando...');

      try {
        // Obtenemos dinámicamente la ruta desde el formulario (ej: /admin/usuarios/5/delete)
        const actionUrl = formularioActivo.getAttribute("action");

        const response = await fetch(actionUrl, {
          method: "POST", // O "DELETE", según como lo configures en tus rutas Express
          headers: { "Content-Type": "application/json" },
        });

        const data = await response.json();

        if (data.success) {
          // Ocultamos el modal
          $("#modalConfirmacion").modal("hide");

          // Simplemente recargamos la página para que EJS refleje el estado "desactivado"
          window.location.reload();
        } else {
          alert("Error: " + data.message);
        }
      } catch (error) {
        alert("Ocurrió un error al comunicarse con el servidor.");
      } finally {
        // Restauramos el botón a la normalidad en caso de error
        $(this).prop("disabled", false).text("Sí, desactivar");
      }
    } else {
      alert(
        "No se pudo conectar con el formulario. Por favor refresca la página (Ctrl + F5).",
      );
    }
  });

  // 3. Resetear el botón si el usuario cancela y cierra el modal
  $("#modalConfirmacion").on("hidden.bs.modal", function () {
    $("#btnConfirmarAccion").prop("disabled", false).text("Sí, desactivar");
    formularioActivo = null;
    usuarioIdActivo = null;
  });

  // 4. Auto-ocultar alertas generales
  setTimeout(function () {
    $(".alert").slideUp(500, function () {
      $(this).remove();
    });
  }, 4000);
});

// Función para el botón Editar (se mantiene global porque redirige a otra vista)
function editarUsuario(id) {
  window.location.href = `/admin/usuarios/${id}/editar`;
}
