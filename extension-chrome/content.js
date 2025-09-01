/**
 * @file content.js
 * @description Injects and controls the modal dialog on the Pixiv page.
 */

(() => {
  // Prevent the script from running multiple times
  if (document.getElementById('pixiv-download-helper-modal')) {
    return;
  }

  // --- Information Extraction ---
  const url = window.location.href;
  const illustIdMatch = url.match(/artworks\/(\d+)/);
  const illustId = illustIdMatch ? illustIdMatch[1] : null;

  const bodyHtml = document.body.innerHTML;
  const userIdMatch = bodyHtml.match(/users\/(\d+)\/artworks/);
  const userId = userIdMatch ? userIdMatch[1] : null;

  let userName = null;
  const avatarImg = document.querySelector('img[alt$="のプロフィール画像"]');
  if (avatarImg) {
      userName = avatarImg.alt.replace('のプロフィール画像', '').trim();
  }

  const data = {
    illust_id: illustId,
    user_id: userId,
    user_name: userName,
  };

  const jsonString = JSON.stringify(data, null, 2);

  // --- Modal HTML and CSS ---
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
      background-color: white;
      padding: 20px;
      border-radius: 8px;
      z-index: 9999;
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    #pixiv-download-helper-modal-content {
      text-align: left;
      max-width: 60vw; 
      max-height: 70vh;
      overflow: auto;
      background-color: #f5f5f5;
      padding: 15px;
      border-radius: 4px;
      min-width: 300px; /* Ensure a minimum width */
    }

    #pixiv-download-helper-ok-button {
      margin-top: 15px;
      padding: 10px 20px;
      border: none;
      border-radius: 5px;
      background-color: #007bff;
      color: white;
      cursor: pointer;
      transition: background-color 0.3s, transform 0.1s;
    }

    #pixiv-download-helper-ok-button:active {
      background-color: #0056b3;
      transform: scale(0.95);
    }
  `;

  // --- Injection and Logic ---

  // Inject CSS
  const styleElement = document.createElement('style');
  styleElement.textContent = modalCSS;
  document.head.appendChild(styleElement);

  // Inject HTML
  const modalContainer = document.createElement('div');
  modalContainer.innerHTML = modalHTML;
  document.body.appendChild(modalContainer);

  // Populate data
  document.getElementById('pixiv-download-helper-json-output').textContent = jsonString;

  /**
   * Closes and removes the modal from the DOM.
   */
  function closeModal() {
    modalContainer.remove();
    styleElement.remove();
  }

  // Add event listeners
  document.getElementById('pixiv-download-helper-modal-backdrop').addEventListener('click', closeModal);
  document.getElementById('pixiv-download-helper-ok-button').addEventListener('click', closeModal);

})();
