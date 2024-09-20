<?php

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

$in = getRequestInfo();
$conn = require __DIR__ . "/database.php";

$stmt = $conn->prepare("INSERT INTO contacts (owner, email, first_name, last_name, phone_number) VALUES(?,?,?,?,?)");
$stmt->bind_param("sssss", $in["owner"], $in["email"], $in["first_name"], $in["last_name"], $in["phone_number"]);
$stmt->execute();

$newID = mysqli_insert_id($conn);

$fetchSql = "SELECT * FROM contacts WHERE id = $newID";
$result = mysqli_query($conn, $fetchSql);
$contact = $result->fetch_assoc();
sendResultInfoAsJson(json_encode($contact));


// returnWithAddedID($newID);
$stmt->close();
$conn->close();

function returnWithAddedContact($contact) {
	sendResultInfoAsJson($contact);
}

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
    $retValue = '{"error":"' . $err . '"}';
    sendResultInfoAsJson($retValue);
}