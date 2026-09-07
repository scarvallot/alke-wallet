$(document).ready(function () {
  let formularioActivo = null;

  // 1. Detectar cuando el Modal se va a abrir
  $("#modalConfirmacion").on("show.bs.modal", function (event) {
    // 'boton' es exactamente el botón rojo de la tabla que el usuario clickeó
    var boton = $(event.relatedTarget);
    var userId = boton.data("userid"); // Extrae el número del data-userid

    // Conecta la variable con el formulario correcto
    formularioActivo = document.getElementById("form-delete-" + userId);
  });

  // 2. Evento de confirmación en el Modal
  $("#btnConfirmarAccion").click(function () {
    if (formularioActivo) {
      // Cambia el estado del botón a procesando
      $(this)
        .prop("disabled", true)
        .html('<i class="fas fa-spinner fa-spin mr-2"></i>Procesando...');

      // Envía el POST al backend
      formularioActivo.submit();
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
  });

  // 4. Auto-ocultar alertas
  setTimeout(function () {
    $(".alert").slideUp(500, function () {
      $(this).remove();
    });
  }, 4000);
});

// Función para el botón Editar (se mantiene global porque redirige directamente)
function editarUsuario(id) {
  window.location.href = `/admin/usuarios/${id}/editar`;
}
