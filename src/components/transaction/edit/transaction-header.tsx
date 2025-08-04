import React from 'react';
import {
  Box,
  Typography,
  Chip,
} from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AssignmentIcon from '@mui/icons-material/Assignment';
import { useIntl } from 'react-intl';

interface TransactionHeaderProps {
  transaction: any;
}

const TransactionHeader: React.FC<TransactionHeaderProps> = ({ transaction }) => {
  const intl = useIntl();

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        p: 3,
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        borderRadius: '16px 16px 0 0',
        color: 'white',
        boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
          borderRadius: '16px 16px 0 0'
        }
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <AssignmentIcon sx={{ fontSize: 32 }} />
        <Box>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              fontSize: '1.75rem',
              mb: 0.5
            }}
          >
            {intl.formatMessage({
              id: 'TextHeaderEditTransaction',
            })}
          </Typography>
        </Box>
      </Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-end',
            mr: 2
          }}
        >
          <Typography variant="caption" sx={{ opacity: 0.8, fontSize: '0.75rem' }}>
            {intl.formatMessage({ id: 'TextRoomInfo' })}
          </Typography>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            {transaction.RoomTypeName} - {transaction.RoomNo}
          </Typography>
        </Box>
        <Chip
          icon={<TrendingUpIcon />}
          label={intl.formatMessage({
            id: transaction.StatusCode,
          })}
          sx={{
            backgroundColor: "#" + transaction.StatusColor,
            color: "white",
            fontWeight: 600,
            fontSize: '0.875rem',
            height: 40,
            '& .MuiChip-icon': {
              color: 'white'
            }
          }}
        />
      </Box>
    </Box>
  );
};

export default TransactionHeader;