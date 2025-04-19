const express = require("express");
const bodyParser = require("body-parser");
const crypto = require("crypto-js");
const axios = require("axios");  // Import Axios
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const port = 3000;

// iKhokha details
const callbackUrl = "https://ikhokha-server.onrender.com/";  // Your Render URL
const applicationKeySecret = "hSA2CkQurGkWVmNgTYAsEsy8A0uWRn8w";  // Your API key secret

// Handle GET request
app.get("/", (req, res) => {
  res.send("✅ Server is running and ready to accept POST requests.");
});

// Handle POST request
app.post("/", async (req, res) => {
  try {
    const body = req.body;
    delete body.text;  // Remove text if unnecessary

    const { pathname } = new URL(callbackUrl);
    const payloadToSign = createPayloadToSign(pathname, JSON.stringify(body));

    const signature = crypto
      .HmacSHA256(payloadToSign, applicationKeySecret.trim())
      .toString(crypto.enc.Hex);

    console.log("✅ Signature would be:", signature);
    console.log("📦 Received POST body:", body);

    // Step 2: Send payment initiation request to iKhokha API
    const paymentData = {
      amount: "1000",  // Example amount
      currency: "ZAR",  // Currency: South African Rand
      description: "Payment for item",  // Description for payment
      redirectUrl: "https://your-redirect-url.com",  // Your redirect URL after payment
    };

    const headers = {
      "Content-Type": "application/json",
      "Authorization": "Bearer YOUR_IKHOHKA_API_KEY", // Replace with your iKhokha API key
    };

    try {
      const response = await axios.post(
        "https://api.ikhokha.com/v1/payments/initiate",
        paymentData,
        { headers }
      );
      console.log("Payment initiation response:", response.data);
      res.status(200).send("Payment initiated successfully!");
    } catch (error) {
      console.error("Error initiating payment:", error);
      res.status(500).send("Error initiating payment");
    }
  } catch (error) {
    console.log("❌ Error processing POST:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.listen(port, () => {
  console.log(`🚀 Server is live at http://localhost:3000`);
});

// Helper function for payload creation
function createPayloadToSign(urlPath, body = "") {
  try {
    const parsedUrl = new URL("http://localhost:3000/" + urlPath);
    const basePath = parsedUrl.pathname;
    const payload = basePath + body;
    return jsStringEscape(payload);
  } catch (error) {
    console.log("❌ Error in createPayloadToSign:", error);
  }
}

function jsStringEscape(str) {
  return str.replace(/[\\"']/g, "\\$&").replace(/\u0000/g, "\\0");
}
