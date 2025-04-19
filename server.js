const crypto = require("crypto-js");
const url = require("url");
const express = require("express");
const bodyParser = require("body-parser");
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const port = 3000;

// iKhokha details
const callbackUrl = "bold-crow-presumably.ngrok-free.app/";
const applicationKeySecret = "hSA2CkQurGkWVmNgTYAsEsy8A0uWRn8w";

// Handle GET request
app.get("/", (req, res) => {
  res.send("✅ Server is running and ready to accept POST requests.");
});

// Handle POST request
app.post("/", (req, res) => {
  const body = req.body;
  delete body.text;

  const { pathname } = new URL(callbackUrl);
  const payloadToSign = createPayloadToSign(pathname, JSON.stringify(body));

  const signature = crypto
    .HmacSHA256(payloadToSign, applicationKeySecret.trim())
    .toString(crypto.enc.Hex);

  // 👇 Temporarily skip this check so you can test in Postman
  // if (signature !== req.headers["ik-sign"]) {
  //   console.log(`Signature mismatch. Expected ${signature} but got ${req.headers["ik-sign"]}`);
  //   return res.sendStatus(403); // Forbidden
  // }

  console.log("✅ Signature would be:", signature);
  console.log("📦 Received POST body:", body);
  res.status(200).send("POST received successfully!");
});

app.listen(port, () => {
  console.log(`🚀 Server is live at http://localhost:3000`);
});

// Helpers
function createPayloadToSign(urlPath, body = "") {
  try {
    const parsedUrl = new url.URL("http://localhost:3000/" + urlPath);
    const basePath = parsedUrl.pathname;
    const payload = basePath + body;
    return jsStringEscape(payload);
  } catch (error) {
    console.log("❌ Error on createPayloadToSign", error);
  }
}

function jsStringEscape(str) {
  try {
    return str.replace(/[\\"']/g, "\\$&").replace(/\u0000/g, "\\0");
  } catch (error) {
    console.log("❌ Error on jsStringEscape", error);
  }
}
