function obtenerUsuarioActual() {
    const usuario = localStorage.getItem("usuario");
    return usuario ? JSON.parse(usuario) : null;
}

function cerrarSesion() {
    localStorage.removeItem("usuario"); // Borra solo el usuario
    // o usa localStorage.clear() si guardas más cosas
    window.location.href = "index.html"; // Redirige al login
  }

document.addEventListener("DOMContentLoaded", () => {
    const prioridad = document.getElementById("prioridad");
    const usuario = obtenerUsuarioActual(); // Ya tienes esta función

    // Simula prioridad existente, si la quieres establecer desde otro lugar
    const prioridadExistente = ""; // Ej: "Alta"

    // Mostrar u ocultar prioridad según usuario y estado
    if (usuario && (usuario.tipo == 1 || prioridadExistente)) {
        prioridad.style.display = "block";
        prioridad.disabled = usuario.rol != 1;
        if (prioridadExistente) {
            prioridad.value = prioridadExistente;
        }
    }
    const incidenciaForm = document.getElementById("newIncidencia");

    if (usuario.rol == 7) {
        incidenciaForm.style.display = "none";
    }

    // Cargar equipos
    fetch("php/api.php?action=obtenerEquipos")
        .then(res => res.json())
        .then(data => {
            console.log(data);
            if (data != null && data != []) {
                const equipoSelect = document.getElementById("equipo");
                if (data.equipos != null && data.equipos != []) {
                    data.equipos.forEach(equipo => {
                        let id = equipo.startsWith("L") ? equipo.substring(1) : equipo.substring(1);
                        let tipo = equipo.charAt(0) === "L" ? "Laptop" : "Monitor";

                        const opt = document.createElement("option");
                        opt.value = equipo;
                        opt.text = `${tipo} #${id}`;
                        equipoSelect.appendChild(opt);
                    });
                }
            }
        })
        .catch(err => console.error("Error al cargar equipos:", err));

    //Mostrar Equipos Usuario
});

function crearIncidencia() {
    const form = document.getElementById("incidenciaForm");
    const formData = new FormData(form);

    const titulo = formData.get("titulo");
    const descripcion = formData.get("descripcion");
    const equipoSeleccionado = formData.get("equipo");
    const usuario = obtenerUsuarioActual();
    const id = usuario.id;

    if (!titulo || !descripcion || !usuario) {
        mostrarMensaje("Faltan campos obligatorios.", "warning");
        return;
    }

    fetch("php/api.php?action=crearIncidencia", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            titulo,
            descripcion,
            usuario_creador: id,
            equipoSeleccionado
        })
    })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                mostrarMensaje(data.message, "success");
                form.reset();
            } else {
                mostrarMensaje(data.message, "danger");
            }
        })
        .catch(err => {
            console.error("Error al crear incidencia:", err);
            mostrarMensaje("Error en la conexión.", "danger");
        });
}

obtenerIncidencias();

function obtenerIncidencias() {
    const usuario = obtenerUsuarioActual();

    const usuario_id = usuario.id;
    const tipo_usuario = usuario.rol;

    fetch("php/api.php?action=obtenerIncidencias", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ usuario_id, tipo_usuario })
    })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                mostrarIncidencias(data.incidencias);
            } else {
                mostrarMensaje(data.message, "danger");
            }
        })
        .catch(err => {
            console.error("Error al obtener incidencias:", err);
            mostrarMensaje("Error en la conexión.", "danger");
        });
}

function mostrarIncidencias(incidencias) {
    const tbody = document.getElementById('listaIncidencias');
    tbody.innerHTML = '';

    incidencias.forEach(inc => {
        const tr = document.createElement('tr');

        tr.addEventListener('click', () => {
            const usuario = obtenerUsuarioActual();
            // Cambiar título del formulario
            const contenedor = document.getElementById('newIncidencia');
            contenedor.querySelector('h2').textContent = 'Ver Incidencia';

            // Ocultar botón Enviar
            const boton = contenedor.querySelector('button');
            if (boton && usuario.rol != 1 && usuario.rol != 7) boton.style.display = 'none';

            // Cargar datos en el formulario
            const form = document.getElementById('incidenciaForm');
            form.titulo.value = inc.titulo;
            form.descripcion.value = inc.descripcion;
            form.prioridad.value = inc.prioridad || "";

            // Deshabilitar inputs para solo ver
            form.titulo.disabled = true;
            form.descripcion.disabled = true;
            form.prioridad.disabled = usuario.rol != 1;
            form.equipo.disabled = true;

            // Seleccionar equipo si hay
            if (inc.id_equipo) {
                form.equipo.value = inc.equipo_id;
            }
        });

        var equipo = "";
        if (inc.equipo_id.startsWith("L"))
            equipo = "Laptop #";
        else
            equipo = "Monitor #";
        equipo += inc.equipo_id.substring(1);

        tr.innerHTML = `
        <td>${inc.titulo}</td>
        <td>${equipo}</td>
        <td>${inc.prioridad || 'No asignada'}</td>
        <td>${inc.estado}</td>
        <td>${inc.fecha_creacion}</td>
        <td>${inc.fecha_resolucion ? inc.fecha_resolucion : 'Sin resolver'}</td>
    `;

        tbody.appendChild(tr);
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