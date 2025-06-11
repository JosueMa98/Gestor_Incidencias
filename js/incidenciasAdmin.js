
let modalProblemas;
document.addEventListener("DOMContentLoaded", () => {
    modalProblemas = new bootstrap.Modal(document.getElementById('modalProblemas'));
    obtenerIncidencias();

    const tabla = document.getElementById("tablaIncidencias");

    tabla.addEventListener("click", function(e) {
      let fila = e.target.closest("tr");
      if (fila && fila.parentNode.tagName === "TBODY") {  // Asegura que sea una fila del tbody
        let celdas = fila.getElementsByTagName("td");

        // Recuperar el id de la incidencia
        const incidenciaId = fila.getAttribute('data-id');
        const equipoID = fila.getAttribute('data-id-equipo');
        const diagnostico = fila.getAttribute('data-diagnostico');
        console.log("ID de la incidencia seleccionada:", incidenciaId);
        console.log("ID equipo de la incidencia seleccionada:", equipoID);

        // Guardarlo en un input oculto para usarlo al guardar después
        document.getElementById("idIncidenciaSeleccionada").value = incidenciaId;
        document.getElementById("equipoSeleccionado").value = equipoID;

        // Asignar los valores al modal
        document.getElementById("modalTitulo").value = celdas[0].textContent;
        document.getElementById("modalEquipo").value = celdas[2].textContent;
        document.getElementById("modalPrioridad").value = celdas[3].textContent;
        document.getElementById("modalEstado").value = celdas[4].textContent;
        document.getElementById("modalFechaCreacion").value = celdas[5].textContent;
        document.getElementById("modalFechaResolucion").value = celdas[6].textContent;
        if(diagnostico == "null")
        {
            document.getElementById("modalDiagnostico").value = "";
        }
        else
        {
            document.getElementById("modalDiagnostico").value = diagnostico;

        }

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
                const selectTecnicoProblemas = document.getElementById("modalTecnicoProblema");
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
                        selectTecnicoProblemas.appendChild(opt);
                    }

                    else
                    {
                        
                        const opt = document.createElement("option");
                        opt.value = id;
                        opt.text = correo;
                        selectTecnico.appendChild(opt);
                    }

                    


                });
            } else {
                mostrarMensaje(data.message, "danger");
            }
        })
        .catch(err => {
            console.error("Error al obtener tecnicos:", err);
            mostrarMensaje("Error en la conexión.", "danger");
        });

});//fin domContent

let todasLasIncidencias = []; // Guardar datos originales

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
                todasLasIncidencias = data.incidencias;
                //renderizarTabla(todasLasIncidencias);

            } else {
                mostrarMensaje(data.message, "danger");
            }
        })
        .catch(err => {
            console.error("Error al obtener incidencias:", err);
            mostrarMensaje("Error en la conexión.", "danger");
        });
}

document.getElementById("filtroEstado").addEventListener("change", function () {
  const estadoSeleccionado = this.value;
  const filtradas = estadoSeleccionado === "Todos"
    ? todasLasIncidencias
    : todasLasIncidencias.filter(inc => inc.estado === estadoSeleccionado);
  
  mostrarIncidencias(filtradas); // 

});




function mostrarIncidencias(incidencias) {
    const tbody = document.getElementById('listaIncidencias');
    tbody.innerHTML = '';

    incidencias.forEach(inc => {
        const tr = document.createElement('tr');
        tr.setAttribute('data-id', inc.id);
        tr.setAttribute('data-id-equipo', inc.equipo_id);
        tr.setAttribute('data-diagnostico', inc.diagnostico); // guarda el id de la incidencia en el tr



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
        <td>${inc.descripcion}</td>
        <td>${nombreLap}</td>
        <td>${inc.prioridad || 'No asignada'}</td>
        <td>${inc.estado}</td>
        <td>${inc.fecha_creacion}</td>
        <td>${inc.fecha_resolucion ? inc.fecha_resolucion : 'Sin resolver'}</td>
        <td>${inc.area}</td>
        <td>${inc.correoTecnico || "No Asignado"}</td>
        <td>${inc.Fecha_de_asignacion|| "No Asignada"}</td>
        <td>   
            <button type="button" class="btn btn-warning btn-sm btn-abrir-problemas"
                data-id="${inc.id}">
                Escalar
            </button>
        </td>

        <td>   
            <button type="button" class="btn btn-success btn-sm btn-fin-inc"
                data-id="${inc.id}">
                Finalizar
            </button>
        </td>
        
    `;

        tr.querySelector(".btn-abrir-problemas").addEventListener("click", function (event) {
            event.stopPropagation(); // Detiene la propagación para que no se abra el modal de detalles
    
            abrirProblemas(inc.id, inc.equipo_id);
        });

        tr.querySelector(".btn-fin-inc").addEventListener("click", function (event) {
            event.stopPropagation(); // Detiene la propagación para que no se abra el modal de detalles
    
            marcarFinalizada(inc.id, inc.equipo_id);
        });

        tbody.appendChild(tr);
    });
}

function marcarFinalizada(idIncidencia, idEquipo)
{
  console.log("id equipo para dar fin: ", idEquipo);
  console.log("id incidencia para dar fin: ", idIncidencia);

    Swal.fire({
    title: "¿Finalizar incidencia?",
    text: "Esta acción no se puede deshacer",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Sí, finalizar",
    cancelButtonText: "Cancelar",
    confirmButtonColor: "#28a745", // Verde
    cancelButtonColor: "#d33"
  }).then((result) => {
    if (result.isConfirmed) {
      // Si el usuario confirma
      fetch("php/api.php?action=finalizarIncAdmin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: idIncidencia, equipo_id: idEquipo })
      })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          Swal.fire("¡Finalizada!", "La incidencia ha sido finalizada.", "success");
          obtenerIncidencias(); // o la función que recargue la lista
        } else {
          Swal.fire("Error", data.message || "No se pudo finalizar", "error");
        }
      })
      .catch(err => {
        console.error(err);
        Swal.fire("Error", "Ocurrió un error al finalizar", "error");
      });
    }
  });
}



function abrirProblemas(id, idEquipo) {
    modalProblemas.show();
    const id_incidencia = id;
    const equipo_id= idEquipo;
    document.getElementById("modalMotivoProblema").value="";
    console.log("incidencia al abrir modal", id_incidencia);

    btnGuardarProblemaModal.onclick = function () {
        guardarProblema(id_incidencia, equipo_id);
    };
}

function guardarProblema(incidencia, equipo)
{
    const tecnicoProblemas = document.getElementById("modalTecnicoProblema").value;
    const motivoProblema = document.getElementById("modalMotivoProblema").value;
    const id_incidencia = incidencia;//document.getElementById("idIncidenciaSeleccionada").value;
    const id_equipo = equipo;//document.getElementById("equipoSeleccionado").value;
    const user = JSON.parse(localStorage.getItem("usuario"));
    const usuario= user.id;
    const rol = user.rol;

    if(!tecnicoProblemas || !motivoProblema )
    {
        mostrarMensajeEn('mensajeModalProblemasAdmin', 'Por favor ingrese el motivo.', 'danger');
        return;
    }

    console.log("incidencia para mandar a problemas: ", id_incidencia);
    console.log("ID equipo enviado:", id_equipo);

    fetch("php/api.php?action=iniciarProblema", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ motivoProblema, id_incidencia, id_equipo, usuario, rol, tecnicoProblemas })
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                modalProblemas.hide();
                mostrarMensajeEn("mensaje12","Problema registrado exitosamente", "success");
                obtenerIncidencias();

            } else {
                mostrarMensajeEn("mensajeModalProblemasAdmin",data.message, "danger");
                console.log("mensjae error",data.message);
            }
        })
        .catch(err => {
            console.error("Error al solicitar el problema:", err);
        });
}






function asignarIncidencia()
{
    let modal = bootstrap.Modal.getInstance(document.getElementById('modalDetalles'));

    const prioridad = document.getElementById("modalPrioridad").value;
    const estado = document.getElementById("modalEstado").value;
    const tecnico = document.getElementById("modalTecnico").value;
    const id = document.getElementById("idIncidenciaSeleccionada").value;
    const form = document.getElementById("formModalDetalles");

    if(!prioridad || !estado || !tecnico )
    {
        mostrarMensajeEn("mensaje123","Por favor llena todos los campos.", 'warning');
        return;
    }

    fetch("php/api.php?action=aceptarIncidencia", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            prioridad,
            estado,
            tecnico,
            id
        })
    })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                mostrarMensajeEn("mensaje12",data.message, "success");
                form.reset();
                modal.hide();
                obtenerIncidencias();
            } else {
                console.error("Error al guardar incidencias:", data.message);
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