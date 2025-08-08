let timer;
const timeoutInMilliseconds = 5000; // 5 seconds of inactivity

function resetTimer() {
  clearTimeout(timer);
  timer = setTimeout(triggerAnnoyance, timeoutInMilliseconds);
}

function triggerAnnoyance() {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.sendMessage(tabs[0].id, { action: "annihilate" });
  });
}

// Listen for keyboard and mouse events on all pages
chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  if (changeInfo.status === 'complete' && tab.active) {
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
