<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

header('Content-Type: application/json');

// Incluir archivos necesarios
include 'conexion.php';
include 'funcionesLogyRegistro.php';

// Verifica si hay una acción
if (!isset($_GET['action'])) {      
    echo json_encode(['success' => false, 'message' => 'Acción no especificada']);
    exit();
}

$action = $_GET['action']; // Asegurar que action esté correctamente asignado
$inputData = null;

// Solo decodifica JSON si es POST
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $inputData = json_decode(file_get_contents('php://input'), true);
    if (json_last_error() !== JSON_ERROR_NONE) {
        echo json_encode(['success' => false, 'message' => 'Error en el formato JSON recibido.']);
        exit();
    }
}

switch ($action) {
    case 'registrarUsuario':
        // Llamada a la función que maneja el registro
        $respuesta = registrarUsuario($inputData, $conn);

        // Enviar la respuesta al frontend
        echo json_encode($respuesta);
        exit();
    case 'obtenerRoles':
        $resultado = obtenerRoles($conn); // Llama a la función para obtener roles
        echo json_encode($resultado); // Convierte el array PHP en JSON y lo envía al frontend
        exit();

    case 'iniciarSesion':
        // Llamada a la función que maneja el registro
        $respuesta = iniciarSesion($inputData, $conn);

        // Enviar la respuesta al frontend
        echo json_encode($respuesta);
        exit();

    case 'registrarLaptop':
        $respuesta = registrarLaptop($inputData, $conn);
        echo json_encode($respuesta);
        exit();

    case 'registrarMonitor':
        $respuesta = registrarMonitor($inputData, $conn);
        echo json_encode($respuesta);
        exit();

    case 'obtenerEquipos':
        $respuesta = obtenerEquipos($conn);
        echo json_encode($respuesta);
        exit();
    
    case 'crearIncidencia':
        $respuesta = crearIncidencia($inputData, $conn);
        echo json_encode($respuesta);
    break;
    
    case 'obtenerIncidencias':
        error_log("🧪 Entrando al case obtenerIncidencias");
        $respuesta = obtenerIncidencias($inputData, $conn);
        error_log("Respuesta PHP: " . print_r($respuesta, true)); // log PHP
        header('Content-Type: text/plain'); // Fuerza salida en texto
        error_log("📤 JSON que se devolverá: " . json_encode($respuesta));
        array_walk_recursive($respuesta, function (&$item) {
        if (is_string($item)) {
                $item = mb_convert_encoding($item, 'UTF-8', 'UTF-8');
            }
        });
        echo json_encode($respuesta);
        exit();
    break;
    
    case 'aceptarIncidencia':
        $respuesta = aceptarIncidencia($inputData, $conn);
        echo json_encode($respuesta);
    break;
    
    case 'finalizarIncidencia':
        $respuesta = finalizarIncidencia($inputData, $conn);
        echo json_encode($respuesta);
    break;

    case 'cerrarIncidencia':
        $respuesta = cerrarIncidencia($inputData, $conn);
        echo json_encode($respuesta);
    break;

    case 'solicitarLaptopUsuario':
        $respuesta = obtenerLaptopUsuario($conn);
        echo json_encode($respuesta);
    break;

    case 'obtenerMonitorUsuario':
        $respuesta = obtenerMonitorUsuario($conn);
        echo json_encode($respuesta);
    break;

    case 'obtenerTecnicos':
        $respuesta = obtenerTecnicos($conn);
        echo json_encode($respuesta);
    break;

    case 'obtenerLaptopTecnico':
        $respuesta = obtenerLaptopTecnico($inputData, $conn);
        echo json_encode($respuesta);
    break;

    case 'solicitarCambio':
        $respuesta = solicitarCambio($inputData, $conn);
        echo json_encode($respuesta);
    break;

    case 'obtenerCambios':
        $respuesta = obtenerCambios($inputData, $conn);
        echo json_encode($respuesta);
    break;
    
    case 'guardarCambio':
        $respuesta = guardarCambio($inputData, $conn);
        echo json_encode($respuesta);
    break;

    case 'iniciarProblema':
        $respuesta = iniciarProblema($inputData, $conn);
        echo json_encode($respuesta);
    break;
    
    case 'obtenerProblemas':
        $respuesta = obtenerProblemas($inputData, $conn);
        echo json_encode($respuesta);
    break;

    case 'aceptarProblema':
        $respuesta = aceptarProblema($inputData, $conn);
        echo json_encode($respuesta);
    break;

    case 'finalizarProblema':
        $respuesta = finalizarProblema($inputData, $conn);
        echo json_encode($respuesta);
    break;

    case 'finalizarIncAdmin':
        $respuesta = finalizarIncAdmin($inputData, $conn);
        echo json_encode($respuesta);
    break;

    case 'obtenerCatalogo':
        $respuesta = obtenerCatalogo($conn);
        echo json_encode($respuesta);
    break;

    case 'guardarOrdenTrabajo':
        $respuesta = guardarOrdenTrabajo($inputData, $conn);
        echo json_encode($respuesta);
    break;

    case 'obtenerOrdenTrabajo':
    $respuesta = obtenerOrdenTrabajo($inputData, $conn);
    echo json_encode($respuesta);
    break;


    
    

    default:
        echo json_encode(['success' => false, 'message' => 'Acción no válida']);
        exit();
}
