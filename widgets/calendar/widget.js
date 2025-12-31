// Calendar Widget JavaScript
(function() {
    'use strict';

    class CalendarWidget {
        constructor(container, settings) {
            this.container = container;
            this.settings = settings || {};
            this.maxEvents = this.settings.maxEvents || 5;
            this.init();
        }

        init() {
            // Placeholder - events are hardcoded in HTML for now
            // In a real implementation, this would fetch events from an API or localStorage
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
