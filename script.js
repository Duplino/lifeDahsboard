// Global variables
let editMode = false;
let sortable = null;
let currentWidget = null;

// Initialize the dashboard
document.addEventListener('DOMContentLoaded', function() {
    initializeClock();
    initializeEditMode();
    initializeResizeControls();
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
    const widgets = document.querySelectorAll('.widget-container');
    
    // Add edit mode classes
    document.body.classList.add('edit-mode-active');
    widgets.forEach(widget => {
        widget.classList.add('edit-mode');
    });
    
    // Initialize Sortable for drag and drop
    sortable = new Sortable(dashboardGrid, {
        animation: 150,
        ghostClass: 'sortable-ghost',
        dragClass: 'sortable-drag',
        handle: '.widget',
        forceFallback: true,
        onEnd: function(evt) {
            console.log('Widget reordered from', evt.oldIndex, 'to', evt.newIndex);
        }
    });
    
    // Show resize buttons
    document.querySelectorAll('.widget-controls').forEach(controls => {
        controls.style.opacity = '1';
    });
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
    
    // Hide resize buttons (will still show on hover due to CSS)
    document.querySelectorAll('.widget-controls').forEach(controls => {
        controls.style.opacity = '';
    });
}

// Resize functionality
function initializeResizeControls() {
    const resizeButtons = document.querySelectorAll('.resize-btn');
    const resizeModal = new bootstrap.Modal(document.getElementById('resizeModal'));
    const widthRange = document.getElementById('widthRange');
    const heightRange = document.getElementById('heightRange');
    const widthValue = document.getElementById('widthValue');
    const heightValue = document.getElementById('heightValue');
    const applyBtn = document.getElementById('applyResize');
    
    resizeButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            
            // Get the parent widget container
            currentWidget = this.closest('.widget-container');
            
            if (!currentWidget) return;
            
            // Get current dimensions
            const currentWidth = getCurrentWidth(currentWidget);
            const currentHeight = getCurrentHeight(currentWidget);
            
            // Get min/max constraints
            const minWidth = parseInt(currentWidget.dataset.minWidth) || 2;
            const maxWidth = parseInt(currentWidget.dataset.maxWidth) || 4;
            const minHeight = parseInt(currentWidget.dataset.minHeight) || 2;
            const maxHeight = parseInt(currentWidget.dataset.maxHeight) || 4;
            
            // Set range constraints
            widthRange.min = minWidth;
            widthRange.max = maxWidth;
            widthRange.value = currentWidth;
            widthValue.textContent = currentWidth;
            
            heightRange.min = minHeight;
            heightRange.max = maxHeight;
            heightRange.value = currentHeight;
            heightValue.textContent = currentHeight;
            
            // Update labels on range change
            widthRange.oninput = function() {
                widthValue.textContent = this.value;
            };
            
            heightRange.oninput = function() {
                heightValue.textContent = this.value;
            };
            
            // Show modal
            resizeModal.show();
        });
    });
    
    // Apply resize
    if (applyBtn) {
        applyBtn.addEventListener('click', function() {
            if (!currentWidget) return;
            
            const newWidth = parseInt(widthRange.value);
            const newHeight = parseInt(heightRange.value);
            
            // Apply new dimensions
            currentWidget.style.gridColumn = `span ${newWidth}`;
            currentWidget.style.gridRow = `span ${newHeight}`;
            
            // Close modal
            resizeModal.hide();
            
            console.log('Widget resized to', newWidth, 'x', newHeight);
        });
    }
}

// Helper functions to get current dimensions
function getCurrentWidth(element) {
    const style = element.style.gridColumn;
    const match = style.match(/span (\d+)/);
    return match ? parseInt(match[1]) : 2;
}

function getCurrentHeight(element) {
    const style = element.style.gridRow;
    const match = style.match(/span (\d+)/);
    return match ? parseInt(match[1]) : 2;
}

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
console.log('- Drag and drop reordering (Edit mode)');
console.log('- Widget resizing with constraints (Edit mode)');
console.log('- Interactive to-do list');
console.log('- Responsive grid layout');
