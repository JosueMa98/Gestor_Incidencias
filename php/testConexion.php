<?php
$host = "db";
$user = "root";
$password = "";
$dbname = "gestorincidencias";

$intentos = 5;
while ($intentos > 0) {
    $conn = new mysqli($host, $user, $password, $dbname);
    if ($conn->connect_error) {
        echo "Reintentando conexión...<br>";
        $intentos--;
        sleep(2); // espera 2 segundos
    } else {
        break;
    }
}

if ($conn->connect_error) {
    die("❌ Error de conexión: " . $conn->connect_error);
}

echo "✅ Conexión exitosa a MySQL desde Docker";
?>
