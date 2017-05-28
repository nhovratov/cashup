<?php
    require_once ("Php/db_connection.php");
    $res = $mysqli->query("SELECT id_person, vorname, nachname FROM person");
    $persons = [];
    while ($row = $res->fetch_assoc()) {
        $persons[] = $row;
    }
?>
<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="utf-8">
    <title>Eigenkosten</title>
    <script src="JavaScript/require.js"></script>
    <script><?="var db_persons = " . json_encode($persons) . ";";?></script>
    <link rel="stylesheet" href="node_modules/bootstrap/dist/css/bootstrap.min.css"/>
    <style>
        #selfcost_form {
            padding: 0 0 15px;
        }

        #select_dbperson {
            margin-bottom: 15px;
        }

        .amount_remove.close {
            font-size: 34px;
        }
    </style>
</head>
<body>
<div id="selfcosts"></div>
<script>
    requirejs.config({
        baseUrl: 'JavaScript'
    });
    require(['self_costs'], function (self_costs) {
        self_costs.init({
            id: "selfcosts",
            templatePath: "Templates/self_costs.html",
        });
    });
</script>
</body>
</html>