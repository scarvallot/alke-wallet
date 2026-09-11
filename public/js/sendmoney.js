$(document).ready(function () {
  // Cargar contactos al iniciar la página
  cargarContactos();

  function mostrarAlerta(mensaje, tipo) {
    $("#alertContainer").html(
      `<div class="alert alert-${tipo} alert-dismissible fade show shadow-sm" role="alert">
        ${mensaje}
        <button type="button" class="close" data-dismiss="alert"><span>&times;</span></button>
      </div>`,
    );
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // Escapa el texto para evitar inyección HTML al renderizar en la UI.
  function escapeHtml(value) {
    // Convierte valores nulos o indefinidos en texto vacío.
    return (
      String(value ?? "")
        // Sustituye los caracteres que pueden romper el HTML.
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/\"/g, "&quot;")
        .replace(/'/g, "&#039;")
    );
  }

  // --- Animaciones UI ---
  $("#btnAgregarContacto").click(function () {
    $("#contactListContainer").slideUp();
    $("#addContactFormContainer").slideToggle();
  });

  $("#btnDesplegarContactos").click(function () {
    $("#addContactFormContainer").slideUp();
    $("#contactListContainer").slideToggle();
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

  // --- Renderizado Dinámico de Contactos ---
  async function cargarContactos() {
    const $contactList = $("#contactList");

    try {
      const response = await fetch("/api/contacts");
      const result = await response.json();

      if (!response.ok || !result.success || !Array.isArray(result.data)) {
        const mensaje =
          result?.message || "Error al cargar la lista de contactos.";
        $contactList.empty();
        $contactList.append(
          `<div class="alert alert-danger border-0 shadow-sm">${escapeHtml(
            mensaje,
          )}</div>`,
        );
        return;
      }

      const contactos = result.data;

      if (contactos.length === 0) {
        $contactList.empty();
        $contactList.append(
          '<div class="alert alert-info border-0 shadow-sm">No tienes contactos registrados en tu agenda.</div>',
        );
        return;
      }

      // Limpiamos la lista y renderizamos todos los contactos
      $contactList.empty();

      contactos.forEach((contacto) => {
        const fullName = escapeHtml(contacto.full_name || "Sin nombre");
        const cbu = escapeHtml(contacto.cbu || "Sin CBU");
        const alias = escapeHtml(contacto.alias || "");
        const aliasHtml = alias
          ? `<small class="text-muted d-block">${alias}</small>`
          : "";

        const html = `
          <div class="card mb-2 contact-item border-0 shadow-sm">
            <div class="card-body d-flex justify-content-between align-items-center p-3">
              <div class="d-flex align-items-center">
                <div class="mr-3 text-primary">
                  <i class="fas fa-user-circle fa-2x"></i>
                </div>
                <div>
                  <h6 class="mb-0 font-weight-bold text-dark">${fullName}</h6>
                  <small class="text-muted d-block">${cbu}</small>
                  ${aliasHtml}
                </div>
              </div>
              <button class="btn btn-sm btn-outline-primary rounded-pill btn-seleccionar-contacto" data-cbu="${cbu}" data-nombre="${fullName}">
                <i class="fas fa-paper-plane mr-1"></i> Enviar
              </button>
            </div>
          </div>
        `;
        $contactList.append(html);
      });
    } catch (error) {
      console.error("Error al cargar la agenda:", error);
      $contactList.html(
        '<div class="alert alert-danger">Error al cargar la lista de contactos.</div>',
      );
    }
  }

  // --- Envío asíncrono para Agregar Contacto ---
  $("#addContactForm").submit(async function (event) {
    event.preventDefault();

    var full_name = $("#contactName").val().trim();
    var cbu = $("#contactCbu").val().trim();
    var alias = $("#contactAlias").val().trim();
    var valido = true;

    // Validaciones
    if (full_name.length < 3) {
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

    if (!valido) return;

    try {
      // Apunta a la API e incluye currency_id (ej. 1 para moneda local)
      const response = await fetch("/api/contacts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ full_name, cbu, alias, currency_id: 1 }),
      });

      const data = await response.json();

      if (data.success) {
        mostrarAlerta("Contacto guardado con éxito.", "success");
        $("#addContactForm")[0].reset();
        $("#addContactFormContainer").slideUp();

        // Recargar la lista de contactos dinámicamente
        cargarContactos();
      } else {
        mostrarAlerta(data.message, "danger");
      }
    } catch (error) {
      mostrarAlerta(
        "Ocurrió un error al comunicarse con el servidor.",
        "danger",
      );
    }
  });

  // --- 1. Abrir la tarjeta flotante al hacer clic en "Enviar" ---
  $(document).on("click", ".btn-seleccionar-contacto", function () {
    const cbu = $(this).data("cbu");
    const nombre = $(this).data("nombre");

    $("#transferAmount").val("");
    $("#modalDestinatarioNombre").text(nombre);
    $("#modalDestinatarioCbu").text(cbu);
    $("#hiddenCbu").val(cbu);
    $("#hiddenNombre").val(nombre);

    $("#transferModal").modal("show");

    setTimeout(() => {
      $("#transferAmount").focus();
    }, 500);
  });

  // --- 2. Procesar el formulario de la tarjeta flotante ---
  $("#transferForm").submit(function (event) {
    event.preventDefault(); // Evitar recarga de página

    // Reemplazamos comas por puntos por si el usuario usa teclado numérico latino
    const montoStr = $("#transferAmount").val().replace(/,/g, ".");
    const cbu = $("#hiddenCbu").val();
    const nombre = $("#hiddenNombre").val();

    const monto = parseFloat(montoStr);

    // Validar el monto ingresado
    if (isNaN(monto) || monto <= 0) {
      mostrarAlerta("Por favor, ingresa un monto válido mayor a 0.", "warning");
      return;
    }

    // En lugar de cerrar el modal, ocultamos el formulario suavemente
    $("#transferForm").slideUp(300, function () {
      // Una vez oculto el formulario, disparamos la transferencia
      ejecutarTransferenciaPorCbu(cbu, monto, nombre);
    });
  });

  // --- 3. Función para enviar la transacción al backend ---
  async function ejecutarTransferenciaPorCbu(cbuDestino, monto, nombre) {
    const $resultCard = $("#transferResultCard");
    const $icon = $("#transferResultIcon");
    const $title = $("#transferResultTitle");
    const $message = $("#transferResultMessage");

    try {
      const response = await fetch("/api/transfer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          receiverId: cbuDestino,
          amount: monto,
        }),
      });

      const data = await response.json();

      // Desplegamos la tarjeta de resultado que agregaste en el HTML
      $resultCard.slideDown();

      if (data.success) {
        // Renderizado de Éxito
        $icon.html('<i class="fas fa-check-circle fa-3x text-success"></i>');
        $title.text("¡Transferencia Exitosa!");
        $title.removeClass("text-danger").addClass("text-success");
        $message.text(
          `Has enviado $${monto.toLocaleString("es-CL")} a ${nombre}.`,
        );

        // Recargamos después de 2.5 segundos para reflejar el nuevo saldo
        setTimeout(() => window.location.reload(), 2500);
      } else {
        // Renderizado de Error (Ej: Saldo insuficiente)
        $icon.html('<i class="fas fa-times-circle fa-3x text-danger"></i>');
        $title.text("Transferencia Rechazada");
        $title.removeClass("text-success").addClass("text-danger");
        $message.text(data.message || "Saldo insuficiente o cuenta inválida.");

        // Damos 3 segundos para leer el error, luego volvemos a mostrar el formulario
        setTimeout(() => {
          $resultCard.slideUp(300, () => $("#transferForm").slideDown());
        }, 3000);
      }
    } catch (error) {
      console.error("Error de red:", error);

      // Renderizado de Error Crítico (Caída de red)
      $resultCard.slideDown();
      $icon.html(
        '<i class="fas fa-exclamation-triangle fa-3x text-warning"></i>',
      );
      $title.text("Error de Sistema");
      $title.removeClass("text-success").addClass("text-danger");
      $message.text("Ocurrió un problema de red. Intenta nuevamente.");

      setTimeout(() => {
        $resultCard.slideUp(300, () => $("#transferForm").slideDown());
      }, 3000);
    }
  }
});
