console.log('Popup script loaded');

const DEFAULT_SHORTCUTS = [
  { id: 1, buttonId: '.redBtn', key: 'Alt+Shift+R', action: 'click', value: '' },
  { id: 2, buttonId: '#btnId', key: '', action: 'click', value: '' },
  { id: 3, buttonId: '#btnId', key: '', action: 'click', value: '' },
  { id: 4, buttonId: '#btnId', key: '', action: 'click', value: '' },
  { id: 5, buttonId: '.fui-Button.r1alrhcs.fui-MenuButton', key: 'Alt+Shift+E', action: 'click', value: '' },
  { id: 6, buttonId: '.fui-Button.r1alrhcs.ms-Button', key: 'Alt+Shift+D', action: 'click', value: '' },
  { id: 7, buttonId: '#btnId', key: '', action: 'click', value: '' },
  { id: 8, buttonId: '.fui-Button__icon.rvwnv2', key: '', action: 'click', value: '' },
  { id: 9, buttonId: '#btnId', key: '', action: 'click', value: '' },
  { id: 10, buttonId: '#btnId', key: '', action: 'click', value: '' }
];

let shortcuts = [];
let recordingIndex = null;

function loadShortcuts() {
  console.log('Loading shortcuts...');
  
  if (typeof chrome !== 'undefined' && chrome.storage) {
    chrome.storage.sync.get('shortcuts', (result) => {
      console.log('Loaded from storage:', result);
      shortcuts = result.shortcuts || JSON.parse(JSON.stringify(DEFAULT_SHORTCUTS));
      renderShortcuts();
    });
  } else {
    console.log('Using default shortcuts (chrome.storage not available)');
    shortcuts = JSON.parse(JSON.stringify(DEFAULT_SHORTCUTS));
    renderShortcuts();
  }
}

function saveShortcuts() {
  console.log('Saving shortcuts:', shortcuts);
  
  if (typeof chrome !== 'undefined' && chrome.storage) {
    chrome.storage.sync.set({ shortcuts }, () => {
      console.log('Saved successfully');
      showToast('Settings saved successfully!', 'success');
    });
  } else {
    showToast('Chrome storage not available', 'warning');
  }
}

function renderShortcuts() {
  console.log('Rendering shortcuts:', shortcuts);
  const container = document.getElementById('shortcutsContainer');
  container.innerHTML = '';

  shortcuts.forEach((shortcut, index) => {
    const div = document.createElement('div');
    div.className = 'shortcut-item';
    
    const keyText = shortcut.key || '<span class="empty-key">Click to record</span>';
    
    div.innerHTML = `
      <div class="shortcut-header">
        <span class="shortcut-label">Shortcut ${shortcut.id}</span>
        <span class="shortcut-number">#${shortcut.id}</span>
      </div>
      
      <div class="input-row">
        <label class="input-label">Button ID / CSS Selector</label>
        <input
          type="text"
          class="button-id-input"
          data-index="${index}"
          value="${shortcut.buttonId}"
          placeholder="#myButton or .className"
        >
      </div>

      <div class="input-row">
        <label class="input-label">Action Type</label>
        <select class="action-select" data-index="${index}">
          <option value="click" ${shortcut.action === 'click' ? 'selected' : ''}>Click</option>
          <option value="scroll" ${shortcut.action === 'scroll' ? 'selected' : ''}>Scroll to Element</option>
          <option value="type" ${shortcut.action === 'type' ? 'selected' : ''}>Type Text</option>
        </select>
      </div>

      <div class="input-row" id="value-row-${index}" style="display: ${shortcut.action === 'type' ? 'block' : 'none'};">
        <label class="input-label">Text to Type</label>
        <input
          type="text"
          class="value-input"
          data-index="${index}"
          value="${shortcut.value}"
          placeholder="Text to type into the element"
        >
      </div>

      <div class="input-row">
        <label class="input-label">Keyboard Shortcut${index >= 4 ? ' (Popup Only)' : ''}</label>
        <div class="key-row">
          <div class="key-input-wrapper">
            <div class="key-display" data-index="${index}" ${index >= 4 ? 'style="pointer-events: none; opacity: 0.5;"' : ''}>${index >= 4 ? 'Not available' : keyText}</div>
          </div>
          ${index < 4 ? '<button class="btn btn-clear" data-index="' + index + '">Clear</button>' : ''}
        </div>
      </div>

      <button class="btn btn-execute" data-index="${index}">
        ▶ Execute Shortcut
      </button>
      <p class="help-text">💡 Click shortcut box and press keys like Ctrl+Alt+K</p>
    `;
    
    container.appendChild(div);
  });

  attachListeners();
  console.log('Shortcuts rendered');
}

function attachListeners() {
  document.querySelectorAll('.button-id-input').forEach(input => {
    input.addEventListener('input', (e) => {
      const index = parseInt(e.target.dataset.index);
      shortcuts[index].buttonId = e.target.value;
      console.log('Updated buttonId:', shortcuts[index]);
    });
  });

  document.querySelectorAll('.action-select').forEach(select => {
    select.addEventListener('change', (e) => {
      const index = parseInt(e.target.dataset.index);
      shortcuts[index].action = e.target.value;
      console.log('Updated action:', shortcuts[index]);
      renderShortcuts(); // Re-render to show/hide value input
    });
  });

  document.querySelectorAll('.value-input').forEach(input => {
    input.addEventListener('input', (e) => {
      const index = parseInt(e.target.dataset.index);
      shortcuts[index].value = e.target.value;
      console.log('Updated value:', shortcuts[index]);
    });
  });

  document.querySelectorAll('.key-display').forEach(display => {
    display.addEventListener('click', (e) => {
      e.stopPropagation();
      const index = parseInt(e.target.dataset.index);
      startRecording(index);
    });
  });

  document.querySelectorAll('.btn-clear').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const index = parseInt(e.target.dataset.index);
      shortcuts[index].key = '';
      renderShortcuts();
      showToast('Shortcut cleared', 'info');
    });
  });

  document.querySelectorAll('.btn-execute').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const index = parseInt(e.target.dataset.index);
      executeShortcut(shortcuts[index]);
    });
  });
}

function startRecording(index) {
  if (recordingIndex !== null) {
    stopRecording();
  }

  recordingIndex = index;
  const displays = document.querySelectorAll('.key-display');
  const display = displays[index];
  display.innerHTML = '⌨️ Press keys...';
  display.classList.add('recording');
  showToast('Recording... Press your key combination', 'info');
}

function stopRecording() {
  if (recordingIndex !== null) {
    const displays = document.querySelectorAll('.key-display');
    const display = displays[recordingIndex];
    display.classList.remove('recording');
    
    const key = shortcuts[recordingIndex].key;
    display.innerHTML = key || '<span class="empty-key">Click to record</span>';
    
    recordingIndex = null;
  }
}

document.addEventListener('keydown', (e) => {
  if (recordingIndex !== null) {
    e.preventDefault();
    e.stopPropagation();
    
    const keys = [];
    if (e.ctrlKey) keys.push('Ctrl');
    if (e.altKey) keys.push('Alt');
    if (e.shiftKey) keys.push('Shift');
    if (e.metaKey) keys.push('Meta');
    
    const mainKey = e.key;
    if (!['Control', 'Alt', 'Shift', 'Meta'].includes(mainKey)) {
      if (mainKey.length === 1) {
        keys.push(mainKey.toUpperCase());
      } else {
        keys.push(mainKey);
      }
    }

    if (keys.length > 1) {
      const shortcutString = keys.join('+');
      shortcuts[recordingIndex].key = shortcutString;
      showToast(`✓ Shortcut set: ${shortcutString}`, 'success');
      stopRecording();
    }
  }
});

document.addEventListener('click', (e) => {
  if (recordingIndex !== null && !e.target.classList.contains('key-display')) {
    stopRecording();
  }
});

function executeShortcut(shortcut) {
  console.log('Executing shortcut:', shortcut);

  if (!shortcut.buttonId) {
    showToast('⚠️ Please set a button ID first!', 'warning');
    return;
  }

  if (typeof chrome !== 'undefined' && chrome.tabs) {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]) {
        chrome.scripting.executeScript({
          target: { tabId: tabs[0].id },
          args: [shortcut.buttonId, shortcut.action, shortcut.value],
          func: (selector, action, value) => {
            const element = document.querySelector(selector);
            if (element) {
              if (action === 'click') {
                element.click();
                return { success: true, found: true };
              } else if (action === 'scroll') {
                element.scrollIntoView({ behavior: 'smooth' });
                return { success: true, found: true };
              } else if (action === 'type') {
                element.value = value;
                element.dispatchEvent(new Event('input', { bubbles: true }));
                return { success: true, found: true };
              }
            }
            return { success: false, found: false };
          }
        }, (results) => {
          if (results && results[0] && results[0].result.found) {
            showToast(`✓ Shortcut ${shortcut.id} executed!`, 'success');
          } else {
            showToast(`⚠️ Element not found: ${shortcut.buttonId}`, 'warning');
          }
        });
      }
    });
  } else {
    showToast('Chrome APIs not available', 'warning');
  }
}

function showToast(message, type = 'success') {
  const toast = document.getElementById('toast');
  const toastMessage = document.getElementById('toastMessage');
  const toastIcon = toast.querySelector('.toast-icon');
  
  toast.className = `toast ${type}`;
  
  if (type === 'success') {
    toastIcon.textContent = '✓';
  } else if (type === 'warning') {
    toastIcon.textContent = '⚠';
  } else if (type === 'info') {
    toastIcon.textContent = 'ℹ';
  }
  
  toastMessage.textContent = message;
  toast.classList.add('show');
  
  setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}

document.getElementById('resetBtn').addEventListener('click', () => {
  if (confirm('⚠️ Reset all shortcuts to default values?')) {
    shortcuts = JSON.parse(JSON.stringify(DEFAULT_SHORTCUTS));
    saveShortcuts();
    renderShortcuts();
    showToast('🔄 All shortcuts reset!', 'info');
  }
});

document.getElementById('saveBtn').addEventListener('click', () => {
  saveShortcuts();
});

// Initialize on load
loadShortcuts();