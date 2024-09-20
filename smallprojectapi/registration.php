<?php

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

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

$newID = mysqli_insert_id($conn);
$fetchSql = "SELECT * FROM users WHERE id = $newID";
$result = mysqli_query($conn, $fetchSql);

if ($newUser = $result->fetch_assoc()) {
    sendResultInfoAsJson(json_encode($newUser));
} else {
    returnWithError("No Records Found");
}




// $result = $stmt->get_result();
// $user = $result->fetch_assoc();

// if ($user) {
//     // sendResultInfoAsJson(json_encode($row));
//     returnWithInfo($user['first_name'], $user['last_name'], $user['id']);
// } else {
//     returnWithError("No Records Found");
// }

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
