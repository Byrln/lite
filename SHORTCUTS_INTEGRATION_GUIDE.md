# Shortcuts Helper Integration Guide

This guide explains how to integrate and use the enhanced shortcuts helper across different pages in the application.

## Global Implementation

The shortcuts helper is already implemented globally through the dashboard layout. The `Alt + H` keyboard shortcut works on any page to open the shortcuts guide.

### Global Keyboard Shortcuts

The following shortcuts are available globally across all pages:

- **Alt + H**: Open shortcuts helper modal
- **Ctrl + K**: Open command palette
- **F2**: Create new reservation
- **Ctrl + S**: Save current form
- **Esc**: Close modal/cancel action

## Page-Specific Integration Examples

### 1. Handsontable Pages

**Location**: `src/pages/handsontable/index.tsx`

The handsontable pages already have specific shortcuts implemented:

```typescript
// In dashboard layout (src/components/layouts/dashboard/index.tsx)
const isHandsontablePage = router.pathname.includes('/handsontable')

// Refresh shortcut for handsontable pages
useEffect(() => {
  const handleKeyDown = (event: KeyboardEvent) => {
    if (
      isHandsontablePage &&
      (event.key === 'r' || event.key === 'R') &&
      (event.metaKey || event.ctrlKey) &&
      !event.shiftKey &&
      !event.altKey
    ) {
      event.preventDefault()
      handleRefresh()
    }
  }

  window.addEventListener('keydown', handleKeyDown)
  return () => window.removeEventListener('keydown', handleKeyDown)
}, [isHandsontablePage, isCalendarLoading])
```

**Available Shortcuts in Handsontable:**
- **Ctrl + R**: Refresh calendar data
- **Alt + B**: Toggle calendar modal
- **Arrow Keys**: Navigate between cells
- **Enter**: Edit selected cell
- **Tab**: Move to next cell
- **Shift + Tab**: Move to previous cell

### 2. Rate Pages

**Location**: `src/pages/rate/index.tsx`

To add shortcuts to rate pages, you can implement page-specific shortcuts:

```typescript
// Add to rate page component
import { useEffect } from 'react';
import { useIntl } from 'react-intl';

const RatePage = () => {
  const intl = useIntl();

  // Page-specific shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Ctrl + N: New rate
      if (
        (event.key === 'n' || event.key === 'N') &&
        (event.metaKey || event.ctrlKey) &&
        !event.shiftKey &&
        !event.altKey
      ) {
        event.preventDefault()
        // Handle new rate creation
        console.log('Create new rate')
      }

      // Ctrl + E: Edit selected rate
      if (
        (event.key === 'e' || event.key === 'E') &&
        (event.metaKey || event.ctrlKey) &&
        !event.shiftKey &&
        !event.altKey
      ) {
        event.preventDefault()
        // Handle edit selected rate
        console.log('Edit selected rate')
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    // Your rate page content
  )
}
```

**Available Shortcuts in Rate Pages:**
- **Ctrl + N**: Create new rate
- **Ctrl + E**: Edit selected rate
- **Delete**: Delete selected rate
- **Ctrl + F**: Search rates
- **Tab**: Navigate between form fields

### 3. Adding Shortcuts Helper Button to Specific Pages

If you want to add a visible shortcuts helper button to specific pages:

```typescript
import { useState } from 'react';
import { IconButton, Tooltip } from '@mui/material';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import ShortcutsHelp from '@/components/common/shortcuts-help';

const YourPageComponent = () => {
  const [shortcutsOpen, setShortcutsOpen] = useState(false);

  return (
    <>
      {/* Your page content */}
      
      {/* Shortcuts helper button */}
      <Tooltip title="Keyboard Shortcuts (Alt + H)">
        <IconButton
          onClick={() => setShortcutsOpen(true)}
          sx={{
            position: 'fixed',
            bottom: 20,
            right: 20,
            backgroundColor: 'primary.main',
            color: 'white',
            '&:hover': {
              backgroundColor: 'primary.dark',
            },
            zIndex: 1000,
          }}
        >
          <HelpOutlineIcon />
        </IconButton>
      </Tooltip>

      {/* Shortcuts helper modal */}
      <ShortcutsHelp
        open={shortcutsOpen}
        onClose={() => setShortcutsOpen(false)}
      />
    </>
  )
}
```

## Customizing Shortcuts for Different Pages

### 1. Context-Aware Shortcuts

You can customize the shortcuts helper to show different shortcuts based on the current page:

```typescript
// In your page component
const router = useRouter();
const currentPage = router.pathname;

// Filter shortcuts based on current page
const getPageSpecificShortcuts = () => {
  if (currentPage.includes('/handsontable')) {
    return 'calendar'; // Show calendar-specific shortcuts
  } else if (currentPage.includes('/rate')) {
    return 'rate'; // Show rate-specific shortcuts
  } else if (currentPage.includes('/front-office')) {
    return 'frontOffice'; // Show front-office shortcuts
  }
  return 'general'; // Show general shortcuts
};
```

### 2. Adding New Shortcuts to Translation Files

To add new shortcuts, update the translation files:

**English** (`src/i18n/en-shortcuts.json`):
```json
{
  "shortcuts": {
    "table": {
      "shortcuts": [
        {
          "shortcut": "Ctrl + N",
          "action": "New Rate",
          "description": "Create a new rate in the current context"
        }
      ]
    }
  }
}
```

**Mongolian** (`src/i18n/mon-shortcuts.json`):
```json
{
  "shortcuts": {
    "table": {
      "shortcuts": [
        {
          "shortcut": "Ctrl + N",
          "action": "Шинэ үнэ",
          "description": "Одоогийн контекстэд шинэ үнэ үүсгэх"
        }
      ]
    }
  }
}
```

## Best Practices

### 1. Consistent Shortcut Patterns
- **Ctrl + N**: New item
- **Ctrl + E**: Edit selected item
- **Ctrl + S**: Save
- **Ctrl + F**: Search/Find
- **Delete**: Delete selected item
- **F2**: Quick action (context-specific)
- **Esc**: Cancel/Close

### 2. Accessibility
- Always provide visual indicators for shortcuts (tooltips, help text)
- Ensure shortcuts don't conflict with browser shortcuts
- Test shortcuts with screen readers

### 3. User Experience
- Keep shortcuts intuitive and memorable
- Provide the shortcuts helper (Alt + H) on every page
- Show keyboard shortcuts in tooltips and help text

## Implementation Checklist

- [ ] Global shortcuts work on all pages (Alt + H, Ctrl + K, etc.)
- [ ] Page-specific shortcuts are implemented where needed
- [ ] Translation files are updated with new shortcuts
- [ ] Shortcuts are documented in the helper modal
- [ ] Visual indicators (tooltips) show shortcuts
- [ ] No conflicts with browser shortcuts
- [ ] Shortcuts work consistently across different browsers

## Examples of Page-Specific Implementations

### Dashboard Pages
- **Ctrl + R**: Refresh dashboard data
- **Alt + B**: Toggle calendar view

### Front Office Pages
- **F2**: New guest registration
- **Ctrl + F**: Find guest/reservation
- **Ctrl + S**: Save reservation

### Reservation Pages
- **F2**: Create new reservation
- **Ctrl + D**: Duplicate reservation
- **Ctrl + P**: Print reservation

### Calendar/Handsontable Pages
- **Ctrl + R**: Refresh calendar
- **Arrow Keys**: Navigate cells
- **Enter**: Edit cell
- **Tab/Shift+Tab**: Move between cells

This integration approach ensures that shortcuts are available globally while allowing for page-specific customizations and maintaining a consistent user experience across the application.