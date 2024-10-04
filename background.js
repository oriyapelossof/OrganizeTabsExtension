chrome.runtime.onInstalled.addListener(() => {
  console.log("Tab Organizer installed!");
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "organize") {
    organizeTabsByFavicon();
    sendResponse({ status: "Tabs organized by favicon" });
  }
});

// Organizes tabs by their favicon URL
function organizeTabsByFavicon() {
  chrome.tabs.query({}, (tabs) => {
    // Sort tabs by their favicon URL
    const sortedTabs = tabs.sort((a, b) => {
      const faviconA = a.favIconUrl || "";  // Use an empty string if no favicon is available
      const faviconB = b.favIconUrl || "";  // empty string for undefined favicons
      return faviconA.localeCompare(faviconB);
    });

    // Moves each tab to its new position
    sortedTabs.forEach((tab, index) => {
      chrome.tabs.move(tab.id, { index: index });
    });
  });
}
