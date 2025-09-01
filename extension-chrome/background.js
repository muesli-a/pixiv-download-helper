/**
 * @file background.js
 * @description Service worker for the pixiv-download-helper extension.
 */

/**
 * Creates the context menu item when the extension is installed.
 * @summary Listens for the runtime.onInstalled event.
 */
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "pixiv-download-helper",
    title: "pixiv-download-helper",
    contexts: ["all"],
    documentUrlPatterns: ["https://www.pixiv.net/artworks/*"]
  });
});

/**
 * Handles clicks on the context menu item.
 * @summary Listens for the contextMenus.onClicked event.
 * @param {chrome.contextMenus.OnClickData} info - Information about the clicked menu item.
 * @param {chrome.tabs.Tab} tab - The tab where the click occurred.
 */
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "pixiv-download-helper") {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ["content.js"]
    });
  }
});
