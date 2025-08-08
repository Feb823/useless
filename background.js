let timer;
const timeoutInMilliseconds = 5000; // 5 seconds of inactivity

function resetTimer() {
  clearTimeout(timer);
  timer = setTimeout(triggerAnnoyance, timeoutInMilliseconds);
}

function triggerAnnoyance() {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    if (tabs[0] && tabs[0].url && !tabs[0].url.startsWith("chrome://") && !tabs[0].url.startsWith("about:")) {
      chrome.tabs.sendMessage(tabs[0].id, { action: "annihilate" });
    }
  });
}

// Listen for keyboard and mouse events on all pages
chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  // Add an extra check for the tab's URL to ensure the script only runs on valid pages
  if (tab && tab.url && changeInfo.status === 'complete' && !tab.url.startsWith("chrome://") && !tab.url.startsWith("about:")) {
    // We now have a content_scripts block in manifest.json, so the content script
    // is injected automatically. We just need to reset the timer here.
    if (tab.active) {
      resetTimer();
    }
  }
});

// We also need to listen for when a tab becomes active to reset the timer
chrome.tabs.onActivated.addListener(function (activeInfo) {
  chrome.tabs.get(activeInfo.tabId, function(tab) {
    if (tab && tab.url && !tab.url.startsWith("chrome://") && !tab.url.startsWith("about:")) {
      resetTimer();
    }
  });
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === "resetTimer") {
    resetTimer();
  }
});

// Initial call to start the timer when the extension is loaded  erf
resetTimer();