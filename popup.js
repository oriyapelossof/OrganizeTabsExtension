document.getElementById("organize_button").addEventListener("click", () => {
    //This sends a background script to organize the tabs
    chrome.runtime.sendMessage({ action: "organize" }, (response) => {    });
  });
  