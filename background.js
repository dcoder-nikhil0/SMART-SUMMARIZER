chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "summarizeContent") {
    handleFreemium(request.content, request.length)
      .then((summary) => {
        chrome.runtime.sendMessage({ action: "showSummary", summary });
      })
      .catch((error) => {
        console.error("Summary error:", error);
        chrome.runtime.sendMessage({
          action: "showSummary",
          summary: "❌ Error: " + error.message,
        });
      });
  }
});

async function handleFreemium(content, length) {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get(["summaryUsage", "usageMonth"], async (data) => {
      const now = new Date();
      const currentMonth = `${now.getFullYear()}-${now.getMonth() + 1}`;

      let usage = data.summaryUsage ?? 0;
      let savedMonth = data.usageMonth;

      // Reset usage if it's a new month
      if (savedMonth !== currentMonth) {
        usage = 0;
        savedMonth = currentMonth;
      }

      if (usage >= 5) {
        return reject(new Error("Free limit reached. Upgrade to continue."));
      }

      try {
        const summary = await summarizePageContent(content, length);

        // Update usage count
        chrome.storage.local.set({
          summaryUsage: usage + 1,
          usageMonth: currentMonth,
        });

        resolve(summary);
      } catch (err) {
        reject(err);
      }
    });
  });
}

async function summarizePageContent(content, length) {
  const apiKey = "AIzaSyCh0xFNFBoFuBz8PQUcY_290D9ERH9aiuk"; // ✅ Use your own API key
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent`;

  const truncatedText = content.slice(0, 10000);

  const wordMap = {
    short: 100,
    medium: 200,
    long: 500,
  };

  const wordCount = wordMap[length] || 150;

  const prompt = `Summarize the following content in about ${wordCount} words:\n\n${truncatedText}`;

  const response = await fetch(`${url}?key=${apiKey}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      contents: [
        {
          parts: [{ text: prompt }],
        },
      ],
    }),
  });

  const data = await response.json();
  console.log("🔍 Full API Response:", data);

  if (data.candidates && data.candidates.length > 0) {
    return data.candidates[0].content.parts[0].text;
  } else {
    console.error("❌ Google API response error:", data);
    throw new Error("No summary returned from API.");
  }
}
