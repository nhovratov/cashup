<?php
$mysqli = new mysqli("localhost", "nikita", "dev", "home");
$type = $_POST['type'];
call_user_func($type . "Query", $mysqli);

/**
 * @param mysqli $db
 */
function cashupQuery($db) {
    $id_person1 = 1;
    $id_person2 = 2;
    $id_category = 1;

    $date = $_POST["date"];
    $person1 = $_POST["person1"];
    $person2 = $_POST["person2"];
    $amount1 = (float)$person1["amount"];
    $amount2 = (float)$person2["amount"];

    $query = "INSERT INTO amount VALUES
			(NULL, $amount1, '$date', $id_person1, $id_category),
			(NULL, $amount2, '$date', $id_person2, $id_category);";
    try {
        $db->query($query);
    } catch (Exception $e) {
        echo "Oops, something went wrong";
    }

    echo "Danke, Ihre Daten wurden erfolgreich eingetragen.";

}

/**
 * @param mysqli $db
 */
function selfcostQuery($db) {
    $id_person = $_POST["personID"];
    $date = $_POST["date"];
    $amount = (float)$_POST["sum"];
    $id_category = (int)$_POST["categoryID"];

    $query = <<<HEREDOC
        INSERT INTO amount VALUES 
        (NULL, $amount, '$date', $id_person, $id_category);
HEREDOC;

    try {
        $db->query($query);
    } catch (Exception $e) {
        echo "Oops, something went wrong";
    }

    echo "Danke, Ihre Daten wurden erfolgreich eingetragen.";

}