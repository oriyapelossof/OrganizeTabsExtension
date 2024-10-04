document.getElementById("organize").addEventListener("click", () => {
    //This sends a background script to organize the tabs
    chrome.runtime.sendMessage({ action: "organize" }, (response) => {
      console.log(response.status);
    });
  });
  