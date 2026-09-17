<?php
$mysqli = new mysqli("127.0.0.1", "root", "", "ta_lms", 3306);
if ($mysqli->connect_error) {
    die("Connection failed: " . $mysqli->connect_error);
}

$sql_file = __DIR__ . "/ta-lms.sql";
if (!file_exists($sql_file)) {
    die("ta-lms.sql not found\n");
}

echo "Importing ta-lms.sql...\n";
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