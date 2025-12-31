// Global variables
let editMode = false;
let grid = null;
let pinnedWidgets = new Set();
let hiddenWidgets = new Set();

// Initialize the dashboard
document.addEventListener('DOMContentLoaded', function() {
    initializeGridStack();
    initializeClock();
    initializeEditMode();
    initializeWidgetControls();
});

// Initialize GridstackJS
function initializeGridStack() {
    grid = GridStack.init({
        column: 12,
        cellHeight: '100px',
        float: false,
        disableDrag: true,
        disableResize: true,
        animate: true,
        removable: false
    });
    
    console.log('GridstackJS initialized');
}

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
function initializeWidgetControls() {
    // Pin buttons
    document.querySelectorAll('.pin-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const container = this.closest('.grid-stack-item');
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
            const container = this.closest('.grid-stack-item');
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
    
    // Use GridstackJS to remove widget temporarily
    if (grid) {
        // Add hidden class instead of removing from grid
        container.classList.add('hidden');
        container.style.display = 'none';
    }
    
    hiddenWidgets.add(widgetType);
    console.log('Hidden:', widgetType);
}

function showWidget(widgetType) {
    const container = document.querySelector(`.grid-stack-item[data-widget="${widgetType}"]`);
    if (container) {
        container.classList.remove('hidden');
        container.style.display = '';
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

// Log initialization
console.log('Life Dashboard initialized successfully!');
console.log('Features:');
console.log('- Real-time clock');
console.log('- GridstackJS 12-column grid layout');
console.log('- Drag-to-reorder widgets (Edit mode)');
console.log('- Drag edges to resize (Edit mode)');
console.log('- Pin widgets to top bar (Weather & Time)');
console.log('- Hide/show widgets');
console.log('- Widget settings (placeholder)');
console.log('- Interactive to-do list');
if (typeof GridStack !== 'undefined') {
    console.log('✓ GridstackJS loaded - Drag and resize enabled');
} else {
    console.log('✗ GridstackJS not loaded');
}
