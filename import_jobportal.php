<?php
$mysqli = new mysqli("127.0.0.1", "root", "", "digitefa_job_portal", 3306);
if ($mysqli->connect_error) {
    die("Connection failed: " . $mysqli->connect_error);
}

// Ensure the databases exist natively first, though check_db should have done it
$mysqli->query("CREATE DATABASE IF NOT EXISTS digitefa_job_portal");

$sql_file = __DIR__ . "/sample-db-job-portal.sql";
if (!file_exists($sql_file)) {
    die("sample-db-job-portal.sql not found\n");
}

echo "Importing sample-db-job-portal.sql into digitefa_job_portal...\n";
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
