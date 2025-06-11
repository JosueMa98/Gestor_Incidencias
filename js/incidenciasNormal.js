
document.addEventListener("DOMContentLoaded", () => {

    const usuario = JSON.parse(localStorage.getItem("usuario"));
    console.log("datos de usuario: ", usuario);
    // Cargar equipos
    /*fetch("php/api.php?action=solicitarLaptopUsuario")
        .then(res => res.json())
        .then(data => {
            switch(usuario.rol)
            {
                case 5:
                    const laptopsFiltradas = data.filter(laptop => laptop.area === "Coordinación de Cobranza STAF");
                    console.log("laptop filtradas: ",laptopsFiltradas);

                    const equipoSelect = document.getElementById("listaEquipos");
                    // Agrega cada fila
                    laptopsFiltradas.forEach(laptop => {

                        let id = laptop.id;
                        let tipo = laptop.modelo;

                        let lapConId = "# " + id +" " + tipo;
                        
                        const opt = document.createElement("option");
                        opt.value = id;
                        opt.text = lapConId;
                        equipoSelect.appendChild(opt);
  
                    });
                break;

                case 2:
                    const laptopsOperaciones = data.filter(laptop => laptop.area === "Operaciones");
                    console.log(laptopsOperaciones);
                    const equipoSelectOperaciones = document.getElementById("listaEquipos");


                    // Agrega cada fila
                    laptopsOperaciones.forEach(laptop => {

                        let id = laptop.id;
                        let tipo = laptop.modelo;
                        let lapConId = "# " + id +" " + tipo;
                        
                        const opt = document.createElement("option");
                        opt.value = id;
                        opt.text = lapConId;
                        equipoSelectOperaciones.appendChild(opt);

                    });
                break;

                

                default:
                    console.log("No hay nada para mostrar");
                break;
            } // fin switch
            

            
            
        })
        .catch(error => console.error("Error en fetch:", error));*/

        obtenerIncidencias();

/******************************************************************************************************/

    const tabla = document.getElementById("tablaIncidencias");

    tabla.addEventListener("click", function(e) {
    let fila = e.target.closest("tr");
    if (fila && fila.parentNode.tagName === "TBODY") {  // Asegura que sea una fila del tbody
        let celdas = fila.getElementsByTagName("td");

        // Recuperar el id de la incidencia
        const incidenciaId = fila.getAttribute('data-id');
        const tecnicoId = fila.getAttribute('data-id-tecnico');
        const calificacion = fila.getAttribute('data-calificacion');
        const diagnostico = fila.getAttribute('data-diagnostico');
        const equipoID = fila.getAttribute('data-equipo');

        console.log("ID de la incidencia seleccionada:", incidenciaId);
        console.log("ID del tecnico asignado:", tecnicoId);
        console.log("calificacion del tecnico:", calificacion);

        // Guardarlo en un input oculto para usarlo al guardar después
        document.getElementById("idIncidenciaSeleccionada").value = incidenciaId;
        document.getElementById("idTecnicoAsignado").value = tecnicoId;
        document.getElementById("equipoAsignadoModal").value = equipoID;

        // Asignar los valores al modal
        document.getElementById("modalTitulo").value = celdas[0].textContent;
        document.getElementById("modalEquipo").value = celdas[1].textContent;
        document.getElementById("modalEstado").value = celdas[3].textContent;
        document.getElementById("modalFechaCreacion").value = celdas[4].textContent;
        document.getElementById("modalFechaResolucion").value = celdas[5].textContent;
        document.getElementById("modalCalificacion").value = calificacion;

        if(diagnostico == "null")
        {
            document.getElementById("modalDiagnostico").value = "";
        }
        else
        {
            document.getElementById("modalDiagnostico").value = diagnostico;

        }
        
        
        document.getElementById("verificarResuelto").value = celdas[3].textContent;
        // Mostrar el modal
        let modal = new bootstrap.Modal(document.getElementById('modalDetalles'));
        modal.show();

        // Espera un momento antes de revisar el valor
        setTimeout(() => {
        const estado = document.getElementById("verificarResuelto").value;
        console.log("Estado actual del modal:", estado);

        if (estado === "Resuelta") {
            console.log("Deshabilitando campos porque ya está aceptada");
            document.getElementById("modalEstado").disabled = false;
            document.getElementById("modalCalificacion").disabled = false;
            document.getElementById("btnGuardarCambiosModal").disabled = false;
        } else {
            // En caso de que no esté aceptada, asegúrate de que los campos estén habilitados
            document.getElementById("modalEstado").disabled = true;
            document.getElementById("modalCalificacion").disabled = true;
            document.getElementById("btnGuardarCambiosModal").disabled = true;
        }
        }, 50);

    }
    });
        

});//fin del dom





function obtenerIncidencias() {
    const usuario = JSON.parse(localStorage.getItem("usuario"));

    const usuario_id = usuario.id;
    const tipo_usuario = usuario.rol;
    console.log("Tipo usuario osea tipo_usuario: ", tipo_usuario);

    fetch("php/api.php?action=obtenerIncidencias", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ usuario_id, tipo_usuario })
    })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                console.log("incidencias obtenidas: ", data.incidencias)
                mostrarIncidencias(data.incidencias);
            } else {
                mostrarMensaje(data.message, "danger");
            }
        })
        .catch(err => {
            console.error("Error al obtener incidencias:", err);
        });
}


function mostrarIncidencias(incidencias) {
    const tbody = document.getElementById('listaIncidencias');
    tbody.innerHTML = '';

    incidencias.forEach(inc => {
        const tr = document.createElement('tr');
        tr.setAttribute('data-id', inc.id);
        tr.setAttribute('data-id-tecnico', inc.tecnico_asignado); // <-- Esto falta
        tr.setAttribute('data-calificacion', inc.calificacion);
        tr.setAttribute('data-diagnostico', inc.diagnostico);
        tr.setAttribute('data-equipo', inc.equipo_id); // guarda el id de la incidencia en el tr


 

        /*var equipo = "";
        if (inc.equipo_id.startsWith("L"))
            equipo = "Laptop #";
        else
            equipo = "Monitor #";
        equipo += inc.equipo_id.substring(1);*/
        const nombreLap = "#" + inc.equipo_id + " " + inc.modelo;
        const titulo = "#" + inc.id + " - " + inc.titulo;

        tr.innerHTML = `
        <td>${titulo}</td>
        <td>${nombreLap}</td>
        <td>${inc.prioridad || 'No asignada'}</td>
        <td>${inc.estado}</td>
        <td>${inc.fecha_creacion}</td>
        <td>${inc.fecha_resolucion ? inc.fecha_resolucion : 'Sin resolver'}</td>
        <td>
            <button class="btn btn-success btn-sm"
                    onclick="abrirOrdenTrabajo(${inc.id})">
                Ver Orden
            </button>
        </td>
    `;

        tbody.appendChild(tr);
    });
}


function abrirOrdenTrabajo(incidenciaId) {
    const url = `ordenT_usuarios.html?incidencia_id=${incidenciaId}`;
    window.open(url, '_blank');
}

function cerrarIncidencia()
{
    const estado = document.getElementById("modalEstado").value;
    const incidencia_id =  document.getElementById("idIncidenciaSeleccionada").value
    let modal = bootstrap.Modal.getInstance(document.getElementById('modalDetalles'));
    const form =  document.getElementById("formModalDetalles");
    const calificacion = document.getElementById("modalCalificacion").value;
    const usuario = JSON.parse(localStorage.getItem("usuario"));
    const usuario_id = usuario.id;
    const tecnico_id= document.getElementById("idTecnicoAsignado").value;
    const equipo_id = document.getElementById("equipoAsignadoModal").value;
    

    if(!estado || !calificacion)
    {
        mostrarMensajeEn("mensaje2","No puedes cerrar si no haz llenado todos los campos", "danger");
        return;
    }

    fetch("php/api.php?action=cerrarIncidencia", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ estado, incidencia_id, calificacion, usuario_id, tecnico_id, equipo_id })
    })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                form.reset();
                modal.hide();
                obtenerIncidencias();
                mostrarMensajeEn("mensajeAcep-Rechazar","Incidencia actualizada con exito", "success");

            } else {
                console.log("mensjae error",data.message);
            }
        })
        .catch(err => {
            console.error("Error al cerrar la incidencia:", err);
        });
}

/**********Mostrar mensaje personalizado de exito o error*******/

