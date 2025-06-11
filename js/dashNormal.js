function obtenerUsuarioActual() {
    const usuario = localStorage.getItem("usuario");
    return usuario ? JSON.parse(usuario) : null;
}
let modalDetalles;

document.addEventListener("DOMContentLoaded", () => {
    modalDetalles =  new bootstrap.Modal(document.getElementById('modalDetalles'));

    const user = JSON.parse(localStorage.getItem("usuario"));
    console.log("Rol logeado: ", user.rol);
    if (user)
    {
      document.getElementById("puesto_usuario").textContent =
      user.rol == 5
        ? "Coordinador Cobranza STAF"
        : user.rol == 2
        ? "Gerente de Operaciones de Mejora Continua"
        : user.rol == 3
        ? "Gerente de Inventario Comercial"
        : user.rol == 4
        ? "Coordinador de Tiendas"
        : user.rol == 6
        ? "Coordinador de Servicios Financieros"
        : "Usuario";
    }

    

    const usuario = obtenerUsuarioActual();
    console.log("datos de usuario: ", usuario);
    cargarLaptopsUsuario(usuario);




    const tabla = document.getElementById("tablaLaptops");

    tabla.addEventListener("click", function(e) {
        const fila = e.target.closest("tr");

        if (!fila) return; // Asegura que diste clic en una fila
        const equipoSeleccionado = fila.getAttribute("data-id"); // ← obten el ID
        console.log("ID del equipo seleccionado:", equipoSeleccionado);
        modalDetalles.show();
        document.getElementById("modalTitulo").value="";
        document.getElementById("modalDescripcion").value="";
        document.getElementById("equipoIdFila").value = equipoSeleccionado;


    });

   
});//fin dom



function crearIncidencia() {
    const form = document.getElementById("formModalDetalles");
    const formData = new FormData(form);

    const titulo = formData.get("modalTitulo");
    const descripcion = formData.get("modalDescripcion");
    const equipoSeleccionado = document.getElementById("equipoIdFila").value;
    const usuario = JSON.parse(localStorage.getItem("usuario"));
    const id = usuario.id;

    if (!titulo || !descripcion || !usuario) {
        mostrarMensajeEn("mensaje2","Faltan campos obligatorios.", "danger");
        return;
    }

    console.log("Datos enviados:", {
        titulo,
        descripcion,
        usuario_creador: id,
        equipoSeleccionado
    });

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
                form.reset();
                modalDetalles.hide();
                mostrarMensajeEn("mensajeExito","Incidencia Registrada Exitosamente","success");
                const usuario = obtenerUsuarioActual();
                cargarLaptopsUsuario(usuario);
            } else {
                console.log(data.message);
            }
        })
        .catch(err => {
            console.error("Error al crear incidencia:", err);
        });
}


    // Cargar equipos
function cargarLaptopsUsuario(usuario) {
    fetch("php/api.php?action=solicitarLaptopUsuario")
        .then(res => res.json())
        .then(data => {
            const tablaBody = document.querySelector("#tablaLaptops tbody");
            tablaBody.innerHTML = "";

            let laptopsFiltradas = [];

            switch(usuario.rol) {
                case 5:
                    laptopsFiltradas = data.filter(laptop => laptop.area === "Coordinación de Cobranza STAF");
                    break;
                case 3:
                    laptopsFiltradas = data.filter(laptop => laptop.area === "Inventario Comercial");
                    break;
                case 2:
                    laptopsFiltradas = data.filter(laptop => laptop.area === "Operaciones");
                    break;
                case 4:
                    laptopsFiltradas = data.filter(laptop => laptop.area === "Coordinación de Gestiones de Tiendas");
                    break;
                case 6:
                    laptopsFiltradas = data.filter(laptop => laptop.area === "Coordinación de Servicios Financieros");
                    break;
                default:
                    return;
            }

            laptopsFiltradas.forEach(laptop => {
                const fila = document.createElement("tr");
                fila.setAttribute("data-id", laptop.id);
                fila.innerHTML = `
                    <td>${laptop.id}</td>
                    <td>${laptop.modelo}</td>
                    <td>${laptop.estado}</td>
                    <td>${laptop.area}</td>
                    <td>${laptop.ubicacion}</td>
                `;
                tablaBody.appendChild(fila);
            });
        })
        .catch(error => console.error("Error al obtener laptops:", error));
}