<?php
$mysqli = new mysqli("127.0.0.1", "root", "", "", 3306);
if ($mysqli->connect_error) {
    die("Connection failed: " . $mysqli->connect_error);
}
echo "Connected successfully to MySQL.\n";

if ($mysqli->query("CREATE DATABASE IF NOT EXISTS digitefa_job_portal") === TRUE) {
    echo "Database 'digitefa_job_portal' created successfully.\n";
} else {
    echo "Error creating database digitefa_job_portal: " . $mysqli->error . "\n";
}

if ($mysqli->query("CREATE DATABASE IF NOT EXISTS ta_lms") === TRUE) {
    echo "Database 'ta_lms' created successfully.\n";
} else {
    echo "Error creating database ta_lms: " . $mysqli->error . "\n";
}

$mysqli->close();
?>