<?php

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

$inData = getRequestInfo();
$conn = require __DIR__ . "/database.php";

// prevents sql injection attacks
$stmt = sprintf(
	"SELECT id,first_name,last_name,password FROM users WHERE email = '%s'",
	$conn->real_escape_string($inData["email"])
);

$result = $conn->query($stmt);
$user = $result->fetch_assoc();

if ($user) {
	// Handles verifying password hash
	if (password_verify($inData["password"], $user["password"])) {
		returnWithInfo($user["first_name"], $user["last_name"], $user["id"]);
	} else {
		returnWithError("No Records Found");
	}
} else {
	returnWithError("No Records Found");
}


$conn->close();


// Helper functions
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