# Shortcut Manager

A powerful Chrome Extension designed to enhance web accessibility, particularly for **visually impaired users** and those who prefer keyboard navigation. It allows you to automate web interactions using custom keyboard shortcuts, significantly reducing the reliance on mouse navigation and visual searching. Define actions like clicking buttons, scrolling to elements, or typing text, and trigger them with your preferred key combinations.

## Accessibility Focus

This tool is built with the goal of making the web more accessible. By mapping complex mouse interactions to simple keyboard shortcuts, it empowers users to navigate and interact with web applications more efficiently, regardless of visual ability.

## Features

- **Custom Shortcuts**: Assign keyboard combinations (e.g., `Alt+Shift+1`) to specific actions.
- **Element Interaction**:
  - **Click**: Simulate a click on any element (specified by CSS selector).
  - **Scroll**: Automatically scroll to a specific element on the page.
  - **Type**: Insert predefined text into input fields.
- **Persistent Settings**: Your configurations are saved and synced across your browser sessions.
- **User-Friendly Interface**: Easy-to-use popup for managing your shortcut rules.

## Installation

Since this extension is not yet in the Chrome Web Store, you need to install it manually (Developer Mode):

1.  **Clone or Download** this repository to your local machine.
2.  Open Google Chrome and navigate to `chrome://extensions/`.
3.  Enable **Developer mode** by toggling the switch in the top-right corner.
4.  Click on the **Load unpacked** button.
5.  Select the folder where you saved this project (the directory containing `manifest.json`).
6.  The extension should now appear in your list of installed extensions.

## Usage

1.  Click the extension icon in your browser toolbar to open the settings popup.
2.  **Configure a Shortcut**:
    *   **Button ID / CSS Selector**: Enter the CSS selector for the target element (e.g., `#submit-btn`, `.nav-link`, `input[name="search"]`).
    *   **Action Type**: Choose between `Click`, `Scroll to Element`, or `Type Text`.
    *   **Text to Type** (if "Type Text" is selected): Enter the text you want to insert.
    *   **Keyboard Shortcut**: Click the recording area and press your desired key combination to bind it.
3.  **Save**: Click the "Save" button to apply your changes.
4.  **Test**: Go to a webpage where your target element exists and press your configured shortcut key.

## Development

### Project Structure

*   `manifest.json`: Configuration file defining permissions, background scripts, and popup.
*   `popup.html`: The HTML structure for the settings popup.
*   `popup.js`: Logic for saving/loading settings and handling UI interactions.
*   `background.js`: Service worker handling background tasks and command listeners.
*   `icons/`: Directory containing extension icons (if applicable).

### Making Changes

1.  Modify the code as needed.
2.  Go back to `chrome://extensions/`.
3.  Click the **Refresh** (circular arrow) icon on the extension card to reload the changes.

## License

[MIT License](LICENSE)
