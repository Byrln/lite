import React, { useState, useMemo } from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  TextField,
  InputAdornment,
  Fade,
  Slide
} from '@mui/material';
import { Box, Typography, Grid, Chip, Divider, Card, CardContent } from '@mui/material';
import { useIntl } from 'react-intl';
import { useRouter } from 'next/router';
import KeyboardIcon from '@mui/icons-material/Keyboard';
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import SpeedIcon from '@mui/icons-material/Speed';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import IconButton from '@mui/material/IconButton';

interface ShortcutsHelpProps {
  open: boolean;
  onClose: () => void;
}

interface Shortcut {
  keys: string[];
  descriptionKey: string;
  categoryKey: string;
  icon?: React.ReactNode;
  highlight?: boolean;
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
        descriptionKey: 'shortcuts.help.show',
        categoryKey: 'shortcuts.category.global',
        icon: <KeyboardIcon sx={{ fontSize: 16, color: '#804fe6' }} />,
        highlight: true
      },
      {
        keys: ['Ctrl', 'K'],
        descriptionKey: 'shortcuts.commandPalette.open',
        categoryKey: 'shortcuts.category.global',
        icon: <RocketLaunchIcon sx={{ fontSize: 16, color: '#ff6b35' }} />,
        highlight: true
      },
      {
        keys: ['Esc'],
        descriptionKey: 'shortcuts.general.close',
        categoryKey: 'shortcuts.category.global',
        icon: <CloseIcon sx={{ fontSize: 16, color: '#666' }} />
      },
      {
        keys: ['F2'],
        descriptionKey: 'shortcuts.reservation.new',
        categoryKey: 'shortcuts.category.global',
        icon: <AutoAwesomeIcon sx={{ fontSize: 16, color: '#4caf50' }} />,
        highlight: true
      }
    ];

    // Page-specific shortcuts
    let pageShortcuts: Shortcut[] = [];

    if (currentPath.includes('/handsontable')) {
      pageShortcuts = [
        {
          keys: ['Ctrl', 'R'],
          descriptionKey: 'shortcuts.calendar.refresh',
          categoryKey: 'shortcuts.category.calendar',
          icon: <SpeedIcon sx={{ fontSize: 16, color: '#2196f3' }} />
        },
        {
          keys: ['Alt', 'B'],
          descriptionKey: 'shortcuts.calendar.toggleModal',
          categoryKey: 'shortcuts.category.calendar',
          icon: <AutoAwesomeIcon sx={{ fontSize: 16, color: '#9c27b0' }} />
        },
        {
          keys: ['Arrow Keys'],
          descriptionKey: 'shortcuts.calendar.navigate',
          categoryKey: 'shortcuts.category.calendar'
        },
        {
          keys: ['Enter'],
          descriptionKey: 'shortcuts.calendar.edit',
          categoryKey: 'shortcuts.category.calendar'
        },
        {
          keys: ['Tab'],
          descriptionKey: 'shortcuts.calendar.nextCell',
          categoryKey: 'shortcuts.category.calendar'
        },
        {
          keys: ['Shift', 'Tab'],
          descriptionKey: 'shortcuts.calendar.prevCell',
          categoryKey: 'shortcuts.category.calendar'
        }
      ];
    } else if (currentPath.includes('/dashboard')) {
      pageShortcuts = [
        {
          keys: ['Ctrl', 'R'],
          descriptionKey: 'shortcuts.dashboard.refresh',
          categoryKey: 'shortcuts.category.dashboard',
          icon: <SpeedIcon sx={{ fontSize: 16, color: '#2196f3' }} />
        },
        {
          keys: ['Alt', 'B'],
          descriptionKey: 'shortcuts.dashboard.toggleCalendar',
          categoryKey: 'shortcuts.category.dashboard',
          icon: <AutoAwesomeIcon sx={{ fontSize: 16, color: '#9c27b0' }} />
        }
      ];
    } else if (currentPath.includes('/front-office')) {
      pageShortcuts = [
        {
          keys: ['Ctrl', 'N'],
          descriptionKey: 'shortcuts.frontOffice.newGuest',
          categoryKey: 'shortcuts.category.frontOffice'
        },
        {
          keys: ['Ctrl', 'F'],
          descriptionKey: 'shortcuts.frontOffice.findGuest',
          categoryKey: 'shortcuts.category.frontOffice'
        }
      ];
    } else if (currentPath.includes('/reservation')) {
      pageShortcuts = [
        {
          keys: ['Ctrl', 'S'],
          descriptionKey: 'shortcuts.reservation.save',
          categoryKey: 'shortcuts.category.reservations'
        },
        {
          keys: ['Ctrl', 'D'],
          descriptionKey: 'shortcuts.reservation.duplicate',
          categoryKey: 'shortcuts.category.reservations'
        }
      ];
    }

    return [...globalShortcuts, ...pageShortcuts];
  };

  const shortcuts: Shortcut[] = getPageSpecificShortcuts();


  // Filter shortcuts based on search term
  const filteredShortcuts = useMemo(() => {
    if (!searchTerm) return shortcuts;
    return shortcuts.filter(shortcut => {
      const description = intl.formatMessage({ id: shortcut.descriptionKey, defaultMessage: shortcut.descriptionKey });
      const category = intl.formatMessage({ id: shortcut.categoryKey, defaultMessage: shortcut.categoryKey });
      return description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        shortcut.keys.some(key => key.toLowerCase().includes(searchTerm.toLowerCase())) ||
        category.toLowerCase().includes(searchTerm.toLowerCase());
    });
  }, [searchTerm, shortcuts, intl]);

  const categories = Array.from(new Set(filteredShortcuts.map(s => s.categoryKey)));

  const renderKeyChip = (key: string, isHighlighted = false) => (
    <Chip
      key={key}
      label={key}
      size="small"
      sx={{
        backgroundColor: isHighlighted ? 'linear-gradient(45deg, #804fe6, #ff6b35)' : '#f8f9fa',
        color: isHighlighted ? '#fff' : '#333',
        fontFamily: 'SF Mono, Monaco, Consolas, monospace',
        fontWeight: '600',
        fontSize: '0.75rem',
        height: '28px',
        border: isHighlighted ? 'none' : '1px solid #e0e0e0',
        borderRadius: '6px',
        margin: '0 3px',
        boxShadow: isHighlighted ? '0 2px 8px rgba(128, 79, 230, 0.3)' : '0 1px 3px rgba(0,0,0,0.1)',
        transition: 'all 0.2s ease',
        '&:hover': {
          transform: 'translateY(-1px)',
          boxShadow: isHighlighted ? '0 4px 12px rgba(128, 79, 230, 0.4)' : '0 2px 6px rgba(0,0,0,0.15)'
        }
      }}
    />
  );

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      TransitionComponent={Slide}
      TransitionProps={{ direction: 'up' } as any}
      PaperProps={{
        sx: {
          borderRadius: 3,
          maxHeight: '90vh',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          overflow: 'hidden'
        }
      }}
    >
      {/* Header with gradient background */}
      <Box sx={{ 
        background: 'rgba(255,255,255,0.1)', 
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(255,255,255,0.2)',
        p: 3
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{
              background: 'linear-gradient(45deg, #ff6b35, #f7931e)',
              borderRadius: '50%',
              p: 1.5,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <RocketLaunchIcon sx={{ color: 'white', fontSize: 28 }} />
            </Box>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
                {intl.formatMessage({ id: 'shortcuts.title', defaultMessage: 'Keyboard Shortcuts' })}
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.9 }}>
                {intl.formatMessage({ id: 'shortcuts.subtitle', defaultMessage: 'Master your workflow with these powerful shortcuts' })}
              </Typography>
            </Box>
          </Box>
          <IconButton 
            onClick={onClose} 
            sx={{ 
              color: 'white',
              backgroundColor: 'rgba(255,255,255,0.1)',
              '&:hover': { backgroundColor: 'rgba(255,255,255,0.2)' }
            }}
          >
            <CloseIcon />
          </IconButton>
        </Box>
      </Box>

      <DialogContent sx={{ 
        background: 'white',
        color: '#333',
        p: 4,
        minHeight: '60vh'
      }}>
        {/* Welcome message with animation */}
        <Fade in={open} timeout={800}>
          <Box sx={{ mb: 4, textAlign: 'center' }}>
            <Typography variant="h5" sx={{ fontWeight: 600, color: '#333', mb: 1 }}>
              {intl.formatMessage({ id: 'shortcuts.welcome', defaultMessage: '🚀 Boost Your Productivity!' })}
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
              {intl.formatMessage({ id: 'shortcuts.description', defaultMessage: 'Master these keyboard shortcuts to navigate faster and work more efficiently. Your fingers will thank you!' })}
            </Typography>
          </Box>
        </Fade>

        {/* Current page indicator */}
        <Card sx={{ 
          mb: 3, 
          background: 'linear-gradient(45deg, #667eea, #764ba2)',
          color: 'white',
          borderRadius: 2
        }}>
          <CardContent sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <SpeedIcon sx={{ color: '#fff' }} />
              <Typography variant="body1" sx={{ fontWeight: 600 }}>
                {intl.formatMessage({ id: 'shortcuts.currentPage', defaultMessage: 'Current Page' })}: 
                <span style={{ marginLeft: 8, fontWeight: 700 }}>
                  {router.pathname.includes('/handsontable') ? 
                    intl.formatMessage({ id: 'shortcuts.page.calendar', defaultMessage: 'Calendar/Handsontable' }) :
                    router.pathname.includes('/dashboard') ? 
                    intl.formatMessage({ id: 'shortcuts.page.dashboard', defaultMessage: 'Dashboard' }) :
                    router.pathname.includes('/front-office') ? 
                    intl.formatMessage({ id: 'shortcuts.page.frontOffice', defaultMessage: 'Front Office' }) :
                    router.pathname.includes('/reservation') ? 
                    intl.formatMessage({ id: 'shortcuts.page.reservations', defaultMessage: 'Reservations' }) : 
                    intl.formatMessage({ id: 'shortcuts.page.general', defaultMessage: 'General' })}
                </span>
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ opacity: 0.9, mt: 0.5 }}>
              {intl.formatMessage({ id: 'shortcuts.pageDescription', defaultMessage: 'Shortcuts are contextual and adapt to your current workspace' })}
            </Typography>
          </CardContent>
        </Card>

        {/* Enhanced Search Field */}
        <TextField
          fullWidth
          placeholder={intl.formatMessage({ id: 'shortcuts.search.placeholder', defaultMessage: '🔍 Search shortcuts, keys, or descriptions...' })}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ 
            mb: 4,
            '& .MuiOutlinedInput-root': {
              borderRadius: 3,
              backgroundColor: '#f8f9fa',
              '&:hover': {
                backgroundColor: '#e9ecef'
              },
              '&.Mui-focused': {
                backgroundColor: 'white',
                boxShadow: '0 0 0 3px rgba(128, 79, 230, 0.1)'
              }
            }
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: '#804fe6' }} />
              </InputAdornment>
            ),
          }}
        />

        {filteredShortcuts.length === 0 ? (
          <Fade in={true} timeout={600}>
            <Box sx={{ textAlign: 'center', py: 6 }}>
              <SearchIcon sx={{ fontSize: 64, color: '#e0e0e0', mb: 2 }} />
              <Typography variant="h5" color="text.secondary" sx={{ mb: 1, fontWeight: 600 }}>
                {intl.formatMessage({ id: 'shortcuts.noResults.title', defaultMessage: 'No shortcuts found' })}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {intl.formatMessage({ id: 'shortcuts.noResults.description', defaultMessage: 'Try searching with different keywords or browse all available shortcuts' })}
              </Typography>
            </Box>
          </Fade>
        ) : (
          <Grid container spacing={3}>
            {categories.map((categoryKey, categoryIndex) => (
              <Grid item xs={12} md={6} key={categoryKey}>
                <Fade in={true} timeout={800 + categoryIndex * 200}>
                  <Card sx={{ 
                    height: '100%',
                    borderRadius: 3,
                    border: '1px solid #e0e0e0',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 8px 25px rgba(0,0,0,0.1)'
                    }
                  }}>
                    <CardContent sx={{ p: 3 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                        <Box sx={{
                          background: 'linear-gradient(45deg, #804fe6, #667eea)',
                          borderRadius: '50%',
                          p: 1,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          <KeyboardIcon sx={{ color: 'white', fontSize: 20 }} />
                        </Box>
                        <Typography
                          variant="h6"
                          sx={{
                            fontSize: '1.1rem',
                            fontWeight: 700,
                            color: '#333'
                          }}
                        >
                          {intl.formatMessage({ id: categoryKey, defaultMessage: categoryKey })}
                        </Typography>
                      </Box>

                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        {filteredShortcuts
                          .filter(shortcut => shortcut.categoryKey === categoryKey)
                          .map((shortcut, index) => (
                            <Card
                              key={index}
                              sx={{
                                background: shortcut.highlight ? 
                                  'linear-gradient(45deg, rgba(128, 79, 230, 0.05), rgba(255, 107, 53, 0.05))' : 
                                  '#fafafa',
                                border: shortcut.highlight ? 
                                  '2px solid rgba(128, 79, 230, 0.2)' : 
                                  '1px solid #f0f0f0',
                                borderRadius: 2,
                                transition: 'all 0.2s ease',
                                '&:hover': {
                                  transform: 'translateX(4px)',
                                  boxShadow: shortcut.highlight ? 
                                    '0 4px 12px rgba(128, 79, 230, 0.2)' : 
                                    '0 2px 8px rgba(0,0,0,0.1)'
                                }
                              }}
                            >
                              <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                                <Box sx={{
                                  display: 'flex',
                                  justifyContent: 'space-between',
                                  alignItems: 'center',
                                  gap: 2
                                }}>
                                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flex: 1 }}>
                                    {shortcut.icon && (
                                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        {shortcut.icon}
                                      </Box>
                                    )}
                                    <Typography
                                      variant="body1"
                                      sx={{
                                        fontSize: '0.9rem',
                                        color: '#333',
                                        fontWeight: shortcut.highlight ? 600 : 400
                                      }}
                                    >
                                      {intl.formatMessage({ id: shortcut.descriptionKey, defaultMessage: shortcut.descriptionKey })}
                                    </Typography>
                                  </Box>

                                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, flexShrink: 0 }}>
                                    {shortcut.keys.map((key, keyIndex) => (
                                      <React.Fragment key={keyIndex}>
                                        {keyIndex > 0 && (
                                          <Typography
                                            variant="body2"
                                            sx={{
                                              mx: 0.5,
                                              color: '#999',
                                              fontSize: '0.75rem',
                                              fontWeight: 600
                                            }}
                                          >
                                            +
                                          </Typography>
                                        )}
                                        {renderKeyChip(key, shortcut.highlight)}
                                      </React.Fragment>
                                    ))}
                                  </Box>
                                </Box>
                              </CardContent>
                            </Card>
                          ))
                        }
                      </Box>
                    </CardContent>
                  </Card>
                </Fade>
              </Grid>
            ))}
          </Grid>
        )}

        {/* Enhanced footer with tips */}
        <Fade in={true} timeout={1200}>
          <Card sx={{ 
            mt: 4, 
            background: 'linear-gradient(45deg, #f8f9fa, #e9ecef)',
            borderRadius: 3,
            border: '1px solid #e0e0e0'
          }}>
            <CardContent sx={{ p: 3, textAlign: 'center' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mb: 2 }}>
                <AutoAwesomeIcon sx={{ color: '#804fe6', fontSize: 24 }} />
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#333' }}>
                  {intl.formatMessage({ id: 'shortcuts.tips.title', defaultMessage: 'Pro Tips' })}
                </Typography>
              </Box>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                {intl.formatMessage({ 
                  id: 'shortcuts.tips.altH', 
                  defaultMessage: '💡 Press Alt + H anytime to quickly access this shortcuts guide' 
                })}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {intl.formatMessage({ 
                  id: 'shortcuts.tips.practice', 
                  defaultMessage: '🎯 Practice these shortcuts daily to boost your productivity by up to 40%!' 
                })}
              </Typography>
            </CardContent>
          </Card>
        </Fade>
      </DialogContent>
    </Dialog>
  );
};

export default ShortcutsHelp;