(function() {
  // Debug log to verify script is loaded
  console.log("Thought Bubble Annihilator content script loaded");

  let popupContainer = null;

  // Try to connect to background (MV3 keep-alive)
  let port;
  try {
    port = chrome.runtime.connect({ name: "thought-annihilator" });
  } catch (e) {
    console.warn("Extension context connect error:", e);
  }

  const GIFS = [
    "https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExc3M0ZmZqdmx2OHhnbHM3aTgwMXhnMnpwdGk5dzhzZG0zcDhxNm11cyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/nsMPhWK6bfxHq/giphy.gif",
    "https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExYWtoc2M2ZWIwZzhpMjlsZnVyemRwdGIxZ3VpZGcxNXE4NTVpcHJvNSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/fMmIxEkxvnW48/giphy.gif",
    "https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExaGVmYndoaDVxcWFpanBla2UzOGtlbzB2b2E0dHpkejQyczd4OWVzNiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/zsp6JrZQf3rPy/giphy.gif",
    "https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExYXMxMnprdnd5b2RtYTUwOTN0Y3JkaXViMTBva3J5dGJ5dG9xODdkOCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/OhEWDytX1xcg8/giphy.gif",
    "https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExZ2NtNXhxNGhtdTR3c3VxZTBkcXMxbnJwdGxwcGh2emcyaGFyc2VqciZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/7Yd8ZAwBkEkCs/giphy.gif"
  ];

  function getRandomGif() {
    return GIFS[Math.floor(Math.random() * GIFS.length)];
  }

  function injectAnnoyance() {
    if (popupContainer) popupContainer.remove();

    popupContainer = document.createElement("div");
    popupContainer.id = "__thought_annihilator_popup";
    popupContainer.style.position = "fixed";
    popupContainer.style.top = "50%";
    popupContainer.style.left = "50%";
    popupContainer.style.transform = "translate(-50%, -50%)";
    popupContainer.style.zIndex = "999999";
    popupContainer.style.background = "rgba(255,255,255,0.88)";
    popupContainer.style.boxShadow = "0 2px 30px rgba(0,0,0,0.35)";
    popupContainer.style.borderRadius = "20px";
    popupContainer.style.padding = "30px";
    popupContainer.style.display = "flex";
    popupContainer.style.flexDirection = "column";
    popupContainer.style.alignItems = "center";
    popupContainer.style.minWidth = "220px";
    popupContainer.style.maxWidth = "90vw";
    popupContainer.style.maxHeight = "90vh";
    popupContainer.style.overflow = "auto";

    const img = document.createElement("img");
    img.src = getRandomGif();
    img.style.maxWidth = "280px";
    img.style.maxHeight = "280px";
    img.alt = "Annoying GIF";
    img.draggable = false;
    img.style.pointerEvents = "none";

    const close = document.createElement("button");
    close.textContent = "✖";
    close.title = "Close";
    close.style.position = "absolute";
    close.style.top = "10px";
    close.style.right = "10px";
    close.style.background = "#ff5555";
    close.style.color = "white";
    close.style.border = "none";
    close.style.borderRadius = "50%";
    close.style.width = "40px";
    close.style.height = "40px";
    close.style.fontSize = "16px";
    close.style.cursor = "pointer";
    close.style.boxShadow = "1px 1px 6px rgba(0,0,0,0.09)";
    close.onclick = e => {
      if (popupContainer) popupContainer.remove();
      popupContainer = null;
      e.stopPropagation();
    };

    popupContainer.appendChild(close);
    popupContainer.appendChild(img);
    document.body.appendChild(popupContainer);
  }

  function notifyBackground() {
    try {
      chrome.runtime.sendMessage({ action: "resetTimer" });
    } catch (e) {
      console.warn("Can't sendMessage; extension context inactive?", e);
    }
  }

  ["mousemove", "keydown", "mousedown", "scroll"].forEach(ev => {
    document.addEventListener(ev, notifyBackground, true);
  });

  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "annihilate") {
      try {
        injectAnnoyance();
      } catch (e) {
        console.warn("Annoyance popup inject failed:", e);
      }
    }
  });

  try {
    window.addEventListener("unload", () => {
      if (popupContainer) popupContainer.remove();
      popupContainer = null;
    });
  } catch (e) {
    // Some sites (Google, YouTube, etc.) block unload events for extensions
    // This is normal and not fatal
    console.warn("Unload event listener blocked by page policy:", e);
  }
})();
