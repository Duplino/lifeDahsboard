// Clock Widget JavaScript
(function() {
    'use strict';

    class ClockWidget {
        constructor(container, settings) {
            this.container = container;
            this.settings = settings || {};
            this.format24Hour = this.settings.format24Hour || false;
            this.showSeconds = this.settings.showSeconds !== undefined ? this.settings.showSeconds : true;
            this.interval = null;
            this.init();
        }

        init() {
            this.updateClock();
            this.interval = setInterval(() => this.updateClock(), 1000);
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
