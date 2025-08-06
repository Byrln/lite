import React, { useState, useEffect } from 'react';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Grid,
  Box,
  IconButton,
  Typography,
  InputAdornment,
} from '@mui/material';
import { Search as SearchIcon, Close as CloseIcon } from '@mui/icons-material';
import { Icon } from '@iconify/react';
import { useIntl } from 'react-intl';

interface IconPickerProps {
  onIconSelect: (iconName: string) => void;
  selectedIcon?: string;
  buttonText?: string;
}

interface IconifyIcon {
  name: string;
  collection: string;
}

const IconPicker: React.FC<IconPickerProps> = ({
  onIconSelect,
  selectedIcon = 'mdi:paperclip',
  buttonText = 'Select Icon'
}) => {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [icons, setIcons] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const intl = useIntl();
  // Default icons to show when no search is performed (90+ hotel/PMS relevant icons)
  const defaultIcons = [
    // Hotel Core Services
    'mdi:bed',
    'mdi:hotel',
    'mdi:door',
    'mdi:key',
    'mdi:key-variant',
    'mdi:room-service',
    'mdi:room-service-outline',
    'mdi:bell',
    'mdi:bell-ring',
    'mdi:account-tie',
    'mdi:desk',
    'mdi:sofa',
    'mdi:shower',
    'mdi:bathtub',
    'mdi:air-conditioner',
    'mdi:wifi',
    'mdi:television',
    'mdi:safe',
    'mdi:iron',
    'mdi:hanger',

    // Guest Services
    'mdi:account',
    'mdi:account-group',
    'mdi:account-plus',
    'mdi:account-check',
    'mdi:luggage',
    'mdi:briefcase',
    'mdi:passport',
    'mdi:id-card',
    'mdi:credit-card',
    'mdi:cash',
    'mdi:receipt',
    'mdi:invoice',
    'mdi:calendar-check',
    'mdi:calendar-clock',
    'mdi:clock',
    'mdi:timer',

    // Food & Beverage
    'mdi:food',
    'mdi:food-fork-drink',
    'mdi:silverware',
    'mdi:coffee',
    'mdi:tea',
    'mdi:wine',
    'mdi:beer',
    'mdi:bottle-wine',
    'mdi:glass-cocktail',
    'mdi:cake',
    'mdi:pizza',
    'mdi:ice-cream',
    'mdi:restaurant',
    'mdi:chef-hat',

    // Housekeeping & Maintenance
    'mdi:broom',
    'mdi:vacuum',
    'mdi:washing-machine',
    'mdi:tumble-dryer',
    'mdi:spray',
    'mdi:wrench',
    'mdi:hammer',
    'mdi:screwdriver',
    'mdi:tools',
    'mdi:cog',
    'mdi:settings',
    'mdi:clipboard-check',
    'mdi:clipboard-list',

    // Communication & Technology
    'mdi:phone',
    'mdi:cellphone',
    'mdi:email',
    'mdi:message',
    'mdi:chat',
    'mdi:laptop',
    'mdi:printer',
    'mdi:fax',
    'mdi:router-wireless',

    // Transportation
    'mdi:car',
    'mdi:taxi',
    'mdi:bus',
    'mdi:airplane',
    'mdi:train',
    'mdi:ship',
    'mdi:parking',
    'mdi:garage',

    // General Business
    'mdi:office-building',
    'mdi:bank',
    'mdi:chart-line',
    'mdi:chart-pie',
    'mdi:calculator',
    'mdi:currency-usd',
    'mdi:percent',
    'mdi:tag',
    'mdi:barcode',
    'mdi:qrcode',

    // Common Actions
    'mdi:check',
    'mdi:close',
    'mdi:plus',
    'mdi:minus',
    'mdi:pencil',
    'mdi:delete',
    'mdi:eye',
    'mdi:eye-off',
    'mdi:lock',
    'mdi:lock-open',
    'mdi:star',
    'mdi:heart',
    'mdi:thumb-up',
    'mdi:flag'
  ];

  useEffect(() => {
    if (!searchQuery) {
      setIcons(defaultIcons);
      return;
    }

    const searchIcons = async () => {
      setLoading(true);
      try {
        const response = await fetch(`https://api.iconify.design/search?query=${encodeURIComponent(searchQuery)}&limit=90`);
        const data = await response.json();
        setIcons(data.icons || []);
      } catch (error) {
        console.error('Error fetching icons:', error);
        setIcons([]);
      } finally {
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(searchIcons, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  const handleIconSelect = (iconName: string) => {
    onIconSelect(iconName);
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
    setSearchQuery('');
    setIcons(defaultIcons);
  };

  return (
    <>
      <Button
        variant="outlined"
        onClick={handleOpen}
        startIcon={<Icon icon={selectedIcon} />}
        endIcon={<Icon icon="mdi:chevron-down" />}
        sx={{
          textTransform: 'none',
          borderRadius: 1,
          px: 2,
          py: 1,
          mr: 1.8,
          border: '1px solid #bda4ee',
          '&:hover': {
            border: '1px solid #8854e4',
          }
        }}
      >
        {intl.formatMessage({ id: 'ButtonSelectIcon' })}
      </Button>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            minHeight: '500px'
          }
        }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">{intl.formatMessage({ id: "ButtonSelectIcon" })}</Typography>
            <IconButton onClick={() => setOpen(false)} size="small">
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>

        <DialogContent>
          <TextField
            fullWidth
            placeholder={intl.formatMessage({ id: 'PlaceholderSearchIcon' })}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            sx={{ mb: 3 }}
          />

          <Box sx={{ maxHeight: '400px', overflowY: 'auto' }}>
            {loading ? (
              <Box display="flex" justifyContent="center" py={4}>
                <Typography>{intl.formatMessage({ id: "TextLoadingIcons" })}</Typography>
              </Box>
            ) : (
              <Grid container spacing={1}>
                {icons.map((iconName) => (
                  <Grid item xs={2} sm={1.5} md={1} key={iconName}>
                    <IconButton
                      onClick={() => handleIconSelect(iconName)}
                      sx={{
                        width: '100%',
                        aspectRatio: '1',
                        border: selectedIcon === iconName ? '2px solid #1976d2' : '1px solid #e0e0e0',
                        borderRadius: 2,
                        '&:hover': {
                          transition: 'all 0.2s linear',
                          border: '2px solid #8854e4',
                          color: "#8854e4",
                          backgroundColor: '#f5f5f5'
                        }
                      }}
                    >
                      <Icon icon={iconName} width={24} height={24} />
                    </IconButton>
                  </Grid>
                ))}
              </Grid>
            )}

            {!loading && icons.length === 0 && (
              <Box display="flex" justifyContent="center" py={4}>
                <Typography color="text.secondary">
                  {intl.formatMessage({ id: "TextNoIconsFound" })}
                </Typography>
              </Box>
            )}
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default IconPicker;