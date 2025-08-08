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

// Keep the service worker alive for 30 seconds after an event
let keepAlive;
chrome.runtime.onConnect.addListener(port => {
  if (port.name === 'thought-annihilator') {
    keepAlive = setInterval(() => {
      // Dummy message to keep the service worker alive
      port.postMessage({ keepAlive: true });
    }, 25000); // Send a message every 25 seconds
    port.onDisconnect.addListener(() => {
      clearInterval(keepAlive);
      keepAlive = null;
    });
  }
});


// Listen for keyboard and mouse events on all pages
chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  if (tab && tab.url && changeInfo.status === 'complete' && !tab.url.startsWith("chrome://") && !tab.url.startsWith("about:")) {
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

// Initial call to start the timer when the extension is loaded
resetTimer();