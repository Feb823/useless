(function() {
  // Connect to background to keep worker alive
  const port = chrome.runtime.connect({ name: 'thought-annihilator' });

  // List of annoying GIFs
  const annoyingGIFs = [
    "https://media.giphy.com/media/oW4icW0Qy1ZJp4XGkG/giphy.gif",
    "https://media.giphy.com/media/l4FGp6wWq7y09T4Yw/giphy.gif",
    "https://media.giphy.com/media/xT5LMwz340wzQn6j8c/giphy.gif"
    // Add more GIF URLs here!
  ];

  // Get a random GIF
  function getRandomGif() {
    const randomIndex = Math.floor(Math.random() * annoyingGIFs.length);
    return annoyingGIFs[randomIndex];
  }

  // Listen for messages FROM background.js
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "annihilate") {
      injectAnnoyingGif();
    }
  });

  // Inject a random GIF in the center of the page
  function injectAnnoyingGif() {
    const gifUrl = getRandomGif();
    const container = document.createElement("div");
    container.style.position = "fixed";
    container.style.top = "50%";
    container.style.left = "50%";
    container.style.transform = "translate(-50%, -50%)";
    container.style.zIndex = "999999";
    container.style.background = "rgba(255,255,255,0.7)";
    container.style.padding = "20px";
    container.style.borderRadius = "16px";
    container.style.boxShadow = "0 2px 20px rgba(0,0,0,0.3)";

    const img = document.createElement("img");
    img.src = gifUrl;
    img.style.maxWidth = "300px";
    img.style.maxHeight = "300px";
    img.alt = "Annoying GIF";

    // Optional: add a close button
    const close = document.createElement("button");
    close.textContent = "x";
    close.style.position = "absolute";
    close.style.top = "10px";
    close.style.right = "10px";
    close.style.background = "red";
    close.style.color = "white";
    close.style.border = "none";
    close.style.borderRadius = "50%";
    close.style.width = "25px";
    close.style.height = "25px";
    close.style.cursor = "pointer";
    close.onclick = () => container.remove();

    container.appendChild(close);
    container.appendChild(img);
    document.body.appendChild(container);
  }

  // Listen for user activity, inform background to reset timer
  ["mousemove", "keydown", "mousedown", "scroll"].forEach(ev => {
    document.addEventListener(ev, () => {
      chrome.runtime.sendMessage({ action: "resetTimer" });
    }, true);
  });

})();
