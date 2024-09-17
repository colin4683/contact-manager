<?php

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

$in = getRequestInfo();
$conn = require __DIR__ . "/database.php";

// Prepare the SQL statement for partial search
$stmt = $conn->prepare("UPDATE contacts SET first_name=?, last_name=?, email=?, phone_number=? WHERE id=?");
$stmt->bind_param("sssii", $in["first_name"], $in["last_name"], $in["email"], $in["phone_number"], $in["id"]);
$stmt->execute();
$stmt->close();
$conn->close();
returnWithError("");

function getRequestInfo()
{
    return json_decode(file_get_contents('php://input'), true);
}

function sendResultInfoAsJson($obj)
{
    header('Content-type: application/json');
    echo $obj;
}

function returnWithError($err)
{
    $retValue = '{"results":[],"error":"' . $err . '"}';
    sendResultInfoAsJson($retValue);
}