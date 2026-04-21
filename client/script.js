async function checkURL() {
  const url = document.getElementById("urlInput").value.trim();
  const resultBox = document.getElementById("resultBox");
  const iconEl = document.getElementById("icon");
  const statusEl = document.getElementById("status");
  const messageEl = document.getElementById("message");
  const scoreEl = document.getElementById("score");
  const reasonsEl = document.getElementById("reasons");
  const tipEl = document.getElementById("tip");

  reasonsEl.innerHTML = "";
  resultBox.className = "result-card hidden";

  if (!url) {
    alert("Please enter a URL");
    return;
  }

  try {
    const response = await fetch("/check-url", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ url })
    });

    const data = await response.json();

    resultBox.classList.remove("hidden");

    const status = data.status || "ERROR";
    resultBox.classList.add(status.toLowerCase());

    if (status === "SAFE") {
      iconEl.textContent = "✅";
      statusEl.textContent = "SAFE";
      messageEl.textContent = "This is a verified trusted website. Safe to visit!";
      tipEl.textContent = "✅ Tip: Always keep your browser and antivirus updated!";
    } else if (status === "SUSPICIOUS") {
      iconEl.textContent = "⚠️";
      statusEl.textContent = "SUSPICIOUS";
      messageEl.textContent = "This website shows some suspicious patterns. Be careful.";
      tipEl.textContent = "⚠️ Tip: Do not enter passwords or OTP on suspicious websites.";
    } else if (status === "DANGEROUS") {
      iconEl.textContent = "❌";
      statusEl.textContent = "DANGEROUS";
      messageEl.textContent = "This website looks risky and may be phishing-related.";
      tipEl.textContent = "❌ Tip: Avoid visiting or sharing personal data on this website.";
    } else {
      iconEl.textContent = "🛡️";
      statusEl.textContent = "ERROR";
      messageEl.textContent = "Something went wrong during analysis.";
      tipEl.textContent = "Tip: Please try again.";
    }

    scoreEl.textContent = `Risk Score: ${data.score}/100`;

    if (data.reasons && data.reasons.length > 0) {
      data.reasons.forEach((reason) => {
        const li = document.createElement("li");
        li.textContent = reason;
        reasonsEl.appendChild(li);
      });
    } else {
      const li = document.createElement("li");
      li.textContent = "No suspicious patterns detected.";
      reasonsEl.appendChild(li);
    }
  } catch (error) {
    resultBox.classList.remove("hidden");
    resultBox.classList.add("error");
    iconEl.textContent = "🛡️";
    statusEl.textContent = "ERROR";
    messageEl.textContent = "Server connection failed.";
    scoreEl.textContent = "";
    reasonsEl.innerHTML = "<li>Please check if the backend server is running.</li>";
    tipEl.textContent = "Tip: Start server again using node server.js";
  }
}