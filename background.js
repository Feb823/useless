let timer;
const timeoutInMilliseconds = 5000; // 5 seconds of inactivity

function resetTimer() {
  clearTimeout(timer);
  timer = setTimeout(triggerAnnoyance, timeoutInMilliseconds);
}

function triggerAnnoyance() {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    // Check if the tab object and its URL exist before sending a message
    if (tabs[0] && tabs[0].url && !tabs[0].url.startsWith("chrome://") && !tabs[0].url.startsWith("about:")) {
      chrome.tabs.sendMessage(tabs[0].id, { action: "annihilate" });
    }
  });
}

// Listen for keyboard and mouse events on all pages
chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  // Add a null/undefined check for the tab and tab.url properties
  if (tab && tab.url && changeInfo.status === 'complete' && tab.active && !tab.url.startsWith("chrome://") && !tab.url.startsWith("about:")) {
    chrome.scripting.executeScript({
      target: { tabId: tabId },
      function: () => {
        document.addEventListener('mousemove', () => {
          chrome.runtime.sendMessage({ action: "resetTimer" });
        });
        document.addEventListener('keydown', () => {
          chrome.runtime.sendMessage({ action: "resetTimer" });
        });
      }
    });
    resetTimer(); // Start the timer on page load
  }
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === "resetTimer") {
    resetTimer();
  }
});

resetTimer();