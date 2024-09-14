<?php

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

$inData = getRequestInfo();

$conn = require __DIR__ . "/database.php";

$stmt = $conn->prepare("SELECT ID,first_name,last_name,password FROM users WHERE email=?");
$stmt->bind_param("s", $inData["email"]);
$stmt->execute();
$result = $stmt->get_result();

if ($row = $result->fetch_assoc()) {
	if (password_verify($inData["password"], $row["password"])) {
		returnWithInfo($row["first_name"], $row["last_name"], $row["ID"]);
	} else {
		returnWithError("No Records Found");
	}
} else {
	returnWithError("No Records Found");
}



$stmt->close();
$conn->close();

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
	$retValue = '{"id":0,"first_name":"","last_name":"","error":"' . $err . '"}';
	sendResultInfoAsJson($retValue);
}

function returnWithInfo($firstName, $lastName, $id)
{
	$retValue = '{"id":' . $id . ',"first_name":"' . $firstName . '","last_name":"' . $lastName . '","error":""}';
	sendResultInfoAsJson($retValue);
}

?>