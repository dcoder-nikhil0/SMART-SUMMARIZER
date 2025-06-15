document.addEventListener("DOMContentLoaded", () => {
  const summarizeBtn = document.getElementById("summarizeBtn");
  const outputDiv = document.getElementById("output");
  const lengthSelect = document.getElementById("summaryLength");
  const quotaDisplay = document.getElementById("quota");

  // Update quota display on load
  chrome.storage.local.get(["summaryUsage", "usageMonth"], (data) => {
    const count = data.summaryUsage ?? 0;
    const quota = Math.max(0, 5 - count);
    quotaDisplay.innerText = `Summaries left this month: ${quota}`;
  });

  summarizeBtn.addEventListener("click", () => {
    const selectedLength = lengthSelect.value;

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tab = tabs[0];

      if (!tab || !tab.id) {
        outputDiv.innerText = "Failed to get active tab.";
        return;
      }

      outputDiv.innerText = "Summarizing...";

      chrome.scripting.executeScript(
        {
          target: { tabId: tab.id },
          func: () => document.body.innerText,
        },
        (results) => {
          if (chrome.runtime.lastError || !results || !results[0]) {
            outputDiv.innerText = "Failed to extract page content.";
            return;
          }

          const pageText = results[0].result;

          chrome.runtime.sendMessage({
            action: "summarizeContent",
            content: pageText,
            length: selectedLength,
          });
        }
      );
    });
  });

  // Listen for summary from background.js
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "showSummary") {
      outputDiv.innerText = request.summary;

      // Update quota display after summarization
      chrome.storage.local.get(["summaryUsage", "usageMonth"], (data) => {
        const count = data.summaryUsage ?? 0;
        const quota = Math.max(0, 5 - count);
        quotaDisplay.innerText = `Summaries left this month: ${quota}`;
      });
    }
  });

  // Right-click to copy summary text
  outputDiv.addEventListener("contextmenu", (e) => {
    e.preventDefault();

    const text = outputDiv.innerText;
    const isCopyable = text && !text.startsWith("⏳") && !text.startsWith("❌");

    if (isCopyable) {
      navigator.clipboard
        .writeText(text)
        .then(() => alert("Summary copied to clipboard!"))
        .catch((err) => {
          console.error("Copy failed:", err);
          alert("Could not copy the summary.");
        });
    }
  });
});
