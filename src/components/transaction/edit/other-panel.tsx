import React from 'react';
import {
  Grid,
  Card,
  CardContent,
  Box,
  Typography,
  IconButton,
  Tooltip,
  Menu,
  MenuItem,
  Zoom,
} from '@mui/material';
import BusinessIcon from '@mui/icons-material/Business';
import { MoreVerticalIcon } from 'lucide-react';
import OtherInformation from 'components/transaction/other-information';
import CustomerReplace from '../../../pages/transaction/edit/customer-replace';
import { useIntl } from 'react-intl';

interface OtherPanelProps {
  transaction: any;
  customerAnchorEl: any;
  handleCustomerClick: (event: any) => void;
  handleCustomerClose: () => void;
  handleModal: (show: boolean, title: string, content: React.ReactNode) => void;
  router: any;
}

const OtherPanel: React.FC<OtherPanelProps> = ({
  transaction,
  customerAnchorEl,
  handleCustomerClick,
  handleCustomerClose,
  handleModal,
  router
}) => {
  const intl = useIntl();
  return (
    <Grid item xs={12} md={4}>
      <Zoom in={true} timeout={1000}>
        <Card
          sx={{
            borderRadius: '0 0 16px 16px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
            border: '1px solid rgba(0,0,0,0.04)',
            background: 'linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)',
            position: 'relative',
            overflow: 'visible',
            '&:hover': {
              boxShadow: '0 20px 40px rgba(0,0,0,0.12)',
            },
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: 4,
              background: 'linear-gradient(90deg, #fa709a 0%, #fee140 100%)',
              borderRadius: '16px 16px 0 0'
            }
          }}
        >
          <CardContent sx={{ p: 4 }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                mb: 3
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box
                  sx={{
                    p: 1.5,
                    borderRadius: 2,
                    background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <BusinessIcon sx={{ fontSize: 20 }} />
                </Box>
                <Box>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 700,
                      fontSize: '1.1rem',
                      color: 'text.primary',
                      mb: 0.5
                    }}
                  >
                    {intl.formatMessage({ id: 'transaction.other.title' })}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {intl.formatMessage({ id: 'transaction.other.subtitle' })}
                  </Typography>
                </Box>
              </Box>
              <Box>
                <Tooltip title={intl.formatMessage({ id: 'transaction.other.actions' })}>
                  <IconButton
                    onClick={handleCustomerClick}
                    sx={{
                      backgroundColor: 'warning.main',
                      color: 'white',
                      width: 30,
                      height: 30,
                      '&:hover': {
                        backgroundColor: 'warning.dark'
                      },
                      transition: 'all 0.3s ease'
                    }}
                  >
                    <MoreVerticalIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
                <Menu
                  id={`other`}
                  anchorEl={customerAnchorEl}
                  open={Boolean(customerAnchorEl)}
                  onClose={handleCustomerClose}
                >
                  <MenuItem
                    key={`customerReplace`}
                    onClick={() => {
                      handleModal(
                        true,
                        intl.formatMessage({ id: 'transaction.other.edit' }),
                        <CustomerReplace
                          TransactionID={router.query.id}
                        />
                      );
                    }}
                  >
                    {intl.formatMessage({ id: 'transaction.other.edit' })}
                  </MenuItem>
                </Menu>
              </Box>
            </Box>
            <OtherInformation
              reservationNo={transaction.ReservationNo}
              folioNo={transaction.FolioNo}
              checkInNo={transaction.CheckinNo}
              company={transaction.CustomerName}
            />
          </CardContent>
        </Card>
      </Zoom>
    </Grid>
  );
};

export default OtherPanel;