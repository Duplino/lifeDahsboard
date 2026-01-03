// Clock Widget JavaScript
(function() {
    'use strict';

    class ClockWidget {
        constructor(container, settings, size) {
            this.container = container;
            this.settings = settings || {};
            this.size = size || { width: 0, height: 0 };
            this.format24Hour = this.settings.format24Hour || false;
            this.showSeconds = this.settings.showSeconds !== undefined ? this.settings.showSeconds : true;
            this.interval = null;
            this.init();
        }

        init() {
            this.updateClock();
            this.interval = setInterval(() => this.updateClock(), 1000);
            this.applyStyling();
        }

        updateClock() {
            const now = new Date();
            
            // Update time
            let hours = now.getHours();
            const minutes = String(now.getMinutes()).padStart(2, '0');
            const seconds = String(now.getSeconds()).padStart(2, '0');
            
            let timeString;
            if (this.format24Hour) {
                hours = String(hours).padStart(2, '0');
                timeString = this.showSeconds ? `${hours}:${minutes}:${seconds}` : `${hours}:${minutes}`;
            } else {
                const ampm = hours >= 12 ? 'PM' : 'AM';
                hours = hours % 12 || 12;
                timeString = this.showSeconds ? `${hours}:${minutes}:${seconds} ${ampm}` : `${hours}:${minutes} ${ampm}`;
            }
            
            const timeElement = this.container.querySelector('#currentTime, .time');
            if (timeElement) {
                timeElement.textContent = timeString;
            }
            
            // Update date
            const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
            const dateString = now.toLocaleDateString('en-US', options);
            
            const dateElement = this.container.querySelector('#currentDate, .date');
            if (dateElement) {
                dateElement.textContent = dateString;
            }
            
            // Update pinned time if it exists
            this.updatePinnedTime();
        }
        
        applyStyling() {
            // Apply different styling based on widget size
            const clockDisplay = this.container.querySelector('.clock-display');
            if (!clockDisplay) return;
            
            // Reset classes
            clockDisplay.classList.remove('clock-compact', 'clock-large');
            
            // Small widget (width 2 or height 2)
            if (this.size.width <= 2 || this.size.height <= 2) {
                clockDisplay.classList.add('clock-compact');
            }
            // Large widget (width >= 4 or height >= 4)
            else if (this.size.width >= 4 || this.size.height >= 4) {
                clockDisplay.classList.add('clock-large');
            }
        }
        
        onResize(size) {
            // Called when the widget is resized
            this.size = size;
            this.applyStyling();
        }
        
        updatePinnedTime() {
            const pinnedTimeElement = document.getElementById('pinnedTime');
            if (pinnedTimeElement) {
                const now = new Date();
                let hours = now.getHours();
                const minutes = String(now.getMinutes()).padStart(2, '0');
                
                let timeString;
                if (this.format24Hour) {
                    hours = String(hours).padStart(2, '0');
                    timeString = `${hours}:${minutes}`;
                } else {
                    const ampm = hours >= 12 ? 'PM' : 'AM';
                    hours = hours % 12 || 12;
                    timeString = `${hours}:${minutes} ${ampm}`;
                }
                
                pinnedTimeElement.textContent = timeString;
            }
        }

        updateSettings(settings) {
            this.settings = settings;
            this.format24Hour = settings.format24Hour || false;
            this.showSeconds = settings.showSeconds !== undefined ? settings.showSeconds : true;
            this.updateClock();
        }

        getPinnedHTML() {
            const now = new Date();
            let hours = now.getHours();
            const minutes = String(now.getMinutes()).padStart(2, '0');
            
            let timeString;
            if (this.format24Hour) {
                hours = String(hours).padStart(2, '0');
                timeString = `${hours}:${minutes}`;
            } else {
                const ampm = hours >= 12 ? 'PM' : 'AM';
                hours = hours % 12 || 12;
                timeString = `${hours}:${minutes} ${ampm}`;
            }
            
            return `
                <i class="bi bi-clock"></i>
                <div class="pinned-content">
                    <span class="pinned-label">Time</span>
                    <span class="pinned-value" id="pinnedTime">${timeString}</span>
                </div>
            `;
        }

        destroy() {
            if (this.interval) {
                clearInterval(this.interval);
                this.interval = null;
            }
        }
    }

    // Export to global scope
    window.ClockWidget = ClockWidget;
})();
