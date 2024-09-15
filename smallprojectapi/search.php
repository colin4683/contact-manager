<?php

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

$in = getRequestInfo();
$conn = require __DIR__ . "/database.php";

$searchResults = "";
$searchCount = 0;

if ($conn->connect_error) 
{
    returnWithError($conn->connect_error);
} 
else
{
   

    // Prepare the SQL statement for partial search
    $stmt = $conn->prepare("SELECT contact_id, first_name, last_name, email, phone_number FROM contacts WHERE owner=? AND (first_name LIKE ? OR last_name LIKE ? OR email LIKE ?)");
    $searchTerm = "%" . $in["search"] . "%";
    $stmt->bind_param("ssss", $in["owner"], $searchTerm, $searchTerm, $searchTerm);
    $stmt->execute();

    $result = $stmt->get_result();

    while ($row = $result->fetch_assoc())
    {
        if ($searchCount > 0)
        {
            $searchResults .= ",";
        }
        $searchCount++;
        $searchResults .= json_encode($row);
    }

    if ($searchCount == 0)
    {
        returnWithError("No Records Found");
    }
    else
    {
        returnWithInfo($searchResults);
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
    $retValue = '{"results":[],"error":"' . $err . '"}';
    sendResultInfoAsJson($retValue);
}
    
function returnWithInfo($searchResults)
{
    $retValue = '{"results":[' . $searchResults . '],"error":""}';
    sendResultInfoAsJson($retValue);
}

?>