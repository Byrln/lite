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
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import { MoreVerticalIcon } from 'lucide-react';
import StayInformation from 'components/transaction/stay-information';
import AmendStayForm from 'components/reservation/amend-stay';

interface StayPanelProps {
  transaction: any;
  stayAnchorEl: any;
  handleStayClick: (event: any) => void;
  handleStayClose: () => void;
  handleModal: (show: boolean, title: string, content: React.ReactNode) => void;
}

const StayPanel: React.FC<StayPanelProps> = ({
  transaction,
  stayAnchorEl,
  handleStayClick,
  handleStayClose,
  handleModal
}) => {
  return (
    <Grid item xs={12} md={4}>
      <Zoom in={true} timeout={800}>
        <Card
          sx={{
            boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
            border: '1px solid rgba(0,0,0,0.04)',
            background: 'linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)',
            borderRadius: '0 0 16px 16px',
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
              background: 'linear-gradient(90deg, #4facfe 0%, #00f2fe 100%)',
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
                    background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <CalendarTodayIcon sx={{ fontSize: 20 }} />
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
                    Хоногийн мэдээлэл
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Буудлагын хугацаа
                  </Typography>
                </Box>
              </Box>
              <Tooltip title="Хоногийн үйлдлүүд">
                <IconButton
                  onClick={handleStayClick}
                  sx={{
                    backgroundColor: 'info.main',
                    color: 'white',
                    width: 30,
                    height: 30,
                    '&:hover': {
                      backgroundColor: 'info.dark',
                    },
                    transition: 'all 0.3s ease'
                  }}
                >
                  <MoreVerticalIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              <Menu
                id={`stay`}
                anchorEl={stayAnchorEl}
                open={Boolean(stayAnchorEl)}
                onClose={handleStayClose}
              >
                <MenuItem
                  key={`amendStay`}
                  onClick={() => {
                    handleModal(
                      true,
                      "Хоног засах",
                      <AmendStayForm
                        transactionInfo={{
                          TransactionID: transaction.TransactionID,
                          ReservationID: transaction.ReservationID,
                          RoomID: transaction.RoomID,
                          RoomTypeID: transaction.RoomTypeID,
                          RoomRateTypeID: transaction.RoomRateTypeID,
                          CurrencyID: transaction.CurrencyID,
                          Adult: transaction.Adult,
                          Child: transaction.Child,
                        }}
                      />
                    );
                  }}
                >
                  Хоног засах
                </MenuItem>
              </Menu>
            </Box>

            <StayInformation
              reservationDate={transaction.ReservationDate}
              arrivalDate={transaction.ArrivalDate}
              departureDate={transaction.DepartureDate}
              pax={
                (transaction.Adult > 0
                  ? transaction.Adult + " насанд хүрэгч "
                  : "") +
                (transaction.Child > 0
                  ? transaction.Child + " хүүхэд"
                  : "")
              }
            />
          </CardContent>
        </Card>
      </Zoom>
    </Grid>
  );
};

export default StayPanel;