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
import PersonIcon from '@mui/icons-material/Person';
import { MoreVerticalIcon } from 'lucide-react';
import GuestInformation from 'components/transaction/guest-information';
import GuestReplace from '../../../pages/transaction/edit/guest-replace';
import GuestNewEdit from 'components/front-office/guest-database/new-edit';
import GuestDocuments from 'components/common/custom-upload';

interface GuestPanelProps {
  transaction: any;
  guestAnchorEl: any;
  handleGuestClick: (event: any) => void;
  handleGuestClose: () => void;
  handleModal: (show: boolean, title: string, content: React.ReactNode) => void;
  dispatch: any;
  router: any;
}

const GuestPanel: React.FC<GuestPanelProps> = ({
  transaction,
  guestAnchorEl,
  handleGuestClick,
  handleGuestClose,
  handleModal,
  dispatch,
  router
}) => {
  return (
    <Grid item xs={12} md={4}>
      <Zoom in={true} timeout={600}>
        <Card
          sx={{
            boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
            border: '1px solid rgba(0,0,0,0.04)',
            borderRadius: '0 0 16px 16px',
            background: 'linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)',
            position: 'relative',
            overflow: 'visible',
            '&:hover': {
              boxShadow: '0 20px 40px rgba(0,0,0,0.12)',
              transform: 'translateY(-8px) scale(1.02)',
              transition: 'all 0.3s ease',
            },
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: 4,
              background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
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
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <PersonIcon sx={{ fontSize: 20 }} />
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
                    Зочны мэдээлэл
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Зочдын дэлгэрэнгүй мэдээлэл
                  </Typography>
                </Box>
              </Box>
              <Tooltip title="Зочны үйлдлүүд">
                <IconButton
                  onClick={handleGuestClick}
                  sx={{
                    backgroundColor: 'primary.main',
                    color: 'white',
                    '&:hover': {
                      backgroundColor: 'primary.dark',
                    },
                    width: 30,
                    height: 30,
                    transition: 'all 0.3s ease',
                  }}
                >
                  <MoreVerticalIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              <Menu
                id={`guest`}
                anchorEl={guestAnchorEl}
                open={Boolean(guestAnchorEl)}
                onClose={handleGuestClose}
              >
                <MenuItem
                  key={`guestReplace`}
                  onClick={() => {
                    handleModal(
                      true,
                      "Зочин солих",
                      <GuestReplace
                        TransactionID={router.query.id}
                      />
                    );
                  }}
                >
                  Зочин солих
                </MenuItem>
                <MenuItem
                  key={`guestDetails`}
                  onClick={() => {
                    handleModal(
                      true,
                      "Зочны мэдээлэл",
                      <GuestNewEdit />
                    );
                    dispatch({
                      type: "isShow",
                      isShow: true,
                    });
                    dispatch({
                      type: "editId",
                      editId: transaction.GuestID,
                    });
                  }}
                >
                  Зочны мэдээлэл харах
                </MenuItem>
                <MenuItem
                  key={`guestEdit`}
                  onClick={() => {
                    handleModal(
                      true,
                      "Зочны мэдээлэл засах",
                      <GuestNewEdit />
                    );
                    dispatch({
                      type: "isShow",
                      isShow: false,
                    });
                    dispatch({
                      type: "editId",
                      editId: transaction.GuestID,
                    });
                  }}
                >
                  Зочны мэдээлэл засах
                </MenuItem>
                <MenuItem
                  key={`guestPictureImport`}
                  onClick={() => {
                    handleModal(
                      true,
                      "Зочны мэдээлэл засах",
                      <GuestDocuments
                        GuestID={transaction.GuestID}
                      />
                    );
                  }}
                >
                  Зураг оруулах
                </MenuItem>
                <MenuItem
                  key={`guestDocumentImport`}
                  onClick={() => {
                    handleModal(
                      true,
                      "Зочны мэдээлэл засах",
                      <GuestDocuments
                        GuestID={transaction.GuestID}
                        IsDocument={true}
                      />
                    );
                  }}
                >
                  Бичиг баримт хуулах
                </MenuItem>
              </Menu>
            </Box>

            <GuestInformation
              name={transaction.GuestName}
              phone={transaction.GuestPhone}
              email={transaction.GuestEmail}
              address={transaction.GuestAddress}
            />
          </CardContent>
        </Card>
      </Zoom>
    </Grid>
  );
};

export default GuestPanel;