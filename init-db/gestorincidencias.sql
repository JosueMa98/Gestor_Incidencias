-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 21-06-2025 a las 07:26:10
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.0.30
USE gestorincidencias;

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

SET NAMES utf8mb4;
SET CHARACTER SET utf8mb4;

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `gestorincidencias`
--

-- --------------------------------------------------------

--



-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `area`
--

CREATE TABLE `area` (
  `id` int(11) NOT NULL,
  `nombre_equipo` varchar(100) NOT NULL,
  `ubicacion_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `area`
--

INSERT INTO `area` (`id`, `nombre_equipo`, `ubicacion_id`) VALUES
(1, 'Coordinación de Cobranza STAF', 1),
(2, 'Coordinación de Gestiones de Tiendas', 2),
(3, 'Coordinación de Servicios Financieros', 3),
(4, 'Inventario Comercial', 4),
(5, 'Operaciones', 5);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `calificaciones`
--

CREATE TABLE `calificaciones` (
  `id` int(11) NOT NULL,
  `incidencia_id` int(11) NOT NULL,
  `usuario_id` int(11) NOT NULL,
  `tecnico_id` int(11) NOT NULL,
  `calificacion` tinyint(4) DEFAULT NULL CHECK (`calificacion` between 1 and 5),
  `comentario` text DEFAULT NULL,
  `fecha` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `calificaciones`
--

INSERT INTO `calificaciones` (`id`, `incidencia_id`, `usuario_id`, `tecnico_id`, `calificacion`, `comentario`, `fecha`) VALUES
(9, 25, 10, 12, 5, NULL, '2025-05-25 00:10:16'),
(10, 32, 14, 12, 5, NULL, '2025-05-25 22:52:11'),
(11, 35, 15, 11, 5, NULL, '2025-05-26 07:34:34');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `catalogo_servicios`
--

CREATE TABLE `catalogo_servicios` (
  `id` int(11) NOT NULL,
  `nombre_servicio` varchar(100) NOT NULL,
  `descripcion` text DEFAULT NULL,
  `tiempo_estimado` int(11) DEFAULT NULL,
  `categoria` varchar(50) DEFAULT NULL,
  `prioridad` enum('Crítica','Alta','Media','Baja') DEFAULT 'Media'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `catalogo_servicios`
--

INSERT INTO `catalogo_servicios` (`id`, `nombre_servicio`, `descripcion`, `tiempo_estimado`, `categoria`, `prioridad`) VALUES
(1, 'Diagnóstico general', 'Evaluación inicial del equipo para identificar problemas de hardware o software.', 30, 'General', 'Media'),
(2, 'Reemplazo de disco duro', 'Sustitución del disco duro dañado por uno nuevo, incluye clonación si aplica.', 90, 'Hardware', 'Alta'),
(3, 'Instalación de sistema operativo', 'Formateo y configuración completa del sistema operativo requerido.', 60, 'Software', 'Alta'),
(4, 'Limpieza interna de equipo', 'Limpieza física interna para eliminar polvo y mejorar ventilación.', 45, 'Mantenimiento', 'Baja'),
(5, 'Reemplazo de memoria RAM', 'Cambio o ampliación de la memoria RAM del equipo.', 30, 'Hardware', 'Media'),
(6, 'Actualización de controladores', 'Instalación o actualización de drivers para asegurar compatibilidad.', 20, 'Software', 'Baja'),
(7, 'Configuración de red', 'Configuración de parámetros de red y conexión a servicios internos.', 25, 'Redes', 'Media'),
(8, 'Cambio de teclado', 'Sustitución de teclado físico por uno nuevo compatible.', 40, 'Hardware', 'Media'),
(9, 'Revisión de fuente de poder', 'Verificación y prueba del estado de la fuente de poder.', 35, 'Hardware', 'Alta'),
(10, 'Eliminación de virus y malware', 'Escaneo completo y eliminación de software malicioso.', 50, 'Seguridad', 'Alta');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `estados_laptop`
--

CREATE TABLE `estados_laptop` (
  `id` int(11) NOT NULL,
  `estado` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `estados_laptop`
--

INSERT INTO `estados_laptop` (`id`, `estado`) VALUES
(1, 'Disponible'),
(2, 'En reparación');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `estados_monitor`
--

CREATE TABLE `estados_monitor` (
  `id` int(11) NOT NULL,
  `estado` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `estados_monitor`
--

INSERT INTO `estados_monitor` (`id`, `estado`) VALUES
(1, 'Disponible'),
(2, 'En reparación');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `incidencias`
--

CREATE TABLE `incidencias` (
  `id` int(11) NOT NULL,
  `titulo` varchar(255) NOT NULL,
  `descripcion` text NOT NULL,
  `equipo_id` varchar(20) NOT NULL,
  `prioridad` enum('Crítica','Alta','Media','Baja') DEFAULT NULL,
  `estado` enum('Pendiente','Asignada','Rechazada','Resuelta','Aceptada','Reabierta','En proceso') DEFAULT 'Pendiente',
  `usuario_creador` int(11) NOT NULL,
  `tecnico_asignado` int(11) DEFAULT NULL,
  `fecha_creacion` timestamp NOT NULL DEFAULT current_timestamp(),
  `fecha_resolucion` timestamp NULL DEFAULT NULL,
  `diagnostico` varchar(255) DEFAULT NULL,
  `Fecha_de_asignacion` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `incidencias`
--

INSERT INTO `incidencias` (`id`, `titulo`, `descripcion`, `equipo_id`, `prioridad`, `estado`, `usuario_creador`, `tecnico_asignado`, `fecha_creacion`, `fecha_resolucion`, `diagnostico`, `Fecha_de_asignacion`) VALUES
(24, 'calis tiempo', 'vere el tiempo\n', '19', 'Crítica', 'Asignada', 10, 11, '2025-05-24 23:31:03', '2025-05-24 23:32:46', 'ya hice diagnostico, detene el tiempo', '2025-05-24 16:31:52'),
(25, 'Pantallazo azul', 'No me deja encender la lap', '14', 'Media', 'Aceptada', 10, 12, '2025-05-24 23:53:56', '2025-05-25 00:00:35', 'no sirve la bateria, se calcino', '2025-05-24 16:54:36'),
(26, 'no enciende', 'desde ayer no enciende', '1', NULL, 'Aceptada', 9, NULL, '2025-05-25 00:24:08', NULL, NULL, NULL),
(27, 'azul', 'se ve la pantalla azul', '10', 'Media', 'Aceptada', 9, 12, '2025-05-25 00:24:28', '2025-05-25 23:36:41', 'me marca que ya esta en problemas', '2025-05-25 16:31:50'),
(28, 'no tengo internet', 'no encuentra señales wifi', '15', 'Crítica', 'Asignada', 9, 12, '2025-05-25 00:25:01', '2025-05-25 00:33:18', 'la antena no funciona', '2025-05-24 17:32:37'),
(29, 'lento', 'la lap esta muy lenta', '15', 'Crítica', 'Asignada', 9, 12, '2025-05-25 03:17:26', '2025-05-25 03:21:48', 'trae un virus', '2025-05-24 20:19:19'),
(31, 'mouse pad', 'no funciona el mouse pad de mi lap', '23', 'Baja', 'Resuelta', 16, 11, '2025-05-25 22:29:54', '2025-05-26 01:36:10', 'mouse pad defectuso', '2025-05-25 18:34:46'),
(32, 'se calienta', 'despues de 1 hora de uso se calienta demasiado la lap', '21', 'Baja', 'Aceptada', 14, 12, '2025-05-25 22:37:56', '2025-05-25 22:51:15', 'se hizo limpieza de disco C', '2025-05-25 15:50:30'),
(33, 'prueba aceptar admin', 'lo mismo', '21', NULL, 'Pendiente', 14, NULL, '2025-05-25 22:53:03', NULL, NULL, NULL),
(34, 'wifi', 'no tengo señal wifi', '15', 'Alta', 'Aceptada', 9, 12, '2025-05-26 01:37:13', '2025-05-26 01:41:27', 'la antena wifi esta dañada', '2025-05-25 18:37:35'),
(35, 'cable', 'tengo falso contacto con el cable del cargador', '22', 'Media', 'Aceptada', 15, 11, '2025-05-26 07:31:08', '2025-05-26 07:32:24', 'el cable esta roto ', '2025-05-26 00:31:42'),
(36, 'señal wifi', 'no detecta señales', '19', 'Media', 'Asignada', 10, 11, '2025-05-26 18:28:46', '2025-05-26 18:33:09', 'tenia mojada la antena', '2025-05-26 11:29:42'),
(37, 'antena ', 'antena dañada', '28', 'Media', 'En proceso', 16, 11, '2025-06-01 22:59:49', NULL, NULL, '2025-06-01 16:00:24'),
(38, 'lenta', 'cada que abro word se pone muy lenta\n', '24', 'Media', 'Asignada', 10, 11, '2025-06-11 02:02:40', NULL, NULL, '2025-06-10 19:03:45');

-- --------------------------------------------------------

--
-- Estructura Stand-in para la vista `incidencias registradas`
-- (Véase abajo para la vista actual)
--
CREATE TABLE `incidencias registradas` (
`id` int(11)
,`titulo` varchar(255)
,`descripcion` text
,`equipo_id` varchar(20)
,`prioridad` enum('Crítica','Alta','Media','Baja')
,`estado` enum('Pendiente','Asignada','Rechazada','Resuelta','Aceptada','Reabierta','En proceso')
,`usuario_creador` int(11)
,`tecnico_asignado` int(11)
,`fecha_creacion` timestamp
,`fecha_resolucion` timestamp
);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `lista_laptop`
--

CREATE TABLE `lista_laptop` (
  `id` int(11) NOT NULL,
  `modelo` varchar(100) DEFAULT NULL,
  `tipo_memoria` varchar(50) DEFAULT NULL,
  `capacidad_memoria` varchar(50) DEFAULT NULL,
  `procesador` varchar(100) DEFAULT NULL,
  `ram` varchar(50) DEFAULT NULL,
  `sistema_operativo` varchar(100) DEFAULT NULL,
  `tipo_fuente` varchar(50) DEFAULT NULL,
  `estado_id` int(11) DEFAULT NULL,
  `fecha_adquisicion` date DEFAULT NULL,
  `garantia` tinyint(1) DEFAULT NULL,
  `area_id` int(11) DEFAULT NULL,
  `software_instaladas` varchar(100) DEFAULT NULL,
  `ubicacion_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `lista_laptop`
--

INSERT INTO `lista_laptop` (`id`, `modelo`, `tipo_memoria`, `capacidad_memoria`, `procesador`, `ram`, `sistema_operativo`, `tipo_fuente`, `estado_id`, `fecha_adquisicion`, `garantia`, `area_id`, `software_instaladas`, `ubicacion_id`) VALUES
(1, 'ThinkPad L14', 'SSD', '512 GB', 'Intel i5', '16 GB', 'Windows 11', 'Original Lenovo 65W', 1, '2025-01-03', 1, 1, NULL, 1),
(4, 'ThinkPad L14', 'SSD', '512 GB', 'Intel i7', '16 GB', 'Windows 11', 'Original Lenovo 65W', 1, '2025-01-03', 1, 1, NULL, 1),
(5, 'ThinkPad L14', 'HDD', '512 GB', 'Intel i5', '16 GB', 'Windows 11', 'Original Lenovo 65W', 1, '2025-04-08', 1, 1, NULL, 1),
(6, 'ThinkPad L14', 'HDD', '512 GB', 'Intel i5', '16 GB', 'Windows 11', 'Original Lenovo 90W, Original Lenovo 65W', 1, '2025-04-09', 1, 1, NULL, 1),
(7, 'ThinkPad L14', 'SSD', '512 GB', 'Intel i5', '16 GB', 'Windows 11', 'Original Lenovo 65W', 1, '2025-04-07', 1, 1, NULL, 1),
(8, 'ThinkPad L14', 'SSD', '1024 GB', 'Intel i5', '16 GB', 'Windows 11', 'Original Lenovo 65W', 1, '2025-04-07', 1, 1, NULL, 1),
(9, 'ThinkPad L14', 'SSD', '1024 GB', 'Intel i5', '32 GB', 'Windows 11', 'Original Lenovo 90W, Original Lenovo 65W', 1, '2025-04-18', 1, 1, NULL, 1),
(10, 'Lenovo ThinkPad E14', 'SSD', '512 GB', 'Intel i5', '16 GB', 'Windows 11', '65W', 1, '2023-08-10', 24, 1, 'Office, Chrome', 1),
(14, 'Asus ExpertBook', 'HDD', '1 TB', 'Intel i3', '4 GB', 'Windows 10', '45W', 1, '2023-03-18', 24, 5, 'Office, Chrome', 5),
(15, 'HP ProBook 450', 'SSD', '256 GB', 'Intel i5', '8 GB', 'Windows 11', '65W', 1, '2022-05-12', 12, 1, 'Office, Notepad++', 1),
(19, 'Asus VivoBook', 'SSD', '256 GB', 'AMD Ryzen 7', '8 GB', 'Windows 11', '65W', 2, '2023-10-05', 24, 5, 'Office, NodeJS', 5),
(20, 'ThinkPad X1 Carbon', 'SSD', '1 TB', 'Intel i9', '16 GB', 'Windows 11', 'Original Lenovo 90W', 1, '2025-05-28', 1, 2, 'Office 365, Microsoft Teams, Google Chrome', 2),
(21, 'ThinkPad X1 Carbon', 'NVMe', '256 GB', 'AMD Ryzen 5', '32 GB', 'Windows 10', 'Original Lenovo 65W', 2, '2025-05-15', 1, 2, 'Microsoft Teams, Zoom, Google Chrome', 2),
(22, 'ThinkPad X1 Carbon', 'NVMe', '512 GB', 'Intel i9', '32 GB', 'Windows 10', 'Original Lenovo 90W', 1, '2025-05-16', 1, 3, 'Visual Studio Code, Notepad++, AutoCAD', 3),
(23, 'ThinkPad E15', 'SSD', '512 GB', 'Intel i9', '16 GB', 'Windows 11', 'Original Lenovo 65W', 2, '2025-05-10', 1, 4, 'Office 365, Microsoft Teams, Zoom, Google Chrome', 4),
(24, 'ThinkPad P14s', 'HDD', '2 TB', 'AMD Ryzen 5', '64 GB', 'Windows 11', 'Original Lenovo 90W', 2, '2025-05-02', 1, 5, 'Zoom, Google Chrome, AutoCAD, Photoshop', 5),
(25, 'ThinkPad P14s', 'NVMe', '512 GB', 'Intel i5', '16 GB', 'Windows 11', 'Original Lenovo 90W', 1, '2025-05-29', 1, 5, 'Microsoft Teams', 5),
(26, 'ThinkPad X1 Carbon', 'HDD', '512 GB', 'Intel i5', '32 GB', 'Windows 11', 'Original Lenovo 65W', 1, '2025-05-31', 1, 5, 'Google Chrome', 5),
(27, 'ThinkPad X1 Carbon', 'HDD', '512 GB', 'Intel i9', '16 GB', 'Windows 10', 'Original Lenovo 90W', 1, '2025-05-06', 1, 5, 'Google Chrome', 5),
(28, 'ThinkPad E15', 'HDD', '256 GB', 'AMD Ryzen 5', '8 GB', 'Windows 11', 'Original Lenovo 65W', 2, '2025-05-22', 1, 4, 'Office 365', 4),
(29, 'ThinkPad E15', 'HDD', '512 GB', 'Intel i7', '32 GB', 'Windows 10', 'Original Lenovo 90W', 1, '2025-05-29', 1, 3, 'Office 365, AutoCAD, Photoshop', 3);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `lista_monitores`
--

CREATE TABLE `lista_monitores` (
  `id` int(11) NOT NULL,
  `marca` varchar(50) NOT NULL,
  `modelo` varchar(100) NOT NULL,
  `tamano_pantalla` varchar(20) DEFAULT NULL,
  `resolucion` varchar(50) DEFAULT NULL,
  `tipo_panel` varchar(50) DEFAULT NULL,
  `frecuencia_actualizacion` varchar(20) DEFAULT NULL,
  `puertos_disponibles` varchar(200) DEFAULT NULL,
  `tipo_conexion` varchar(50) DEFAULT NULL,
  `fecha_adquisicion` date DEFAULT NULL,
  `garantia` tinyint(1) DEFAULT NULL,
  `area_asignada` int(11) DEFAULT NULL,
  `estado` int(11) DEFAULT NULL,
  `ubicacion_fisica` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `lista_monitores`
--

INSERT INTO `lista_monitores` (`id`, `marca`, `modelo`, `tamano_pantalla`, `resolucion`, `tipo_panel`, `frecuencia_actualizacion`, `puertos_disponibles`, `tipo_conexion`, `fecha_adquisicion`, `garantia`, `area_asignada`, `estado`, `ubicacion_fisica`) VALUES
(1, 'Lenovo ThinkVision', '63E2KAC6LA', '24 pulgadas', 'Full HD (1920x1080)', 'VA', '75Hz', 'HDMI,DisplayPort,VGA', 'Cable', '2025-05-29', 1, 3, 1, 3),
(2, 'Lenovo ThinkVision', 'T24i-30', '23.8 pulgadas', 'Full HD (1920x1080)', 'VA', '75Hz', 'VGA,USB-C', 'Docking Station', '2025-05-30', 1, 4, 1, 4),
(3, 'Lenovo ThinkVision', 'T24i-30', '23.8 pulgadas', 'Quad HD (2560x1440)', 'VA', '75Hz', 'HDMI', 'Cable', '2025-05-30', 1, 1, 1, 1),
(4, 'HP', 'T24i-30', '23.8 pulgadas', 'Quad HD (2560x1440)', 'VA', '60Hz', 'USB-C', 'Docking Station', '2025-05-30', 1, 2, 1, 2),
(5, 'ASUS', 'T27p-10', '27 pulgadas', '4K UHD (3840x2160)', 'OLED', '120Hz', 'HDMI,VGA,USB-C', 'Docking Station', '2025-05-25', 1, 5, 1, 5),
(6, 'HP', '63E2KAC6LA', '21 pulgadas', 'Quad HD (2560x1440)', 'IPS', '75Hz', 'HDMI,VGA,USB-C', 'Docking Station', '2025-05-15', 1, 4, 1, 4),
(7, 'Lenovo ThinkVision', 'T24i-30', '24 pulgadas', 'Full HD (1920x1080)', 'IPS', '75Hz', 'DisplayPort,USB-C', 'Cable', '2025-05-16', 1, 5, 1, 5);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `ordenes_servicios`
--

CREATE TABLE `ordenes_servicios` (
  `id` int(11) NOT NULL,
  `orden_id` int(11) NOT NULL,
  `servicio_id` int(11) NOT NULL,
  `comentario` text DEFAULT NULL,
  `tecnico_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `ordenes_servicios`
--

INSERT INTO `ordenes_servicios` (`id`, `orden_id`, `servicio_id`, `comentario`, `tecnico_id`) VALUES
(1, 2, 1, NULL, NULL),
(2, 2, 4, NULL, NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `ordenes_trabajo`
--

CREATE TABLE `ordenes_trabajo` (
  `id` int(11) NOT NULL,
  `incidencia_id` int(11) DEFAULT NULL,
  `equipo_id` int(11) DEFAULT NULL,
  `tecnico_id` int(11) DEFAULT NULL,
  `cambio_id` int(11) DEFAULT NULL,
  `diagnostico` text DEFAULT NULL,
  `solucion` text DEFAULT NULL,
  `tiempo_total` int(11) DEFAULT NULL,
  `estado` enum('Pendiente','En proceso','Finalizada') DEFAULT 'Pendiente',
  `fecha_creacion` datetime DEFAULT current_timestamp(),
  `fecha_cierre` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `ordenes_trabajo`
--

INSERT INTO `ordenes_trabajo` (`id`, `incidencia_id`, `equipo_id`, `tecnico_id`, `cambio_id`, `diagnostico`, `solucion`, `tiempo_total`, `estado`, `fecha_creacion`, `fecha_cierre`) VALUES
(2, 37, NULL, 11, NULL, 'la antena esta calcinada', 'se hara limpieza', 75, 'Pendiente', '2025-06-01 16:08:08', NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `problemas_registrados`
--

CREATE TABLE `problemas_registrados` (
  `id` int(11) NOT NULL,
  `incidencia_id` int(11) DEFAULT NULL,
  `solucionProblema` varchar(255) DEFAULT NULL,
  `motivoProblema` text DEFAULT NULL,
  `fecha_inicioProblema` datetime DEFAULT current_timestamp(),
  `fecha_solucionProblema` datetime DEFAULT NULL,
  `estado` enum('Pendiente','En Investigacion','Solucionado','Cerrado','Rechazado') DEFAULT 'Pendiente',
  `usuario_creador` int(11) NOT NULL,
  `id_equipo` int(11) NOT NULL,
  `id_tecnico` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `problemas_registrados`
--

INSERT INTO `problemas_registrados` (`id`, `incidencia_id`, `solucionProblema`, `motivoProblema`, `fecha_inicioProblema`, `fecha_solucionProblema`, `estado`, `usuario_creador`, `id_equipo`, `id_tecnico`) VALUES
(32, 24, NULL, 'No puedo hacer mas sin ese cargador', '2025-05-24 17:20:30', NULL, 'En Investigacion', 11, 19, 17),
(33, 27, 'se limpio la placa madre', 'Investiga porque van varias con pantallazo azul en esa area', '2025-05-24 17:26:35', '2025-05-25 16:35:51', 'Solucionado', 13, 10, 18),
(34, 29, NULL, 'No pude limpiar el virus de la maquina, desconozco el origen', '2025-05-24 20:25:12', NULL, 'Rechazado', 12, 15, NULL),
(35, 26, 'tenia un virus en el disco C', 'lleva 5 veces que me da pantalla azul', '2025-05-24 20:27:28', '2025-05-25 14:27:33', 'Solucionado', 13, 1, 17),
(36, 32, 'se arreglo todo', 'calis', '2025-05-25 16:30:24', '2025-05-26 00:54:05', 'Solucionado', 13, 21, 17),
(37, 31, NULL, 'el mouse pad presenta fallas hardware que desconozco', '2025-05-25 18:35:54', NULL, 'Pendiente', 11, 23, NULL),
(38, 34, 'se reemplazo la placa madre', 'no pude resolver el problema con mis herramientas', '2025-05-25 18:38:45', '2025-05-25 18:39:40', 'Solucionado', 12, 15, 18),
(39, 36, NULL, 'pinta mal y no se va poder', '2025-05-26 11:48:43', NULL, 'Rechazado', 11, 19, NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `roles`
--

CREATE TABLE `roles` (
  `id` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `roles`
--

INSERT INTO `roles` (`id`, `nombre`) VALUES
(1, 'Admin'),
(5, 'Coordinador Cobranza STAF'),
(4, 'Coordinador de Gestiones de Tiendas'),
(6, 'Coordinador Servicios Financieros'),
(3, 'Gerente de Inventario Comercial'),
(2, 'Gerente de operaciones Mejora Continua'),
(7, 'Tecnico'),
(8, 'Tecnico de Problemas');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `solicitudes_cambio`
--

CREATE TABLE `solicitudes_cambio` (
  `id` int(11) NOT NULL,
  `incidencia_id` int(11) DEFAULT NULL,
  `pieza` varchar(255) DEFAULT NULL,
  `motivo` text DEFAULT NULL,
  `fecha_solicitud` datetime DEFAULT current_timestamp(),
  `estado` enum('Pendiente','Aprobada','Rechazada') DEFAULT 'Pendiente',
  `usuario_creador` int(11) NOT NULL,
  `id_equipo` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `solicitudes_cambio`
--

INSERT INTO `solicitudes_cambio` (`id`, `incidencia_id`, `pieza`, `motivo`, `fecha_solicitud`, `estado`, `usuario_creador`, `id_equipo`) VALUES
(17, 25, 'bateria Asus ExpertBook 100 w', 'no tiene reparo la que tiene aqui', '2025-05-24 17:01:30', 'Aprobada', 12, 14),
(18, 25, 'puerto de carga Asus', 'tambien necesitare uno nuevo', '2025-05-24 17:02:59', 'Rechazada', 12, 14),
(19, 24, 'Cargador Asus', 'Se quemo el que traia', '2025-05-24 17:18:48', 'Rechazada', 11, 19),
(20, 29, 'usb', 'mi usb se daño', '2025-05-24 20:23:51', 'Aprobada', 12, 15),
(21, 24, 'otra pieza', 'no la tengo', '2025-05-26 00:20:57', 'Rechazada', 11, 19),
(22, 35, 'cable para cargador Thinpad Carbono', 'el anterior esta roto y no sirve', '2025-05-26 00:32:55', 'Aprobada', 11, 22),
(23, 36, 'acces point', 'necesita uno nuevo', '2025-05-26 11:34:47', 'Aprobada', 11, 19);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `ubicaciones`
--

CREATE TABLE `ubicaciones` (
  `id` int(11) NOT NULL,
  `nombre` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `ubicaciones`
--

INSERT INTO `ubicaciones` (`id`, `nombre`) VALUES
(1, 'Pasillo 1'),
(2, 'Pasillo 3'),
(3, 'Pasillo 5'),
(4, 'Pasillo 7'),
(5, 'Pasillo 9');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `id` int(11) NOT NULL,
  `correo` varchar(150) NOT NULL,
  `contrasena` varchar(255) NOT NULL,
  `rol_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`id`, `correo`, `contrasena`, `rol_id`) VALUES
(1, 'l20171583@culiacan.tecnm.mx', '$2y$10$U2.beR5M.anU59SPcRla5OMHSBxk4xtg9mR8Ro0pxavQrzllueh2a', 1),
(9, 'coorCobranza@gmail.com', '$2y$10$p9U4f16Rp2iuJQxK8lXW2e633QKeM.0/ndGjlFHEJYRWtP1IVIBOi', 5),
(10, 'operaciones@gmail.com', '$2y$10$jTe7gzL9broW0RVGYQ.bv.DmZEtk6MTralMi947JP3N6rGnF60hvm', 2),
(11, 'tecnico1@gmail.com', '$2y$10$0BB0M7RRPnoBeOIN8duPtuymmeZiRrbfiupTsRSfh.aDxd.y9fkBu', 7),
(12, 'tecnico2@gmail.com', '$2y$10$1tKn6eqj0yOx60oEuAnuHeBiBqqYFC2sL1CecLBv2V3u7KtXnhPH6', 7),
(13, 'admin@gmail.com', '$2y$10$/hXlgKEbstSd.0TY3f5yf..tIzigoqTv/V3IswzB5SkctIeX/5YRi', 1),
(14, 'coorTiendas@gmail.com', '$2y$10$4JbNeYMP6wvKrubflaUlUuQftxurXdwUQ6Cro1kSGdhRn5MHspl.6', 4),
(15, 'coorServFin@gmail.com', '$2y$10$SYJpb9KvKtd0gyVAx3R9A.wzTJ0BXcbJYXETigQuYhghfhByQ2/Ey', 6),
(16, 'gerInvCom@gmail.com', '$2y$10$8lPYG0Mhwf9CK68gtwA2gOVLPvH9ATeuN/5NRRiS11kbFa3KIOVTy', 3),
(17, 'Problemas1@gmail.com', '$2y$10$gvhEywP8SaWtQSKmYVoKCewNc5JZriEopu9VZEAzrZwqUvSAsB8qu', 8),
(18, 'Problemas2@gmail.com', '$2y$10$2aDz3y4sk2X9gl.ICQgafenr0.8d1HxOtvtjKOlYM2TEm/zf76Z2i', 8);

-- --------------------------------------------------------

--
-- Estructura para la vista `incidencias registradas`
--
DROP TABLE IF EXISTS `incidencias registradas`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `incidencias registradas`  AS SELECT `incidencias`.`id` AS `id`, `incidencias`.`titulo` AS `titulo`, `incidencias`.`descripcion` AS `descripcion`, `incidencias`.`equipo_id` AS `equipo_id`, `incidencias`.`prioridad` AS `prioridad`, `incidencias`.`estado` AS `estado`, `incidencias`.`usuario_creador` AS `usuario_creador`, `incidencias`.`tecnico_asignado` AS `tecnico_asignado`, `incidencias`.`fecha_creacion` AS `fecha_creacion`, `incidencias`.`fecha_resolucion` AS `fecha_resolucion` FROM `incidencias` ;

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `area`
--
ALTER TABLE `area`
  ADD PRIMARY KEY (`id`),
  ADD KEY `ubicacion_id` (`ubicacion_id`);

--
-- Indices de la tabla `calificaciones`
--
ALTER TABLE `calificaciones`
  ADD PRIMARY KEY (`id`),
  ADD KEY `incidencia_id` (`incidencia_id`),
  ADD KEY `usuario_id` (`usuario_id`),
  ADD KEY `tecnico_id` (`tecnico_id`);

--
-- Indices de la tabla `catalogo_servicios`
--
ALTER TABLE `catalogo_servicios`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `estados_laptop`
--
ALTER TABLE `estados_laptop`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `estado` (`estado`);

--
-- Indices de la tabla `estados_monitor`
--
ALTER TABLE `estados_monitor`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `incidencias`
--
ALTER TABLE `incidencias`
  ADD PRIMARY KEY (`id`),
  ADD KEY `usuario_creador` (`usuario_creador`),
  ADD KEY `tecnico_asignado` (`tecnico_asignado`);

--
-- Indices de la tabla `lista_laptop`
--
ALTER TABLE `lista_laptop`
  ADD PRIMARY KEY (`id`),
  ADD KEY `estado_id` (`estado_id`),
  ADD KEY `area_id` (`area_id`),
  ADD KEY `fk_ubicacion_laptop` (`ubicacion_id`);

--
-- Indices de la tabla `lista_monitores`
--
ALTER TABLE `lista_monitores`
  ADD PRIMARY KEY (`id`),
  ADD KEY `area_asignada` (`area_asignada`),
  ADD KEY `estado` (`estado`),
  ADD KEY `ubicacion_fisica` (`ubicacion_fisica`);

--
-- Indices de la tabla `ordenes_servicios`
--
ALTER TABLE `ordenes_servicios`
  ADD PRIMARY KEY (`id`),
  ADD KEY `tecnico_id` (`tecnico_id`),
  ADD KEY `orden_id` (`orden_id`),
  ADD KEY `servicio_id` (`servicio_id`);

--
-- Indices de la tabla `ordenes_trabajo`
--
ALTER TABLE `ordenes_trabajo`
  ADD PRIMARY KEY (`id`),
  ADD KEY `incidencia_id` (`incidencia_id`),
  ADD KEY `equipo_id` (`equipo_id`),
  ADD KEY `tecnico_id` (`tecnico_id`),
  ADD KEY `cambio_id` (`cambio_id`);

--
-- Indices de la tabla `problemas_registrados`
--
ALTER TABLE `problemas_registrados`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_incidencia_id` (`incidencia_id`),
  ADD KEY `idx_usuario_creador` (`usuario_creador`),
  ADD KEY `idx_id_equipo` (`id_equipo`),
  ADD KEY `idx_id_tecnico` (`id_tecnico`);

--
-- Indices de la tabla `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `nombre` (`nombre`);

--
-- Indices de la tabla `solicitudes_cambio`
--
ALTER TABLE `solicitudes_cambio`
  ADD PRIMARY KEY (`id`),
  ADD KEY `incidencia_id` (`incidencia_id`),
  ADD KEY `fk_usuario_creador` (`usuario_creador`),
  ADD KEY `fk_id_equipo` (`id_equipo`);

--
-- Indices de la tabla `ubicaciones`
--
ALTER TABLE `ubicaciones`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `nombre` (`nombre`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `correo` (`correo`),
  ADD KEY `rol_id` (`rol_id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `area`
--
ALTER TABLE `area`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `calificaciones`
--
ALTER TABLE `calificaciones`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT de la tabla `catalogo_servicios`
--
ALTER TABLE `catalogo_servicios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT de la tabla `estados_laptop`
--
ALTER TABLE `estados_laptop`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT de la tabla `estados_monitor`
--
ALTER TABLE `estados_monitor`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `incidencias`
--
ALTER TABLE `incidencias`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=39;

--
-- AUTO_INCREMENT de la tabla `lista_laptop`
--
ALTER TABLE `lista_laptop`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=30;

--
-- AUTO_INCREMENT de la tabla `lista_monitores`
--
ALTER TABLE `lista_monitores`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT de la tabla `ordenes_servicios`
--
ALTER TABLE `ordenes_servicios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `ordenes_trabajo`
--
ALTER TABLE `ordenes_trabajo`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `problemas_registrados`
--
ALTER TABLE `problemas_registrados`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=40;

--
-- AUTO_INCREMENT de la tabla `roles`
--
ALTER TABLE `roles`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT de la tabla `solicitudes_cambio`
--
ALTER TABLE `solicitudes_cambio`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- AUTO_INCREMENT de la tabla `ubicaciones`
--
ALTER TABLE `ubicaciones`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `area`
--
ALTER TABLE `area`
  ADD CONSTRAINT `area_ibfk_1` FOREIGN KEY (`ubicacion_id`) REFERENCES `ubicaciones` (`id`);

--
-- Filtros para la tabla `calificaciones`
--
ALTER TABLE `calificaciones`
  ADD CONSTRAINT `calificaciones_ibfk_1` FOREIGN KEY (`incidencia_id`) REFERENCES `incidencias` (`id`),
  ADD CONSTRAINT `calificaciones_ibfk_2` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`),
  ADD CONSTRAINT `calificaciones_ibfk_3` FOREIGN KEY (`tecnico_id`) REFERENCES `usuarios` (`id`);

--
-- Filtros para la tabla `incidencias`
--
ALTER TABLE `incidencias`
  ADD CONSTRAINT `incidencias_ibfk_1` FOREIGN KEY (`usuario_creador`) REFERENCES `usuarios` (`id`),
  ADD CONSTRAINT `incidencias_ibfk_2` FOREIGN KEY (`tecnico_asignado`) REFERENCES `usuarios` (`id`);

--
-- Filtros para la tabla `lista_laptop`
--
ALTER TABLE `lista_laptop`
  ADD CONSTRAINT `fk_ubicacion_laptop` FOREIGN KEY (`ubicacion_id`) REFERENCES `ubicaciones` (`id`),
  ADD CONSTRAINT `lista_laptop_ibfk_1` FOREIGN KEY (`estado_id`) REFERENCES `estados_laptop` (`id`),
  ADD CONSTRAINT `lista_laptop_ibfk_2` FOREIGN KEY (`area_id`) REFERENCES `area` (`id`);

--
-- Filtros para la tabla `lista_monitores`
--
ALTER TABLE `lista_monitores`
  ADD CONSTRAINT `lista_monitores_ibfk_1` FOREIGN KEY (`area_asignada`) REFERENCES `area` (`id`),
  ADD CONSTRAINT `lista_monitores_ibfk_2` FOREIGN KEY (`estado`) REFERENCES `estados_monitor` (`id`),
  ADD CONSTRAINT `lista_monitores_ibfk_3` FOREIGN KEY (`ubicacion_fisica`) REFERENCES `ubicaciones` (`id`);

--
-- Filtros para la tabla `ordenes_servicios`
--
ALTER TABLE `ordenes_servicios`
  ADD CONSTRAINT `ordenes_servicios_ibfk_1` FOREIGN KEY (`tecnico_id`) REFERENCES `usuarios` (`id`),
  ADD CONSTRAINT `ordenes_servicios_ibfk_2` FOREIGN KEY (`orden_id`) REFERENCES `ordenes_trabajo` (`id`),
  ADD CONSTRAINT `ordenes_servicios_ibfk_3` FOREIGN KEY (`servicio_id`) REFERENCES `catalogo_servicios` (`id`);

--
-- Filtros para la tabla `ordenes_trabajo`
--
ALTER TABLE `ordenes_trabajo`
  ADD CONSTRAINT `ordenes_trabajo_ibfk_1` FOREIGN KEY (`incidencia_id`) REFERENCES `incidencias` (`id`),
  ADD CONSTRAINT `ordenes_trabajo_ibfk_2` FOREIGN KEY (`equipo_id`) REFERENCES `lista_laptop` (`id`),
  ADD CONSTRAINT `ordenes_trabajo_ibfk_4` FOREIGN KEY (`tecnico_id`) REFERENCES `usuarios` (`id`),
  ADD CONSTRAINT `ordenes_trabajo_ibfk_5` FOREIGN KEY (`cambio_id`) REFERENCES `solicitudes_cambio` (`id`);

--
-- Filtros para la tabla `problemas_registrados`
--
ALTER TABLE `problemas_registrados`
  ADD CONSTRAINT `fk_problema_equipo` FOREIGN KEY (`id_equipo`) REFERENCES `lista_laptop` (`id`),
  ADD CONSTRAINT `fk_problema_incidencia` FOREIGN KEY (`incidencia_id`) REFERENCES `incidencias` (`id`),
  ADD CONSTRAINT `fk_problema_tecnico` FOREIGN KEY (`id_tecnico`) REFERENCES `usuarios` (`id`),
  ADD CONSTRAINT `fk_problema_usuario` FOREIGN KEY (`usuario_creador`) REFERENCES `usuarios` (`id`);

--
-- Filtros para la tabla `solicitudes_cambio`
--
ALTER TABLE `solicitudes_cambio`
  ADD CONSTRAINT `fk_id_equipo` FOREIGN KEY (`id_equipo`) REFERENCES `lista_laptop` (`id`),
  ADD CONSTRAINT `fk_usuario_creador` FOREIGN KEY (`usuario_creador`) REFERENCES `usuarios` (`id`),
  ADD CONSTRAINT `solicitudes_cambio_ibfk_1` FOREIGN KEY (`incidencia_id`) REFERENCES `incidencias` (`id`);

--
-- Filtros para la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD CONSTRAINT `usuarios_ibfk_1` FOREIGN KEY (`rol_id`) REFERENCES `roles` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
