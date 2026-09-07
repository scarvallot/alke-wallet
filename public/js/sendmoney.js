$(document).ready(function () {
  // Mostrar / ocultar formulario de nuevo contacto con animación
  $("#btnAgregarContacto").click(function () {
    $("#addContactFormContainer").slideToggle();
  });

  $("#btnCancelarContacto").click(function () {
    $("#addContactFormContainer").slideUp();
    $("#addContactForm")[0].reset();
    $("#errNombre, #errCbu, #errAlias").text("");
  });

  // Validar formulario ANTES de enviarlo al servidor Node.js
  $("#addContactForm").submit(function (event) {
    var nombre = $("#contactName").val().trim();
    var cbu = $("#contactCbu").val().trim();
    var alias = $("#contactAlias").val().trim();
    var valido = true;

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

    // Si hay errores, frenamos el POST al servidor
    if (!valido) {
      event.preventDefault();
    }
    // Si es válido, NO usamos preventDefault(). El formulario hará el POST
    // a tu ruta Express, guardará en MySQL y recargará la página.
  });

  // Búsqueda visual en tiempo real sobre los contactos renderizados por EJS
  $("#searchContact").on("keyup", function () {
    var termino = $(this).val().toLowerCase();
    // EJS debe generar cada contacto con la clase "contact-item"
    $(".contact-item").filter(function () {
      $(this).toggle($(this).text().toLowerCase().indexOf(termino) > -1);
    });
  });

  // Auto-ocultar alertas de éxito/error provenientes del servidor (Flash messages)
  setTimeout(function () {
    $(".alert").slideUp();
  }, 4000);
});
