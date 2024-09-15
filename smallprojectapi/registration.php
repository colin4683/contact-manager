<?php

$inData = getRequestInfo();

$conn = require __DIR__ . "/database.php";
$passwordHash = password_hash($inData["password"], PASSWORD_DEFAULT);

$stmt = $conn->prepare("INSERT into users (first_name, last_name, email, password) VALUES(?,?,?,?)");
$stmt->bind_param(
    "ssss",
    $inData["first_name"],
    $inData["last_name"],
    $inData["email"],
    $passwordHash
);
$stmt->execute();

$result = $stmt->get_result();

if ($row = $result->fetch_assoc()) {
    returnWithInfo($row['first_name'], $row['last_name'], $row['ID']);
} else {
    returnWithError("No Records Found");
}

$stmt->close();
$conn->close();


// Helper functions
function returnWithInfo($firstName, $lastName, $id)
{
    $retValue = '{"id":' . $id . ',"first_name":"' . $firstName . '","last_name":"' . $lastName . '","error":""}';
    sendResultInfoAsJson($retValue);
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
?>
