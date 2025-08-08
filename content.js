(function() {
  console.log("Thought Bubble Annihilator content script loaded");

  // Your GIF URLs (edit or expand if you wish)
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

  // Create a BIG popup at a random position
  function createHugePopup() {
    const popup = document.createElement("div");
    popup.style.position = "fixed";
    // Randomize top/left for page coverage, but ensure the popup stays mostly on screen
    popup.style.top = `${Math.floor(Math.random() * 70)}vh`;
    popup.style.left = `${Math.floor(Math.random() * 70)}vw`;
    popup.style.zIndex = "999999";
    popup.style.background = "rgba(255,255,255,0.94)";
    popup.style.boxShadow = "0 2px 30px rgba(0,0,0,0.5)";
    popup.style.borderRadius = "30px";
    popup.style.padding = "0";
    popup.style.minWidth = "44vw";
    popup.style.minHeight = "44vh";
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

  // Flood the screen with MANY huge GIFs
  chrome.runtime.onMessage.addListener((request) => {
    if (request.action === "annihilate") {
      const popupCount = 9; // Adjust to the number of big GIFs you want
      for (let i = 0; i < popupCount; i++) {
        createHugePopup();
      }
    }
  });

  // Notify background to reset timer on user activity
  function notifyBackground() {
    try {
      chrome.runtime.sendMessage({ action: "resetTimer" });
    } catch (e) {/* Ignore */}
  }

  ["mousemove", "keydown", "mousedown", "scroll"].forEach(ev => {
    document.addEventListener(ev, notifyBackground, true);
  });

  // Clean up all popups on unload (best effort)
  try {
    window.addEventListener("unload", () => {
      document.querySelectorAll("div[style*='z-index: 999999']").forEach(popup => popup.remove());
    });
  } catch (e) { /* Ignore */ }
})();
