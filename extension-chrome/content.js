/**
 * @file content.js
 * @description Pixivのページにモーダルダイアログを挿入し、制御します。
 */

(() => {
  // スクリプトが複数回実行されるのを防ぐ
  if (document.getElementById("pixiv-download-helper-modal")) {
    return;
  }

  // --- 情報抽出 ---
  const url = window.location.href;
  const illustIdMatch = url.match(/artworks\/(\d+)/);
  const illustId = illustIdMatch ? illustIdMatch[1] : "";

  const bodyHtml = document.body.innerHTML;
  const userIdMatch = bodyHtml.match(/users\/(\d+)\/artworks/);
  const userId = userIdMatch ? userIdMatch[1] : "";

  // 新しく、シンプルで正確なユーザー名抽出ロジック
  // ユーザーのアバター要素をターゲットにし、その'title'属性から名前を抽出します。
  const userNameSelector = 'h2 a[href*="/users/"] div[role="img"][title]';
  const userNameElement = document.querySelector(userNameSelector);
  const userName = userNameElement ? userNameElement.getAttribute("title") : "";

  const titleSelector = "figcaption h1";
  const titleElement = document.querySelector(titleSelector);
  const title = titleElement ? titleElement.innerText : "";

  const descriptionSelector = "figcaption p";
  const descriptionElement = document.querySelector(descriptionSelector);
  let description = "";
  if (descriptionElement) {
    // 元のページ内容を変更しないように要素を複製する
    const tempElement = descriptionElement.cloneNode(true);

    // <br>を改行文字に置換する
    tempElement.innerHTML = tempElement.innerHTML.replace(/<br\s*\/?>/gi, "\n");

    // ハイパーリンクを削除し、テキスト内容のみを保持する
    const links = tempElement.querySelectorAll("a");
    links.forEach((link) => {
      link.outerHTML = link.innerHTML; // <a>タグをその内容で置換する
    });

    description = tempElement.innerText;
  }

  const tagsSelector = "figcaption footer ul li";
  const tagElements = document.querySelectorAll(tagsSelector);
  let tags = Array.from(tagElements)
    .map((li) => {
      const link = li.querySelector("a");
      return link ? link.innerText : "";
    })
    .filter((tag) => tag !== "");

  if (tags.length === 0) {
    tags = [""];
  }

  let imageUrls = [];
  const pageCountSelector = ".gtm-manga-viewer-open-preview span";
  const pageCountElement = document.querySelector(pageCountSelector);
  let pageCount = 1;
  if (pageCountElement) {
    const match = pageCountElement.innerText.match(/\d+\/(\d+)/);
    if (match) {
      pageCount = parseInt(match[1], 10);
    }
  }

  const originalUrlMatch = bodyHtml.match(
    /https:\/\/i\.pximg\.net\/img-original\/img\/[^"']+/
  );
  if (originalUrlMatch) {
    const baseUrl = originalUrlMatch[0];
    const urlParts = baseUrl.split("/");
    const filename = urlParts.pop();
    const basePath = urlParts.join("/") + "/";
    const extension = filename.split(".").pop();

    for (let i = 0; i < pageCount; i++) {
      imageUrls.push(`${basePath}${illustId}_p${i}.${extension}`);
    }
  }

  if (imageUrls.length === 0) {
    imageUrls = [""];
  }

  const data = {
    illust_id: illustId,
    user_id: userId,
    user_name: userName,
    title: title,
    description: description,
    tags: tags,
    image_urls: imageUrls,
  };

  const jsonString = JSON.stringify(data, null, 2);

  // --- バックエンドへのデータ送信 ---
  fetch("http://127.0.0.1:8001/download-image", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      console.log("Data successfully sent to backend.");
    })
    .catch((error) => {
      console.error("Error sending data to backend:", error);
    });

  // --- モーダルのHTMLとCSS ---
  const modalHTML = `
    <div id="pixiv-download-helper-modal-backdrop"></div>
    <div id="pixiv-download-helper-modal">
      <div id="pixiv-download-helper-modal-content">
        <pre id="pixiv-download-helper-json-output"></pre>
      </div>
      <button id="pixiv-download-helper-ok-button">OK</button>
    </div>
  `;

  const modalCSS = `
    #pixiv-download-helper-modal-backdrop {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.5);
      z-index: 9998;
    }

    #pixiv-download-helper-modal {
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: white;
      color: black;
      padding: 20px;
      border: 1px solid black;
      z-index: 9999;
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    #pixiv-download-helper-modal-content {
      max-width: 60vw;
      max-height: 70vh;
      overflow: auto;
      background: #f0f0f0;
      padding: 10px;
      border: 1px solid #ccc;
      min-width: 300px;
    }

    #pixiv-download-helper-ok-button {
      margin-top: 15px;
      padding: 10px 20px;
      background: #ddd;
      border: 1px solid #aaa;
      color: black;
      cursor: pointer;
      transition: background-color 0.3s, transform 0.1s;
    }

    #pixiv-download-helper-ok-button:active {
      background-color: #ccc;
      transform: scale(0.95);
    }
  `;

  // --- 挿入とロジック ---

  // CSSを挿入
  const styleElement = document.createElement("style");
  styleElement.textContent = modalCSS;
  document.head.appendChild(styleElement);

  // HTMLを挿入
  const modalContainer = document.createElement("div");
  modalContainer.innerHTML = modalHTML;
  document.body.appendChild(modalContainer);

  // データを入力
  document.getElementById("pixiv-download-helper-json-output").textContent =
    jsonString;

  /**
   * モーダルを閉じてDOMから削除します。
   */
  function closeModal() {
    modalContainer.remove();
    styleElement.remove();
  }

  // イベントリスナーを追加
  document
    .getElementById("pixiv-download-helper-modal-backdrop")
    .addEventListener("click", closeModal);
  document
    .getElementById("pixiv-download-helper-ok-button")
    .addEventListener("click", closeModal);
})();
