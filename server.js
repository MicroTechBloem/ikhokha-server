const crypto = require("crypto-js");
const express = require("express");
const bodyParser = require("body-parser");
const app = express();

const port = process.env.PORT || 3000;

// Use body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// iKhokha config
const callbackUrl = "https://ikhokha-server.onrender.com/";
const applicationKeySecret = "hSA2CkQurGkWVmNgTYAsEsy8A0uWRn8w";

// Test GET route
app.get("/", (req, res) => {
  res.send("✅ Server is running and ready to accept POST requests.");
});

// POST webhook route
app.post("/", (req, res) => {
  const body = req.body;
  delete body.text;

  const urlPath = new URL(callbackUrl).pathname;
  const payloadToSign = createPayloadToSign(urlPath, JSON.stringify(body));

  const signature = crypto
    .HmacSHA256(payloadToSign, applicationKeySecret.trim())
    .toString(crypto.enc.Hex);

  if (signature !== req.headers["ik-sign"]) {
    console.log(`❌ Signature mismatch. Expected ${signature} but got ${req.headers["ik-sign"]}`);
    return res.sendStatus(403); // Forbidden
  }

  console.log("✅ Signature verified!");
  console.log("📦 Received POST body:", body);
  res.status(200).send("POST received and verified!");
});

// Start server
app.listen(port, () => {
  console.log(`🚀 Server is live at http://localhost:${port}`);
});

// Helpers
function createPayloadToSign(urlPath, body = "") {
  const payload = urlPath + body;
  return jsStringEscape(payload);
}

function jsStringEscape(str) {
  return str.replace(/[\\"']/g, "\\$&").replace(/\u0000/g, "\\0");
}
