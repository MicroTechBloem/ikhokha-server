<?php
// This will receive the payment request from the frontend (your payment form)

// Get the data from the incoming POST request
$data = json_decode(file_get_contents('php://input'), true);

// Check if data is received
if ($data && isset($data['amount']) && isset($data['orderId'])) {
    $amount = $data['amount'];
    $orderId = $data['orderId'];

    // You can now use these values to connect with the iKhokha API and proceed with the payment request.
    echo json_encode([
        'status' => 'success',
        'message' => 'Payment request received successfully',
    ]);
} else {
    echo json_encode([
        'status' => 'error',
        'message' => 'Missing required fields.',
    ]);
}
?>
