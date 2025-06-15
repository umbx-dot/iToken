chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'loginWithToken') {
    handleTokenLogin(message.token, sendResponse);
    return true;
  }
});

function handleTokenLogin(token, sendResponse) {
  if (!token || typeof token !== 'string') {
    sendResponse({ success: false, error: 'Invalid token' });
    return;
  }

  chrome.windows.create({
    url: 'https://discord.com/login',
    incognito: true,
    type: 'popup',
    width: 1000,
    height: 800
  }, (newWindow) => {
    if (chrome.runtime.lastError) {
      sendResponse({ success: false, error: 'Failed to create window' });
      return;
    }

    if (!newWindow || !newWindow.tabs || newWindow.tabs.length === 0) {
      sendResponse({ success: false, error: 'Please enable incognito mode for this extension' });
      return;
    }

    const tabId = newWindow.tabs[0].id;
    
    const updateListener = (updatedTabId, changeInfo) => {
      if (updatedTabId === tabId && changeInfo.status === 'complete') {
        chrome.tabs.onUpdated.removeListener(updateListener);
        
        chrome.scripting.executeScript({
          target: { tabId: tabId },
          func: injectTokenScript,
          args: [token]
        });
      }
    };

    chrome.tabs.onUpdated.addListener(updateListener);
    
    setTimeout(() => {
      chrome.tabs.onUpdated.removeListener(updateListener);
    }, 30000);

    sendResponse({ success: true });
  });
}

function injectTokenScript(token) {
  try {
    const originalWebSocket = window.WebSocket;
    let tokenSet = false;

    window.WebSocket = function(url, protocols) {
      if (!tokenSet && url && url.includes('gateway.discord')) {
        try {
          window.localStorage.setItem('token', JSON.stringify(token));
          tokenSet = true;
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        } catch (e) {
          console.error('Token injection failed:', e);
        }
      }
      return new originalWebSocket(url, protocols);
    };

    Object.setPrototypeOf(window.WebSocket, originalWebSocket);
    window.WebSocket.prototype = originalWebSocket.prototype;

    setTimeout(() => {
      if (!tokenSet) {
        try {
          window.localStorage.setItem('token', JSON.stringify(token));
          window.location.reload();
        } catch (e) {
          console.error('Backup token injection failed:', e);
        }
      }
    }, 3000);

  } catch (error) {
    console.error('Token injection script error:', error);
  }
}