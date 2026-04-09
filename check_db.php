<?php
$mysqli = new mysqli("localhost", "root", "root", "", 3306);
if ($mysqli->connect_error) {
    die("Connection failed: " . $mysqli->connect_error);
}
echo "Connected successfully to MySQL.\n";

$result = $mysqli->query("SHOW DATABASES");
echo "Databases:\n";
while ($row = $result->fetch_row()) {
    echo "- " . $row[0] . "\n";
}
$mysqli->close();
?>
