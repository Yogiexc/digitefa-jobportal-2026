<?php
$host = "mysql-3db73ab0-yogiexsaputra-9c10.e.aivencloud.com";
$port = 20947;
$user = "avnadmin";
$pass = "AVNS_IKcFSTNXjgOsWCQaETN";
$db = "defaultdb";

$mysqli = new mysqli($host, $user, $pass, $db, $port);
if ($mysqli->connect_error) {
    die("Connection failed: " . $mysqli->connect_error);
}

$sql_file = __DIR__ . "/digitefa_job_portal.sql";
if (!file_exists($sql_file)) {
    die("SQL file not found\n");
}

echo "Importing $sql_file into Aiven DB...\n";
$query = file_get_contents($sql_file);

if ($mysqli->multi_query($query)) {
    $success = 1;
    do {
        if ($result = $mysqli->store_result()) {
            $result->free();
        }
        $success++;
    } while (@$mysqli->next_result());
    echo "Successfully imported SQL dump. Queries executed: " . $success . "\n";
} else {
    echo "Error executing script: " . $mysqli->error . "\n";
}

$mysqli->close();
?>
