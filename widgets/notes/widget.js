// Notes Widget JavaScript
(function() {
    'use strict';

    class NotesWidget {
        constructor(container, settings, size) {
            this.container = container;
            this.settings = settings || {};
            this.size = size || { width: 0, height: 0 };
            this.autoSave = this.settings.autoSave !== undefined ? this.settings.autoSave : true;
            this.storageKey = 'widget_notes_data';
            this.saveTimeout = null;
            this.init();
        }

        init() {
            this.loadNotes();
            this.attachEventListeners();
        }

        loadNotes() {
            const stored = localStorage.getItem(this.storageKey);
            const textarea = this.container.querySelector('#notesTextarea, .notes-textarea');
            
            if (textarea) {
                if (stored) {
                    textarea.value = stored;
                } else {
                    // Default notes
                    textarea.value = 'Remember to:\n- Back up important files\n- Update passwords quarterly\n- Schedule regular breaks';
                }
            }
        }

        saveNotes() {
            const textarea = this.container.querySelector('#notesTextarea, .notes-textarea');
            if (textarea) {
                localStorage.setItem(this.storageKey, textarea.value);
            }
        }

        attachEventListeners() {
            const textarea = this.container.querySelector('#notesTextarea, .notes-textarea');
            
            if (textarea) {
                textarea.addEventListener('input', () => {
                    if (this.autoSave) {
                        // Debounce the save
                        if (this.saveTimeout) {
                            clearTimeout(this.saveTimeout);
                        }
                        this.saveTimeout = setTimeout(() => {
                            this.saveNotes();
                        }, 500);
                    }
                });

                textarea.addEventListener('blur', () => {
                    // Always save on blur
                    this.saveNotes();
                });
            }
        }
        
        onResize(size) {
            // Called when the widget is resized
            this.size = size;
            console.log(`Notes widget resized to ${size.width}x${size.height}`);
        }

        updateSettings(settings) {
            this.settings = settings;
            this.autoSave = settings.autoSave !== undefined ? settings.autoSave : true;
        }

        destroy() {
            if (this.saveTimeout) {
                clearTimeout(this.saveTimeout);
            }
            this.saveNotes(); // Save on destroy
        }
    }

    // Export to global scope
    window.NotesWidget = NotesWidget;
})();
