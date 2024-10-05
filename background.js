function notify_installation()
{
  alert("Tab Organizer installed!");
}

// Function to extract domain from a URL - this is for the secondary sort by domain
function extractDomain(url) {
  const hostname = new URL(url).hostname;
  return hostname.replace('www.', ''); // Remove 'www.' for consistent grouping
}

function CompareByIconName(tab1, tab2)
{
    const favicon1 = tab1.favIconUrl || "";  // If a tab doesn't have a favicon or has the default browser favicon, the favIconUrl will be undefined, so it will be treated as an empty string
    const favicon2 = tab2.favIconUrl || "";

    // Primary sort: compare favicons (empty strings for missing/default favicons)
    return favicon1.localeCompare(favicon2);
}

function CompareByDomain(tab1, tab2)
{
  // Secondary sort: if both tabs have the default/no favicon, sort by domain
  const domain1 = extractDomain(tab1.url);
  const domain2 = extractDomain(tab2.url);
  return domain1.localeCompare(domain2);
}

// Organizes tabs by favicon (primary) and by domain (secondary) for tabs with missing/default favicon
function organizeTabsByFaviconAndDomain() {

  //{} is to take info of all tabs
  chrome.tabs.query({}, (tabs) => {
    
    const sortedTabs = tabs.sort((tab1, tab2) => {
      // Sort tabs by favicon URL (primary sort), and by domain if the favicon is missing (secondary sort)
      faviconComparison = CompareByIconName(tab1, tab2);
      // tabs with the same favicon will be sorted by their domain names - 0 means that a and b are equal in terms of sorting order
      if (faviconComparison !== 0)
        return faviconComparison;
      
      return CompareByDomain(tab1, tab2);
    });

    // Move each tab to its new position
    sortedTabs.forEach((tab, index) => {
      chrome.tabs.move(tab.id, { index: index });
    });
  });
}

chrome.runtime.onInstalled.addListener(notify_installation);

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "organize") {
    organizeTabsByFaviconAndDomain();
    sendResponse({ status: "Tabs organized by favicon and domain" });
  }
});