<?php

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

$inData = getRequestInfo();

$id = 0;
$firstName = "";
$lastName = "";

$conn = new mysqli("localhost", "SmallAdmin", "GoodPassword", "smallproject");
if ($conn->connect_error) {
	returnWithError($conn->connect_error);
} else {
	$stmt = $conn->prepare("SELECT ID,first_name,last_name FROM users WHERE email=? AND password =?");
	$stmt->bind_param("ss", $inData["email"], $inData["password"]);
	$stmt->execute();
	$result = $stmt->get_result();

	if ($row = $result->fetch_assoc()) {
		returnWithInfo($row['first_name'], $row['last_name'], $row['ID']);
	} else {
		returnWithError("No Records Found");
	}

	$stmt->close();
	$conn->close();
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
	$retValue = '{"id":0,"first_name":"","last_name":"","error":"' . $err . '"}';
	sendResultInfoAsJson($retValue);
}

function returnWithInfo($firstName, $lastName, $id)
{
	$retValue = '{"id":' . $id . ',"first_name":"' . $firstName . '","last_name":"' . $lastName . '","error":""}';
	sendResultInfoAsJson($retValue);
}

?>