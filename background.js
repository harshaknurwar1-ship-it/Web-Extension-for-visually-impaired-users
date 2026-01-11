// Background service worker for handling keyboard shortcuts

chrome.commands.onCommand.addListener(async (command) => {
    if (command === 'open-new-tab') {
      await chrome.tabs.create({});
      return;
    }

    const result = await chrome.storage.sync.get('shortcuts');
    const shortcuts = result.shortcuts || [];

    const shortcutNum = parseInt(command.split('-')[1]);
    const shortcut = shortcuts.find(s => s.id === shortcutNum);

    if (shortcut && shortcut.buttonId) {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

      try {
        await chrome.scripting.executeScript({
          target: { tabId: tab.id },
          args: [shortcut.buttonId],
          func: (selector) => {
            const element = document.querySelector(selector);
            if (element) {
              element.click();
              return true;
            }
            return false;
          }
        });
      } catch (error) {
        console.error('Error executing shortcut:', error);
      }
    }
  });
  
  chrome.runtime.onInstalled.addListener(() => {
    console.log('Shortcut Manager Pro installed');
  });