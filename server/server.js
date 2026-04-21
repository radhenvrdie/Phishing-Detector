const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();

app.use(cors());
app.use(express.json());

// Serve frontend files from client folder
app.use(express.static(path.join(__dirname, "../client")));

// Simple phishing URL analyzer
function analyzeURL(url) {
  let score = 0;
  let reasons = [];

  const lowerUrl = url.toLowerCase();

  if (!lowerUrl.startsWith("https://")) {
    score += 30;
    reasons.push("No HTTPS (not secure)");
  }

  if (url.length > 75) {
    score += 10;
    reasons.push("URL is too long");
  }

  if (url.includes("@")) {
    score += 25;
    reasons.push("Contains @ symbol");
  }

  if (url.includes("-")) {
    score += 10;
    reasons.push("Contains hyphen (-)");
  }

  const suspiciousWords = ["login", "verify", "bank", "free", "win", "account", "update"];
  suspiciousWords.forEach((word) => {
    if (lowerUrl.includes(word)) {
      score += 15;
      reasons.push(`Suspicious word found: ${word}`);
    }
  });

  const ipPattern = /(\d{1,3}\.){3}\d{1,3}/;
  if (ipPattern.test(url)) {
    score += 30;
    reasons.push("Uses IP address instead of domain name");
  }

  return { score, reasons };
}

// API route
app.post("/check-url", (req, res) => {
  const { url } = req.body;

  if (!url || url.trim() === "") {
    return res.json({
      status: "ERROR",
      score: 0,
      reasons: ["No URL provided"]
    });
  }

  const { score, reasons } = analyzeURL(url);

  let status = "SAFE";
  if (score >= 60) {
    status = "DANGEROUS";
  } else if (score >= 30) {
    status = "SUSPICIOUS";
  }

  res.json({
    status,
    score,
    reasons: reasons.length ? reasons : ["No suspicious pattern detected"]
  });
});

// Open frontend on root
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/index.html"));
});

// Start server
app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});