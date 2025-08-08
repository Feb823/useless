(function() {
  console.log("Thought Bubble Annihilator content script loaded");

  // Your specified GIF URLs
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

  // Create a big popup at a random position ensuring full viewport coverage
  function createHugePopup() {
    const popupWidthVw = 44; // width in viewport width units
    const popupHeightVh = 44; // height in viewport height units

    const maxLeft = 100 - popupWidthVw;
    const maxTop = 100 - popupHeightVh;

    const left = Math.floor(Math.random() * maxLeft);
    const top = Math.floor(Math.random() * maxTop);

    const popup = document.createElement("div");
    popup.style.position = "fixed";
    popup.style.top = `${top}vh`;
    popup.style.left = `${left}vw`;
    popup.style.minWidth = `${popupWidthVw}vw`;
    popup.style.minHeight = `${popupHeightVh}vh`;
    popup.style.zIndex = "999999";
    popup.style.background = "rgba(255,255,255,0.94)";
    popup.style.boxShadow = "0 2px 30px rgba(0,0,0,0.5)";
    popup.style.borderRadius = "30px";
    popup.style.padding = "0";
    popup.style.display = "flex";
    popup.style.flexDirection = "column";
    popup.style.alignItems = "center";
    popup.style.justifyContent = "center";

    const img = document.createElement("img");
    img.src = getRandomGif();
    img.style.width = "100%";
    img.style.height = "100%";
    img.style.objectFit = "cover";
    img.style.borderRadius = "30px";
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
    close.style.fontSize = "22px";
    close.style.cursor = "pointer";
    close.style.boxShadow = "1px 1px 8px rgba(0,0,0,0.18)";
    close.onclick = e => {
      popup.remove();
      e.stopPropagation();
    };

    popup.appendChild(close);
    popup.appendChild(img);
    document.body.appendChild(popup);
  }

  // Flood the screen with many huge GIFs on "annihilate" message
  chrome.runtime.onMessage.addListener((request) => {
    if (request.action === "annihilate") {
      const popupCount = 9; // Number of big GIF popups
      for (let i = 0; i < popupCount; i++) {
        createHugePopup();
      }
    }
  });

  // Notify background to reset inactivity timer on user activity
  function notifyBackground() {
    try {
      chrome.runtime.sendMessage({ action: "resetTimer" });
    } catch (e) {
      // Ignore errors if extension context invalidated
    }
  }

  ["mousemove", "keydown", "mousedown", "scroll"].forEach(ev => {
    document.addEventListener(ev, notifyBackground, true);
  });

  // Clean up all GIF popups on page unload (best effort)
  try {
    window.addEventListener("unload", () => {
      document.querySelectorAll("div[style*='z-index: 999999']").forEach(popup => popup.remove());
    });
  } catch (e) {
    // Some pages block unload events for extensions; no impact
  }
})();
