$(document).ready(function () {
  function mostrarAlerta(mensaje, tipo) {
    $("#alertContainer").html(
      `<div class="alert alert-${tipo} alert-dismissible fade show" role="alert">
        ${mensaje}
        <button type="button" class="close" data-dismiss="alert"><span>&times;</span></button>
      </div>`,
    );
    window.scrollTo({ top: 0, behavior: "smooth" }); // Scroll para ver la alerta
  }

  // --- Animaciones UI (Se mantienen intactas) ---
  $("#btnAgregarContacto").click(function () {
    $("#addContactFormContainer").slideToggle();
  });

  $("#btnCancelarContacto").click(function () {
    $("#addContactFormContainer").slideUp();
    $("#addContactForm")[0].reset();
    $("#errNombre, #errCbu, #errAlias").text("");
  });

  // Búsqueda visual en tiempo real
  $("#searchContact").on("keyup", function () {
    var termino = $(this).val().toLowerCase();
    $(".contact-item").filter(function () {
      $(this).toggle($(this).text().toLowerCase().indexOf(termino) > -1);
    });
  });

  // --- Nuevo envío asíncrono para Agregar Contacto ---
  $("#addContactForm").submit(async function (event) {
    event.preventDefault(); // Detenemos incondicionalmente la recarga de página

    var nombre = $("#contactName").val().trim();
    var cbu = $("#contactCbu").val().trim();
    var alias = $("#contactAlias").val().trim();
    var valido = true;

    // Validaciones
    if (nombre.length < 3) {
      $("#errNombre").text("El nombre debe tener al menos 3 caracteres.");
      valido = false;
    } else {
      $("#errNombre").text("");
    }

    if (!/^\d{10,}$/.test(cbu)) {
      $("#errCbu").text("El CBU debe tener al menos 10 dígitos numéricos.");
      valido = false;
    } else {
      $("#errCbu").text("");
    }

    if (alias.length < 3) {
      $("#errAlias").text("El alias debe tener al menos 3 caracteres.");
      valido = false;
    } else {
      $("#errAlias").text("");
    }

    if (!valido) return;

    try {
      // Ajusta la ruta "/sendmoney/contact" según cómo la declares en tus rutas
      const response = await fetch("/sendmoney/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre, cbu, alias }),
      });

      const data = await response.json();

      if (data.success) {
        mostrarAlerta("Contacto guardado con éxito.", "success");
        $("#addContactForm")[0].reset();
        $("#addContactFormContainer").slideUp();

        // Recargamos la página tras un instante para que EJS dibuje el nuevo contacto en la lista
        setTimeout(() => window.location.reload(), 1500);
      } else {
        mostrarAlerta(data.message, "danger");
      }
    } catch (error) {
      mostrarAlerta("Ocurrió un error al guardar el contacto.", "danger");
    }
  });
});
