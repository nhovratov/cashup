<?php
$mysqli = require_once("Php/db_connection.php");
/** @var mysqli $mysqli */
$persons = $mysqli->query("SELECT id_person, vorname, nachname FROM person")->fetch_all(MYSQLI_ASSOC);
$now = getdate();
$lastMonth = '"' . $now['year'] . '-' . sprintf("%02d", $now['mon'] - 1) . '-' . '01"';
$thisMonth = '"' . $now['year'] . '-' . sprintf("%02d", $now['mon']) . '-' . '01"';
$sums = $mysqli
    ->query("
SELECT 
  person.id_person,
  vorname,
  amount.date,
  ROUND(SUM(amount.value), 2) as summe
FROM person
INNER JOIN amount
ON person.id_person = amount.id_person
WHERE amount.date = $lastMonth OR amount.date = $thisMonth
GROUP BY person.vorname, amount.date")
    ->fetch_all(MYSQLI_ASSOC);
?>

<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="utf-8">
    <title>Statistiken</title>
    <script src="JavaScript/require.js"></script>
    <script>
        <?="var db_persons = " . json_encode($persons) . ";";?>
    </script>
    <link rel="stylesheet" href="node_modules/bootstrap/dist/css/bootstrap.min.css"/>
    <style>
        /* Custom styles */
    </style>
</head>
<body>
<nav class="navbar navbar-default">
    <div class="container-fluid">
        <div class="collapse navbar-collapse">
            <ul class="nav navbar-nav">
                <li><a href="index.html">Kassensturz</a></li>
                <li><a href="self_costs.php">Eigenkosten</a></li>
                <li class="active"><a href="statistics.php">Statistiken</a></li>
            </ul>
        </div><!-- /.navbar-collapse -->
    </div><!-- /.container-fluid -->
</nav>
<div class="container">
    <div class="row">
        <div class="col-md-4">
            <h1>Statistiken</h1>
            <table class="table">
                <thead>
                <tr>
                    <th>Name</th>
                    <th>Monat</th>
                    <th>Summe</th>
                </tr>
                </thead>
                <tbody>
                <?php
                    foreach ($sums as $data) {
                        echo "<tr>";
                        echo "<td>$data[vorname]</td>";
                        echo "<td>$data[date]</td>";
                        echo "<td>" . number_format($data["summe"], 2, ',', ".") . "&#8364;</td>";
                        echo "</tr>";
                    }
                ?>
                </tbody>
            </table>
        </div>
    </div>
</div>

</body>
</html>
