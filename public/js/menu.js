$(document).ready(function () {
  // Consultar saldo real a tu API Node.js/MySQL
  async function cargarSaldoReal() {
    try {
      const respuesta = await fetch("/api/saldo");

      if (respuesta.ok) {
        const data = await respuesta.json();
        const saldoNumerico = Number(data.current_balance);
        $("#balance").text(
          data.currency_symbol + saldoNumerico.toLocaleString("es-CL"),
        );
      } else {
        $("#balance").text("Error al cargar");
      }
    } catch (error) {
      console.error("Fallo la comunicación con el servidor", error);
      $("#balance").text("$---");
    }
  }

  // Ejecutar al cargar la página
  cargarSaldoReal();
});
