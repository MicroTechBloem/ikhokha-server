<?php
$rawData = file_get_contents("php://input");
file_put_contents("callback_log.txt", $rawData . PHP_EOL, FILE_APPEND);
http_response_code(200);
echo "Callback received";
?>
