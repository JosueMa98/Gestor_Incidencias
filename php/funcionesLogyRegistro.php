<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
// Incluir la conexión
include 'conexion.php';

function obtenerRoles($conn)
{
    $resultado = $conn->query("SELECT id, nombre FROM roles WHERE id !=1"); //excluir el admin //Guarda la consulta en resultado
    if (!$resultado) {
        // Muestra el error específico de MySQL
        die("❌ Error en la consulta: " . $conn->error);
    }
    $roles = []; //arreglo
    while ($rol = $resultado->fetch_assoc()) {  //fectch_assoc convierte las filas de la tabla a par clave valor para guardar en el array, ejemplo id-nombre(valor)
        $roles[] = $rol; //guarda cada fila convertida en el arreglo roles para mandarlo al js
    }
    // Depuración
    //print_r($roles); 


    return $roles;
}

function registrarUsuario($data, $conn)
{
    error_log("Iniciando función registrarUsuario");

    if (empty($data['correo']) || empty($data['password']) || empty($data['rol'])) {
        error_log("Faltan datos: " . print_r($data, true));
        return ['success' => false, 'message' => 'Faltan datos'];
    }

    $correo = mysqli_real_escape_string($conn, $data['correo']);
    $password = password_hash($data['password'], PASSWORD_BCRYPT);
    $rol = $data['rol'];

    $sql1 = "SELECT COUNT(*) as count FROM usuarios WHERE correo = '$correo'";
    $resultado = mysqli_query($conn, $sql1);
    $fila = mysqli_fetch_assoc($resultado);

    if ($fila['count'] > 0) {
        return (['success' => false, 'message' => 'El correo ya está registrado']);
    }


    error_log("Datos procesados: Correo - $correo, Password (hash) - $password");

    $sql = "INSERT INTO usuarios (correo, contrasena, rol_id) VALUES ('$correo', '$password', '$rol')";

    if (mysqli_query($conn, $sql)) {
        error_log("Usuario registrado con éxito.");
        return ['success' => true, 'message' => 'Usuario registrado con éxito'];
    } else {
        error_log("Error en la consulta SQL: " . mysqli_error($conn));
        return ['success' => false, 'message' => 'Error al registrar usuario'];
    }
}

function iniciarSesion($data, $conn)
{
    $correo = mysqli_real_escape_string($conn, $data['usuario']);
    $contra = $data['contraseña'];

    // ✅ Consulta para obtener la contraseña y el rol
    $sql = "SELECT id, contrasena, rol_id FROM usuarios WHERE correo = ?";
    $stmt = mysqli_prepare($conn, $sql);

    if (!$stmt) {
        error_log("Error al preparar la consulta: " . mysqli_error($conn));
        return ['success' => false, 'message' => 'Error en la preparación de la consulta'];
    }

    // ✅ Asociar variables
    mysqli_stmt_bind_param($stmt, "s", $correo);

    // ✅ Ejecutar la consulta
    mysqli_stmt_execute($stmt);

    // ✅ Obtener resultado
    $resultado = mysqli_stmt_get_result($stmt);

    if ($resultado && mysqli_num_rows($resultado) > 0) {
        $usuario = mysqli_fetch_assoc($resultado);

        // ✅ Verificar la contraseña
        if (password_verify($contra, $usuario['contrasena'])) {
            $rol = $usuario['rol_id'];

            if ($rol == 1) {
                error_log("Inicio de sesión exitoso como ADMIN: $correo");
                return ['success' => true, 'message' => 'Inicio de sesión como administrador', 'redirect' => 'dashboard_admin.html', 'correo' => $correo, 'rol' => $rol, 'id' => $usuario['id']];
            } if ($rol == 7) {
                error_log("Inicio de sesión exitoso como Usuario: $correo");
                return ['success' => true, 'message' => 'Inicio de sesión como usuario', 'redirect' => 'dashboard_tecnico.html', 'correo' => $correo, 'rol' => $rol, 'id' => $usuario['id']];
            }
            if ($rol == 8) {
                error_log("Inicio de sesión exitoso como Usuario: $correo");
                return ['success' => true, 'message' => 'Inicio de sesión como usuario', 'redirect' => 'dash_tecnicoProblemas.html', 'correo' => $correo, 'rol' => $rol, 'id' => $usuario['id']];
            }
            else{
                error_log("Inicio de sesión exitoso como Usuario: $correo");
                return ['success' => true, 'message' => 'Inicio de sesión como usuario', 'redirect' => 'dashboard_normal.html', 'correo' => $correo, 'rol' => $rol, 'id' => $usuario['id']];
            }
        } else {
            error_log("Contraseña incorrecta para: $correo");
            return ['success' => false, 'message' => 'Correo o contraseña incorrectos'];
        }
    } else {
        error_log("Correo no encontrado: $correo");
        return ['success' => false, 'message' => 'Correo o contraseña incorrectos'];
    }
}

function registrarLaptop($data, $conn) {
    // Sanitizar y preparar valores
    $modelo = $conn->real_escape_string($data['modelo']);
    $procesador = $conn->real_escape_string($data['procesador']);
    $tipo_memoria = $conn->real_escape_string($data['tipo_memoria']);
    $capacidad_memoria = $conn->real_escape_string($data['capacidad_memoria']);
    $ram = $conn->real_escape_string($data['ram']);
    $tipo_fuente = $conn->real_escape_string($data['tipo_fuente']);
    $sistema_operativo = $conn->real_escape_string($data['sistema_operativo']);
    $software_instaladas = $conn->real_escape_string($data['software_instaladas']);
    $fecha_adquisicion = $conn->real_escape_string($data['fecha_adquisicion']);
    $garantia = intval($data['garantia']);
    $area_id = intval($data['area_id']);
    $estado_id = intval($data['estado_id']);

    // Buscar ubicación asociada al área
    $ubicacion_id = null;
    $query = $conn->query("SELECT ubicacion_id FROM area WHERE id = $area_id LIMIT 1");

    if ($query && $fila = $query->fetch_assoc()) {
        $ubicacion_id = intval($fila['ubicacion_id']);
    } else {
        return ['success' => false, 'message' => 'No se encontró la ubicación correspondiente al área seleccionada.'];
        
    }

    // Insertar en base de datos
    $sql = "INSERT INTO lista_laptop (
        modelo, procesador, tipo_memoria, capacidad_memoria,
        ram, tipo_fuente, sistema_operativo, software_instaladas,
        fecha_adquisicion, garantia, area_id, ubicacion_id, estado_id
    ) VALUES (
        '$modelo', '$procesador', '$tipo_memoria', '$capacidad_memoria',
        '$ram', '$tipo_fuente', '$sistema_operativo', '$software_instaladas',
        '$fecha_adquisicion', $garantia, $area_id, $ubicacion_id, $estado_id
    )";

    if ($conn->query($sql) === TRUE) {
        return ['success' => true, 'message' => 'Laptop registrada correctamente'];
    } else {
        return ['success' => false, 'message' => 'Error al registrar: ' . $conn->error];
    }
}


function registrarMonitor($data, $conn)
{
    error_log("Iniciando función registrarMonitor");

    // Validaciones básicas
    $campos_obligatorios = [
        'marca',
        'modelo',
        'tamano_pantalla',
        'resolucion',
        'tipo_panel',
        'frecuencia_actualizacion',
        'puertos_disponibles',
        'tipo_conexion',
        'fecha_adquisicion',
        'garantia',
        'area_asignada',
        'estado'
    ];

    foreach ($campos_obligatorios as $campo) {
        if (!isset($data[$campo]) || $data[$campo] === '') {
            error_log("Falta el campo: $campo");
            return ['success' => false, 'message' => "Falta el campo: $campo"];
        }
    }

    // Escapar datos
    $marca         = mysqli_real_escape_string($conn, $data['marca']);
    $modelo        = mysqli_real_escape_string($conn, $data['modelo']);
    $tamaño        = mysqli_real_escape_string($conn, $data['tamano_pantalla']);
    $resolucion    = mysqli_real_escape_string($conn, $data['resolucion']);
    $tipo_panel    = mysqli_real_escape_string($conn, $data['tipo_panel']);
    $frecuencia    = mysqli_real_escape_string($conn, $data['frecuencia_actualizacion']);
    $puertos       = mysqli_real_escape_string($conn, $data['puertos_disponibles']); // ya viene como texto separado por coma
    $tipo_conexion = mysqli_real_escape_string($conn, $data['tipo_conexion']);
    $fecha         = mysqli_real_escape_string($conn, $data['fecha_adquisicion']);
    $garantia      = intval($data['garantia']);
    $area_id       = intval($data['area_asignada']);
    $estado_id     = intval($data['estado']);

    // Obtener ubicación asociada al área
    $queryUbicacion = "SELECT ubicacion_id FROM area WHERE id = $area_id LIMIT 1";
    $resultUbicacion = mysqli_query($conn, $queryUbicacion);
    if ($resultUbicacion && mysqli_num_rows($resultUbicacion) > 0) {
        $row = mysqli_fetch_assoc($resultUbicacion);
        $ubicacion_id = intval($row['ubicacion_id']);
    } else {
        error_log("No se encontró la ubicación para el área ID $area_id");
        return ['success' => false, 'message' => 'No se encontró la ubicación asociada al área seleccionada.'];
    }

    // Insertar monitor
    $sql = "INSERT INTO lista_monitores (
                marca, modelo, tamano_pantalla, resolucion,
                tipo_panel, frecuencia_actualizacion, puertos_disponibles,
                tipo_conexion, fecha_adquisicion, garantia,
                area_asignada, estado, ubicacion_fisica
            ) VALUES (
                '$marca', '$modelo', '$tamaño', '$resolucion',
                '$tipo_panel', '$frecuencia', '$puertos',
                '$tipo_conexion', '$fecha', $garantia,
                $area_id, $estado_id, $ubicacion_id
            )";

    if (mysqli_query($conn, $sql)) {
        error_log("Monitor registrado con éxito.");
        return ['success' => true, 'message' => 'Monitor registrado con éxito'];
    } else {
        error_log("Error en la consulta SQL: " . mysqli_error($conn));
        return ['success' => false, 'message' => 'Error al registrar monitor'];
    }
}


function obtenerEquipos($conn) {
    $equipos = [
        'laptops' => [],
        'monitores' => []
    ];

    // Obtener laptops con JOIN a área, ubicación y estado
    $sqlLaptops = "
        SELECT l.*, 
               a.nombre_equipo AS area_nombre, 
               u.nombre AS ubicacion_nombre, 
               e.estado AS estado_nombre
        FROM lista_laptop l
        LEFT JOIN area a ON l.area_id = a.id
        LEFT JOIN ubicaciones u ON a.ubicacion_id = u.id
        LEFT JOIN estados_laptop e ON l.estado_id = e.id
    ";

    $resultadoLaptops = mysqli_query($conn, $sqlLaptops);
    if (!$resultadoLaptops) {
        error_log("Error al obtener laptops: " . mysqli_error($conn));
        return ['success' => false, 'message' => 'Error al obtener laptops.'];
    }
    while ($fila = mysqli_fetch_assoc($resultadoLaptops)) {
        $equipos['laptops'][] = $fila;
    }

    // Obtener monitores con JOIN a área, ubicación y estado
    $sqlMonitores = "
        SELECT m.*, 
               a.nombre_equipo AS area_nombre, 
               u.nombre AS ubicacion_nombre, 
               e.estado AS estado_nombre
        FROM lista_monitores m
        LEFT JOIN area a ON m.area_asignada = a.id
        LEFT JOIN ubicaciones u ON a.ubicacion_id = u.id
        LEFT JOIN estados_monitor e ON m.estado = e.id
    ";

    $resultadoMonitores = mysqli_query($conn, $sqlMonitores);
    if (!$resultadoMonitores) {
        error_log("Error al obtener monitores: " . mysqli_error($conn));
        return ['success' => false, 'message' => 'Error al obtener monitores.'];
    }
    while ($fila = mysqli_fetch_assoc($resultadoMonitores)) {
        $equipos['monitores'][] = $fila;
    }

    return ['success' => true, 'equipos' => $equipos];
}



function crearIncidencia($data, $conn)
{
    $titulo = mysqli_real_escape_string($conn, $data['titulo']);
    $descripcion = mysqli_real_escape_string($conn, $data['descripcion']);
    $usuario_creador = intval($data['usuario_creador']);
    $id_equipo = mysqli_real_escape_string($conn, $data['equipoSeleccionado']);

    // Primero, insertamos la incidencia
    $sqlInsert = "INSERT INTO incidencias (titulo, descripcion, usuario_creador, equipo_id)
                  VALUES ('$titulo', '$descripcion', $usuario_creador, '$id_equipo')";

    if (mysqli_query($conn, $sqlInsert)) {
        $id_incidencia = mysqli_insert_id($conn);

        // Luego, actualizamos la otra tabla.
        // Por ejemplo, supongamos que deseas marcar el equipo como "en incidencia" en la tabla "lista_laptop"
        $sqlUpdate = "UPDATE lista_laptop 
                      SET estado_id = 2  
                      WHERE id = '$id_equipo'";
        
        if (mysqli_query($conn, $sqlUpdate)) {
            return ['success' => true, 'message' => 'Incidencia creada y equipo actualizado correctamente'];
        } else {
            // Si falla el update, podrías hacer rollback si usas transacciones o informar el error.
            return ['success' => false, 'message' => 'Incidencia creada pero error al actualizar el equipo: ' . mysqli_error($conn)];
        }
    } else {
        return ['success' => false, 'message' => 'Error al registrar la incidencia: ' . mysqli_error($conn)];
    }
}


function aceptarIncidencia($data, $conn)
{
    $id = intval($data['id']);
    $prioridad = mysqli_real_escape_string($conn, $data['prioridad']);
    $tecnico_id = intval($data['tecnico']);
    $estado = mysqli_real_escape_string($conn, $data['estado']);


    $sql = "UPDATE incidencias 
            SET prioridad = '$prioridad', 
                tecnico_asignado = $tecnico_id, 
                estado = '$estado',
                Fecha_de_asignacion = NOW() 
            WHERE id = $id";

    if (mysqli_query($conn, $sql)) {
        return ['success' => true, 'message' => 'Incidencia aceptada y asignada correctamente'];
    } else {
        return ['success' => false, 'message' => 'Error al aceptar la incidencia: ' . mysqli_error($conn)];
    }
}

function finalizarIncidencia($data, $conn)
{
    $id = intval($data['incidencia_id']);
    $campos = [];

    // Diagnóstico nuevo
    $nuevoDiagnostico = mysqli_real_escape_string($conn, $data['diagnostico']);
    $estado = mysqli_real_escape_string($conn, $data['estado']);

    // Consultar el diagnóstico actual
    $sqlActual = "SELECT diagnostico FROM incidencias WHERE id = $id";
    $res = mysqli_query($conn, $sqlActual);

    if ($res && $fila = mysqli_fetch_assoc($res)) {
        $diagnosticoActual = $fila['diagnostico'];

        if ($nuevoDiagnostico !== $diagnosticoActual) {
            $campos[] = "diagnostico = '$nuevoDiagnostico'";
            $campos[] = "fecha_resolucion = NOW()";
        }
    } else {
        return ['success' => false, 'message' => 'Incidencia no encontrada'];
    }

    // Siempre actualiza el estado (siempre lo mandas)
    $campos[] = "estado = '$estado'";

    $setClause = implode(', ', $campos);
    $sqlUpdate = "UPDATE incidencias SET $setClause WHERE id = $id";

    if (mysqli_query($conn, $sqlUpdate)) {
        return ['success' => true, 'message' => 'Incidencia actualizada correctamente'];
    } else {
        return ['success' => false, 'message' => 'Error al actualizar la incidencia: ' . mysqli_error($conn)];
    }
}



function cerrarIncidencia($data, $conn)
{
    $id = intval($data['incidencia_id']);
    $estado = mysqli_real_escape_string($conn, $data['estado']);
    $calificacion = intval($data['calificacion']);
    $tecnico_id = intval($data['tecnico_id']);
    $usuario_id = intval($data['usuario_id']);
    $id_equipo = intval($data['equipo_id']);

    // Iniciar transacción
    mysqli_begin_transaction($conn);

    try {
        // 1. Cerrar incidencia
        $sql1 = "UPDATE incidencias 
                 SET estado = '$estado'
                 WHERE id = $id";
        if (!mysqli_query($conn, $sql1)) {
            throw new Exception("Error al cerrar la incidencia: " . mysqli_error($conn));
        }

        // 2. Insertar calificación
        $sql2 = "INSERT INTO calificaciones (incidencia_id, usuario_id, tecnico_id, calificacion, fecha)
                 VALUES ($id, $usuario_id, $tecnico_id, $calificacion, NOW())";
        if (!mysqli_query($conn, $sql2)) {
            throw new Exception("Error al registrar calificación: " . mysqli_error($conn));
        }
        if($estado === "Aceptada")
        {
            $sql3 = "UPDATE lista_laptop 
                      SET estado_id = 1  
                      WHERE id = '$id_equipo'";
            if (!mysqli_query($conn, $sql3)) {
                throw new Exception("Error al actualizar el estado: " . mysqli_error($conn));
            }
        }


        // Confirmar cambios
        mysqli_commit($conn);
        return ['success' => true, 'message' => 'Incidencia cerrada y calificación registrada correctamente'];

    } catch (Exception $e) {
        // Revertir si algo falla
        mysqli_rollback($conn);
        return ['success' => false, 'message' => $e->getMessage()];
    }
}


function obtenerIncidencias($data, $conn)
{
    error_log("📥 Entrando a obtenerIncidencias");
    error_log("🕵️‍♂️ Dump de data:");
    ob_start();
    var_dump($data);
    error_log(ob_get_clean());

    if (!is_array($data)) {
        return ['success' => false, 'message' => 'Data no es arreglo'];
    }

    if (!isset($data['usuario_id'])) {
        return ['success' => false, 'message' => 'Falta usuario_id'];
    }

    if (!isset($data['tipo_usuario'])) {
        return ['success' => false, 'message' => 'Falta tipo_usuario'];
    }

    if (!is_array($data) || !isset($data['usuario_id']) || !isset($data['tipo_usuario'])) {
        return ['success' => false, 'message' => 'Parámetros incompletos o no válidos.'];
    }

    $usuario_id = intval($data['usuario_id']);
    $tipo_usuario = intval($data['tipo_usuario']);

    if ($tipo_usuario === 1) {
        $condicion = "1";
    } elseif ($tipo_usuario === 7) {
        $condicion = "i.tecnico_asignado = $usuario_id";
    } else {
        $condicion = "i.usuario_creador = $usuario_id";
    }

    $sql = "SELECT 
            i.id, 
            i.equipo_id, 
            i.titulo, 
            i.descripcion, 
            i.prioridad, 
            i.estado, 
            i.fecha_creacion, 
            i.fecha_resolucion,
            i.Fecha_de_asignacion,
            i.diagnostico,
            i.tecnico_asignado,
            usu.correo AS correoTecnico,
            u.nombre AS ubicacion,
            l.modelo,
            a.nombre_equipo AS area,
            c.pieza,
            ca.calificacion,
            p.estado AS estadoProblema,
            p.motivoProblema,
            c.estado AS estadoCambio
        FROM incidencias i
        LEFT JOIN lista_laptop l ON i.equipo_id = l.id
        LEFT JOIN usuarios usu ON i.tecnico_asignado = usu.id
        LEFT JOIN problemas_registrados p ON i.id = p.incidencia_id
        LEFT JOIN ubicaciones u ON l.ubicacion_id = u.id
        LEFT JOIN area a ON l.area_id = a.id
        LEFT JOIN solicitudes_cambio c ON i.id = c.incidencia_id
        LEFT JOIN calificaciones ca ON i.id = ca.incidencia_id
        WHERE $condicion
        /*GROUP BY i.id*/
        ORDER BY i.fecha_creacion DESC";

    $result = mysqli_query($conn, $sql);

    if (!$result) {
        error_log("Error SQL obtenerIncidencias: " . mysqli_error($conn));
        return ['success' => false, 'message' => 'Error al obtener incidencias.'];
    }

    $sqlCambios = "SELECT incidencia_id, pieza, estado FROM solicitudes_cambio";
    $resultCambios = mysqli_query($conn, $sqlCambios);

    $cambiosPorIncidencia = [];

    if ($resultCambios) {
        while ($rowCambio = mysqli_fetch_assoc($resultCambios)) {
            $id = $rowCambio['incidencia_id'];
            if (!isset($cambiosPorIncidencia[$id])) {
                $cambiosPorIncidencia[$id] = [];
            }
            $cambiosPorIncidencia[$id][] = [
                'pieza' => $rowCambio['pieza'],
                'estado' => $rowCambio['estado']
            ];
        }
    }

    $incidencias = [];
    while ($row = mysqli_fetch_assoc($result)) {
        $row['cambios'] = $cambiosPorIncidencia[$row['id']] ?? [];
        $incidencias[] = $row;
    }

    return ['success' => true, 'incidencias' => $incidencias];
}



function obtenerLaptopUsuario($conn)
{
    $sql = $conn->query("SELECT 
                            l.id, 
                            l.modelo, 
                            e.estado, 
                            a.nombre_equipo AS area, 
                            u.nombre AS ubicacion 
                         FROM lista_laptop l
                         INNER JOIN estados_laptop e ON l.estado_id = e.id
                         INNER JOIN area a ON l.area_id = a.id
                         INNER JOIN ubicaciones u ON l.ubicacion_id = u.id");

    $laptops = [];
    if ($sql && $sql->num_rows > 0) {
        while ($result = $sql->fetch_assoc()) {
            $laptops[] = $result;
        }
    }
    error_log(print_r($laptops, true)); // Guarda en error_log del servidor

    return $laptops;
}

function obtenerTecnicos($conn)
{
    $sql = "SELECT id, correo, rol_id FROM usuarios WHERE rol_id IN (7, 8)";

    $resultado = mysqli_query($conn, $sql);

    if (!$resultado) {
        error_log("Error al obtener tecnicos: " . mysqli_error($conn));
        return ['success' => false, 'message' => 'Error al obtener tecnicos.'];
    }

    $tecnicos = [];
    while ($fila = mysqli_fetch_assoc($resultado)) {
        $tecnicos[] = [
            'id' => $fila['id'],
            'correo' => $fila['correo'],
            'rol_id' => $fila['rol_id']
        ];
    }

    return ['success' => true, 'tecnicos' => $tecnicos];
}

function obtenerLaptopTecnico($data, $conn)
{

    $equipo_id = intval($data['equipo_id']);

    $condicion = "l.id = $equipo_id";


        $sql = "SELECT 
        l.id, 
        l.modelo,
        l.tipo_memoria,
        l.capacidad_memoria,
        l.procesador,
        l.ram,
        l.sistema_operativo,
        l.tipo_fuente,
        l.fecha_adquisicion,
        l.garantia,
        l.software_instaladas,
        a.nombre_equipo AS area, 
        u.nombre AS ubicacion 
    FROM lista_laptop l
    INNER JOIN estados_laptop e ON l.estado_id = e.id
    INNER JOIN area a ON l.area_id = a.id
    INNER JOIN ubicaciones u ON l.ubicacion_id = u.id
    WHERE $condicion";

    $result = mysqli_query($conn, $sql); //atajo

    if ($result) {
        $laptop = mysqli_fetch_assoc($result);
 
        return ['success' => true, 'laptop' => $laptop];
    } 
    else 
    {
        return ['success' => false, 'message' => 'Error al obtener info laptop: ' . mysqli_error($conn)];
    }

}

function solicitarCambio($data, $conn)
{
    $pieza = mysqli_real_escape_string($conn, $data['pieza']);
    $motivo = mysqli_real_escape_string($conn, $data['motivo']);
    $usuario_creador = intval($data['usuario']);
    $incidencia_id = intval($data['incidencia_id']);
    $id_equipo = intval($data['id_equipo']);


    $sql = "INSERT INTO solicitudes_cambio (pieza, motivo, usuario_creador, incidencia_id, id_equipo)
            VALUES ('$pieza', '$motivo', $usuario_creador, '$incidencia_id', '$id_equipo')";

    if (mysqli_query($conn, $sql)) {
     
        return ['success' => true, 'message' => 'Solicitud cambio creado correctamente'];
    } else {
        return ['success' => false, 'message' => 'Error al registrar la solicitud de cambio: ' . mysqli_error($conn)];
    }
}

function obtenerCambios($data, $conn)
{
    $usuario_id = intval($data['usuario_id']);
    $tipo_usuario = intval($data['tipo_usuario']);

    // Determinar la condición de la consulta según el tipo de usuario
    if ($tipo_usuario === 1) {
        // Admin: todas las incidencias
        $condicion = "1";
    } elseif ($tipo_usuario === 7) {
        // Técnico: incidencias asignadas a él
        $condicion = "tecnico_asignado = $usuario_id";
    } else {
        // Otros usuarios: incidencias creadas por ellos
        $condicion = "usuario_creador = $usuario_id";
    }

    $sql = "SELECT 
            c.id AS rfc, 
            c.pieza, 
            c.motivo, 
            c.fecha_solicitud, 
            c.estado, 
            i.diagnostico, 
            i.titulo,
            usu.correo AS tecnico, 
            c.incidencia_id,
            c.id_equipo,
            u.nombre AS ubicacion,
            l.modelo,
            a.nombre_equipo AS area
        FROM solicitudes_cambio c
        LEFT JOIN incidencias i ON c.incidencia_id = i.id
        LEFT JOIN usuarios usu ON c.usuario_creador = usu.id
        LEFT JOIN lista_laptop l ON c.id_equipo = l.id
        LEFT JOIN ubicaciones u ON l.ubicacion_id = u.id
        LEFT JOIN area a ON l.area_id = a.id
        WHERE $condicion
        ORDER BY c.fecha_solicitud DESC";


    $result = mysqli_query($conn, $sql); //atajo

    if ($result) {
        $cambios = [];
        while ($row = mysqli_fetch_assoc($result)) {
            $cambios[] = $row;
        }
        return ['success' => true, 'cambios' => $cambios];
    } else {
        return ['success' => false, 'message' => 'Error al obtener solicitudes de cambios: ' . mysqli_error($conn)];
    }
}


function guardarCambio($data, $conn)
{
    $id = intval($data['idCambio']);
    $estado = mysqli_real_escape_string($conn, $data['estado']);

    $sql = "UPDATE solicitudes_cambio 
            SET estado = '$estado'
            WHERE id = $id";

    if (mysqli_query($conn, $sql)) {
        return ['success' => true, 'message' => 'Cambio finalizado correctamente'];
    } else {
        return ['success' => false, 'message' => 'Error al guardar el cambio: ' . mysqli_error($conn)];
    }
}

function iniciarProblema($data, $conn)
{
    $motivo = mysqli_real_escape_string($conn, $data['motivoProblema']);
    $id_incidencia = intval($data['id_incidencia']);
    $usuario_creador = intval($data['usuario']);
    $id_equipo = intval($data['id_equipo']);
    $rol = isset($data['rol']) ? intval($data['rol']) : 0;

    // Validar si ya existe un problema para esta incidencia
    $verificar = "SELECT id FROM problemas_registrados WHERE incidencia_id = $id_incidencia LIMIT 1";
    $resultado = mysqli_query($conn, $verificar);

    if (mysqli_num_rows($resultado) > 0) {
        return ['success' => false, 'message' => 'Ya existe un problema asociado a esta incidencia.'];
    }

    // Insertar nuevo problema si no existe
    if ($rol === 1) {
        $tecnicoProblemas = intval($data['tecnicoProblemas']);
        $sql = "INSERT INTO problemas_registrados 
                (incidencia_id, motivoProblema, usuario_creador, id_equipo, id_tecnico, estado)
                VALUES 
                ($id_incidencia, '$motivo', $usuario_creador, $id_equipo, $tecnicoProblemas, 'En Investigacion')";
    } else {
        $sql = "INSERT INTO problemas_registrados 
                (incidencia_id, motivoProblema, usuario_creador, id_equipo)
                VALUES 
                ($id_incidencia, '$motivo', $usuario_creador, $id_equipo)";
    }

    if (mysqli_query($conn, $sql)) {
        return ['success' => true, 'message' => 'Problema creado correctamente'];
    } else {
        return ['success' => false, 'message' => 'Error al registrar el problema: ' . mysqli_error($conn)];
    }
}




function obtenerProblemas($data, $conn)
{
    $usuario_id = intval($data['usuario_id']);
    $tipo_usuario = intval($data['tipo_usuario']);

    // Determinar la condición de la consulta según el tipo de usuario
    if ($tipo_usuario === 1) {
        // Admin: todas las incidencias
        $condicion = "1";
    } elseif ($tipo_usuario === 8) {
        // Técnico: incidencias asignadas a él
        $condicion = "p.id_tecnico = $usuario_id";
    } 

    $sql = "SELECT 
            p.id,
            p.incidencia_id, 
            p.id_equipo, 
            p.estado,
            p.motivoProblema,
            p.solucionProblema,
            p.fecha_inicioProblema, 
            p.fecha_solucionProblema,
            us.correo AS usuario_creador,
            usu.correo AS tecnico_problemas,
            u.nombre AS ubicacion,
            l.modelo,
            a.nombre_equipo AS area
        FROM problemas_registrados p
        LEFT JOIN lista_laptop l ON p.id_equipo = l.id
        LEFT JOIN ubicaciones u ON l.ubicacion_id = u.id
        LEFT JOIN area a ON l.area_id = a.id
        LEFT JOIN usuarios us ON p.usuario_creador = us.id
        LEFT JOIN usuarios usu ON p.id_tecnico = usu.id
        WHERE $condicion
        ORDER BY p.fecha_inicioProblema DESC";

    $result = mysqli_query($conn, $sql);

    if ($result) {
        $problemas = [];
        while ($row = mysqli_fetch_assoc($result)) {
            $problemas[] = $row;
        }
        return ['success' => true, 'problemas' => $problemas];
    } else {
        return ['success' => false, 'message' => 'Error al obtener problemas: ' . mysqli_error($conn)];
    }
}

function aceptarProblema($data, $conn)
{
    $id = intval($data['id']);
    $tecnico_id = intval($data['tecnico']);
    $estado = mysqli_real_escape_string($conn, $data['estado']);

    if($estado === "Rechazado")
    {
        $sql = "UPDATE problemas_registrados 
                SET   
                    estado = '$estado' 
                WHERE id = $id";       
    }
    else
    {
        $sql = "UPDATE problemas_registrados 
                SET  
                    id_tecnico = $tecnico_id, 
                    estado = '$estado' 
                WHERE id = $id";
    }



    if (mysqli_query($conn, $sql)) {
        return ['success' => true, 'message' => 'Problema asignado correctamente'];
    } else {
        return ['success' => false, 'message' => 'Error al aceptar la incidencia: ' . mysqli_error($conn)];
    }    
}


function finalizarProblema($data, $conn)
{
    $id = intval($data['problemaID']);
    $estado = mysqli_real_escape_string($conn, $data['estado']);
    $solucion = mysqli_real_escape_string($conn, $data['solucion']);

    $sql = "UPDATE problemas_registrados 
            SET   
                estado = '$estado',
                solucionProblema = '$solucion',
                fecha_solucionProblema = NOW() 
            WHERE id = $id";       



    if (mysqli_query($conn, $sql)) {
        return ['success' => true, 'message' => 'Problema finalizado correctamente'];
    } else {
        return ['success' => false, 'message' => 'Error al finalizar el problema: ' . mysqli_error($conn)];
    }    
}

function obtenerMonitorUsuario($conn)
{
    $sql = $conn->query("SELECT 
                            l.id,
                            l.marca, 
                            l.modelo, 
                            e.estado, 
                            a.nombre_equipo AS area, 
                            u.nombre AS ubicacion 
                         FROM lista_monitores l
                         INNER JOIN estados_monitor e ON l.estado = e.id
                         INNER JOIN area a ON l.area_asignada = a.id
                         INNER JOIN ubicaciones u ON l.ubicacion_fisica = u.id");

    $monitores = [];
    if ($sql && $sql->num_rows > 0) {
        while ($result = $sql->fetch_assoc()) {
            $monitores[] = $result;
        }
    }
    error_log(print_r($monitores, true)); // Guarda en error_log del servidor

    return $monitores;
}

function finalizarIncAdmin($data, $conn)
{
    $id = intval($data['id']);
    $equipo_id = intval($data['equipo_id']);

    // Iniciar transacción
    mysqli_begin_transaction($conn);
    try {
        $sql1 = "UPDATE incidencias 
                SET   
                    estado = 'Aceptada',
                    fecha_resolucion = NOW()
                WHERE id = $id";   
        if (!mysqli_query($conn, $sql1)) {
            throw new Exception("Error al cerrar la incidencia: " . mysqli_error($conn));
        }  
        
        $sql2 = "UPDATE lista_laptop 
                SET   
                    estado_id = 1
                WHERE id = $equipo_id"; 
        if (!mysqli_query($conn, $sql2)) {
            throw new Exception("Error al registrar calificación: " . mysqli_error($conn));
        }

        // Confirmar cambios
        mysqli_commit($conn);
        return ['success' => true, 'message' => 'Incidencia cerrada y calificación registrada correctamente'];

    } catch (Exception $e) {
            // Revertir si algo falla
            mysqli_rollback($conn);
            return ['success' => false, 'message' => $e->getMessage()];
        }


}

function obtenerCatalogo($conn)
{
    $query = "SELECT * FROM catalogo_servicios";
    $result = mysqli_query($conn, $query);

    $servicios = [];

    if ($result && mysqli_num_rows($result) > 0) {
        while ($fila = mysqli_fetch_assoc($result)) {
            $servicios[] = $fila;
        }
        return ['success' => true, 'servicios' => $servicios];
    } else {
        return ['success' => false, 'message' => "Error al obtener servicios: " . mysqli_error($conn)];
    }
}

function guardarOrdenTrabajo($data, $conn) {
    $incidencia_id = intval($data['incidencia_id']);
    $diagnostico = mysqli_real_escape_string($conn, $data['diagnostico']);
    $solucion = mysqli_real_escape_string($conn, $data['solucion']);
    $tiempo_total = intval($data['tiempo_total']);
    $servicios = $data['servicios']; // array de IDs
    $tecnico_id = intval($data['tecnico']);


    mysqli_begin_transaction($conn);

    try {
        // 1. Insertar orden
        $queryOrden = "INSERT INTO ordenes_trabajo (incidencia_id, diagnostico, solucion, tiempo_total, tecnico_id)
                       VALUES ($incidencia_id, '$diagnostico', '$solucion', $tiempo_total, $tecnico_id)";
        if (!mysqli_query($conn, $queryOrden)) {
            throw new Exception("Error al guardar la orden: " . mysqli_error($conn));
        }

        $orden_id = mysqli_insert_id($conn);

        // 2. Insertar servicios
        foreach ($servicios as $id_servicio) {
            $id_servicio = intval($id_servicio);
            $queryServicio = "INSERT INTO ordenes_servicios (orden_id, servicio_id)
                              VALUES ($orden_id, $id_servicio)";
            if (!mysqli_query($conn, $queryServicio)) {
                throw new Exception("Error al guardar los servicios: " . mysqli_error($conn));
            }
        }

        // 3. Opcional: actualizar incidencia a 'En proceso' o mantener según tu flujo
        $updateIncidencia = "UPDATE incidencias SET estado = 'En proceso' WHERE id = $incidencia_id";
        mysqli_query($conn, $updateIncidencia);

        $horaDeAtencion = "UPDATE incidencias SET fecha_resolucion = NOW()";
        mysqli_query($conn, $horaDeAtencion);

        mysqli_commit($conn);
        return ['success' => true];

    } catch (Exception $e) {
        mysqli_rollback($conn);
        return ['success' => false, 'message' => $e->getMessage()];
    }
}


function obtenerOrdenTrabajo($data, $conn) {
    $incidencia_id = intval($data['incidencia_id']);
    
    // Obtener datos de la orden
    $queryOrden = "SELECT * FROM ordenes_trabajo WHERE incidencia_id = $incidencia_id";
    $resOrden = mysqli_query($conn, $queryOrden);

    if (!$resOrden || mysqli_num_rows($resOrden) == 0) {
        return ['success' => false, 'message' => 'No se encontró la orden para esta incidencia.'];
    }

    $orden = mysqli_fetch_assoc($resOrden);
    $orden_id = intval($orden['id']);

    // Obtener servicios
    $queryServicios = "SELECT cs.nombre_servicio, cs.tiempo_estimado 
                       FROM ordenes_servicios os 
                       JOIN catalogo_servicios cs ON os.servicio_id = cs.id 
                       WHERE os.orden_id = $orden_id";
    $resServicios = mysqli_query($conn, $queryServicios);
    $servicios = [];
    while ($row = mysqli_fetch_assoc($resServicios)) {
        $servicios[] = $row;
    }

    // Obtener cambios (si hay)
   /* $queryCambios = "SELECT * FROM solicitudes_cambio WHERE orden_id = $orden_id";
    $resCambios = mysqli_query($conn, $queryCambios);
    $cambios = [];
    while ($row = mysqli_fetch_assoc($resCambios)) {
        $cambios[] = $row;
    }*/

    return [
        'success' => true,
        'orden' => $orden,
        'servicios' => $servicios
        //'cambios' => $cambios
    ];
}
?>