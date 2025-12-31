# Life Dashboard

A beautiful, responsive personal dashboard built with Bootstrap 5.3, featuring customizable widgets for weather, time, calendar events, to-do notes, and more.

## Features

- **Modern Design**: Clean, gradient-based UI with smooth animations
- **Responsive Layout**: Grid-based layout that adapts to different screen sizes
- **Customizable Widgets**: 6 different widget types included
- **Edit Mode**: Hover over the title to reveal the edit button
- **Drag & Drop**: Reorder widgets by dragging them (in edit mode)
- **Resizable Widgets**: Each widget has min/max width and height constraints
- **Live Clock**: Real-time clock with date display
- **Interactive To-Do List**: Check off completed tasks
- **No API Dependencies**: Pure design implementation with placeholder data

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
2. **Reorder Widgets**: In edit mode, drag widgets to reorder them
3. **Resize Widgets**: Click the resize button (↔) on any widget header to open the resize modal
4. **Save Layout**: Click "Save Layout" button to exit edit mode

### Interacting with Widgets

- **To-Do List**: Click checkboxes to mark tasks as complete
- **Quick Notes**: Click in the text area to add/edit notes
- **Clock**: Updates automatically every second

## Technologies Used

- **Bootstrap 5.3**: UI framework and responsive grid
- **Bootstrap Icons**: Icon library
- **Sortable.js**: Drag and drop functionality
- **Vanilla JavaScript**: No additional frameworks
- **CSS Grid**: For flexible widget layout

## File Structure

```
lifeDahsboard/
├── index.html          # Main HTML file with widget structure
├── style.css           # Custom styles and widget themes
├── script.js           # Interactive functionality
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

## Future Enhancements

When ready to add API integrations:
- Connect weather widget to weather API
- Sync calendar with Google Calendar/Outlook
- Persist widget layouts to localStorage
- Add more widget types (news, stocks, etc.)
- Theme customization options

## License

Open source - feel free to use and modify as needed.