
<?php

    $mysqli = require_once("Php/db_connection.php");
    $res = $mysqli->query("SELECT id_person, vorname, nachname FROM person");
    $persons = [];

    while ($row = $res->fetch_assoc()) {
        $persons[] = $row;
    }
    var_dump($persons);

    $res = $mysqli->query("SELECT id_category, name FROM category");
    $categories = [];

    while ($row = $res->fetch_assoc()) {
        $categories[] = $row;
    }

?>

<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="utf-8">
    <title>Eigenkosten</title>
    <script src="JavaScript/require.js"></script>
    <script>
        <?="var db_persons = " . json_encode($persons) . ";";?>
        <?="var db_categories = " . json_encode($categories) . ";";?>
    </script>
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
<nav class="navbar navbar-default">
    <div class="container-fluid">
        <div class="collapse navbar-collapse">
            <ul class="nav navbar-nav">
                <li><a href="index.html">Kassensturz</a></li>
                <li class="active"><a href="self_costs.php">Eigenkosten</a></li>
                <li><a href="statistics.php">Statistiken</a></li>
            </ul>
        </div><!-- /.navbar-collapse -->
    </div><!-- /.container-fluid -->
</nav>
<div id="selfcosts"></div>
<script>
    requirejs.config({
        baseUrl: 'JavaScript'
    });
    require(['self_costs'], function (self_costs) {
        self_costs.init({
            id: "selfcosts",
            templatePath: "Templates/self_costs.html",
            displayPastMonths: 4,
        });
    });
</script>
</body>
</html>
