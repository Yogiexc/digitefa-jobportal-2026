<?php
$mysqli = new mysqli("127.0.0.1", "root", "", "", 3306);
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
