import React, { useState, useMemo } from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  TextField,
  InputAdornment
} from '@mui/material';
import { Box, Typography, Grid, Chip, Divider } from '@mui/material';
import { useIntl } from 'react-intl';
import { useRouter } from 'next/router';
import KeyboardIcon from '@mui/icons-material/Keyboard';
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
import IconButton from '@mui/material/IconButton';

interface ShortcutsHelpProps {
  open: boolean;
  onClose: () => void;
}

interface Shortcut {
  keys: string[];
  description: string;
  category: string;
}

const ShortcutsHelp: React.FC<ShortcutsHelpProps> = ({ open, onClose }) => {
  const intl = useIntl();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');

  // Get page-specific shortcuts based on current route
  const getPageSpecificShortcuts = (): Shortcut[] => {
    const currentPath = router.pathname;

    // Global shortcuts available on all pages
    const globalShortcuts: Shortcut[] = [
      {
        keys: ['Alt', 'H'],
        description: 'Show Keyboard Shortcuts Help',
        category: 'Global'
      },
      {
        keys: ['Ctrl', 'K'],
        description: 'Open Command Palette - Quick search and navigation',
        category: 'Global'
      },
      {
        keys: ['Esc'],
        description: 'Close Command Palette, Modal or Dialog',
        category: 'Global'
      },
      {
        keys: ['F2'],
        description: 'Create New Reservation',
        category: 'Global'
      }
    ];

    // Page-specific shortcuts
    let pageShortcuts: Shortcut[] = [];

    if (currentPath.includes('/handsontable')) {
      pageShortcuts = [
        {
          keys: ['Ctrl', 'R'],
          description: 'Refresh/Reload Calendar Data',
          category: 'Handsontable/Calendar'
        },
        {
          keys: ['Alt', 'B'],
          description: 'Toggle Calendar Modal',
          category: 'Handsontable/Calendar'
        },
        {
          keys: ['Arrow Keys'],
          description: 'Navigate between calendar cells',
          category: 'Handsontable/Calendar'
        },
        {
          keys: ['Enter'],
          description: 'Edit selected cell or confirm changes',
          category: 'Handsontable/Calendar'
        },
        {
          keys: ['Tab'],
          description: 'Move to next cell',
          category: 'Handsontable/Calendar'
        },
        {
          keys: ['Shift', 'Tab'],
          description: 'Move to previous cell',
          category: 'Handsontable/Calendar'
        }
      ];
    } else if (currentPath.includes('/dashboard')) {
      pageShortcuts = [
        {
          keys: ['Ctrl', 'R'],
          description: 'Refresh Dashboard Data',
          category: 'Dashboard'
        },
        {
          keys: ['Alt', 'B'],
          description: 'Toggle Calendar View',
          category: 'Dashboard'
        }
      ];
    } else if (currentPath.includes('/front-office')) {
      pageShortcuts = [
        {
          keys: ['Ctrl', 'N'],
          description: 'New Guest Registration',
          category: 'Front Office'
        },
        {
          keys: ['Ctrl', 'F'],
          description: 'Find Guest/Reservation',
          category: 'Front Office'
        }
      ];
    } else if (currentPath.includes('/reservation')) {
      pageShortcuts = [
        {
          keys: ['Ctrl', 'S'],
          description: 'Save Reservation',
          category: 'Reservations'
        },
        {
          keys: ['Ctrl', 'D'],
          description: 'Duplicate Reservation',
          category: 'Reservations'
        }
      ];
    }

    return [...globalShortcuts, ...pageShortcuts];
  };

  const shortcuts: Shortcut[] = getPageSpecificShortcuts();


  // Filter shortcuts based on search term
  const filteredShortcuts = useMemo(() => {
    if (!searchTerm) return shortcuts;
    return shortcuts.filter(shortcut =>
      shortcut.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shortcut.keys.some(key => key.toLowerCase().includes(searchTerm.toLowerCase())) ||
      shortcut.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  const categories = Array.from(new Set(filteredShortcuts.map(s => s.category)));

  const renderKeyChip = (key: string) => (
    <Chip
      key={key}
      label={key}
      size="small"
      sx={{
        backgroundColor: '#f5f5f5',
        color: '#333',
        fontFamily: 'monospace',
        fontWeight: 'bold',
        fontSize: '0.75rem',
        height: '24px',
        border: '1px solid #ddd',
        borderRadius: '4px',
        margin: '0 2px'
      }}
    />
  );

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          maxHeight: '80vh'
        }
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 2, pb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <KeyboardIcon sx={{ color: '#804fe6' }} />
          <DialogTitle sx={{ p: 0, fontSize: '1.25rem', fontWeight: 600 }}>
            Keyboard Shortcuts
          </DialogTitle>
        </Box>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </Box>

      <DialogContent sx={{ pt: 2 }}>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Use these keyboard shortcuts to navigate and work more efficiently in the system.
        </Typography>

        <Box sx={{ mb: 3, p: 2, backgroundColor: '#e3f2fd', borderRadius: 1, border: '1px solid #bbdefb' }}>
          <Typography variant="body2" sx={{ fontWeight: 600, color: '#1976d2', mb: 0.5 }}>
            📍 Current Page: {router.pathname.includes('/handsontable') ? 'Calendar/Handsontable' :
              router.pathname.includes('/dashboard') ? 'Dashboard' :
                router.pathname.includes('/front-office') ? 'Front Office' :
                  router.pathname.includes('/reservation') ? 'Reservations' : 'General'}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Shortcuts shown are relevant to your current page and globally available actions.
          </Typography>
        </Box>

        {/* Search Field */}
        <TextField
          fullWidth
          placeholder="Search shortcuts..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ mb: 3 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: '#666' }} />
              </InputAdornment>
            ),
          }}
          size="small"
        />

        {filteredShortcuts.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
              No shortcuts found
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Try searching with different keywords
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={3}>
            {categories.map((category) => (
              <Grid item xs={12} md={6} key={category}>
                <Box sx={{ mb: 2 }}>
                  <Typography
                    variant="h6"
                    sx={{
                      fontSize: '1rem',
                      fontWeight: 600,
                      color: '#804fe6',
                      mb: 1
                    }}
                  >
                    {category}
                  </Typography>
                  <Divider sx={{ mb: 2 }} />

                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                    {filteredShortcuts
                      .filter(shortcut => shortcut.category === category)
                      .map((shortcut, index) => (
                        <Box
                          key={index}
                          sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            py: 1,
                            px: 1.5,
                            backgroundColor: '#fafafa',
                            borderRadius: 1,
                            border: '1px solid #f0f0f0'
                          }}
                        >
                          <Typography
                            variant="body2"
                            sx={{
                              fontSize: '0.875rem',
                              color: '#333',
                              flex: 1
                            }}
                          >
                            {shortcut.description}
                          </Typography>

                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            {shortcut.keys.map((key, keyIndex) => (
                              <React.Fragment key={keyIndex}>
                                {keyIndex > 0 && (
                                  <Typography
                                    variant="body2"
                                    sx={{
                                      mx: 0.5,
                                      color: '#666',
                                      fontSize: '0.75rem'
                                    }}
                                  >
                                    +
                                  </Typography>
                                )}
                                {renderKeyChip(key)}
                              </React.Fragment>
                            ))}
                          </Box>
                        </Box>
                      ))
                    }
                  </Box>
                </Box>
              </Grid>
            ))}
          </Grid>
        )}

        <Box sx={{ mt: 4, p: 2, backgroundColor: '#f8f9fa', borderRadius: 1 }}>
          <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
            💡 <strong>Tip:</strong> Press <strong>Alt + H</strong> anytime to view this shortcuts guide.
          </Typography>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default ShortcutsHelp;