<?php

$host       = "localhost";
$dbname     = "smallproject";
$username   = "SmallAdmin";
$password   = "GoodPassword";

$mariadb = new mysqli($host, $username, $password, $dbname);

if ($mariadb->connect_errno) {
    die("Connection error". $mariadb->connect_error);
}

return $mariadb;