// Global variables
let editMode = false;
let sortable = null;
let pinnedWidgets = new Set();
let hiddenWidgets = new Set();

// Initialize the dashboard
document.addEventListener('DOMContentLoaded', function() {
    initializeClock();
    initializeEditMode();
    initializeWidgetControls();
    initializeResizing();
});

// Clock functionality
function initializeClock() {
    updateClock();
    setInterval(updateClock, 1000);
}

function updateClock() {
    const now = new Date();
    
    // Update time
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const timeString = `${hours}:${minutes}:${seconds}`;
    
    const timeElement = document.getElementById('currentTime');
    if (timeElement) {
        timeElement.textContent = timeString;
    }
    
    // Update date
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const dateString = now.toLocaleDateString('en-US', options);
    
    const dateElement = document.getElementById('currentDate');
    if (dateElement) {
        dateElement.textContent = dateString;
    }
    
    // Update pinned time if it exists
    updatePinnedData();
}

// Edit mode functionality
function initializeEditMode() {
    const editBtn = document.getElementById('editBtn');
    const dashboardGrid = document.getElementById('dashboardGrid');
    
    if (!editBtn || !dashboardGrid) return;
    
    editBtn.addEventListener('click', function() {
        editMode = !editMode;
        
        if (editMode) {
            enableEditMode();
            editBtn.innerHTML = '<i class="bi bi-check-square"></i> Save Layout';
            editBtn.classList.remove('btn-primary');
            editBtn.classList.add('btn-success');
        } else {
            disableEditMode();
            editBtn.innerHTML = '<i class="bi bi-pencil-square"></i> Edit Layout';
            editBtn.classList.remove('btn-success');
            editBtn.classList.add('btn-primary');
        }
    });
}

function enableEditMode() {
    const dashboardGrid = document.getElementById('dashboardGrid');
    const widgets = document.querySelectorAll('.widget-container:not(.hidden)');
    
    // Add edit mode classes
    document.body.classList.add('edit-mode-active');
    widgets.forEach(widget => {
        widget.classList.add('edit-mode');
    });
    
    // Initialize Sortable for drag and drop
    if (typeof Sortable !== 'undefined') {
        sortable = new Sortable(dashboardGrid, {
            animation: 150,
            ghostClass: 'sortable-ghost',
            dragClass: 'sortable-drag',
            handle: '.widget-header',
            filter: '.hidden',
            forceFallback: true,
            onEnd: function(evt) {
                console.log('Widget reordered from', evt.oldIndex, 'to', evt.newIndex);
            }
        });
    }
    
    // Enable resizing
    updateResizingState(true);
}

function disableEditMode() {
    const widgets = document.querySelectorAll('.widget-container');
    
    // Remove edit mode classes
    document.body.classList.remove('edit-mode-active');
    widgets.forEach(widget => {
        widget.classList.remove('edit-mode');
    });
    
    // Destroy Sortable
    if (sortable) {
        sortable.destroy();
        sortable = null;
    }
    
    // Disable resizing
    updateResizingState(false);
}

// Widget controls functionality
function initializeWidgetControls() {
    // Pin buttons
    document.querySelectorAll('.pin-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const container = this.closest('.widget-container');
            const widgetType = container.dataset.widget;
            
            if (pinnedWidgets.has(widgetType)) {
                unpinWidget(widgetType);
                this.classList.remove('pinned');
            } else {
                pinWidget(widgetType, container);
                this.classList.add('pinned');
            }
        });
    });
    
    // Hide buttons
    document.querySelectorAll('.hide-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const container = this.closest('.widget-container');
            hideWidget(container);
        });
    });
    
    // Settings buttons
    document.querySelectorAll('.settings-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            showSettingsModal();
        });
    });
    
    // Floating add button
    const floatingBtn = document.getElementById('floatingAddBtn');
    if (floatingBtn) {
        floatingBtn.addEventListener('click', showHiddenWidgetsModal);
    }
}

// Pin/Unpin widget functionality
function pinWidget(widgetType, container) {
    pinnedWidgets.add(widgetType);
    updatePinnedBar();
    console.log('Pinned:', widgetType);
}

function unpinWidget(widgetType) {
    pinnedWidgets.delete(widgetType);
    updatePinnedBar();
    console.log('Unpinned:', widgetType);
}

function updatePinnedBar() {
    const pinnedBar = document.getElementById('pinnedBar');
    if (!pinnedBar) return;
    
    pinnedBar.innerHTML = '';
    
    pinnedWidgets.forEach(widgetType => {
        const pinnedItem = document.createElement('div');
        pinnedItem.className = 'pinned-item';
        
        if (widgetType === 'weather') {
            pinnedItem.innerHTML = `
                <i class="bi bi-cloud-sun-fill"></i>
                <div class="pinned-content">
                    <span class="pinned-label">Weather</span>
                    <span class="pinned-value">72°F Partly Cloudy</span>
                </div>
            `;
        } else if (widgetType === 'clock') {
            const now = new Date();
            const timeString = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
            pinnedItem.innerHTML = `
                <i class="bi bi-clock"></i>
                <div class="pinned-content">
                    <span class="pinned-label">Time</span>
                    <span class="pinned-value" id="pinnedTime">${timeString}</span>
                </div>
            `;
        }
        
        pinnedBar.appendChild(pinnedItem);
    });
}

function updatePinnedData() {
    if (pinnedWidgets.has('clock')) {
        const pinnedTime = document.getElementById('pinnedTime');
        if (pinnedTime) {
            const now = new Date();
            const timeString = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
            pinnedTime.textContent = timeString;
        }
    }
}

// Hide/Show widget functionality
function hideWidget(container) {
    const widgetType = container.dataset.widget;
    container.classList.add('hidden');
    hiddenWidgets.add(widgetType);
    console.log('Hidden:', widgetType);
}

function showWidget(widgetType) {
    const container = document.querySelector(`.widget-container[data-widget="${widgetType}"]`);
    if (container) {
        container.classList.remove('hidden');
        hiddenWidgets.delete(widgetType);
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
            const item = document.createElement('div');
            item.className = 'd-flex justify-content-between align-items-center mb-2 p-2 border rounded';
            item.innerHTML = `
                <span class="text-capitalize">${widgetType}</span>
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

function showSettingsModal() {
    if (typeof bootstrap === 'undefined') {
        alert('Settings modal would open here');
        return;
    }
    
    const modal = new bootstrap.Modal(document.getElementById('settingsModal'));
    modal.show();
}

// Resizing functionality using Interact.js
// This provides drag-to-resize functionality for widgets by their edges
// Improvements made:
// - Only works in edit mode for safety
// - Uses delta-based calculations for smoother resizing
// - Properly calculates grid column widths dynamically
// - Respects min/max constraints from data attributes
// - Stores original dimensions to prevent drift during resize
function initializeResizing() {
    if (typeof interact === 'undefined') {
        console.log('Interact.js not loaded, skipping resize functionality');
        console.log('To enable resizing, ensure Interact.js CDN is accessible');
        return;
    }
    
    const GRID_GAP = 16; // 1rem = 16px, should match CSS gap
    const GRID_COLUMNS = 12;
    
    interact('.widget-container')
        .resizable({
            edges: { left: false, right: true, bottom: true, top: false },
            listeners: {
                start(event) {
                    const container = event.target;
                    // Store original dimensions to prevent accumulation errors
                    container.dataset.originalWidth = getCurrentWidth(container);
                    container.dataset.originalHeight = getCurrentHeight(container);
                },
                move(event) {
                    const container = event.target;
                    
                    // Only allow resizing in edit mode
                    if (!editMode) return;
                    
                    // Get constraints from data attributes
                    const minWidth = parseInt(container.dataset.minWidth) || 2;
                    const maxWidth = parseInt(container.dataset.maxWidth) || 6;
                    const minHeight = parseInt(container.dataset.minHeight) || 2;
                    const maxHeight = parseInt(container.dataset.maxHeight) || 8;
                    
                    // Calculate grid cell dimensions dynamically
                    const grid = document.getElementById('dashboardGrid');
                    const gridRect = grid.getBoundingClientRect();
                    const columnWidth = (gridRect.width - (GRID_GAP * (GRID_COLUMNS - 1))) / GRID_COLUMNS;
                    
                    // Get delta changes from resize
                    const deltaWidth = event.deltaRect.width;
                    const deltaHeight = event.deltaRect.height;
                    
                    // Get original dimensions
                    const currentWidth = parseInt(container.dataset.originalWidth) || getCurrentWidth(container);
                    const currentHeight = parseInt(container.dataset.originalHeight) || getCurrentHeight(container);
                    
                    // Calculate how many grid units to change
                    const widthChange = Math.round(deltaWidth / (columnWidth + GRID_GAP));
                    const heightChange = Math.round(deltaHeight / 150); // Approximate row height with gap
                    
                    // Calculate new dimensions
                    let newWidth = currentWidth + widthChange;
                    let newHeight = currentHeight + heightChange;
                    
                    // Apply constraints
                    newWidth = Math.max(minWidth, Math.min(maxWidth, newWidth));
                    newHeight = Math.max(minHeight, Math.min(maxHeight, newHeight));
                    
                    // Update grid span
                    container.style.gridColumn = `span ${newWidth}`;
                    container.style.gridRow = `span ${newHeight}`;
                },
                end(event) {
                    const container = event.target;
                    // Update stored dimensions for next resize
                    container.dataset.originalWidth = getCurrentWidth(container);
                    container.dataset.originalHeight = getCurrentHeight(container);
                }
            },
            modifiers: [
                interact.modifiers.restrictSize({
                    min: { width: 150, height: 150 }
                })
            },
            inertia: false,
            enabled: false // Start disabled, enable in edit mode
        });
}

// Enable/disable resizing based on edit mode
function updateResizingState(enabled) {
    if (typeof interact === 'undefined') return;
    
    const containers = document.querySelectorAll('.widget-container');
    containers.forEach(container => {
        const interactInstance = interact(container);
        if (interactInstance) {
            interactInstance.resizable({ enabled: enabled });
        }
    });
}

// Make function globally accessible for modal
window.showWidgetFromModal = showWidgetFromModal;

// To-do list functionality
document.addEventListener('change', function(e) {
    if (e.target.matches('.todo-item input[type="checkbox"]')) {
        const label = e.target.nextElementSibling;
        if (e.target.checked) {
            label.style.textDecoration = 'line-through';
            label.style.color = '#999';
        } else {
            label.style.textDecoration = 'none';
            label.style.color = '#333';
        }
    }
});

// Prevent default drag behavior on non-edit mode
document.addEventListener('dragstart', function(e) {
    if (!editMode) {
        e.preventDefault();
    }
});

// Log initialization
console.log('Life Dashboard initialized successfully!');
console.log('Features:');
console.log('- Real-time clock');
console.log('- 12x12 grid layout');
console.log('- Drag-to-reorder widgets (Edit mode)');
console.log('- Drag edges to resize (Edit mode - requires Interact.js)');
console.log('- Pin widgets to top bar (Weather & Time)');
console.log('- Hide/show widgets');
console.log('- Widget settings (placeholder)');
console.log('- Interactive to-do list');
if (typeof interact !== 'undefined') {
    console.log('✓ Interact.js loaded - Resizing enabled');
} else {
    console.log('✗ Interact.js not loaded - Resizing disabled');
}
