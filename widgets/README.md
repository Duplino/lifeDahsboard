# Widgets Folder

This folder contains all the modular widgets for the Life Dashboard. Each widget is self-contained with its own HTML, CSS, JavaScript, and manifest files.

## Folder Structure

Each widget has its own folder with the following structure:

```
widgets/
├── {widget-name}/
│   ├── manifest.json    # Widget configuration and settings
│   ├── widget.html      # Widget HTML template
│   ├── widget.css       # Widget-specific styles
│   ├── widget.js        # Widget JavaScript logic
│   ├── pinned.html      # (Optional) HTML for pinned version
│   └── pinned.css       # (Optional) CSS for pinned version
```

## Manifest File Structure

Each widget must have a `manifest.json` file with the following structure:

```json
{
  "name": "Widget Name",
  "description": "Widget description",
  "pinnable": true,
  "size": {
    "min": { "width": 2, "height": 2 },
    "default": { "width": 3, "height": 3 },
    "max": { "width": 6, "height": 6 }
  },
  "settings": {
    "settingName": {
      "type": "boolean|number|text",
      "label": "Setting Label",
      "default": "default value",
      "description": "Setting description"
    }
  }
}
```

### Manifest Properties

- **name**: Display name of the widget
- **description**: Brief description of what the widget does
- **pinnable**: Whether this widget can be pinned to the top bar
- **size**: Grid size constraints
  - **min**: Minimum grid size (width and height in grid units)
  - **default**: Default grid size when first added
  - **max**: Maximum grid size
- **settings**: Object containing widget-specific settings
  - Each setting has:
    - **type**: "boolean", "number", or "text"
    - **label**: Display label for the setting
    - **default**: Default value
    - **description**: Help text for the setting
    - **min/max**: (For number type) Minimum and maximum values

## Widget JavaScript Class

Each widget's JavaScript file should export a class with the following structure:

```javascript
(function() {
    'use strict';

    class MyWidget {
        constructor(container, settings) {
            this.container = container;  // The widget's DOM element
            this.settings = settings || {};  // Settings from localStorage
            this.init();
        }

        init() {
            // Initialize the widget
        }

        updateSettings(settings) {
            // Called when settings are changed
            this.settings = settings;
        }

        getPinnedHTML() {
            // (Optional) Return HTML for pinned version
            // Only needed if widget is pinnable
            return '<div>Pinned content</div>';
        }

        destroy() {
            // Cleanup when widget is removed
            // Clear intervals, remove event listeners, etc.
        }
    }

    // Export to global scope
    window.MyWidget = MyWidget;
})();
```

## Widget HTML Template

The HTML template should be a complete widget structure:

```html
<div class="widget my-widget">
    <div class="widget-header">
        <h5 class="widget-title">Widget Name</h5>
        <div class="widget-controls">
            <button class="btn btn-sm btn-light pin-btn" title="Pin to top bar">
                <i class="bi bi-pin-angle"></i>
            </button>
            <button class="btn btn-sm btn-light hide-btn" title="Hide widget">
                <i class="bi bi-eye-slash"></i>
            </button>
            <button class="btn btn-sm btn-light settings-btn" title="Settings">
                <i class="bi bi-gear"></i>
            </button>
        </div>
    </div>
    <div class="widget-content">
        <!-- Widget content goes here -->
    </div>
</div>
```

**Note**: Remove the pin button if the widget is not pinnable.

## LocalStorage Integration

Widgets can save and load data from localStorage:

### Widget-specific Data

Each widget can use its own localStorage key:

```javascript
// Save data
localStorage.setItem('widget_mywidget_data', JSON.stringify(data));

// Load data
const stored = localStorage.getItem('widget_mywidget_data');
const data = stored ? JSON.parse(stored) : defaultData;
```

### Widget Settings

Widget settings are managed automatically by the dashboard system and passed to the widget's constructor and `updateSettings()` method.

## Available Widgets

1. **Weather** - Displays current weather conditions
   - Pinnable: Yes
   - Settings: Temperature unit (Celsius/Fahrenheit), Location

2. **Clock** - Shows real-time clock and date
   - Pinnable: Yes
   - Settings: 24-hour format, Show seconds

3. **Calendar** - Lists upcoming events
   - Pinnable: No
   - Settings: Maximum events to display

4. **To-Do Notes** - Interactive task checklist
   - Pinnable: No
   - Settings: Show completed tasks, Sort by date
   - Saves todos to localStorage

5. **Quick Notes** - Text area for note-taking
   - Pinnable: No
   - Settings: Auto-save
   - Saves notes to localStorage

6. **Fitness Tracker** - Displays fitness statistics
   - Pinnable: No
   - Settings: Daily step goal, Daily calorie goal

## Adding a New Widget

1. Create a new folder in `widgets/` with your widget name
2. Create `manifest.json` with widget configuration
3. Create `widget.html` with the widget template
4. Create `widget.css` with widget-specific styles
5. Create `widget.js` with widget logic class
6. (Optional) Create `pinned.html` and `pinned.css` if widget is pinnable
7. Add widget folder name to `/apps.json` array
8. Refresh the dashboard - your widget will be loaded automatically!

## Best Practices

- Keep widgets self-contained and independent
- Use meaningful class names to avoid CSS conflicts
- Clean up resources in the `destroy()` method
- Save data to localStorage frequently for persistence
- Use debouncing for auto-save functionality
- Test widgets at different sizes (min, default, max)
- Provide clear setting descriptions for users
