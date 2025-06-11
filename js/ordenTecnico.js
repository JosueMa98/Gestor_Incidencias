
  document.addEventListener("DOMContentLoaded", () => {

    const params = new URLSearchParams(window.location.search);
    const incidenciaId = params.get("incidencia_id");

    if (!incidenciaId) {
        alert("No se especificó el ID de la incidencia.");
        return;
    }
    document.getElementById("idIncidenciaSeleccionada").value=incidenciaId;

    console.log("ID de incidencia:", incidenciaId);

    const serviciosSelect = document.getElementById("servicios");

    fetch("php/api.php?action=obtenerCatalogo")
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          data.servicios.forEach(servicio => {
            const option = document.createElement("option");
            option.value = servicio.id;
            option.textContent = `${servicio.nombre_servicio} (${servicio.tiempo_estimado} min)`;
            option.dataset.tiempo = servicio.tiempo_estimado;
            serviciosSelect.appendChild(option);
          });
        } else {
          alert("No se pudo cargar el catálogo de servicios.");
        }
      })
      .catch(err => {
        console.error("Error al obtener servicios:", err);
      });
  });

    function solicitarCambio() {
      const pieza = document.getElementById("pieza").value.trim();
      const motivo = document.getElementById("motivoCambio").value.trim();

      if (!pieza || !motivo) {
        alert("Por favor, llena la pieza y el motivo del cambio.");
        return;
      }



    }

    document.addEventListener("DOMContentLoaded", () => {
        const serviciosSelect = document.getElementById("servicios");
        const tiempoTotalInput = document.getElementById("tiempoTotal");

        serviciosSelect.addEventListener("change", () => {
            const selectedOptions = [...serviciosSelect.selectedOptions];
            let total = 0;

            selectedOptions.forEach(option => {
            const tiempo = parseInt(option.dataset.tiempo, 10) || 0;
            total += tiempo;
            });

            tiempoTotalInput.value = total;
        });

        // Suponiendo que ya cargaste el catálogo con option.dataset.tiempo en cada opción
    });

function guardarOrdenTrabajo() {

  const diagnostico = document.getElementById("diagnostico").value.trim();
  const solucion = document.getElementById("solucion").value.trim();
  const tiempoTotal = document.getElementById("tiempoTotal").value.trim();
  const servicios = [...document.getElementById("servicios").selectedOptions].map(opt => opt.value);
  const incidencia= document.getElementById("idIncidenciaSeleccionada").value;
  const user = JSON.parse(localStorage.getItem("usuario"));
  const tecnico_id = user.id;


  if (!diagnostico || !solucion || servicios.length === 0) {
    alert("Completa todos los campos obligatorios.");
    return;
  }

  const payload = {
    incidencia_id: incidencia,
    tecnico: tecnico_id,
    diagnostico,
    solucion,
    tiempo_total: tiempoTotal,
    servicios
  };

  fetch("php/api.php?action=guardarOrdenTrabajo", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        alert("Orden guardada correctamente.");
        window.close(); // Cierra la ventana
      } else {
        alert("Error: " + data.message);
      }
    })
    .catch(err => {
      console.error("Error:", err);
      alert("Ocurrió un error al guardar.");
    });
}


document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const incidenciaId = params.get("incidencia_id");
  if (incidenciaId) {
    cargarOrden(incidenciaId);
    // Deshabilitar campos si ya existe una orden
    deshabilitarCamposOrden();

  }
});

function cargarOrden(incidenciaId) {
    console.log("Consultando orden para incidencia ID:", incidenciaId);

  fetch("php/api.php?action=obtenerOrdenTrabajo", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ incidencia_id: incidenciaId })
  })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        const orden = data.orden;

        document.getElementById("diagnostico").value = orden.diagnostico;
        document.getElementById("solucion").value = orden.solucion;
        document.getElementById("tiempoTotal").value = orden.tiempo_total + " min";

        const listaServicios = document.getElementById("servicios");
        listaServicios.innerHTML = "";
        data.servicios.forEach(s => {
          const option = document.createElement("option");
          option.textContent = `${s.nombre_servicio} (${s.tiempo_estimado} min)`;
          option.selected = true;
          listaServicios.appendChild(option);
        });

        // Si tienes una sección visual para los cambios:
       /* const contenedorCambios = document.getElementById("listaCambios");
        if (contenedorCambios && data.cambios.length > 0) {
          data.cambios.forEach(c => {
            const div = document.createElement("div");
            div.className = "alert alert-warning";
            div.innerHTML = `<strong>${c.pieza}</strong>: ${c.motivo} <br> Estado: <b>${c.estado}</b>`;
            contenedorCambios.appendChild(div);
          });
        }*/

      } else {
        alert(data.message);
      }
    })
    .catch(err => {
      console.error("Error:", err);
    });
}


function deshabilitarCamposOrden() {
  document.getElementById("diagnostico").readOnly = true;
  document.getElementById("solucion").readOnly = true;
  document.getElementById("servicios").disabled = true;
  document.getElementById("tiempoTotal").readOnly = true;





  const btnGuardar = document.querySelector(".btn-success");
  if (btnGuardar) btnGuardar.disabled = true;
}
