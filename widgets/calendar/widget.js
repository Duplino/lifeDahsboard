// Calendar Widget JavaScript
(function() {
    'use strict';

    class CalendarWidget {
        constructor(container, settings, size) {
            this.container = container;
            this.settings = settings || {};
            this.size = size || { width: 0, height: 0 };
            this.maxEvents = this.settings.maxEvents || 5;
            this.init();
        }

        init() {
            // Placeholder - events are hardcoded in HTML for now
            // In a real implementation, this would fetch events from an API or localStorage
        }
        
        onResize(size) {
            // Called when the widget is resized
            this.size = size;
            console.log(`Calendar widget resized to ${size.width}x${size.height}`);
        }

        updateSettings(settings) {
            this.settings = settings;
            this.maxEvents = settings.maxEvents || 5;
            // Re-render events with new max limit if needed
        }

        destroy() {
            // Cleanup if needed
        }
    }

    // Export to global scope
    window.CalendarWidget = CalendarWidget;
})();
