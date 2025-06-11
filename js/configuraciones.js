
let modalRegistroLaptop;
let modalRegistroMonitor;
let modalDetallesEquipo; 
document.addEventListener("DOMContentLoaded", () => {
    obtenerEquipos();
    modalRegistroLaptop = new bootstrap.Modal(document.getElementById('modalRegistroLaptop'));
    modalRegistroMonitor = new bootstrap.Modal(document.getElementById('modalRegistroMonitor'));
    modalDetallesEquipo = new bootstrap.Modal(document.getElementById('modalDetallesEquipo')); 




});

function registrarLaptop() {
  const form = document.getElementById("laptopForm");

  // Validación HTML5 automática
  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }

  // Obtener datos
  const datos = {
    modelo: form.modelo.value,
    procesador: form.procesador.value,
    tipo_memoria: form.tipo_memoria.value,
    capacidad_memoria: form.capacidad_memoria.value,
    ram: form.ram.value,
    tipo_fuente: form.tipo_fuente.value,
    sistema_operativo: form.sistema_operativo.value,
    software_instaladas: Array.from(form.querySelector('[name="software[]"]').selectedOptions).map(opt => opt.value).join(', '),
    fecha_adquisicion: form.fecha_adquisicion.value,
    garantia: form.garantia.value,
    area_id: form.area_id.value,
    estado_id: 1 // Disponible por defecto
  };

  // Imprimir para depuración
  console.log("Datos de la laptop:", datos);

 
  
  fetch('php/api.php?action=registrarLaptop', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(datos)
  })
  .then(res => res.json())
  .then(data => {

    if (data.success) {
        mostrarMensajeEn("mensaje12",data.message, "success");
        form.reset();
        modalRegistroLaptop.hide();
        obtenerEquipos();
    } else {
        console.error("Error al guardar problema:", data.message);
    }
  })
  .catch(err => {
    alert("Error al guardar: " + err.message);
  });
  
}



function registrarMonitor() {
  const form = document.getElementById('formularioMonitor');

  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }

  const datos = {
    marca: document.getElementById('marca_monitor').value,
    modelo: document.getElementById('modelo_monitor').value,
    tamaño_pantalla: document.getElementById('tam_pantalla_monitor').value,
    resolucion: document.getElementById('resolucion_monitor').value,
    tipo_panel: document.getElementById('tipo_panel').value,
    frecuencia_actualizacion: document.getElementById('frecuencia').value,
    puertos_disponibles: Array.from(document.getElementById('puertos').selectedOptions)
                              .map(opt => opt.value)
                              .join(','),
    tipo_conexion: document.getElementById('tipo_conexion').value,
    fecha_adquisicion: document.getElementById('fecha_adquisicion_monitor').value,
    garantia: document.getElementById('garantia_monitor').value,
    area_asignada: document.getElementById('area_asignada_monitor').value,
    estado: 1 // valor fijo por defecto
  };

  fetch('php/api.php?action=registrarMonitor', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(datos)
  })
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      mostrarMensajeEn("mensaje12",data.message, "success");
      form.reset();
      modalRegistroMonitor.hide();
      obtenerEquipos();
    } else {
      console.error("Error al registrar: " + data.message);
    }
  })
  .catch(error => {
    console.error('Error en la petición:', error);
  });
}
let todosLosEquipos = []; // Guardar datos originales

function obtenerEquipos() {

    fetch("php/api.php?action=obtenerEquipos")
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                console.log("Equipos obtenidos: ", data)
                mostrarEquipos(data.equipos.laptops, 'L');
                mostrarEquipos(data.equipos.monitores, 'M');
                todosLosEquipos = data.equipos;

            } else {
                console.error(data.message, "danger");
            }
        })
        .catch(err => {
            console.error("Error al obtener incidencias:", err);
        });
}


function mostrarEquipos(lista, tipo) {
  const tbody = document.getElementById('listaEquipos');

  lista.forEach(eq => {
    const tr = document.createElement('tr');
    
    const tipoTexto = tipo === 'L' ? 'Laptop #' : 'Monitor #';
    const idEquipo = tipo + eq.id;
    const nombreEquipo = tipoTexto + eq.id + " " + eq.modelo;

    tr.innerHTML = `
      
      <td>${nombreEquipo}</td>
      <td>${eq.estado_nombre}</td>
      <td>${eq.fecha_adquisicion || 'Sin fecha'}</td>
      <td>${eq.area_nombre || 'Sin asignar'}</td>
      <td>${eq.ubicacion_nombre}</td>
    `;

    tr.addEventListener("click", () => abrirModalEquipo(eq));
    tbody.appendChild(tr);
  });
}

document.getElementById("filtroArea").addEventListener("change", function () {
  const areaSeleccionada = this.value;
  console.log("Área seleccionada:", areaSeleccionada);


  // Unificar laptops y monitores en un solo arreglo
  const equiposUnificados = [...todosLosEquipos.laptops, ...todosLosEquipos.monitores];

  const filtradas = areaSeleccionada === "Todas"
    ? equiposUnificados
    : equiposUnificados.filter(eq => eq.area_nombre === areaSeleccionada);

  const tbody = document.getElementById('listaEquipos');
  tbody.innerHTML = ''; // Limpiar tabla

  // Volver a mostrar la lista filtrada
    filtradas.forEach(eq => {
    const tr = document.createElement('tr');
    const tipoTexto = eq.hasOwnProperty('procesador') ? 'Laptop #' : 'Monitor #';
    const nombreEquipo = tipoTexto + eq.id + " " + eq.modelo;

    tr.innerHTML = `
        <td>${nombreEquipo}</td>
        <td>${eq.estado_nombre}</td>
        <td>${eq.fecha_adquisicion || 'Sin fecha'}</td>
        <td>${eq.area_nombre || 'Sin asignar'}</td>
        <td>${eq.ubicacion_nombre}</td>
    `;

    tr.addEventListener("click", () => abrirModalEquipo(eq)); // ✅ Agregado
    tbody.appendChild(tr);
    });

});


function formatearNombreCampo(campo) {
  const mapa = {
    id: "ID",
    modelo: "Modelo",
    marca: "Marca",
    procesador: "Procesador",
    tipo_memoria: "Tipo de Memoria",
    capacidad_memoria: "Capacidad de Memoria",
    ram: "RAM",
    tipo_fuente: "Tipo de Fuente",
    sistema_operativo: "Sistema Operativo",
    software_instaladas: "Software Instalado",
    fecha_adquisicion: "Fecha de Adquisición",
    garantia: "Garantía",
    area_nombre: "Área Asignada",
    ubicacion_nombre: "Ubicación Física",
    estado_nombre: "Estado",
    tamaño_pantalla: "Tamaño de Pantalla",
    resolucion: "Resolución",
    tipo_panel: "Tipo de Panel",
    frecuencia_actualizacion: "Frecuencia de Actualización",
    puertos_disponibles: "Puertos",
    tipo_conexion: "Tipo de Conexión"
  };

  return mapa[campo] || campo.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}


function abrirModalEquipo(equipo) {
  const tbody = document.getElementById("tablaDetallesEquipo");
  console.log("Abriendo modal con equipo:", equipo);

  tbody.innerHTML = '';

  const camposIgnorados = [
    // Campos ID relacionados con nombres
    'estado', 'estado_id',
    'area_asignada', 'area_id',
    'ubicacion_fisica', 'ubicacion_id'
  ];

  for (const key in equipo) {
    if (!equipo.hasOwnProperty(key)) continue;
    if (camposIgnorados.includes(key)) continue; // ❌ ignora los campos duplicados de ID

    const valor = equipo[key] !== null && equipo[key] !== '' ? equipo[key] : 'No especificado';

    const row = document.createElement('tr');
    row.innerHTML = `
      <th>${formatearNombreCampo(key)}</th>
      <td>${valor}</td>
    `;
    tbody.appendChild(row);
  }

  modalDetallesEquipo.show();
}


