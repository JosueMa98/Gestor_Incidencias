let modalDetalles;
let diagnostico;


document.addEventListener("DOMContentLoaded", () => {
    modalDetalles = new bootstrap.Modal(document.getElementById('modalDetalles'));

    const user = JSON.parse(localStorage.getItem("usuario"));
    console.log("Rol logeado: ", user.rol);


    document.getElementById("puesto_usuario").textContent = "Tecnico Especialista en Problemas";

    obtenerProblemas();

    const tabla = document.getElementById("tablaProblemas");

    tabla.addEventListener("click", function(e) {
        let fila = e.target.closest("tr");
        if (fila && fila.parentNode.tagName === "TBODY") {  // Asegura que sea una fila del tbody
          let celdas = fila.getElementsByTagName("td");
  
          // Recuperar el id de la incidencia
          const problemaId = fila.getAttribute('data-id');
          console.log("ID del problema seleccionado:", problemaId);

          const motivoAsociado = fila.getAttribute('data-motivo');
            


            // Recuperar el id de la laptop seleccionada
            const equipoSeleccionado = fila.getAttribute('data-equipo-id');
            document.getElementById("idEquipoSeleccionado").value = equipoSeleccionado;
            console.log("ID del equipo seleccionado:", equipoSeleccionado);
  
          // Guardarlo en un input oculto para usarlo al guardar después
          document.getElementById("idProblemaSeleccionado").value = problemaId;

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

                } else {
                    console.log("mensjae error",data.message);
                }
            })
            .catch(err => {
                console.error("Error al obtener laptop:", err);
            });

/*******************************************************************************************************/          
  
          // Asignar los valores al modal
          document.getElementById("modalEquipo").value = celdas[2].textContent;
          document.getElementById("modalEstado").value = celdas[3].textContent;
          document.getElementById("modalMotivo").value = motivoAsociado;
          const solucion = fila.getAttribute('data-solucion');

          if(solucion == "null")
          {
            document.getElementById("modalSolucion").value = "";
          }
          else{
            document.getElementById("modalSolucion").value = solucion;
          }


   

          document.getElementById("verificarResuelto").value = celdas[3].textContent;
         //let modalEstado = document.getElementById("modalEstado"); 

        setTimeout(() => {
            const estado = document.getElementById("verificarResuelto").value;
            //const selectEstado = document.getElementById("modalEstado");

            console.log("Estado actual del modal:", estado);

            if (estado === "Solucionado") {
                console.log("Deshabilitando campos porque ya está aceptada");
                document.getElementById("modalEstado").disabled = true;
    
                document.getElementById("modalSolucion").disabled = true;
                document.getElementById("btnGuardarCambiosModal").disabled = true;

            } else {
                // En caso de que no esté aceptada, asegúrate de que los campos estén habilitados
                console.log("Deshabilitando campos porque ya está aceptada");
                document.getElementById("modalEstado").disabled = false;
                document.getElementById("modalSolucion").disabled = false;
                document.getElementById("btnGuardarCambiosModal").disabled = false;

            }
            }, 50);

            
       
  
          // Mostrar el modal
          modalDetalles.show();
        }
      });

});

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
        tr.setAttribute('data-equipo-id', pro.id_equipo);
        tr.setAttribute('data-estado', pro.estado);
        tr.setAttribute('data-solucion', pro.solucionProblema);   // guarda el id del problema en el tr


        /*var equipo = "";
        if (inc.equipo_id.startsWith("L"))
            equipo = "Laptop #";
        else
            equipo = "Monitor #";
        equipo += inc.equipo_id.substring(1);*/
        const nombreLap = "#" + pro.id_equipo + " " + pro.modelo;
        const idIncidencia = "# - "+ pro.incidencia_id;


        tr.innerHTML = `
        <td>${pro.id}</td>
        <td>${idIncidencia}</td>
        <td>${nombreLap}</td>
        <td>${pro.estado}</td>
        <td>${pro.fecha_inicioProblema}</td>
        <td>${pro.fecha_solucionProblema ? pro.fecha_solucionProblema : 'Sin Solucionar'}</td>
    `;

        tbody.appendChild(tr);
    });
}


function solucionarProblema()
{
    const solucion = document.getElementById("modalSolucion").value;
    const estado = document.getElementById("modalEstado").value;
    const form = document.getElementById("formModalDetalles");

    if (!solucion || !estado || estado === "En Investigacion")
    {
        mostrarMensajeEn("mensajemodal", "Favor de llenar los campos necesarios", "danger");
        return;
    }

    const problemaID = document.getElementById("idProblemaSeleccionado").value;

    console.log("problema para mandar: ", problemaID);

    fetch("php/api.php?action=finalizarProblema", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ estado, solucion, problemaID })
    })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                form.reset();
                modalDetalles.hide();
                obtenerProblemas();
                mostrarMensajeEn("mensajeGuardarCambios" ,"Cambios guardados con exito", "success");

            } else {
                console.log("mensjae error",data.message);
            }
        })
        .catch(err => {
            console.error("Error al finalizar el problema:", err);
        });


}