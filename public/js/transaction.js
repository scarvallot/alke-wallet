$(document).ready(function () {
  // Filtrado visual sobre las transacciones renderizadas por EJS
  $("#filtroTipo").on("change", function () {
    var filtro = $(this).val();

    if (filtro === "todos") {
      $(".transaction-item").show();
    } else {
      // Requiere que tu vista EJS imprima la clase .transaction-item
      // y un atributo de datos, ejemplo: data-tipo="<%= transaccion.tipo %>"
      $(".transaction-item").each(function () {
        if ($(this).data("tipo") === filtro) {
          $(this).show();
        } else {
          $(this).hide();
        }
      });
    }
  });
});
