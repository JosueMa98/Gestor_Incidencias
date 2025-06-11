let todasLosCambios = []; // Guardar datos originales


function obtenerCambios() {
    const usuario = JSON.parse(localStorage.getItem("usuario"));

    const usuario_id = usuario.id;
    const tipo_usuario = usuario.rol;
    console.log("Tipo usuario osea tipo_usuario: ", tipo_usuario);

    fetch("php/api.php?action=obtenerCambios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ usuario_id, tipo_usuario })
    })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                console.log("cambios obtenidos: ", data.cambios)
                mostrarCambios(data.cambios);
                todasLosCambios = data.cambios;

            } else {
                console.log("mensjae error",data.message);
            }
        })
        .catch(err => {
            console.error("Error al obtener cambios:", err);
        });
}

document.getElementById("filtroEstado").addEventListener("change", function () {
  const estadoSeleccionado = this.value;
  const filtradas = estadoSeleccionado === "Todos"
    ? todasLosCambios
    : todasLosCambios.filter(cam => cam.estado === estadoSeleccionado);
  
  mostrarCambios(filtradas); // 

});

function mostrarCambios(cambios) {
    const tbody = document.getElementById('listaSolicitudesCambio');
    tbody.innerHTML = '';

    cambios.forEach(cam => {
        const tr = document.createElement('tr');
        tr.setAttribute('data-id', cam.rfc); // guarda el id de la incidencia en el tr
        tr.setAttribute('data-equipo-id', cam.id_equipo);

        let equipo = "# " + cam.id_equipo +" "+ cam.modelo;
        tr.setAttribute('data-equipo', equipo );
        tr.setAttribute('data-motivo', cam.motivo );
        tr.setAttribute('data-diagnostico', cam.diagnostico );
        tr.setAttribute('data-ubicacion', cam.ubicacion );
        tr.setAttribute('data-area', cam.area );
        tr.setAttribute('data-rfc', cam.rfc );
       
        /*var equipo = "";
        if (inc.equipo_id.startsWith("L"))
            equipo = "Laptop #";
        else
            equipo = "Monitor #";
        equipo += inc.equipo_id.substring(1);*/
        const titulo = "#" + cam.incidencia_id + " - " + cam.titulo;
        const rfc = "RFC-" + String(cam.rfc).padStart(3, "0");

        tr.innerHTML = `
        <td>${rfc}</td>
        <td>${titulo}</td>
        <td>${cam.tecnico}</td>
        <td>${cam.pieza}</td>
        <td>${cam.estado}</td>
        <td>${cam.fecha_solicitud}</td>
    `;

        tbody.appendChild(tr);
    });
}

let modalDetalles;


document.addEventListener("DOMContentLoaded", () => {
    obtenerCambios();
    modalDetalles = new bootstrap.Modal(document.getElementById('modalDetalles'));


});


const tabla = document.getElementById("tablaSolicitudesCambio");

tabla.addEventListener("click", function(e) {
    let fila = e.target.closest("tr");
    if (fila && fila.parentNode.tagName === "TBODY") {
        let celdas = fila.getElementsByTagName("td");
        modalDetalles.show();

                  // Asignar los valores al modal
        document.getElementById("modalTitulo").value = celdas[0].textContent;
        document.getElementById("modalPieza").value = celdas[3].textContent;
        document.getElementById("modalEstado").value = celdas[4].textContent;
        document.getElementById("modalFechaSolicitud").value = celdas[5].textContent;
        document.getElementById("modalEquipo").value = fila.getAttribute("data-equipo");
        document.getElementById("modalMotivo").value = fila.getAttribute("data-motivo");
        document.getElementById("modalDiagnostico").value = fila.getAttribute("data-diagnostico");
        document.getElementById("modalUbicación").value = fila.getAttribute("data-ubicacion");
        document.getElementById("modalArea").value = fila.getAttribute("data-area");

        let rfcSeleccionado = fila.getAttribute("data-rfc");

        document.getElementById("idCambioSeleccionado").value = rfcSeleccionado;






        // Aquí puedes hacer algo con las celdas seleccionadas, por ejemplo:
        console.log("Fila clickeada:", fila.dataset.id); // si usas data-id
    }
});

function guardarCambio()
{
    let idCambio = document.getElementById("idCambioSeleccionado").value;
    let estado = document.getElementById("modalEstado").value;

    console.log("Estado del modal:", estado); // Verifica el valor de estado
    console.log("ID Cambio:", idCambio); // Verifica el valor de idCambio

    if (!estado)
    {   
        console.log("⚠ No hay estado seleccionado");
        mostrarMensaje("Para guardar debe aprobar o rechazar el cambio.", "danger");
        return;
    }

    console.log("✅ Se puede guardar el cambio.");

    let form = document.getElementById("formModalDetalles");

    fetch("php/api.php?action=guardarCambio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ estado, idCambio })
    })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                form.reset();
                modalDetalles.hide();
                obtenerCambios();
                mostrarMensaje2("Cambio guardado con exito", "success");

            } else {
                console.log("mensjae error",data.message);
            }
        })
        .catch(err => {
            console.error("Error al finalizar el cambio:", err);
        });
}


function mostrarMensaje(mensaje, tipo) {
    const mensajeDiv = document.getElementById('mensaje');
    mensajeDiv.innerHTML = `<div class="alert alert-${tipo}">${mensaje}</div>`;

    // Limpiar el mensaje después de 5 segundos
    setTimeout(() => {
        mensajeDiv.innerHTML = '';
    }, 5000);
} 
function mostrarMensaje2(mensaje, tipo) {
    const mensajeDiv = document.getElementById('mensajeCambioAdmin');
    mensajeDiv.innerHTML = `<div class="alert alert-${tipo}">${mensaje}</div>`;

    // Limpiar el mensaje después de 5 segundos
    setTimeout(() => {
        mensajeDiv.innerHTML = '';
    }, 5000);
} 
