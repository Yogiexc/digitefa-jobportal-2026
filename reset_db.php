<?php
$mysqli = new mysqli("127.0.0.1", "root", "", "", 3306);
if ($mysqli->connect_error) {
    die("Connection failed: " . $mysqli->connect_error);
}

if ($mysqli->query("DROP DATABASE IF EXISTS digitefa_job_portal") === TRUE) {
    echo "Database 'digitefa_job_portal' dropped.\n";
}
if ($mysqli->query("CREATE DATABASE digitefa_job_portal") === TRUE) {
    echo "Database 'digitefa_job_portal' created.\n";
}

$mysqli->close();
?>