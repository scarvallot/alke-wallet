$(document).ready(function () {
  // Mostrar saldo actual desde localStorage
  // var saldo = parseInt(localStorage.getItem("walletBalance")) || 0;
  // $("#balance").text("$" + saldo.toLocaleString("es-CL"));

  // Consultar saldo real a la base de datos MySQL
  async function cargarSaldoReal() {
    try {
      const respuesta = await fetch("/api/saldo");

      if (respuesta.ok) {
        const data = await respuesta.json();
        // Transformar el decimal de la BD a número para formatearlo
        const saldoNumerico = Number(data.current_balance);

        // Renderizar con el símbolo de la moneda correspondiente
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

  // Ejecutar la función al cargar la página
  cargarSaldoReal();
  // Función para mostrar alerta de redirección
  function redirigir(mensaje, url) {
    $("#alertContainer").html(
      '<div class="alert alert-success">Redirigiendo a ' +
        mensaje +
        "...</div>",
    );
    setTimeout(function () {
      window.location.href = url;
    }, 1500);
  }

  // --- Eventos de los botones de navegación (Rutas de Express) ---
  $("#depositBtn").click(function () {
    redirigir("Depósito", "/deposit");
  });

  $("#sendMoneyBtn").click(function () {
    redirigir("Envío de Dinero", "/sendmoney");
  });

  $("#transactionBtn").click(function () {
    redirigir("Últimos Movimientos", "/transaction");
  });

  $("#btnCerrarSesion").click(function () {
    window.location.href = "/logout"; // Destruye la sesión en el backend
  });
});
