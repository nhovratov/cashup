<?php
$mysqli = new mysqli("localhost", "nikita", "dev", "home");

$id_person1 = 1;
$id_person2 = 2;
$id_category = 1;

if (isset($_POST["submit_db"])) {
	$date = $_POST["date"];
	$person1 = $_POST["person1"];
	$person2 = $_POST["person2"];
	$amount1 = (float) $person1["amount"];
	$amount2 = (float) $person2["amount"];

	$query = "INSERT INTO amount VALUES 
				(NULL, $amount1, '$date', $id_person1, $id_category),
				(NULL, $amount2, '$date', $id_person2, $id_category);";
	try {
		$mysqli->query($query);
	} catch (Exception $e) {
		echo "Oops, something went wrong";
	}

	echo "Danke, Ihre Daten wurden erfolgreich eingetragen.";
	
}
