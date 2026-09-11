$(document).ready(function () {
  // 1. Cargar las transacciones apenas inicia la página
  cargarTransacciones();

  // 2. Lógica del select para filtrar transacciones
  $("#filtroTipo").on("change", function () {
    const filtro = $(this).val();

    if (filtro === "todos") {
      $(".transaction-item").show();
    } else {
      $(".transaction-item").each(function () {
        // Compara el value del select con el data-tipo de la tarjeta
        if ($(this).data("tipo") === filtro) {
          $(this).show();
        } else {
          $(this).hide();
        }
      });
    }
  });
});

async function cargarTransacciones() {
  // Apuntamos al ID exacto de tu EJS
  const $contenedor = $("#transactionList");

  try {
    const response = await fetch("/api/transactions");
    const resData = await response.json();

    $contenedor.empty();

    if (!resData.success || !resData.data || resData.data.length === 0) {
      $contenedor.append(
        '<div class="alert alert-info">No tienes movimientos recientes.</div>',
      );
      return;
    }

    resData.data.forEach((t) => {
      // PREVENCIÓN DEL undefinedNaN: Aseguramos que sea un número válido
      const importeNumerico = Number(t.importe);
      if (isNaN(importeNumerico)) return;

      const fechaLocal = new Date(t.fecha).toLocaleString("es-CL");
      const montoFormateado = importeNumerico.toLocaleString("es-CL");

      // Variables para personalizar la UI según el tipo de movimiento
      let tipoFiltro = "";
      let etiqueta = "";
      let colorTexto = "";
      let icono = "";
      let signo = "";

      // Mapeamos el tipo del backend a las opciones de tu <select>
      if (t.tipo === "deposito") {
        tipoFiltro = "deposito";
        etiqueta = "Depósito";
        colorTexto = "text-success";
        icono = "fa-arrow-down";
        signo = "+";
      } else if (t.tipo === "ingreso") {
        tipoFiltro = "transferencia_recibida";
        etiqueta = "Transferencia Recibida";
        colorTexto = "text-success";
        icono = "fa-hand-holding-usd";
        signo = "+";
      } else {
        // Envíos de dinero
        tipoFiltro = "transferencia_enviada";
        etiqueta = "Transferencia Enviada";
        colorTexto = "text-danger";
        icono = "fa-paper-plane";
        signo = "-";
      }

      // Construimos la tarjeta HTML usando clases de Bootstrap
      const html = `
        <div class="card mb-3 transaction-item shadow-sm border-0" data-tipo="${tipoFiltro}">
          <div class="card-body d-flex justify-content-between align-items-center p-3">
            <div class="d-flex align-items-center">
              <div class="mr-3 ${colorTexto}">
                <i class="fas ${icono} fa-lg"></i>
              </div>
              <div>
                <h6 class="mb-0">${etiqueta}</h6>
                <small class="text-muted">${fechaLocal}</small>
              </div>
            </div>
            <div class="${colorTexto} font-weight-bold">
              ${signo}$${montoFormateado}
            </div>
          </div>
        </div>
      `;

      $contenedor.append(html);
    });
  } catch (error) {
    console.error("Error al cargar el historial:", error);
    $contenedor.html(
      '<div class="alert alert-danger">Ocurrió un error al comunicarse con el servidor.</div>',
    );
  }
}
