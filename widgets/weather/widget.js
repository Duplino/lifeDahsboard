// Weather Widget JavaScript
(function() {
    'use strict';

    class WeatherWidget {
        constructor(container, settings) {
            this.container = container;
            this.settings = settings || {};
            this.useCelsius = this.settings.temperatureUnit || false;
            this.location = this.settings.location || 'San Francisco, CA';
            this.init();
        }

        init() {
            // Update location if specified in settings
            const locationElement = this.container.querySelector('.location');
            if (locationElement) {
                locationElement.textContent = this.location;
            }

            // Convert temperature if needed
            this.updateTemperature();
        }

        updateTemperature() {
            const tempElement = this.container.querySelector('.temperature');
            if (tempElement) {
                const fahrenheit = 72;
                if (this.useCelsius) {
                    const celsius = Math.round((fahrenheit - 32) * 5 / 9);
                    tempElement.textContent = `${celsius}°C`;
                } else {
                    tempElement.textContent = `${fahrenheit}°F`;
                }
            }
        }

        updateSettings(settings) {
            this.settings = settings;
            this.useCelsius = settings.temperatureUnit || false;
            this.location = settings.location || this.location;
            this.init();
        }

        getPinnedHTML() {
            const tempElement = this.container.querySelector('.temperature');
            const descElement = this.container.querySelector('.weather-desc');
            const temp = tempElement ? tempElement.textContent : '72°F';
            const desc = descElement ? descElement.textContent : 'Partly Cloudy';
            
            return `
                <i class="bi bi-cloud-sun-fill"></i>
                <div class="pinned-content">
                    <span class="pinned-label">Weather</span>
                    <span class="pinned-value">${temp} ${desc}</span>
                </div>
            `;
        }

        destroy() {
            // Cleanup if needed
        }
    }

    // Export to global scope
    window.WeatherWidget = WeatherWidget;
})();
