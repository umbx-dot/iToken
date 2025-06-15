# iToken - Discord Token Manager Extension

A Chrome/Brave extension for managing Discord tokens. This extension allows you to copy, validate, and login with Discord tokens directly from the browser.

## Features

- Copy current Discord token from localStorage
- Validate Discord tokens and display user information
- Login to Discord using a token in incognito mode
- Clean, draggable interface accessible via F4 hotkey

## Installation

### For Chrome Browser

1. Download or clone this repository to your local machine
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" by toggling the switch in the top-right corner
4. Click "Load unpacked" button
5. Select the folder containing the extension files (manifest.json, background.js, content.js)
6. The extension should now appear in your extensions list

### For Brave Browser

1. Download or clone this repository to your local machine
2. Open Brave and navigate to `brave://extensions/`
3. Enable "Developer mode" by toggling the switch in the top-right corner
4. Click "Load unpacked" button
5. Select the folder containing the extension files (manifest.json, background.js, content.js)
6. The extension should now appear in your extensions list

## Required Permissions

The extension requires the following permissions to function properly:

### Essential Permissions
- **Storage**: Store extension settings and temporary data
- **Scripting**: Inject scripts into Discord pages for token management
- **Tabs**: Create and manage browser tabs for login functionality
- **ClipboardWrite**: Copy tokens to clipboard
- **ActiveTab**: Access the currently active tab

### Host Permissions
- **https://discord.com/**: Access Discord web application
- **https://discordapp.com/**: Access Discord web application (legacy domain)

### Incognito Mode Setup

For the token login feature to work properly, you must enable the extension in incognito mode:

#### Chrome
1. Go to `chrome://extensions/`
2. Find the iToken extension
3. Click "Details"
4. Toggle "Allow in incognito" to ON

#### Brave
1. Go to `brave://extensions/`
2. Find the iToken extension
3. Click "Details"
4. Toggle "Allow in Private Windows" to ON

## Usage

### Accessing the Interface
- Navigate to any Discord page (discord.com)
- Press **F4** to open/close the extension interface
- The interface is draggable - click and drag the header to move it around

### Current Token Management
1. Click "Copy Token" to copy your current Discord token to clipboard
2. The status will show whether a token is found in your current session

### Token Validation
1. Paste a Discord token in the "Token to Validate" field
2. Click "Validate Token"
3. View detailed information about the token including:
   - Username and discriminator
   - User ID and email
   - MFA status
   - Account verification status
   - Nitro subscription type
   - Account creation date

### Token Login
1. Paste a Discord token in the "Token" field under "Token Login"
2. Click "Login with Token"
3. An incognito popup window will open
4. The extension will automatically inject the token and reload the page
5. You should be logged in with the provided token

## Security Considerations

- This extension manipulates Discord tokens, which are sensitive authentication credentials
- Only use tokens from accounts you own or have explicit permission to access
- Be cautious when sharing or validating tokens from unknown sources
- The extension uses incognito mode for token login to isolate sessions

## Troubleshooting

### Extension Not Loading
- Ensure all three files (manifest.json, background.js, content.js) are in the same folder
- Check that Developer mode is enabled in your browser's extensions page
- Verify the manifest.json file is valid JSON

### F4 Hotkey Not Working
- Make sure you're on a Discord page (discord.com or discordapp.com)
- Refresh the page after installing the extension
- Check browser console for any script errors

### Token Login Fails
- Ensure incognito mode is enabled for the extension
- Verify the token is valid using the token validator first
- Check that popup blockers are not interfering with the login window

### Incognito Mode Issues
- Go to your browser's extension settings
- Find iToken and enable "Allow in incognito/private windows"
- Restart your browser after making this change

## Technical Details

- **Manifest Version**: 3
- **Content Security Policy**: Restricts script execution for security
- **Service Worker**: Handles background tasks and API calls
- **Content Script**: Runs on Discord pages to provide the user interface

## Browser Compatibility

- Chrome 88+
- Brave 1.20+
- Other Chromium-based browsers with Manifest V3 support

## License

This project is licensed under the MIT License.

## Credits

- Created by umbx-dot
- GitHub: github.com/umbx-dot
- Discord: idom_71966
- Telegram: @umbx1

## Disclaimer

This extension is for educational and legitimate account management purposes only. Users are responsible for complying with Discord's Terms of Service and applicable laws. The developers are not responsible for any misuse of this tool.
