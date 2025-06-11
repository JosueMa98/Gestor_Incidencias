let modalSolicitudCambio;
let modalDetalles;
let diagnostico;
let modalVerCambios;
let modalProblema; 
let modalVerProblemas;

document.addEventListener("DOMContentLoaded", () => {

    modalSolicitudCambio = new bootstrap.Modal(document.getElementById('modalSolicitudCambio'));
    modalDetalles = new bootstrap.Modal(document.getElementById('modalDetalles'));
    modalVerCambios = new bootstrap.Modal(document.getElementById('modalVerCambios'));
    modalProblema = new bootstrap.Modal(document.getElementById('modalProblema'));
    modalVerProblemas= new bootstrap.Modal(document.getElementById('modalVerProblemas'));
    const user = JSON.parse(localStorage.getItem("usuario"));
    console.log("Rol logeado: ", user.rol);


    document.getElementById("puesto_usuario").textContent = "Tecnico en Sistemas";

    obtenerIncidencias();



    const tabla = document.getElementById("tablaIncidencias");

    tabla.addEventListener("click", function(e) {
        let fila = e.target.closest("tr");
        if (fila && fila.parentNode.tagName === "TBODY") {  // Asegura que sea una fila del tbody
          let celdas = fila.getElementsByTagName("td");
  
          // Recuperar el id de la incidencia
          const incidenciaId = fila.getAttribute('data-id');
          console.log("ID de la incidencia seleccionada:", incidenciaId);

          const diagnosticoAsignado = fila.getAttribute('data-diagnostico');
            document.getElementById("diagnosticoAsignado").value = diagnosticoAsignado;

                              // Limpiar campos antes de asignar
            document.getElementById("motivoProblemaModal").value = "";
            document.getElementById("estadoProblemaModal").value = "";
            

            let motivo = fila.getAttribute("data-motivo");
            let estado = fila.getAttribute("data-estado");

            
            document.getElementById("motivoProblemaModal").value = (motivo && motivo !== "null") ? motivo : "";
            document.getElementById("estadoProblemaModal").value = (estado && estado !== "null") ? estado : "";
            console.log("motivo problema asociado a la incidencia", motivo);


            // Recuperar el id de la laptop seleccionada
            const equipoSeleccionado = fila.getAttribute('data-equipo-id');
            document.getElementById("idEquipoSeleccionado").value = equipoSeleccionado;
            console.log("ID del equipo seleccionado:", equipoSeleccionado);
  
          // Guardarlo en un input oculto para usarlo al guardar después
          document.getElementById("idIncidenciaSeleccionada").value = incidenciaId;

          fetch("php/api.php?action=obtenerLaptopTecnico", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ equipo_id: equipoSeleccionado })
        })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    console.log("Info lap obtenida: ", data.laptop)
                    document.getElementById("modalModelo").value = data.laptop.modelo;
                    document.getElementById("modalTipoMemoria").value = data.laptop.tipo_memoria;
                    document.getElementById("modalCapacidadMemoria").value = data.laptop.capacidad_memoria;
                    document.getElementById("modalProcesador").value = data.laptop.procesador;
                    document.getElementById("modalRAM").value = data.laptop.ram;
                    document.getElementById("modalSistemaOperativo").value = data.laptop.sistema_operativo;
                    document.getElementById("modalTipoFuente").value = data.laptop.tipo_fuente;
                    document.getElementById("modalFechaAdquisicion").value = data.laptop.fecha_adquisicion;
                    document.getElementById("modalGarantia").value = data.laptop.garantia;
                    document.getElementById("modalArea").value = data.laptop.area;
                    document.getElementById("modalSoftware").value = data.laptop.software_instaladas;
                    document.getElementById("modalUbicacion").value = data.laptop.ubicacion;
                    const diagnostico = fila.getAttribute('data-diagnostico');
                    document.getElementById("modalDiagnostico").value = (diagnostico && diagnostico !== "null") ? diagnostico : "";

                } else {
                    console.log("mensjae error",data.message);
                }
            })
            .catch(err => {
                console.error("Error al obtener laptop:", err);
            });

/*******************************************************************************************************/          
  
          // Asignar los valores al modal
          document.getElementById("modalTitulo").value = celdas[0].textContent;
          document.getElementById("modalEquipo").value = celdas[2].textContent;
          document.getElementById("modalPrioridad").value = celdas[3].textContent;
          document.getElementById("modalEstado").value = celdas[5].textContent;
          document.getElementById("modalFechaCreacion").value = celdas[6].textContent;
          document.getElementById("modalFechaResolucion").value = celdas[7].textContent;

          document.getElementById("verificarResuelto").value = celdas[5].textContent;
          let modalEstado = document.getElementById("modalEstado"); 

        setTimeout(() => {
            const estado = document.getElementById("verificarResuelto").value;
            const selectEstado = document.getElementById("modalEstado");

            console.log("Estado actual del modal:", estado);

            if (estado === "Aceptada" || estado === "Resuelta") {
                console.log("Deshabilitando campos porque ya está aceptada");
                document.getElementById("modalEstado").disabled = true;
                const opcionAceptada = document.createElement("option");
                opcionAceptada.text = "Aceptada";
                selectEstado.appendChild(opcionAceptada);
                document.getElementById("modalDiagnostico").disabled = true;
                document.getElementById("btnGuardarCambiosModal").disabled = true;
                document.getElementById("btnSolicitarCambiosModal").disabled = true;
                document.getElementById("btnEscalarAProblema").disabled = true;
                
            } else {
                // En caso de que no esté aceptada, asegúrate de que los campos estén habilitados
                console.log("Deshabilitando campos porque ya está aceptada");
                document.getElementById("modalEstado").disabled = false;
                document.getElementById("modalDiagnostico").disabled = false;
                document.getElementById("btnGuardarCambiosModal").disabled = false;
                document.getElementById("btnSolicitarCambiosModal").disabled = false;
                document.getElementById("btnEscalarAProblema").disabled = false;

            }
            }, 50);

  
          // Mostrar el modal
          modalDetalles.show();
        }
      });

});

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
                console.log("mensjae error",data.message);
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
        tr.setAttribute('data-id', inc.id); // guarda el id de la incidencia en el tr
        tr.setAttribute('data-equipo-id', inc.equipo_id);
        tr.setAttribute('data-diagnostico', inc.diagnostico);
        tr.setAttribute('data-motivo', inc.motivoProblema);
        tr.setAttribute('data-estado', inc.estadoProblema);
        calcularTiempoRestante(inc.Fecha_de_asignacion, inc.prioridad, inc.fecha_resolucion);
       
        //const cambios = [{ pieza: inc.pieza, estado: inc.estadoCambio }];
        const cambiosStr = JSON.stringify(inc.cambios || []).replace(/'/g, "&apos;");
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
        <td>${inc.ubicacion}</td>
        <td>${inc.estado}</td>
        <td>${inc.Fecha_de_asignacion}</td>
        <td>${inc.fecha_resolucion ? inc.fecha_resolucion : 'Sin atender'}</td>
        <td>   
            <button
            type="button"
            class="btn btn-primary btn-sm btn-abrir-cambios"
            data-cambios='${cambiosStr}'>
            Ver Cambios
            </button>
        </td>
        <td>   
            <button type="button" class="btn btn-secondary btn-sm btn-abrir-problemas"
                data-id="${inc.id}"
                data-motivoP="${inc.motivoProblema || ''}"
                data-estadoP="${inc.estadoProblema || ''}">
                Mostrar
            </button>
        </td>

        <td class="contador-tiempo"
            data-fecha="${inc.fecha_creacion}"
            data-prioridad="${inc.prioridad}"
            data-resuelto="${inc.fecha_resolucion || ''}">
        </td>

        <td>
            <button class="btn btn-success btn-sm"
                    onclick="abrirOrdenTrabajo(${inc.id})">
                Ver Orden
            </button>
        </td>

    `;

        tr.querySelector(".btn-abrir-cambios").addEventListener("click", function (event) {
            event.stopPropagation();

            const cambiosStr = this.getAttribute("data-cambios");
            let cambios = [];

            try {
                cambios = JSON.parse(cambiosStr);
            } catch (e) {
                mostrarMensaje2("Error al cargar los cambios.", "danger");
                return;
            }

            abrirCambios(cambios);
        });


        tr.querySelector(".btn-abrir-problemas").addEventListener("click", function (event) {
            event.stopPropagation(); // Detiene la propagación para que no se abra el modal de detalles
        
            const motivoProblema = this.getAttribute("data-motivoP");
            const estadoProblema = this.getAttribute("data-estadoP");

            abrirProblemas(motivoProblema, estadoProblema);
        });

        tbody.appendChild(tr);
    });
}

function abrirOrdenTrabajo(incidenciaId) {
    const url = `orden_trabajo.html?incidencia_id=${incidenciaId}`;
    window.open(url, '_blank');
}

function calcularTiempoRestante(fechaAsignacion, prioridad, fechaResolucion) {
    const tiempos = {
        'Crítica': 1 * 60 * 60 * 1000,
        'Alta': 4 * 60 * 60 * 1000,
        'Media': 24 * 60 * 60 * 1000,
        'Baja': 72 * 60 * 60 * 1000,
    };

    if (!prioridad || !tiempos[prioridad]) return "Sin prioridad válida";

    const inicio = new Date(fechaAsignacion);
    const limite = new Date(inicio.getTime() + tiempos[prioridad]);

    // Si ya se resolvió
    if (fechaResolucion) {
        const solucion = new Date(fechaResolucion);
        const tiempoTranscurrido = solucion - inicio;

        if (tiempoTranscurrido <= tiempos[prioridad]) {
            return "Atendido a tiempo";
        } else {
            return "Atendido fuera de tiempo";
        }
    }

    // Si aún no se resuelve
    const ahora = new Date();
    const diferencia = limite - ahora;

    if (diferencia <= 0) return "Tiempo agotado";

    const horas = Math.floor(diferencia / (1000 * 60 * 60));
    const minutos = Math.floor((diferencia % (1000 * 60 * 60)) / (1000 * 60));
    const segundos = Math.floor((diferencia % (1000 * 60)) / 1000);

    return `${horas}h ${minutos}m ${segundos}s`;
}


function actualizarContadores() {
    document.querySelectorAll('.contador-tiempo').forEach(div => {
        const fecha = div.dataset.fecha;
        const prioridad = div.dataset.prioridad;
        const fechaResolucion = div.dataset.resuelto || null;

        div.textContent = calcularTiempoRestante(fecha, prioridad, fechaResolucion);
    });
}

// Actualiza cada segundo
setInterval(actualizarContadores, 1000);

// Llamada inicial
actualizarContadores();


function finalizarIncidencia()
{
    const estado = document.getElementById("modalEstado").value;
    const incidencia_id =  document.getElementById("idIncidenciaSeleccionada").value;
    const diagnostico =  document.getElementById("modalDiagnostico").value;
    const form =  document.getElementById("formModalDetalles");
    

    if(!diagnostico)
    {
        mostrarMensaje("Por favor llena todos los campos", "danger");
        return;
    }

    fetch("php/api.php?action=finalizarIncidencia", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ estado, incidencia_id, diagnostico })
    })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                form.reset();
                modalDetalles.hide();
                obtenerIncidencias();
                mostrarMensaje2("Incidencia finalizada con exito", "success");

            } else {
                console.log("mensjae error",data.message);
            }
        })
        .catch(err => {
            console.error("Error al finalizar la incidencia:", err);
        });
}

document.getElementById("btnSolicitarCambiosModal").addEventListener("click", function(){

    modalDetalles.hide();
    modalSolicitudCambio.show();

});

function abrirCambios(cambios) {
    const tbody = document.getElementById("tablaCambiosVC");
    tbody.innerHTML = ""; // Limpia antes de insertar
    console.log("cambios recibidos", cambios);

    const sinCambiosValidos =
        !Array.isArray(cambios) ||
        cambios === null ||
        cambios.length === 0 ||
        cambios.every(c => !c.pieza && !c.estado); // aquí está el truco

    if (sinCambiosValidos) {
        console.log("entro al if de ver cambios");
        mostrarMensaje2("No hay cambios solicitados para esta incidencia", "danger");
        return;
    }

    cambios.forEach(c => {
        const fila = document.createElement("tr");

        const tdPieza = document.createElement("td");
        tdPieza.textContent = c.pieza;

        const tdEstado = document.createElement("td");
        tdEstado.textContent = c.estado;

        fila.appendChild(tdPieza);
        fila.appendChild(tdEstado);

        tbody.appendChild(fila);
    });

    modalVerCambios.show();
}


function abrirProblemas(motivoP, estadoP)
{    // Limpia antes
    document.getElementById("motivoProblemaVP").value = "";
    document.getElementById("estadoProblemaVP").value = "";
    console.log("motivo problema: ", motivoP);
    console.log("estado problema: ", estadoP);

    if(!motivoP || !estadoP)
    {
        mostrarMensaje2("No hay problemas registrados para esta incidencia", "danger");
    }
    else{
        modalVerProblemas.show();
        document.getElementById("motivoProblemaVP").value= motivoP;
        document.getElementById("estadoProblemaVP").value= estadoP;

    }

}

function solicitarCambio()
{
    const pieza = document.getElementById("piezaSolicitada").value;
    const motivo = document.getElementById("motivoCambio").value;
    const incidencia_id =  document.getElementById("idIncidenciaSeleccionada").value;
    const user = JSON.parse(localStorage.getItem("usuario"));
    const diagnostico = document.getElementById("diagnosticoAsignado").value;
    const id_equipo = document.getElementById("idEquipoSeleccionado").value;
    const usuario = user.id;

    if(!diagnostico || diagnostico === "null")
    {
        mostrarMensaje3("Para solicitar un cambio primero debe realizar un diagnostico", "danger");
        return;
    }

    const form = document.getElementById("formSolicitudCambio");

    if(!pieza || !motivo)
    {
        mostrarMensaje3("Por favor llena todos los campos", "danger");
        return;
    }

    fetch("php/api.php?action=solicitarCambio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pieza, motivo, incidencia_id, usuario, id_equipo })
    })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                form.reset();
                modalSolicitudCambio.hide();
                obtenerIncidencias();
                mostrarMensaje2("Cambio solicitado con exito", "success");
                console.log("usuario mandado: ", usuario);

            } else {
                console.log("mensjae error",data.message);
            }
        })
        .catch(err => {
            console.error("Error al solicitar el cambio:", err);
        });

}

document.getElementById("btnEscalarAProblema").addEventListener("click", () => {
    const motivo = document.getElementById("motivoProblemaModal").value.trim();
    const estado = document.getElementById("estadoProblemaModal").value.trim();


    console.log("Motivo:", motivo);
    console.log("Estado:", estado);

    if(motivo !== "" || estado !== "")
    {
        mostrarMensaje("Usted ya ha realizado una solicitud de problema a esta incidencia", "danger");
        return;
    }
    else{
        modalDetalles.hide();
        modalProblema.show();
    }

});

document.getElementById("btnCancelarProblema").addEventListener("click", () => {
    
    document.getElementById("motivoProblema").value="";
  modalProblema.hide();
  modalDetalles.show();
});

function enviarProblema()
{
    const motivoProblema=document.getElementById("motivoProblema").value;
    const id_incidencia= document.getElementById("idIncidenciaSeleccionada").value;
    const user = JSON.parse(localStorage.getItem("usuario"));
    const id_equipo = document.getElementById("idEquipoSeleccionado").value;
    const usuario = user.id;

    console.log("id incidencia problema: ", id_incidencia);
    console.log("id equipo problema: ", id_equipo);
    console.log("id usuario problema: ", usuario);

    if(!motivoProblema)
    {
        mostrarMensajeEn('mensaje4', 'Por favor ingrese el motivo.', 'danger');
        return;
    }

    fetch("php/api.php?action=iniciarProblema", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ motivoProblema, id_incidencia, id_equipo, usuario })
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                document.getElementById("motivoProblema").value="";
                modalProblema.hide();
                mostrarMensaje2("Solicitud de problema realizada con exito", "success");
                obtenerIncidencias();

            } else {
                console.log("mensjae error",data.message);
            }
        })
        .catch(err => {
            console.error("Error al solicitar el problema:", err);
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

function mostrarMensaje2(mensaje, tipo) {
    const mensajeDiv = document.getElementById('mensaje2');
    mensajeDiv.innerHTML = `<div class="alert alert-${tipo}">${mensaje}</div>`;

    // Limpiar el mensaje después de 5 segundos
    setTimeout(() => {
        mensajeDiv.innerHTML = '';
    }, 5000);
} 

function mostrarMensaje3(mensaje, tipo) {
    const mensajeDiv = document.getElementById('mensaje3');
    mensajeDiv.innerHTML = `<div class="alert alert-${tipo}">${mensaje}</div>`;

    // Limpiar el mensaje después de 5 segundos
    setTimeout(() => {
        mensajeDiv.innerHTML = '';
    }, 5000);
} 

function mostrarMensajeEn(idDiv, mensaje, tipo = 'info') {
    const mensajeDiv = document.getElementById(idDiv);
    if (!mensajeDiv) return;

    mensajeDiv.innerHTML = `<div class="alert alert-${tipo}">${mensaje}</div>`;

    setTimeout(() => {
        mensajeDiv.innerHTML = '';
    }, 5000);
}
