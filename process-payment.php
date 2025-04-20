<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST");

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['amount']) || !isset($data['orderId'])) {
    echo json_encode(["status" => "error", "message" => "Missing required fields."]);
    exit;
}

// You can replace this with iKhokha API request code if needed

echo json_encode([
    "status" => "success",
    "message" => "Payment request processed.",
    "data" => [
        "amount" => $data['amount'],
        "orderId" => $data['orderId']
    ]
]);
?>
