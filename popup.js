document.addEventListener("DOMContentLoaded", () => {
  const summarizeBtn = document.getElementById("summarizeBtn");
  const outputDiv = document.getElementById("output");
  const lengthSelect = document.getElementById("summaryLength");
  const quotaDisplay = document.getElementById("quota");

  function updateQuotaDisplay() {
    chrome.storage.local.get(
      ["summaryUsage", "usageMonth", "purchasedCredits"],
      (data) => {
        const freeUsed = data.summaryUsage ?? 0;
        const purchased = data.purchasedCredits ?? 0;
        const remainingFree = Math.max(0, 5 - freeUsed);
        const totalAvailable = remainingFree + purchased;

        quotaDisplay.innerHTML = `🔋 Summaries left: <strong>${totalAvailable}</strong>`;

        // Show "Buy More Credits" button if no credits left
        const existingBtn = document.getElementById("buyMoreBtn");
        if (totalAvailable === 0 && !existingBtn) {
          const buyBtn = document.createElement("button");
          buyBtn.id = "buyMoreBtn";
          buyBtn.innerText = "Buy More Credits";
          buyBtn.style.marginTop = "10px";
          buyBtn.style.backgroundColor = "#00ff8c";
          buyBtn.style.color = "#000";
          buyBtn.style.border = "none";
          buyBtn.style.padding = "8px 12px";
          buyBtn.style.borderRadius = "6px";
          buyBtn.style.cursor = "pointer";

          buyBtn.onclick = () => {
            chrome.tabs.create({
              url: "https://summarizer-five-beta.vercel.app/",
            });
          };

          quotaDisplay.appendChild(document.createElement("br"));
          quotaDisplay.appendChild(buyBtn);
        } else if (existingBtn && totalAvailable > 0) {
          existingBtn.remove(); // Remove if user has credits now
        }
      }
    );
  }

  updateQuotaDisplay();

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

  chrome.runtime.onMessage.addListener((request) => {
    if (request.action === "showSummary") {
      outputDiv.innerText = request.summary;
      updateQuotaDisplay(); // Refresh after summarization
    }
  });

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
