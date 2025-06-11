function obtenerUsuarioActual() {
    const usuario = localStorage.getItem("usuario");
    return usuario ? JSON.parse(usuario) : null;
}


document.addEventListener("DOMContentLoaded", () => {

    const user = JSON.parse(localStorage.getItem("usuario"));
    console.log("Rol logeado: ", user.rol);


    const usuario = obtenerUsuarioActual();
    console.log("datos de usuario: ", usuario);
    // Cargar equipos
    fetch("php/api.php?action=obtenerMonitorUsuario")
        .then(res => res.json())
        .then(data => {
            switch(usuario.rol)
            {
                case 5:
                    const laptopsFiltradas = data.filter(laptop => laptop.area === "Coordinación de Cobranza STAF");
                    console.log(laptopsFiltradas);

                    const tablaBody = document.querySelector("#tablaMonitores tbody");

                    // Limpia el contenido previo
                    tablaBody.innerHTML = "";

                    // Agrega cada fila
                    laptopsFiltradas.forEach(laptop => {
                        const fila = document.createElement("tr");
                        fila.setAttribute("data-id", laptop.id); // ← agrega el ID como atributo


                        fila.innerHTML = `
                            <td>${laptop.id}</td>
                            <td>${laptop.marca}</td>
                            <td>${laptop.modelo}</td>
                            <td>${laptop.estado}</td>
                            <td>${laptop.area}</td>
                            <td>${laptop.ubicacion}</td>
                        `;

                        tablaBody.appendChild(fila);
                    });
                break;

                case 3:
                    const laptopsInvComercial = data.filter(laptop => laptop.area === "Inventario Comercial");
                    console.log(laptopsInvComercial);

                    const tablaBodyInvCom = document.querySelector("#tablaMonitores tbody");

                    // Limpia el contenido previo
                    tablaBodyInvCom.innerHTML = "";

                    // Agrega cada fila
                    laptopsInvComercial.forEach(laptop => {
                        const fila = document.createElement("tr");
                        fila.setAttribute("data-id", laptop.id); // ← agrega el ID como atributo

                        fila.innerHTML = `
                            <td>${laptop.id}</td>
                            <td>${laptop.marca}</td>
                            <td>${laptop.modelo}</td>
                            <td>${laptop.estado}</td>
                            <td>${laptop.area}</td>
                            <td>${laptop.ubicacion}</td>
                        `;

                        tablaBodyInvCom.appendChild(fila);
                    });
                break;

                case 2:
                    const laptopsOperaciones = data.filter(laptop => laptop.area === "Operaciones");
                    console.log(laptopsOperaciones);

                    const tablaBodyOp = document.querySelector("#tablaMonitores tbody");

                    // Limpia el contenido previo
                    tablaBodyOp.innerHTML = "";

                    // Agrega cada fila
                    laptopsOperaciones.forEach(laptop => {
                        const fila = document.createElement("tr");
                        fila.setAttribute("data-id", laptop.id); // ← agrega el ID como atributo

                        fila.innerHTML = `
                            <td>${laptop.id}</td>
                            <td>${laptop.marca}</td>
                            <td>${laptop.modelo}</td>
                            <td>${laptop.estado}</td>
                            <td>${laptop.area}</td>
                            <td>${laptop.ubicacion}</td>
                        `;

                        tablaBodyOp.appendChild(fila);
                    });
                break;

                case 4:
                    const laptopsTiendas = data.filter(laptop => laptop.area === "Coordinación de Gestiones de Tiendas");
                    console.log(laptopsTiendas);

                    const tablaBodyTiendas = document.querySelector("#tablaMonitores tbody");

                    // Limpia el contenido previo
                    tablaBodyTiendas.innerHTML = "";

                    // Agrega cada fila
                    laptopsTiendas.forEach(laptop => {
                        const fila = document.createElement("tr");
                        fila.setAttribute("data-id", laptop.id); // ← agrega el ID como atributo

                        fila.innerHTML = `
                            <td>${laptop.id}</td>
                            <td>${laptop.marca}</td>
                            <td>${laptop.modelo}</td>
                            <td>${laptop.estado}</td>
                            <td>${laptop.area}</td>
                            <td>${laptop.ubicacion}</td>
                        `;

                        tablaBodyTiendas.appendChild(fila);
                    });
                break;

                case 6:
                    const laptopsServFin = data.filter(laptop => laptop.area === "Coordinación de Servicios Financieros");
                    console.log(laptopsServFin);

                    const tablaBodyServFin = document.querySelector("#tablaMonitores tbody");

                    // Limpia el contenido previo
                    tablaBodyServFin.innerHTML = "";

                    // Agrega cada fila
                    laptopsServFin.forEach(laptop => {
                        const fila = document.createElement("tr");
                        fila.setAttribute("data-id", laptop.id); // ← agrega el ID como atributo

                        fila.innerHTML = `
                            <td>${laptop.id}</td>
                            <td>${laptop.marca}</td>
                            <td>${laptop.modelo}</td>
                            <td>${laptop.estado}</td>
                            <td>${laptop.area}</td>
                            <td>${laptop.ubicacion}</td>
                        `;

                        tablaBodyServFin.appendChild(fila);
                    });
                break;


                

                default:
                    console.log("No hay nada para mostrar");
                break;
            } // fin switch
            

            
            
        })
        .catch(error => console.error("Error en fetch:", error));

   
});//fin dom


