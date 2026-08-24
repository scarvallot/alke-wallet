$(document).ready(function () {
  // Mostrar saldo desde localStorage
  var saldo = parseInt(localStorage.getItem("walletBalance")) || 0;
  $("#balance").text("$" + saldo.toLocaleString("es-CL"));

  // Lista de contactos (cargada desde localStorage o con ejemplo inicial)
  var contactos = JSON.parse(localStorage.getItem("contacts")) || [
    {
      nombre: "Sergio Carvallo",
      alias: "se.carvallo",
      cbu: "12312312312312312312",
    },
  ];

  // Renderizar lista de contactos
  function renderizarContactos(filtro) {
    var lista = contactos;

    // Filtrar si hay término de búsqueda
    if (filtro && filtro.trim() !== "") {
      var termino = filtro.toLowerCase();
      lista = contactos.filter(function (c) {
        return (
          c.nombre.toLowerCase().includes(termino) ||
          c.alias.toLowerCase().includes(termino)
        );
      });
    }

    if (lista.length === 0) {
      $("#contactList").html(
        '<p class="text-muted text-center">No se encontraron contactos.</p>',
      );
      return;
    }

    var html = "";
    lista.forEach(function (c) {
      html +=
        '<div class="contact-item d-flex justify-content-between align-items-center p-3 border rounded mb-2">' +
        "<div>" +
        "<strong>" +
        c.nombre +
        "</strong><br>" +
        '<small class="text-primary">' +
        c.alias +
        "</small><br>" +
        '<small class="text-muted">' +
        c.cbu +
        "</small>" +
        "</div>" +
        '<button class="btn btn-sm btn-primary btn-enviar" data-nombre="' +
        c.nombre +
        '">' +
        '<i class="fas fa-paper-plane mr-1"></i>Enviar dinero' +
        "</button>" +
        "</div>";
    });
    $("#contactList").html(html);
  }

  renderizarContactos();

  // Mostrar / ocultar formulario de nuevo contacto
  $("#btnAgregarContacto").click(function () {
    $("#addContactFormContainer").slideToggle();
  });

  $("#btnCancelarContacto").click(function () {
    $("#addContactFormContainer").slideUp();
    $("#addContactForm")[0].reset();
    $("#errNombre, #errCbu, #errAlias").text("");
  });

  // Validar y guardar nuevo contacto
  $("#addContactForm").submit(function (event) {
    event.preventDefault();

    var nombre = $("#contactName").val().trim();
    var cbu = $("#contactCbu").val().trim();
    var alias = $("#contactAlias").val().trim();
    var valido = true;

    // Validaciones básicas
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

    // Agregar contacto y guardar en localStorage
    contactos.push({ nombre: nombre, cbu: cbu, alias: alias });
    localStorage.setItem("contacts", JSON.stringify(contactos));

    $("#addContactForm")[0].reset();
    $("#addContactFormContainer").slideUp();
    renderizarContactos();

    $("#alertContainer").html(
      '<div class="alert alert-success">Contacto <strong>' +
        nombre +
        "</strong> agregado exitosamente.</div>",
    );
  });

  // Búsqueda en agenda al escribir
  $("#searchContact").on("keyup", function () {
    renderizarContactos($(this).val());
  });

  // Búsqueda al enviar el formulario
  $("#searchForm").submit(function (event) {
    event.preventDefault();
    renderizarContactos($("#searchContact").val());
  });

  // Enviar dinero al hacer clic en el botón del contacto
  $(document).on("click", ".btn-enviar", function () {
    var nombre = $(this).data("nombre");
    $("#alertContainer").html(
      '<div class="alert alert-success">' +
        '<i class="fas fa-check-circle mr-2"></i>' +
        "Dinero enviado a <strong>" +
        nombre +
        "</strong> con éxito." +
        "</div>",
    );
    // Scroll al mensaje
    $("html, body").animate(
      { scrollTop: $("#alertContainer").offset().top - 20 },
      400,
    );
  });

  // Botones de navegación
  $("#depositBtn").click(function () {
    window.location.href = "../deposit/deposit.html";
  });
  $("#transactionBtn").click(function () {
    window.location.href = "../transaction/transaction.html";
  });
  $("#menuBtn").click(function () {
    window.location.href = "../menu/menu.html";
  });
  $("#btnCerrarSesion").click(function () {
    window.location.href = "../auth/login/login.html";
  });
});
