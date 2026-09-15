$(document).ready(function () {
  let balanceOculto = false; // Estado de visibilidad del saldo

  // Consultar saldo real a tu API Node.js/MySQL
  async function cargarSaldoReal() {
    try {
      const respuesta = await fetch("/api/saldo");

      if (respuesta.ok) {
        const data = await respuesta.json();
        const saldoNumerico = Number(data.current_balance ?? data.balance ?? 0);
        const moneda = data.currency_symbol || "$";
        const saldoFormateado = Number.isNaN(saldoNumerico)
          ? "0"
          : saldoNumerico.toLocaleString("es-CL");

        // Guardar el saldo real (no visible en HTML por seguridad)
        const saldoReal = `${moneda}${saldoFormateado}`;
        $("#balance").data("saldo-real", saldoReal);

        // Mostrar saldo inicialmente visible
        $("#balance").text(saldoReal);
        balanceOculto = false;
        actualizarIconoPrivacidad();
      } else {
        $("#balance").text("Error al cargar");
      }
    } catch (error) {
      console.error("Fallo la comunicación con el servidor", error);
      $("#balance").text("$---");
    }
  }

  // Cargar datos de cuenta (CBU)
  async function cargarDatosCuenta() {
    try {
      console.log("1. Iniciando petición a /api/cuenta...");
      const respuesta = await fetch("/api/cuenta");

      if (respuesta.ok) {
        const data = await respuesta.json();
        console.log("2. Datos recibidos del backend:", data);

        // Extraer el CBU
        const cbu = data.cbu || "";

        if (cbu) {
          console.log("3. Inyectando CBU en el HTML:", cbu);
          $("#cuenta-cbu").text(cbu);
          $("#cuenta-cbu").data("valor", cbu);

          // Habilitar el botón de copiar
          $("#btn-copiar-cbu").prop("disabled", false);
        } else {
          console.warn("El backend respondió OK, pero el CBU viene vacío.");
          $("#cuenta-cbu").text("CBU no configurado");
        }
      } else {
        console.error("Error del servidor. Código HTTP:", respuesta.status);
      }
    } catch (error) {
      console.error("Fallo crítico al hacer el fetch a /api/cuenta:", error);
    }
  }

  // Toggle visibilidad del saldo
  $("#btn-privacidad").on("click", function () {
    balanceOculto = !balanceOculto;

    if (balanceOculto) {
      $("#balance").text("••••••••");
    } else {
      const saldoReal = $("#balance").data("saldo-real");
      $("#balance").text(saldoReal);
    }

    actualizarIconoPrivacidad();
  });

  // Actualizar ícono de privacidad
  function actualizarIconoPrivacidad() {
    const $icon = $("#btn-privacidad i");
    if (balanceOculto) {
      $icon.removeClass("fa-eye").addClass("fa-eye-slash");
      $icon.attr("title", "Mostrar saldo");
    } else {
      $icon.removeClass("fa-eye-slash").addClass("fa-eye");
      $icon.attr("title", "Ocultar saldo");
    }
  }

  // Copiar CBU
  $("#btn-copiar-cbu").on("click", function () {
    const cbu = $("#cuenta-cbu").data("valor");

    if (cbu) {
      copiarAlPortapapeles(cbu, "CBU copiado");
    }
  });

  // Copiar Número de Cuenta
  $("#btn-copiar-cuenta").on("click", function () {
    const cuenta = $("#cuenta-numero").data("valor");

    if (cuenta) {
      copiarAlPortapapeles(cuenta, "Número de cuenta copiado");
    }
  });

  // Función auxiliar para copiar al portapapeles
  function copiarAlPortapapeles(texto, mensaje) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      // API moderna (segura y recomendada)
      navigator.clipboard
        .writeText(texto)
        .then(() => {
          mostrarNotificacion(mensaje, "success");
        })
        .catch((err) => {
          console.error("Error al copiar:", err);
          fallbackCopiar(texto, mensaje);
        });
    } else {
      // Fallback para navegadores antiguos
      fallbackCopiar(texto, mensaje);
    }
  }

  // Fallback para copiar (navegadores antiguos)
  function fallbackCopiar(texto, mensaje) {
    const $temp = $("<input>");
    $("body").append($temp);
    $temp.val(texto).select();

    try {
      document.execCommand("copy");
      mostrarNotificacion(mensaje, "success");
    } catch (err) {
      mostrarNotificacion("Error al copiar", "error");
      console.error("Fallo en fallback de copiar:", err);
    }

    $temp.remove();
  }

  // Mostrar notificación
  function mostrarNotificacion(mensaje, tipo = "info") {
    const clase = tipo === "success" ? "bg-success" : "bg-danger";
    const $notificacion = $(`
      <div class="alert alert-${
        tipo === "success" ? "success" : "danger"
      } alert-dismissible fade show position-fixed" 
           role="alert" 
           style="top: 20px; right: 20px; z-index: 9999; min-width: 300px;">
        ${mensaje}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
      </div>
    `);

    $("body").append($notificacion);

    // Auto-desaparecer después de 3 segundos
    setTimeout(() => {
      $notificacion.fadeOut(300, function () {
        $(this).remove();
      });
    }, 3000);
  }
  // --- Animación UI para los datos de la cuenta ---
  $("#btnDesplegarCuenta").click(function () {
    // Usamos slideToggle para un efecto de acordeón suave
    $("#datosCuentaContainer").slideToggle(300);

    // Opcional: Cambiar el texto/ícono del botón dependiendo si está abierto o cerrado
    const $icon = $(this).find("i");
    if ($icon.hasClass("fa-university")) {
      $icon.removeClass("fa-university").addClass("fa-chevron-up");
    } else {
      $icon.removeClass("fa-chevron-up").addClass("fa-university");
    }
  });

  cargarSaldoReal();
  cargarDatosCuenta();
});
