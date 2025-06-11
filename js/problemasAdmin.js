
document.addEventListener("DOMContentLoaded", () => {


    obtenerProblemas();

    const tabla = document.getElementById("tablaProblemas");

    tabla.addEventListener("click", function(e) {
      let fila = e.target.closest("tr");
      if (fila && fila.parentNode.tagName === "TBODY") {  // Asegura que sea una fila del tbody
        let celdas = fila.getElementsByTagName("td");

        // Recuperar el id de la incidencia
        const problemaID = fila.getAttribute('data-id');
        const motivo = fila.getAttribute('data-motivo');
        console.log("ID del problema seleccionado:", problemaID);

        // Guardarlo en un input oculto para usarlo al guardar después
        document.getElementById("idProblemaSeleccionado").value = problemaID;

        // Asignar los valores al modal
        document.getElementById("modalEstado").value = celdas[1].textContent;
        const correoTecnico = celdas[5].textContent.trim();
        const selectTecnico = document.getElementById("modalTecnico");

        const opcion = [...selectTecnico.options].find(opt => opt.text === correoTecnico);
        if (opcion) {
        selectTecnico.value = opcion.value;
        }

        document.getElementById("modalMotivo").value = motivo;
        document.getElementById("verificarResuelto").value = celdas[1].textContent;
        document.getElementById("modalEstado").value = celdas[3].textContent;

        const solucion = fila.getAttribute('data-solucion');

        if(solucion == "null")
        {
            document.getElementById("modalSolucion").value = "";
        }
        else{
            document.getElementById("modalSolucion").value = solucion;
        }




        setTimeout(() => {
            const estado = document.getElementById("verificarResuelto").value;
            const selectEstado = document.getElementById("modalEstado");

            console.log("Estado actual del modal:", estado);

            if (estado === "En Investigacion") {
                console.log("Deshabilitando campos porque ya está en investigacion");
                document.getElementById("modalEstado").disabled = true;

                document.getElementById("btnGuardarCambiosModal").disabled = true;
                document.getElementById("modalTecnico").disabled = true;


            } else {
                // En caso de que no esté aceptada, asegúrate de que los campos estén habilitados
                console.log("Deshabilitando campos porque ya está aceptada");
                document.getElementById("modalEstado").disabled = false;
                document.getElementById("btnGuardarCambiosModal").disabled = false;
                document.getElementById("modalTecnico").disabled = false;

            }
            }, 50);

        // Mostrar el modal
        let modal = new bootstrap.Modal(document.getElementById('modalDetalles'));
        modal.show();
      }
    });

    fetch("php/api.php?action=obtenerTecnicos")
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                console.log("tecnicos obtenids: ", data.tecnicos)
                const selectTecnico = document.getElementById("modalTecnico");
                // Agrega cada fila
                data.tecnicos.forEach(tecnico => {

                    let id = tecnico.id;
                    let correo  = tecnico.correo;
                    let rol = tecnico.rol_id;

                    if(rol==8)
                    {   console.log("entro al if");
                        const opt = document.createElement("option");
                        opt.value = id;
                        opt.text = correo;
                        selectTecnico.appendChild(opt);
                    }

                });
            } else {
                console.log(data.message);
            }
        })
        .catch(err => {
            console.error("Error al obtener tecnicos:", err);
        });

});//fin domContent


function obtenerProblemas() {
    const usuario = JSON.parse(localStorage.getItem("usuario"));

    const usuario_id = usuario.id;
    const tipo_usuario = usuario.rol;
    console.log("Tipo usuario osea tipo_usuario: ", tipo_usuario);

    fetch("php/api.php?action=obtenerProblemas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ usuario_id, tipo_usuario })
    })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                console.log("problemas obtenidas: ", data.problemas)
                mostrarProblemas(data.problemas);
            } else {
                mostrarMensaje(data.message, "danger");
            }
        })
        .catch(err => {
            console.error("Error al obtener problemas:", err);
        });
}


function mostrarProblemas(problemas) {
    const tbody = document.getElementById('listaProblemas');
    tbody.innerHTML = '';

    problemas.forEach(pro => {
        const tr = document.createElement('tr');
        tr.setAttribute('data-id', pro.id);
        tr.setAttribute('data-motivo', pro.motivoProblema);
        tr.setAttribute('data-solucion', pro.solucionProblema);  // guarda el id del problema en el tr


        /*var equipo = "";
        if (inc.equipo_id.startsWith("L"))
            equipo = "Laptop #";
        else
            equipo = "Monitor #";
        equipo += inc.equipo_id.substring(1);*/
        const nombreLap = "#" + pro.id_equipo + " " + pro.modelo;
        const problema = "#" + pro.id;
        const incidencia = "(ID) - "+ pro.incidencia_id;


        tr.innerHTML = `
        <td>${problema}</td>
        <td>${incidencia}</td>
        <td>${nombreLap}</td>
        <td>${pro.estado}</td>
        <td>${pro.fecha_inicioProblema}</td>
        <td>${pro.fecha_solucionProblema ? pro.fecha_solucionProblema : 'Sin Solucionar'}</td>
        <td>${pro.usuario_creador}</td>
        <td>${pro.tecnico_problemas || 'No asignado'}</td>
    `;

        tbody.appendChild(tr);
    });
}

function asignarProblema()
{
    let modal = bootstrap.Modal.getInstance(document.getElementById('modalDetalles'));

    const estado = document.getElementById("modalEstado").value;
    const tecnico = document.getElementById("modalTecnico").value;
    const id = document.getElementById("idProblemaSeleccionado").value;
    const form = document.getElementById("formModalDetalles");

    console.log("estado enviado a problemas josue: ", estado);

    if(estado ==="Pendiente" || !tecnico )
    {
        mostrarMensajeModal("Por favor llena todos los campos.", 'warning');
        return;
    }

    fetch("php/api.php?action=aceptarProblema", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            estado,
            tecnico,
            id
        })
    })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                mostrarMensaje(data.message, "success");
                form.reset();
                modal.hide();
                obtenerProblemas();
            } else {
                console.error("Error al guardar problema:", data.message);
            }
        })
        .catch(err => {
            console.error("Error al guardar incidencias:", err);
        });

}

/**********Mostrar mensaje personalizado de exito o error*******/
function mostrarMensaje(mensaje, tipo) {
    const mensajeDiv = document.getElementById('mensaje');
    mensajeDiv.innerHTML = `<div class="alert alert-${tipo}">${mensaje}</div>`;

    // Limpiar el mensaje después de 5 segundos
    setTimeout(() => {
        mensajeDiv.innerHTML = '';
    }, 5000);
} 

function mostrarMensajeModal(mensaje, tipo) {
    const mensajeDiv = document.getElementById('mensaje2');
    mensajeDiv.innerHTML = `<div class="alert alert-${tipo}">${mensaje}</div>`;

    // Limpiar el mensaje después de 5 segundos
    setTimeout(() => {
        mensajeDiv.innerHTML = '';
    }, 5000);
} 