let timer;
const timeoutMs = 5000; // 5 seconds

console.log("Thought Bubble Annihilator background script loaded");

function resetTimer() {
  clearTimeout(timer);
  timer = setTimeout(triggerAnnoyance, timeoutMs);
  console.log("resetTimer called at", new Date());
}

function triggerAnnoyance() {
  console.log("triggerAnnoyance called at", new Date());
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    console.log("tabs queried:", tabs);
    if (
      Array.isArray(tabs) &&
      tabs.length > 0 &&
      tabs[0].id &&
      tabs[0].url &&
      !tabs[0].url.startsWith("chrome://") &&
      !tabs[0].url.startsWith("about:")
    ) {
      console.log("Sending annihilate message to tab id:", tabs[0].id);
      chrome.tabs.sendMessage(tabs[0].id, { action: "annihilate" }, function(resp) {
        // Optionally log response; ignore errors for MV3 quirks
        if (chrome.runtime.lastError) {
          console.warn("tabs.sendMessage lastError:", chrome.runtime.lastError);
        } else {
          console.log("Message sent; content script response:", resp);
        }
      });
    } else {
      console.log("No valid tab for message.", tabs);
    }
  });
}

// Keep service worker alive for Manifest V3
let keepAlive;
chrome.runtime.onConnect.addListener(port => {
  if (port.name === "thought-annihilator") {
    keepAlive = setInterval(() => {
      port.postMessage({ keepAlive: true });
    }, 25000);
    port.onDisconnect.addListener(() => {
      clearInterval(keepAlive);
      keepAlive = null;
    });
  }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "resetTimer") {
    resetTimer();
  }
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (
    tab &&
    tab.url &&
    changeInfo.status === "complete" &&
    !tab.url.startsWith("chrome://") &&
    !tab.url.startsWith("about:")
  ) {
    if (tab.active) {
      resetTimer();
    }
  }
});

chrome.tabs.onActivated.addListener(activeInfo => {
  chrome.tabs.get(activeInfo.tabId, tab => {
    if (
      tab &&
      tab.url &&
      !tab.url.startsWith("chrome://") &&
      !tab.url.startsWith("about:")
    ) {
      resetTimer();
    }
  });
});

resetTimer();
