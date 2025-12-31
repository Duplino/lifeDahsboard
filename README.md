# Life Dashboard

A beautiful, responsive personal dashboard built with Bootstrap 5.3, featuring customizable widgets for weather, time, calendar events, to-do notes, and more.

## Features

- **Modern Design**: Clean, gradient-based UI with smooth animations
- **Responsive Layout**: Grid-based layout that adapts to different screen sizes
- **Modular Widget System**: Each widget is self-contained with its own HTML, CSS, and JavaScript
- **Widget Manifests**: Configuration files for each widget with settings, sizes, and metadata
- **LocalStorage Persistence**: Dashboard layout, widget positions, sizes, and data are saved automatically
- **Widget Data Storage**: Widgets can save their own data (todos, notes, etc.) to localStorage
- **Customizable Widgets**: 6 different widget types included
- **Widget Settings**: Each widget has configurable settings (e.g., Celsius/Fahrenheit for weather)
- **Edit Mode**: Hover over the title to reveal the edit button
- **Drag & Drop**: Reorder widgets by dragging them (in edit mode)
- **Resizable Widgets**: Each widget has min/max width and height constraints
- **Pin to Top Bar**: Pin important widgets (weather, time) to the top bar for quick access
- **Hide/Show Widgets**: Temporarily hide widgets and restore them when needed
- **Live Clock**: Real-time clock with date display
- **Interactive To-Do List**: Add, complete, and delete tasks with persistence
- **Quick Notes**: Text editor with auto-save functionality
- **Easy to Extend**: Add new widgets by creating a folder with manifest, HTML, CSS, and JS files

## Widget Types

1. **Weather Widget** - Displays temperature, conditions, and location
2. **Clock Widget** - Shows real-time clock and current date
3. **Calendar Widget** - Lists upcoming events
4. **To-Do Notes Widget** - Interactive checklist for tasks
5. **Quick Notes Widget** - Editable text area for notes
6. **Fitness Tracker Widget** - Displays fitness stats (steps, heart rate, calories)

## Widget Constraints

Each widget has predefined minimum and maximum sizes:

- **Weather**: Width 2-4 columns, Height 2-3 rows
- **Clock**: Width 2-3 columns, Height 2 rows
- **Calendar**: Width 2-4 columns, Height 3-4 rows
- **To-Do**: Width 2-3 columns, Height 3-4 rows
- **Notes**: Width 2-4 columns, Height 2-4 rows
- **Fitness**: Width 2-3 columns, Height 2-3 rows

## Usage

### Opening the Dashboard

Simply open `index.html` in a web browser. No build process or server required.

Alternatively, serve it with a simple HTTP server:
```bash
python3 -m http.server 8080
# Then open http://localhost:8080 in your browser
```

### Edit Mode

1. **Activate Edit Mode**: Hover over the "Life Dashboard" title to reveal the "Edit Layout" button, then click it
2. **Reorder Widgets**: In edit mode, drag widgets by their headers to reorder them
3. **Resize Widgets**: In edit mode, grab the bottom-right corner of any widget and drag to resize (respects min/max constraints)
4. **Pin Widgets**: Click the pin button on weather/time widgets to show data in the top bar
5. **Hide Widgets**: Click the eye icon to hide widgets; use the floating button (bottom-left) to restore them
6. **Save Layout**: Click "Save Layout" button to exit edit mode

### Interacting with Widgets

- **To-Do List**: Click checkboxes to mark tasks as complete
- **Quick Notes**: Click in the text area to add/edit notes
- **Clock**: Updates automatically every second
- **Pinned Data**: Pinned widgets display their data in the title bar for quick access

## Technologies Used

- **Bootstrap 5.3**: UI framework and responsive grid
- **Bootstrap Icons**: Icon library
- **Sortable.js**: Drag and drop functionality for reordering
- **Interact.js**: Drag-to-resize functionality by widget edges
- **Vanilla JavaScript**: No additional frameworks
- **CSS Grid**: 12-column flexible widget layout

## File Structure

```
lifeDashboard/
├── index.html          # Main HTML file
├── style.css           # Global styles
├── script.js           # Dashboard core functionality
├── apps.json           # List of available widgets
├── widgets/            # Modular widget system
│   ├── README.md       # Widget development guide
│   ├── weather/        # Weather widget
│   ├── clock/          # Clock widget
│   ├── calendar/       # Calendar widget
│   ├── todo/           # To-Do widget
│   ├── notes/          # Notes widget
│   └── fitness/        # Fitness widget
└── README.md           # This file
```

## Customization

### Adding New Widgets

1. Add a new `.widget-container` in `index.html` with appropriate data attributes:
   ```html
   <div class="widget-container" data-widget="custom" 
        data-min-width="2" data-max-width="4" 
        data-min-height="2" data-max-height="3" 
        style="grid-column: span 2; grid-row: span 2;">
     <!-- Widget content -->
   </div>
   ```

2. Style the widget in `style.css`:
   ```css
   .custom-widget {
     background: linear-gradient(135deg, #color1, #color2);
   }
   ```

### Changing Widget Colors

Edit the gradient colors in `style.css` for each widget class (e.g., `.weather-widget`, `.clock-widget`, etc.)

### Modifying Grid Layout

The dashboard uses a 6-column grid by default. Modify in `style.css`:
```css
.dashboard-grid {
    grid-template-columns: repeat(6, 1fr);
}
```

## Browser Compatibility

- Chrome/Edge (recommended)
- Firefox
- Safari
- Opera

Modern browsers with CSS Grid support are required.

## Modular Widget System

The dashboard now uses a fully modular widget system where each widget is self-contained:

- Each widget has its own folder in `widgets/` with HTML, CSS, JS, and manifest.json
- Widgets are loaded dynamically based on `apps.json`
- Widget settings and layouts are saved to localStorage
- Easy to add new widgets - see `widgets/README.md` for documentation
- Widgets can have pinned versions for the top bar
- Each widget can define its own settings (boolean, number, text)
- Widgets can save their own data to localStorage

### Adding a New Widget

1. Create a folder in `widgets/` with your widget name
2. Add `manifest.json`, `widget.html`, `widget.css`, and `widget.js`
3. Add the folder name to `apps.json`
4. Refresh the dashboard!

See `widgets/README.md` for complete documentation.

## Future Enhancements

When ready to add API integrations:
- Connect weather widget to weather API
- Sync calendar with Google Calendar/Outlook
- Add more widget types (news, stocks, habit tracker, etc.)
- Theme customization options
- Import/export dashboard layouts
- Widget marketplace/sharing system

## License

Open source - feel free to use and modify as needed.