// Lista ficticia de transacciones para demostración
var listaTransacciones = [
  {
    tipo: "deposito",
    descripcion: "Depósito sueldo mensual",
    monto: 850000,
    fecha: "01/06/2026",
  },
  {
    tipo: "compra",
    descripcion: "Supermercado Jumbo",
    monto: 47350,
    fecha: "03/06/2026",
  },
  {
    tipo: "suscripcion",
    descripcion: "Suscripción Netflix",
    monto: 8990,
    fecha: "05/06/2026",
  },
  {
    tipo: "transferencia_enviada",
    descripcion: "Transferencia a Carolina",
    monto: 120000,
    fecha: "06/06/2026",
  },
  {
    tipo: "compra",
    descripcion: "Recarga tarjeta Bip!",
    monto: 15000,
    fecha: "07/06/2026",
  },
  {
    tipo: "deposito",
    descripcion: "Pago proyecto freelance",
    monto: 230000,
    fecha: "08/06/2026",
  },
];

// Función para mostrar movimientos según filtro
function mostrarUltimosMovimientos(filtro) {
  var lista =
    filtro === "todos"
      ? listaTransacciones
      : listaTransacciones.filter(function (t) {
          return t.tipo === filtro;
        });

  if (lista.length === 0) {
    $("#transactionList").html(
      '<p class="text-center text-muted py-3">No hay movimientos de este tipo.</p>',
    );
    return;
  }

  var html = "";
  $.each(lista, function (i, t) {
    var esIngreso =
      t.tipo === "deposito" || t.tipo === "transferencia_recibida";
    var color = esIngreso ? "text-success" : "text-danger";
    var signo = esIngreso ? "+" : "-";
    var tipoTexto = getTipoTransaccion(t.tipo);

    html +=
      '<div class="card border-0 shadow-sm mb-2">' +
      '<div class="card-body py-2 px-3">' +
      '<div class="d-flex justify-content-between align-items-center">' +
      "<div>" +
      "<strong>" +
      t.descripcion +
      "</strong><br>" +
      '<small class="text-muted">' +
      t.fecha +
      "</small> " +
      '<span class="badge badge-light border">' +
      tipoTexto +
      "</span>" +
      "</div>" +
      '<span class="font-weight-bold ' +
      color +
      '">' +
      signo +
      "$" +
      t.monto.toLocaleString("es-CL") +
      "</span>" +
      "</div>" +
      "</div>" +
      "</div>";
  });

  $("#transactionList").html(html);
}

// Función para obtener el tipo legible
function getTipoTransaccion(tipo) {
  var tipos = {
    compra: "Compra",
    deposito: "Depósito",
    transferencia_recibida: "Transferencia recibida",
    transferencia_enviada: "Transferencia enviada",
    pago_servicios: "Pago de servicios",
    suscripcion: "Suscripción",
  };
  return tipos[tipo] || tipo;
}

$(document).ready(function () {
  // Mostrar saldo desde localStorage
  var saldo = parseInt(localStorage.getItem("walletBalance")) || 0;
  $("#balance").text("$" + saldo.toLocaleString("es-CL"));

  // Renderizar todos los movimientos al cargar
  mostrarUltimosMovimientos("todos");

  // Filtro por tipo de movimiento
  $("#filtroTipo").on("change", function () {
    mostrarUltimosMovimientos($(this).val());
  });

  // Botones de navegación
  $("#depositBtn").click(function () {
    window.location.href = "../deposit/deposit.html";
  });
  $("#sendMoneyBtn").click(function () {
    window.location.href = "../sendmoney/sendmoney.html";
  });
  $("#menuBtn").click(function () {
    window.location.href = "../menu/menu.html";
  });
  $("#btnCerrarSesion").click(function () {
    window.location.href = "../auth/login/login.html";
  });
});
