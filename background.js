chrome.runtime.onInstalled.addListener(() => {
  console.log("Tab Organizer installed!");
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "organize") {
    organizeTabsByFaviconAndDomain();
    sendResponse({ status: "Tabs organized by favicon and domain" });
  }
});

// Organizes tabs by favicon (primary) and by domain (secondary) for tabs with missing/default favicon
function organizeTabsByFaviconAndDomain() {
  //{} is to take info of all tabs
  chrome.tabs.query({}, (tabs) => {
    // Sort tabs by favicon URL (primary sort), and by domain if the favicon is missing (secondary sort)
    // 
    const sortedTabs = tabs.sort((a, b) => {
      const faviconA = a.favIconUrl || "";  // If a tab doesn't have a favicon or has the default browser favicon, the favIconUrl will be undefined, so it will be treated as an empty string
      const faviconB = b.favIconUrl || ""; 

      // Primary sort: compare favicons (empty strings for missing/default favicons)
      const faviconComparison = faviconA.localeCompare(faviconB);

      // tabs with the same favicon will be sorted by their domain names - 0 means that a and b are equal in terms of sorting order
      if (faviconComparison !== 0) {
        return faviconComparison;
      }

      // Function to extract domain from a URL - this is for the secondary sort by domain
      function extractDomain(url) {
        const hostname = new URL(url).hostname;
        return hostname.replace('www.', ''); // Remove 'www.' for consistent grouping
      }
      
      // Secondary sort: if both tabs have the default/no favicon, sort by domain
      const domainA = extractDomain(a.url);
      const domainB = extractDomain(b.url);
      return domainA.localeCompare(domainB);
    });

    // Move each tab to its new position
    sortedTabs.forEach((tab, index) => {
      chrome.tabs.move(tab.id, { index: index });
    });
  });
}
