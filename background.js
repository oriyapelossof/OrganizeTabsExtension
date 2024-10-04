chrome.runtime.onInstalled.addListener(() => {
  console.log("Tab Organizer installed!");
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "organize") {
    organizeTabsByWebsite();
    sendResponse({ status: "Tabs organized by website" });
  }
});

// Organizes tabs by website (which means by same domain name)
function organizeTabsByWebsite() {
  chrome.tabs.query({}, (tabs) => {
    // Sort tabs by their domain
    const sortedTabs = tabs.sort((a, b) => {
      const domainA = extractDomain(a.url);
      const domainB = extractDomain(b.url); 
      return domainA.localeCompare(domainB);
    });

    // Moves each tab to its new position
    sortedTabs.forEach((tab, index) => {
      chrome.tabs.move(tab.id, { index: index });
    });
  });
}

// Function to extract domain from a URL
function extractDomain(url) {
  const hostname = new URL(url).hostname;
  return hostname.replace('www.', ''); // Removes 'www.' for the sorting
}
