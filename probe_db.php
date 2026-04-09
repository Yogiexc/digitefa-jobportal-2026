<?php
$hosts = ['127.0.0.1', 'localhost'];
$ports = [3306, 3307];
$users = ['root'];
$passwords = ['', 'root', 'admin', 'password', '12345678'];

echo "--- DATABASE CREDENTIAL PROBER (PDO) ---\n";

foreach ($hosts as $host) {
    foreach ($ports as $port) {
        foreach ($users as $user) {
            foreach ($passwords as $pass) {
                echo "Testing $user@$host:$port (pass: '$pass')... ";
                try {
                    $dsn = "mysql:host=$host;port=$port";
                    $options = [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION, PDO::ATTR_TIMEOUT => 2];
                    $pdo = new PDO($dsn, $user, $pass, $options);
                    echo "SUCCESS!\n";
                    echo "\nFOUND VALID CREDENTIALS:\n";
                    echo "Host: $host\n";
                    echo "Port: $port\n";
                    echo "User: $user\n";
                    echo "Pass: $pass\n";
                    exit(0);
                } catch (PDOException $e) {
                    echo "FAIL (" . $e->getCode() . ": " . substr($e->getMessage(), 0, 50) . ")\n";
                }
            }
        }
    }
}
echo "\nNo valid credentials found. Please check Laragon MySQL settings.\n";
?>
