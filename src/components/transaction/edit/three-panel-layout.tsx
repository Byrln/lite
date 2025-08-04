import React, { useState } from 'react';
import {
  Box,
  Grid,
  IconButton,
  Tooltip,
  Collapse,
  Typography,
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import TransactionHeader from './transaction-header';
import GuestPanel from './guest-panel';
import StayPanel from './stay-panel';
import OtherPanel from './other-panel';
import { useIntl } from 'react-intl';

interface ThreePanelLayoutProps {
  transaction: any;
  guestAnchorEl: any;
  stayAnchorEl: any;
  customerAnchorEl: any;
  handleGuestClick: (event: any) => void;
  handleGuestClose: () => void;
  handleStayClick: (event: any) => void;
  handleStayClose: () => void;
  handleCustomerClick: (event: any) => void;
  handleCustomerClose: () => void;
  handleModal: (show: boolean, title: string, content: React.ReactNode) => void;
  router: any;
  dispatch: any;
}

const ThreePanelLayout: React.FC<ThreePanelLayoutProps> = ({
  transaction,
  guestAnchorEl,
  stayAnchorEl,
  customerAnchorEl,
  handleGuestClick,
  handleGuestClose,
  handleStayClick,
  handleStayClose,
  handleCustomerClick,
  handleCustomerClose,
  handleModal,
  router,
  dispatch
}) => {
  const intl = useIntl();
  const [isVisible, setIsVisible] = useState(true);

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  return (
    <Box>
      {/* Toggle Header */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          p: 2,
          border: '1px solid rgba(0,0,0,0.04)'
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontWeight: 600,
            color: 'text.primary'
          }}
        >
          {intl.formatMessage({ id: 'TextTransactionDetail' })}
        </Typography>
        <Tooltip title={isVisible ? 'Hide panels' : 'Show panels'}>
          <IconButton
            onClick={toggleVisibility}
            sx={{
              backgroundColor: isVisible ? 'primary.main' : 'grey.400',
              color: 'white',
              '&:hover': {
                backgroundColor: isVisible ? 'primary.dark' : 'grey.600',
              },
              transition: 'all 0.3s ease'
            }}
          >
            {isVisible ? <VisibilityOffIcon /> : <VisibilityIcon />}
          </IconButton>
        </Tooltip>
      </Box>

      {/* Collapsible Content */}
      <Collapse in={isVisible} timeout={500}>
        <Box sx={{ p: 3 }}>
          {/* Three Panels */}
          <Grid container spacing={3}>
            <GuestPanel
              transaction={transaction}
              guestAnchorEl={guestAnchorEl}
              handleGuestClick={handleGuestClick}
              handleGuestClose={handleGuestClose}
              handleModal={handleModal}
              dispatch={dispatch}
              router={router}
            />
            <StayPanel
              transaction={transaction}
              stayAnchorEl={stayAnchorEl}
              handleStayClick={handleStayClick}
              handleStayClose={handleStayClose}
              handleModal={handleModal}
            />
            <OtherPanel
              transaction={transaction}
              customerAnchorEl={customerAnchorEl}
              handleCustomerClick={handleCustomerClick}
              handleCustomerClose={handleCustomerClose}
              handleModal={handleModal}
              router={router}
            />
          </Grid>
        </Box>
      </Collapse>
    </Box>
  );
};

export default ThreePanelLayout;