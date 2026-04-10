<?php
$mysqli = new mysqli("127.0.0.1", "root", "", "digitefa_job_portal", 3306);
if ($mysqli->connect_error) {
    die("Connection failed: " . $mysqli->connect_error);
}
$result = $mysqli->query("SHOW TABLES");
if ($result->num_rows > 0) {
    echo "Tables in digitefa_job_portal:\n";
    while ($row = $result->fetch_row()) {
        echo "- " . $row[0] . "\n";
    }
} else {
    echo "Database digitefa_job_portal is EMPTY! No tables found.\n";
}
$mysqli->close();
?>
