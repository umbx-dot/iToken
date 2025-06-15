class iTokenUI {
  constructor() {
    this.isVisible = false;
    this.isDragging = false;
    this.dragOffset = { x: 0, y: 0 };
    this.init();
  }

  init() {
    this.injectStyles();
    this.createUI();
    this.setupEventListeners();
  }

  injectStyles() {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes slideIn {
        from {
          opacity: 0;
          transform: translate(-50%, -60%) scale(0.9);
        }
        to {
          opacity: 1;
          transform: translate(-50%, -50%) scale(1);
        }
      }
      
      @keyframes slideOut {
        from {
          opacity: 1;
          transform: translate(-50%, -50%) scale(1);
        }
        to {
          opacity: 0;
          transform: translate(-50%, -60%) scale(0.9);
        }
      }
      
      @keyframes pulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.05); }
      }
      
      #itoken-ui {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 420px;
        height: 560px;
        background: #0a0a0a;
        border: 1px solid #333;
        border-radius: 12px;
        box-shadow: 0 25px 50px rgba(0, 0, 0, 0.8);
        z-index: 999999;
        opacity: 0;
        pointer-events: none;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        color: #e0e0e0;
        overflow: hidden;
        backdrop-filter: blur(20px);
        animation: slideOut 0.3s ease-out forwards;
        will-change: transform;
      }
      
      #itoken-ui.visible {
        pointer-events: auto;
        animation: slideIn 0.3s ease-out forwards;
      }
      
      #itoken-header {
        background: linear-gradient(135deg, #1a1a1a, #2a2a2a);
        padding: 12px 16px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        cursor: move;
        user-select: none;
        border-bottom: 1px solid #333;
        touch-action: none;
      }
      
      #itoken-title {
        font-size: 14px;
        font-weight: 600;
        color: #fff;
        text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
      }
      
      #itoken-close {
        background: none;
        border: none;
        color: #888;
        font-size: 18px;
        cursor: pointer;
        padding: 4px 6px;
        border-radius: 4px;
        transition: all 0.2s ease;
      }
      
      #itoken-close:hover {
        background: #333;
        color: #fff;
        transform: scale(1.1);
      }
      
      #itoken-body {
        padding: 20px;
        height: calc(100% - 49px);
        overflow-y: auto;
      }
      
      .itoken-section {
        margin-bottom: 24px;
        padding: 16px;
        background: #111;
        border: 1px solid #222;
        border-radius: 8px;
        transition: all 0.3s ease;
      }
      
      .itoken-section:hover {
        border-color: #333;
        background: #121212;
      }
      
      .itoken-section h3 {
        margin: 0 0 12px 0;
        font-size: 14px;
        font-weight: 600;
        color: #fff;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }
      
      .itoken-form-group {
        margin-bottom: 16px;
      }
      
      .itoken-label {
        display: block;
        margin-bottom: 6px;
        font-size: 12px;
        font-weight: 500;
        color: #999;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }
      
      .itoken-input {
        width: 100%;
        padding: 10px 12px;
        background: #0a0a0a;
        border: 1px solid #333;
        border-radius: 6px;
        color: #fff;
        font-size: 13px;
        transition: all 0.3s ease;
        box-sizing: border-box;
      }
      
      .itoken-input:focus {
        outline: none;
        border-color: #555;
        background: #0f0f0f;
        box-shadow: 0 0 0 2px rgba(85, 85, 85, 0.2);
      }
      
      .itoken-btn {
        padding: 10px 16px;
        background: linear-gradient(135deg, #1a1a1a, #2a2a2a);
        border: 1px solid #333;
        border-radius: 6px;
        color: #fff;
        font-size: 12px;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.3s ease;
        margin-right: 8px;
        margin-bottom: 8px;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }
      
      .itoken-btn:hover {
        background: linear-gradient(135deg, #2a2a2a, #3a3a3a);
        border-color: #555;
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
      }
      
      .itoken-btn:active {
        transform: translateY(0);
        animation: pulse 0.3s ease;
      }
      
      .itoken-btn:disabled {
        background: #0a0a0a;
        border-color: #222;
        color: #555;
        cursor: not-allowed;
        transform: none;
        box-shadow: none;
      }
      
      .itoken-info-box {
        background: #0a0a0a;
        border: 1px solid #222;
        border-radius: 6px;
        padding: 12px;
        margin: 12px 0;
        font-family: 'SF Mono', Monaco, 'Cascadia Code', monospace;
        font-size: 11px;
        white-space: pre-wrap;
        word-break: break-all;
        color: #ccc;
        transition: all 0.3s ease;
      }
      
      .itoken-loading {
        display: none;
        text-align: center;
        color: #666;
        font-size: 12px;
        margin: 12px 0;
        font-style: italic;
      }
      
      .itoken-loading.active {
        display: block;
      }
      
      .itoken-success {
        color: #4caf50;
        border-color: #2e7d32;
        background: #0d1b0d;
      }
      
      .itoken-error {
        color: #f44336;
        border-color: #c62828;
        background: #1b0d0d;
      }
      
      .itoken-warning {
        color: #ff9800;
        border-color: #ef6c00;
        background: #1b140d;
      }
      
      .itoken-credits {
        margin-top: 20px;
        padding: 16px;
        background: #0a0a0a;
        border: 1px solid #222;
        border-radius: 8px;
        font-size: 11px;
        color: #ccc;
        text-align: center;
        line-height: 1.6;
      }
      
      .itoken-credits a {
        color: #4caf50;
        text-decoration: none;
        transition: color 0.2s ease;
      }
      
      .itoken-credits a:hover {
        color: #66bb6a;
        text-decoration: underline;
      }
      
      #itoken-body::-webkit-scrollbar {
        width: 6px;
      }
      
      #itoken-body::-webkit-scrollbar-track {
        background: #0a0a0a;
      }
      
      #itoken-body::-webkit-scrollbar-thumb {
        background: #333;
        border-radius: 3px;
      }
      
      #itoken-body::-webkit-scrollbar-thumb:hover {
        background: #555;
      }
    `;
    document.head.appendChild(style);
  }

  createUI() {
    const ui = document.createElement('div');
    ui.id = 'itoken-ui';
    ui.innerHTML = `
      <div id="itoken-header">
        <div id="itoken-title">iToken (v1)</div>
        <button id="itoken-close">×</button>
      </div>
      <div id="itoken-body">
        <div class="itoken-section">
          <h3>Current Token</h3>
          <button id="copy-token" class="itoken-btn">Copy Token</button>
          <div id="token-status" class="itoken-info-box"></div>
        </div>
        
        <div class="itoken-section">
          <h3>Token Login</h3>
          <div class="itoken-form-group">
            <label class="itoken-label">Token:</label>
            <input type="text" id="login-token" class="itoken-input" placeholder="Paste your Discord token here">
          </div>
          <button id="login-btn" class="itoken-btn">Login with Token</button>
          <div id="login-loading" class="itoken-loading">Opening login window...</div>
          <div id="login-status" class="itoken-info-box"></div>
        </div>
        
        <div class="itoken-section">
          <h3>Token Validator</h3>
          <div class="itoken-form-group">
            <label class="itoken-label">Token to Validate:</label>
            <input type="text" id="check-token" class="itoken-input" placeholder="Paste token to validate">
          </div>
          <button id="check-btn" class="itoken-btn">Validate Token</button>
          <div id="check-loading" class="itoken-loading">Validating token...</div>
          <div id="check-info" class="itoken-info-box"></div>
        </div>
        
        <div class="itoken-credits">
          Licensed under MIT<br>
          Made by umbx-dot - github<br>
          Discord: idom_71966<br>
          Telegram: <a href="https://t.me/umbx1" target="_blank">@umbx1</a><br>
          --------------------<br>
          
        </div>
      </div>
    `;
    document.body.appendChild(ui);
    this.ui = ui;
  }

  setupEventListeners() {
    document.addEventListener('keydown', (e) => {
      if (e.key === 'F4') {
        e.preventDefault();
        this.toggle();
      }
    });

    const header = this.ui.querySelector('#itoken-header');
    
    header.addEventListener('mousedown', (e) => {
      if (e.target.id === 'itoken-close') return;
      
      this.isDragging = true;
      this.dragOffset.x = e.clientX - this.ui.offsetLeft;
      this.dragOffset.y = e.clientY - this.ui.offsetTop;
      
      document.body.style.userSelect = 'none';
      document.body.style.cursor = 'move';
      this.ui.style.transition = 'none';
      
      e.preventDefault();
      e.stopPropagation();
    });

    document.addEventListener('mousemove', (e) => {
      if (!this.isDragging) return;
      
      e.preventDefault();
      
      let x = e.clientX - this.dragOffset.x;
      let y = e.clientY - this.dragOffset.y;
      
      this.ui.style.left = x + 'px';
      this.ui.style.top = y + 'px';
      this.ui.style.transform = 'none';
    });

    document.addEventListener('mouseup', (e) => {
      if (this.isDragging) {
        this.isDragging = false;
        document.body.style.userSelect = '';
        document.body.style.cursor = '';
        this.ui.style.transition = '';
        e.preventDefault();
      }
    });

    document.addEventListener('mouseleave', () => {
      if (this.isDragging) {
        this.isDragging = false;
        document.body.style.userSelect = '';
        document.body.style.cursor = '';
        this.ui.style.transition = '';
      }
    });

    this.ui.querySelector('#itoken-close').addEventListener('click', () => {
      this.hide();
    });

    this.setupTokenFeatures();
  }

  setupTokenFeatures() {
    const copyBtn = this.ui.querySelector('#copy-token');
    const loginBtn = this.ui.querySelector('#login-btn');
    const checkBtn = this.ui.querySelector('#check-btn');
    const loginToken = this.ui.querySelector('#login-token');
    const checkToken = this.ui.querySelector('#check-token');
    const tokenStatus = this.ui.querySelector('#token-status');
    const loginStatus = this.ui.querySelector('#login-status');
    const checkInfo = this.ui.querySelector('#check-info');
    const loginLoading = this.ui.querySelector('#login-loading');
    const checkLoading = this.ui.querySelector('#check-loading');

    this.updateTokenStatus();

    copyBtn.addEventListener('click', () => {
      const token = this.getCurrentToken();
      if (token) {
        navigator.clipboard.writeText(token).then(() => {
          this.showMessage(tokenStatus, 'Token copied to clipboard!', 'success');
        }).catch(() => {
          this.showMessage(tokenStatus, 'Failed to copy token', 'error');
        });
      } else {
        this.showMessage(tokenStatus, 'No token found', 'warning');
      }
    });

    loginBtn.addEventListener('click', () => {
      const token = loginToken.value.trim();
      if (!token) {
        this.showMessage(loginStatus, 'Please enter a token', 'error');
        return;
      }

      loginLoading.classList.add('active');
      loginBtn.disabled = true;

      chrome.runtime.sendMessage({
        action: 'loginWithToken',
        token: token
      }, (response) => {
        loginLoading.classList.remove('active');
        loginBtn.disabled = false;
        
        if (response.success) {
          this.showMessage(loginStatus, 'Login window opened successfully!\nComplete the login process in the popup window.', 'success');
        } else {
          this.showMessage(loginStatus, `Login failed: ${response.error}`, 'error');
        }
      });
    });

    checkBtn.addEventListener('click', async () => {
      const token = checkToken.value.trim();
      if (!token) {
        this.showMessage(checkInfo, 'Please enter a token to validate', 'error');
        return;
      }

      checkLoading.classList.add('active');
      checkBtn.disabled = true;

      try {
        const userInfo = await this.fetchUserInfo(token);
        
        const info = `
Token Validation Result:
┌─ Status: ✅ VALID
├─ Username: ${userInfo.username}#${userInfo.discriminator || '0000'}
├─ User ID: ${userInfo.id}
├─ Email: ${userInfo.email || 'Not verified'}
├─ MFA: ${userInfo.mfa_enabled ? 'Enabled' : 'Disabled'}
├─ Verified: ${userInfo.verified ? 'Yes' : 'No'}
├─ Nitro: ${this.getPremiumType(userInfo.premium_type)}
└─ Created: ${new Date(((userInfo.id / 4194304) + 1420070400000)).toLocaleDateString()}

Token Type: ${token.startsWith('mfa.') ? 'MFA Token' : 'Regular Token'}
Token Length: ${token.length} characters
        `;
        
        this.showMessage(checkInfo, info, 'success');
        
      } catch (error) {
        this.showMessage(checkInfo, `❌ INVALID TOKEN\n\nError: ${error.message}\n\nThe token may be:\n• Expired or revoked\n• Malformed\n• Rate limited`, 'error');
      } finally {
        checkLoading.classList.remove('active');
        checkBtn.disabled = false;
      }
    });
  }

  getCurrentToken() {
    try {
      const token = localStorage.getItem('token');
      return token ? token.replace(/"/g, '') : null;
    } catch (error) {
      return null;
    }
  }

  updateTokenStatus() {
    const tokenStatus = this.ui.querySelector('#token-status');
    const token = this.getCurrentToken();
    
    if (token) {
      this.showMessage(tokenStatus, 'Status: ✅ Found', 'success');
    } else {
      this.showMessage(tokenStatus, 'Status: ❌ Not found', 'warning');
    }
  }

  async fetchUserInfo(token) {
    const response = await fetch('https://discord.com/api/v9/users/@me', {
      headers: {
        'Authorization': token
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status} - ${response.statusText}`);
    }

    return await response.json();
  }

  getPremiumType(type) {
    const types = {
      0: 'None',
      1: 'Nitro Classic',
      2: 'Nitro',
      3: 'Nitro Basic'
    };
    return types[type] || 'Unknown';
  }

  showMessage(element, message, type = 'info') {
    element.textContent = message;
    element.className = `itoken-info-box itoken-${type}`;
  }

  show() {
    this.isVisible = true;
    this.ui.classList.add('visible');
    this.updateTokenStatus();
  }

  hide() {
    this.isVisible = false;
    this.ui.classList.remove('visible');
  }

  toggle() {
    if (this.isVisible) {
      this.hide();
    } else {
      this.show();
    }
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new iTokenUI();
  });
} else {
  new iTokenUI();
}