const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");
const crypto = require("crypto-js");
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const port = 3000;

// Replace with your actual values
const callbackUrl = "https://ikhokha-server.onrender.com/";
const ApplicationKey = "hSA2CkQurGkWVmNgTYAsEsy8A0uWRn8w"; 
const ApplicationId = "IKPKQEFULQIQS2S6XQCKN2V1BWV50A7M"; 

app.get("/", (req, res) => {
  res.send("✅ Server is running and ready to accept POST requests.");
});

app.post("/", async (req, res) => {
  try {
    const body = {
      amount: "1000",
      currency: "ZAR",
      description: "Test payment",
      redirectUrl: "https://example.com/success"
    };

    const headers = {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${ikhApiKey}`
    };

    const response = await axios.post(
      "https://api.ikhokha.com/v1/payments/initiate",
      body,
      { headers }
    );

    console.log("✅ Payment response:", response.data);
    res.status(200).json(response.data);
  } catch (error) {
    console.error("❌ Error initiating payment:", error.message);
    res.status(500).send("Internal Server Error: " + error.message);
  }
});

app.listen(port, () => {
  console.log(`🚀 Server is live on port ${port}`);
});
