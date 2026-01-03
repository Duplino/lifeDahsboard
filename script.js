// Global variables
let editMode = false;
let grid = null;
let widgetInstances = new Map(); // Store widget class instances
let widgetManifests = new Map(); // Store widget manifests
let pinnedWidgets = new Set();
let hiddenWidgets = new Set();
let availableWidgets = [];

// Widget layout storage key
const LAYOUT_STORAGE_KEY = 'dashboard_layout';
const SETTINGS_STORAGE_KEY = 'dashboard_widget_settings';

// Initialize the dashboard
document.addEventListener('DOMContentLoaded', async function() {
    await loadAvailableWidgets();
    await loadWidgetManifests();
    await initializeGridStack();
    await loadDashboardLayout();
    initializeEditMode();
});

// Load available widgets from apps.json
async function loadAvailableWidgets() {
    try {
        const response = await fetch('apps.json');
        availableWidgets = await response.json();
        console.log('Available widgets:', availableWidgets);
    } catch (error) {
        console.error('Failed to load apps.json:', error);
        availableWidgets = ['weather', 'clock', 'calendar', 'todo', 'notes', 'fitness'];
    }
}

// Load widget manifests
async function loadWidgetManifests() {
    for (const widgetName of availableWidgets) {
        try {
            const response = await fetch(`widgets/${widgetName}/manifest.json`);
            const manifest = await response.json();
            widgetManifests.set(widgetName, manifest);
            console.log(`Loaded manifest for ${widgetName}:`, manifest);
        } catch (error) {
            console.error(`Failed to load manifest for ${widgetName}:`, error);
        }
    }
}

// Initialize GridstackJS
async function initializeGridStack() {
    grid = GridStack.init({
        column: 12,
        cellHeight: '100px',
        float: false,
        disableDrag: true,
        disableResize: true,
        animate: true,
        removable: false
    });
    
    // Listen for resize events
    grid.on('resizestop', function(event, el) {
        const widgetName = el.getAttribute('data-widget');
        const node = el.gridstackNode;
        
        if (widgetName && node) {
            const size = { width: node.w, height: node.h };
            const instance = widgetInstances.get(widgetName);
            
            if (instance && typeof instance.onResize === 'function') {
                instance.onResize(size);
            }
        }
    });
    
    console.log('GridstackJS initialized');
}

// Load dashboard layout from localStorage or create default
async function loadDashboardLayout() {
    const savedLayout = localStorage.getItem(LAYOUT_STORAGE_KEY);
    let layout;
    
    if (savedLayout) {
        try {
            layout = JSON.parse(savedLayout);
            console.log('Loaded saved layout:', layout);
        } catch (error) {
            console.error('Failed to parse saved layout:', error);
            layout = createDefaultLayout();
        }
    } else {
        layout = createDefaultLayout();
    }
    
    // Load widgets based on layout
    for (const widgetConfig of layout.widgets) {
        await createWidget(widgetConfig);
    }
    
    // Restore pinned widgets
    if (layout.pinned) {
        layout.pinned.forEach(widgetName => {
            pinnedWidgets.add(widgetName);
        });
        updatePinnedBar();
    }
    
    // Restore hidden widgets
    if (layout.hidden) {
        layout.hidden.forEach(widgetName => {
            hiddenWidgets.add(widgetName);
            const container = document.querySelector(`.grid-stack-item[data-widget="${widgetName}"]`);
            if (container) {
                container.classList.add('hidden');
                container.style.display = 'none';
            }
        });
    }
}

// Create default layout
function createDefaultLayout() {
    return {
        widgets: [
            { name: 'weather', x: 0, y: 0, w: 3, h: 3 },
            { name: 'clock', x: 3, y: 0, w: 3, h: 3 },
            { name: 'calendar', x: 6, y: 0, w: 3, h: 4 },
            { name: 'todo', x: 9, y: 0, w: 3, h: 4 },
            { name: 'notes', x: 0, y: 3, w: 3, h: 3 },
            { name: 'fitness', x: 3, y: 3, w: 3, h: 3 }
        ],
        pinned: [],
        hidden: []
    };
}

// Create a widget
async function createWidget(config) {
    const { name, x, y, w, h } = config;
    const manifest = widgetManifests.get(name);
    
    if (!manifest) {
        console.error(`No manifest found for widget: ${name}`);
        return;
    }
    
    // Load widget CSS
    await loadWidgetCSS(name);
    
    // Load widget HTML
    const html = await loadWidgetHTML(name);
    
    // Load widget JS
    await loadWidgetJS(name);
    
    // Create grid item
    const gridItem = document.createElement('div');
    gridItem.className = 'grid-stack-item';
    gridItem.dataset.widget = name;
    gridItem.dataset.pinnable = manifest.pinnable;
    
    // Set grid attributes
    gridItem.setAttribute('gs-x', x);
    gridItem.setAttribute('gs-y', y);
    gridItem.setAttribute('gs-w', w);
    gridItem.setAttribute('gs-h', h);
    gridItem.setAttribute('gs-min-w', manifest.size.min.width);
    gridItem.setAttribute('gs-max-w', manifest.size.max.width);
    gridItem.setAttribute('gs-min-h', manifest.size.min.height);
    gridItem.setAttribute('gs-max-h', manifest.size.max.height);
    
    // Create content wrapper
    const content = document.createElement('div');
    content.className = 'grid-stack-item-content';
    content.innerHTML = html;
    
    gridItem.appendChild(content);
    
    // Add to grid using makeWidget for GridStack v11+
    const dashboardGrid = document.getElementById('dashboardGrid');
    dashboardGrid.appendChild(gridItem);
    grid.makeWidget(gridItem);
    
    // Initialize widget controls
    initializeWidgetControlsForWidget(gridItem);
    
    // Initialize widget instance
    await initializeWidgetInstance(name, gridItem);
}

// Load widget CSS
async function loadWidgetCSS(widgetName) {
    return new Promise((resolve, reject) => {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = `widgets/${widgetName}/widget.css`;
        link.onload = () => resolve();
        link.onerror = () => {
            console.warn(`Failed to load CSS for ${widgetName}`);
            resolve(); // Don't reject, CSS is optional
        };
        document.head.appendChild(link);
    });
}

// Load widget HTML
async function loadWidgetHTML(widgetName) {
    try {
        const response = await fetch(`widgets/${widgetName}/widget.html`);
        return await response.text();
    } catch (error) {
        console.error(`Failed to load HTML for ${widgetName}:`, error);
        return '<div class="widget"><p>Failed to load widget</p></div>';
    }
}

// Load widget JS
async function loadWidgetJS(widgetName) {
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = `widgets/${widgetName}/widget.js`;
        script.onload = () => resolve();
        script.onerror = () => {
            console.warn(`Failed to load JS for ${widgetName}`);
            resolve(); // Don't reject, JS is optional
        };
        document.body.appendChild(script);
    });
}

// Initialize widget instance
async function initializeWidgetInstance(widgetName, container) {
    // Get widget settings from localStorage
    const settings = getWidgetSettings(widgetName);
    
    // Get current size from GridStack node
    const node = container.gridstackNode;
    const size = node ? { width: node.w, height: node.h } : { width: 0, height: 0 };
    
    // Convert widget name to class name (e.g., 'weather' -> 'WeatherWidget')
    const className = widgetName.charAt(0).toUpperCase() + widgetName.slice(1) + 'Widget';
    
    // Check if widget class exists
    if (window[className]) {
        try {
            const widgetContent = container.querySelector('.widget');
            const instance = new window[className](widgetContent, settings, size);
            widgetInstances.set(widgetName, instance);
        } catch (error) {
            console.error(`Failed to initialize ${className}:`, error);
        }
    }
}

// Get widget settings from localStorage
function getWidgetSettings(widgetName) {
    const allSettings = localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (allSettings) {
        try {
            const parsed = JSON.parse(allSettings);
            return parsed[widgetName] || {};
        } catch (error) {
            return {};
        }
    }
    return {};
}

// Save widget settings to localStorage
function saveWidgetSettings(widgetName, settings) {
    const allSettings = localStorage.getItem(SETTINGS_STORAGE_KEY);
    let parsed = {};
    
    if (allSettings) {
        try {
            parsed = JSON.parse(allSettings);
        } catch (error) {
            parsed = {};
        }
    }
    
    parsed[widgetName] = settings;
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(parsed));
}

// Save dashboard layout
function saveDashboardLayout() {
    const widgets = [];
    const gridItems = document.querySelectorAll('.grid-stack-item');
    
    gridItems.forEach(item => {
        if (!item.classList.contains('hidden')) {
            const widgetName = item.dataset.widget;
            const node = item.gridstackNode;
            
            if (node) {
                widgets.push({
                    name: widgetName,
                    x: node.x,
                    y: node.y,
                    w: node.w,
                    h: node.h
                });
            }
        }
    });
    
    const layout = {
        widgets: widgets,
        pinned: Array.from(pinnedWidgets),
        hidden: Array.from(hiddenWidgets)
    };
    
    localStorage.setItem(LAYOUT_STORAGE_KEY, JSON.stringify(layout));
    console.log('Layout saved:', layout);
}

// Edit mode functionality
function initializeEditMode() {
    const editMenuBtn = document.getElementById('editMenuBtn');
    const floatingSaveBtn = document.getElementById('floatingSaveBtn');
    
    if (editMenuBtn) {
        editMenuBtn.addEventListener('click', function(e) {
            e.preventDefault();
            enableEditMode();
        });
    }
    
    if (floatingSaveBtn) {
        floatingSaveBtn.addEventListener('click', function() {
            disableEditMode();
            saveDashboardLayout();
        });
    }
}

function enableEditMode() {
    const widgets = document.querySelectorAll('.grid-stack-item:not(.hidden)');
    
    // Set edit mode flag
    editMode = true;
    
    // Add edit mode classes
    document.body.classList.add('edit-mode-active');
    widgets.forEach(widget => {
        widget.classList.add('edit-mode');
    });
    
    // Enable GridstackJS dragging and resizing
    if (grid) {
        grid.enableMove(true);
        grid.enableResize(true);
    }
}

function disableEditMode() {
    const widgets = document.querySelectorAll('.grid-stack-item');
    
    // Set edit mode flag
    editMode = false;
    
    // Remove edit mode classes
    document.body.classList.remove('edit-mode-active');
    widgets.forEach(widget => {
        widget.classList.remove('edit-mode');
    });
    
    // Disable GridstackJS dragging and resizing
    if (grid) {
        grid.enableMove(false);
        grid.enableResize(false);
    }
}

// Widget controls functionality
function initializeWidgetControlsForWidget(container) {
    // Apply titlebar visibility setting
    const widgetName = container.dataset.widget;
    const settings = getWidgetSettings(widgetName);
    const manifest = widgetManifests.get(widgetName);
    
    // Check if showTitlebar setting exists and apply it
    if (manifest && manifest.settings && manifest.settings.showTitlebar !== undefined) {
        const showTitlebar = settings.showTitlebar !== undefined ? settings.showTitlebar : manifest.settings.showTitlebar.default;
        const header = container.querySelector('.widget-header');
        const title = container.querySelector('.widget-title');
        if (header && title) {
            if (!showTitlebar) {
                title.style.display = 'none';
                header.classList.add('titlebar-hidden');
            } else {
                title.style.display = '';
                header.classList.remove('titlebar-hidden');
            }
        }
    }
    
    // Pin button
    const pinBtn = container.querySelector('.pin-btn');
    if (pinBtn) {
        pinBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            const widgetType = container.dataset.widget;
            
            if (pinnedWidgets.has(widgetType)) {
                unpinWidget(widgetType);
                this.classList.remove('pinned');
            } else {
                pinWidget(widgetType, container);
                this.classList.add('pinned');
            }
        });
    }
    
    // Hide button
    const hideBtn = container.querySelector('.hide-btn');
    if (hideBtn) {
        hideBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            hideWidget(container);
        });
    }
    
    // Settings button
    const settingsBtn = container.querySelector('.settings-btn');
    if (settingsBtn) {
        settingsBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            showSettingsModal(container.dataset.widget);
        });
    }
    
    // Floating add button
    const floatingBtn = document.getElementById('floatingAddBtn');
    if (floatingBtn && !floatingBtn.dataset.initialized) {
        floatingBtn.dataset.initialized = 'true';
        floatingBtn.addEventListener('click', showHiddenWidgetsModal);
    }
}

// Pin/Unpin widget functionality
function pinWidget(widgetType, container) {
    pinnedWidgets.add(widgetType);
    updatePinnedBar();
    saveDashboardLayout();
    console.log('Pinned:', widgetType);
}

function unpinWidget(widgetType) {
    pinnedWidgets.delete(widgetType);
    updatePinnedBar();
    saveDashboardLayout();
    console.log('Unpinned:', widgetType);
}

function updatePinnedBar() {
    const pinnedBar = document.getElementById('pinnedBar');
    if (!pinnedBar) return;
    
    pinnedBar.innerHTML = '';
    
    pinnedWidgets.forEach(widgetType => {
        const instance = widgetInstances.get(widgetType);
        if (instance && typeof instance.getPinnedHTML === 'function') {
            const pinnedItem = document.createElement('div');
            pinnedItem.className = 'pinned-item';
            pinnedItem.innerHTML = instance.getPinnedHTML();
            pinnedBar.appendChild(pinnedItem);
        }
    });
}

// Hide/Show widget functionality
function hideWidget(container) {
    const widgetType = container.dataset.widget;
    
    // Add hidden class
    container.classList.add('hidden');
    container.style.display = 'none';
    
    hiddenWidgets.add(widgetType);
    saveDashboardLayout();
    console.log('Hidden:', widgetType);
}

function showWidget(widgetType) {
    const container = document.querySelector(`.grid-stack-item[data-widget="${widgetType}"]`);
    if (container) {
        container.classList.remove('hidden');
        container.style.display = '';
        hiddenWidgets.delete(widgetType);
        saveDashboardLayout();
        console.log('Shown:', widgetType);
    }
}

function showHiddenWidgetsModal() {
    if (typeof bootstrap === 'undefined') {
        alert('Hidden widgets: ' + Array.from(hiddenWidgets).join(', ') || 'None');
        return;
    }
    
    const modalElement = document.getElementById('hiddenWidgetsModal');
    const listContainer = document.getElementById('hiddenWidgetsList');
    
    // Remove any existing modal instance and backdrop
    const existingModal = bootstrap.Modal.getInstance(modalElement);
    if (existingModal) {
        existingModal.dispose();
    }
    
    // Remove any orphaned backdrops
    document.querySelectorAll('.modal-backdrop').forEach(backdrop => backdrop.remove());
    
    listContainer.innerHTML = '';
    
    if (hiddenWidgets.size === 0) {
        listContainer.innerHTML = '<p class="text-muted">No hidden widgets</p>';
    } else {
        hiddenWidgets.forEach(widgetType => {
            const manifest = widgetManifests.get(widgetType);
            const displayName = manifest ? manifest.name : widgetType;
            
            const item = document.createElement('div');
            item.className = 'd-flex justify-content-between align-items-center mb-2 p-2 border rounded';
            item.innerHTML = `
                <span>${displayName}</span>
                <button class="btn btn-sm btn-primary" onclick="showWidgetFromModal('${widgetType}')">
                    <i class="bi bi-eye"></i> Show
                </button>
            `;
            listContainer.appendChild(item);
        });
    }
    
    const modal = new bootstrap.Modal(modalElement);
    modal.show();
}

function showWidgetFromModal(widgetType) {
    showWidget(widgetType);
    
    // Close and dispose of the modal properly
    const modalElement = document.getElementById('hiddenWidgetsModal');
    const modalInstance = bootstrap.Modal.getInstance(modalElement);
    if (modalInstance) {
        modalInstance.hide();
        // Wait for modal to hide before showing it again
        modalElement.addEventListener('hidden.bs.modal', () => showHiddenWidgetsModal(), { once: true });
    } else {
        showHiddenWidgetsModal();
    }
}

function showSettingsModal(widgetType) {
    if (typeof bootstrap === 'undefined') {
        alert('Settings modal would open here for: ' + widgetType);
        return;
    }
    
    const modalElement = document.getElementById('settingsModal');
    const modalBody = modalElement.querySelector('.modal-body');
    const modalTitle = modalElement.querySelector('.modal-title');
    
    const manifest = widgetManifests.get(widgetType);
    if (!manifest) {
        modalBody.innerHTML = '<p>No settings available for this widget.</p>';
        const modal = new bootstrap.Modal(modalElement);
        modal.show();
        return;
    }
    
    modalTitle.textContent = `${manifest.name} Settings`;
    
    // Get current settings
    const currentSettings = getWidgetSettings(widgetType);
    
    // Build settings form
    let formHTML = '<form id="widgetSettingsForm">';
    
    if (manifest.settings && Object.keys(manifest.settings).length > 0) {
        for (const [key, setting] of Object.entries(manifest.settings)) {
            const currentValue = currentSettings[key] !== undefined ? currentSettings[key] : setting.default;
            
            formHTML += `<div class="mb-3">`;
            formHTML += `<label for="setting_${key}" class="form-label">${setting.label}</label>`;
            
            if (setting.type === 'boolean') {
                formHTML += `
                    <div class="form-check form-switch">
                        <input class="form-check-input" type="checkbox" id="setting_${key}" name="${key}" ${currentValue ? 'checked' : ''}>
                        <label class="form-check-label" for="setting_${key}">${setting.description || ''}</label>
                    </div>
                `;
            } else if (setting.type === 'number') {
                formHTML += `
                    <input type="number" class="form-control" id="setting_${key}" name="${key}" value="${currentValue}" 
                           min="${setting.min || ''}" max="${setting.max || ''}">
                    <div class="form-text">${setting.description || ''}</div>
                `;
            } else if (setting.type === 'text') {
                formHTML += `
                    <input type="text" class="form-control" id="setting_${key}" name="${key}" value="${currentValue}">
                    <div class="form-text">${setting.description || ''}</div>
                `;
            }
            
            formHTML += `</div>`;
        }
    } else {
        formHTML += '<p>No settings available for this widget.</p>';
    }
    
    formHTML += '</form>';
    
    modalBody.innerHTML = formHTML;
    
    // Update footer with save button
    const footer = modalElement.querySelector('.modal-footer');
    footer.innerHTML = `
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
        <button type="button" class="btn btn-primary" id="saveSettingsBtn">Save Changes</button>
    `;
    
    // Add save handler
    const saveBtn = footer.querySelector('#saveSettingsBtn');
    saveBtn.addEventListener('click', function() {
        const form = document.getElementById('widgetSettingsForm');
        const formData = new FormData(form);
        const newSettings = {};
        
        for (const [key, setting] of Object.entries(manifest.settings)) {
            if (setting.type === 'boolean') {
                newSettings[key] = form.querySelector(`[name="${key}"]`).checked;
            } else if (setting.type === 'number') {
                newSettings[key] = parseFloat(formData.get(key));
            } else {
                newSettings[key] = formData.get(key);
            }
        }
        
        // Save settings
        saveWidgetSettings(widgetType, newSettings);
        
        // Update widget instance
        const instance = widgetInstances.get(widgetType);
        if (instance && typeof instance.updateSettings === 'function') {
            instance.updateSettings(newSettings);
        }
        
        // Handle titlebar visibility
        const container = document.querySelector(`.grid-stack-item[data-widget="${widgetType}"]`);
        if (container && manifest.settings.showTitlebar !== undefined) {
            const showTitlebar = newSettings.showTitlebar !== undefined ? newSettings.showTitlebar : manifest.settings.showTitlebar.default;
            const header = container.querySelector('.widget-header');
            const title = container.querySelector('.widget-title');
            if (header && title) {
                if (!showTitlebar) {
                    title.style.display = 'none';
                    header.classList.add('titlebar-hidden');
                } else {
                    title.style.display = '';
                    header.classList.remove('titlebar-hidden');
                }
            }
        }
        
        // Close modal
        bootstrap.Modal.getInstance(modalElement).hide();
    });
    
    const modal = new bootstrap.Modal(modalElement);
    modal.show();
}

// Make function globally accessible for modal
window.showWidgetFromModal = showWidgetFromModal;

// Log initialization
console.log('Life Dashboard initialized successfully!');
console.log('Features:');
console.log('- Modular widget system');
console.log('- GridstackJS 12-column grid layout');
console.log('- Drag-to-reorder widgets (Edit mode)');
console.log('- Drag edges to resize (Edit mode)');
console.log('- Pin widgets to top bar');
console.log('- Hide/show widgets');
console.log('- Widget settings');
console.log('- LocalStorage persistence');
if (typeof GridStack !== 'undefined') {
    console.log('✓ GridstackJS loaded - Drag and resize enabled');
} else {
    console.log('✗ GridstackJS not loaded');
}
