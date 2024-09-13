<?php
    ini_set('display_errors', 1);
    ini_set('display_startup_errors', 1);
    error_reporting(E_ALL);

    $inData = getRequestInfo();

    $FirstName = $inData["first_name"];
    $LastName = $inData["last_name"]; 
    $Email = $inData["email"];  
    $Password = $inData["password"]; 

    $conn = new mysqli("localhost", "SmallAdmin", "GoodPassword", "smallproject");

    if ($conn->connect_error) {
        returnWithError($conn->connect_error);
    } 
    else {
        // $hashedPassword = password_hash($Password, PASSWORD_DEFAULT);
        $stmt = $conn->prepare("INSERT into users (first_name, last_name, email, password) VALUES(?,?,?,?)");
        $stmt->bind_param("ssss", $FirstName, $LastName, $Email, $Password);  
        $stmt->execute();
        $result = $stmt->get_result();

      if ($row = $result->fetch_assoc()) {
			returnWithInfo( $row['first_name'], $row['last_name'], $row['ID'] );
		} else {
			returnWithError("No Records Found");
		}

        $stmt->close();
        $conn->close();
        returnWithError("");
    }

    function returnWithInfo( $firstName, $lastName, $id ) {
		$retValue = '{"id":' . $id . ',"first_name":"' . $firstName . '","last_name":"' . $lastName . '","error":""}';
		sendResultInfoAsJson( $retValue );
	}

    function getRequestInfo() {
        return json_decode(file_get_contents('php://input'), true);
    }

    function sendResultInfoAsJson($obj) {
        header('Content-type: application/json');
        echo $obj;
    }

    function returnWithError($err) {
        $retValue = '{"error":"' . $err . '"}';
        sendResultInfoAsJson($retValue);
    }
?>
