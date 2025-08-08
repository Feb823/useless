(function() {
  // A list of random, annoying GIFs
  const annoyingGIFs = [
    "https://media.giphy.com/media/oW4icW0Qy1ZJp4XGkG/giphy.gif",
    "https://media.giphy.com/media/l4FGp6wWq7y09T4Yw/giphy.gif",
    "https://media.giphy.com/media/xT5LMwz340wzQn6j8c/giphy.gif"
    // Add more GIF URLs here!
  ];

  // Function to get a random GIF URL from our list
  function getRandomGif() {
    const randomIndex = Math.floor(Math.random() * annoyingGIFs.length);
    return annoyingGIFs[randomIndex];
  }

  // Function to create and display the pop-up
  function createPopUp() {
    // This check prevents multiple pop-ups from being created
    const existingPopUp = document.getElementById('annihilator-popup');
    if (existingPopUp) {
      existingPopUp.remove();
    }

    const popupDiv = document.createElement('div');
    popupDiv.id = 'annihilator-popup';
    popupDiv.style.position = 'fixed';
    popupDiv.style.top = '50%';
    popupDiv.style.left = '50%';
    popupDiv.style.transform = 'translate(-50%, -50%)';
    popupDiv.style.zIndex = '99999';
    popupDiv.style.border = '5px solid red';
    popupDiv.style.backgroundColor = 'white';
    popupDiv.style.padding = '10px';
    popupDiv.style.boxShadow = '0px 0px 20px rgba(0,0,0,0.5)';
    popupDiv.style.cursor = 'pointer';

    const gifImg = document.createElement('img');
    gifImg.src = getRandomGif();
    gifImg.style.width = '300px';
    gifImg.style.height = 'auto';

    const closeButton = document.createElement('button');
    closeButton.textContent = 'Close';
    closeButton.style.display = 'block';
    closeButton.style.marginTop = '10px';
    closeButton.style.width = '100%';
    closeButton.style.cursor = 'pointer';
    closeButton.onclick = () => popupDiv.remove();

    popupDiv.appendChild(gifImg);
    popupDiv.appendChild(closeButton);

    document.body.appendChild(popupDiv);
  }

  // Listen for messages from the background script
  chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.action === "annihilate") {
      createPopUp();
    }
  });

})();