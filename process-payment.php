<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

$input = json_decode(file_get_contents("php://input"), true);

// Check if amount and orderId are provided
if (!isset($input['amount']) || !isset($input['orderId'])) {
    echo json_encode(["status" => "error", "message" => "Missing required fields."]);
    exit;
}

// iKhokha API credentials
$endpoint = "https://api.ikhokha.com/public-api/v1/api/payment";
$appID = "IKPKQEFULQIQS2S6XQCKN2V1BWV50A7M"; // 
$appSecret = "hSA2CkQurGkWVmNgTYAsEsy8A0uWRn8w"; // 

// Prepare request body
$requestBody = [
    "entityID" => "4", // Replace with your actual entity ID
    "externalEntityID" => "4", // Replace with your actual external entity ID
    "amount" => intval($input['amount']), // Amount in cents (e.g., 1000 for R10.00)
    "currency" => "ZAR",
    "requesterUrl" => "https://ikhokha-server.onrender.com/payment-handler.php",
    "description" => "Payment for Order: " . $input['orderId'],
    "paymentReference" => $input['orderId'],
    "mode" => "test", // Change to "test" if you're using the sandbox environment
    "externalTransactionID" => $input['orderId'],
    "urls" => [
        "callbackUrl" => "https://ikhokha-server.onrender.com/callback.php", // Replace with your callback URL
        "successPageUrl" => "https://ikhokha-server.onrender.com/success.php", // Replace with your success page URL
        "failurePageUrl" => "https://ikhokha-server.onrender.com/failure.php", // Replace with your failure page URL
        "cancelUrl" => "https://ikhokha-server.onrender.com/cancel.php" // Replace with your cancel page URL
    ]
];

// Function to escape special characters in strings
function escapeString($str) {
    $escaped = preg_replace(['/[\\"\'\"]/u', '/\x00/'], ['\\\\$0', '\\0'], (string)$str);
    return str_replace('\/', '/', $escaped);
}

// Function to create payload for signing
function createPayloadToSign($urlPath, $body) {
    $parsedUrl = parse_url($urlPath);
    $basePath = $parsedUrl['path'];
    if (!$basePath) {
        throw new Exception("No path present in the URL");
    }
    return escapeString($basePath . json_encode($body));
}

// Function to generate HMAC signature
function generateSignature($payloadToSign, $secret) {
    return hash_hmac('sha256', $payloadToSign, $secret);
}

// Prepare payload to sign
$stringifiedBody = json_encode($requestBody);
$payloadToSign = createPayloadToSign($endpoint, $stringifiedBody);
$ikSign = generateSignature($payloadToSign, $appSecret);

// Initialize cURL session
$ch = curl_init($endpoint);

// Set cURL options
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "POST");
curl_setopt($ch, CURLOPT_POSTFIELDS, $stringifiedBody);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    "Content-Type: application/json",
    "IK-APPID: $appID",
    "IK-SIGN: $ikSign"
]);

// Execute cURL session and handle response
$response = curl_exec($ch);
curl_close($ch);

// Decode and return the response
$responseData = json_decode($response, true);
if (isset($responseData['status']) && $responseData['status'] == 'success') {
    echo json_encode(["status" => "success", "message" => "Payment initiation successful"]);
} else {
    echo json_encode([
        "status" => "error",
        "message" => "Failed to initiate payment",
        "errorDetails" => $responseData
    ]);
}
?>
