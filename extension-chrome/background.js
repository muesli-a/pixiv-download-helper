/**
 * @file background.js
 * @description pixiv-download-helper拡張機能のService Workerです。
 */

/**
 * 拡張機能がインストールされたときにコンテキストメニュー項目を作成します。
 * @summary runtime.onInstalledイベントをリッスンします。
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
 * コンテキストメニュー項目がクリックされたときの処理です。
 * @summary contextMenus.onClickedイベントをリッスンします。
 * @param {chrome.contextMenus.OnClickData} info - クリックされたメニュー項目に関する情報。
 * @param {chrome.tabs.Tab} tab - クリックが発生したタブ。
 */
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "pixiv-download-helper") {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ["content.js"]
    });
  }
});