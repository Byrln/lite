import "react-calendar-timeline/lib/Timeline.css";
import { useRouter } from "next/router";
import { useState, useEffect, useContext } from "react";
import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import {
  Tabs,
  Tab,
  Card,
  CardContent,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  Stack,
  Fade,
} from "@mui/material";
import ThreePanelLayout from "../../../components/transaction/edit/three-panel-layout";
import TransactionHeader from "../../../components/transaction/edit/transaction-header";
import InfoIcon from "@mui/icons-material/Info";
import PersonIcon from "@mui/icons-material/Person";
import ReceiptIcon from '@mui/icons-material/Receipt';
import SummaryIcon from '@mui/icons-material/Assessment';
import CommentIcon from '@mui/icons-material/Comment';
import HotelIcon from '@mui/icons-material/Hotel';
import { useIntl } from 'react-intl';
import { TransactionSWR } from "lib/api/transaction";
import SharerInformation from "components/transaction/general-information/sharer-information";
import Summary from "components/transaction/general-information/summary";
import RoomCharge from "components/transaction/room-charge";
import Folio from "components/transaction/folio";
import RemarkList from "components/reservation/remark/list";
import { useAppState } from "lib/context/app";
import { ModalContext } from "lib/context/modal";
import {
  CashierSessionListSWR,
} from "lib/api/cashier-session";
interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
  className?: string;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <div>{children}</div>
        </Box>
      )}
    </div>
  );
}

const TransactionEdit = () => {
  const intl = useIntl();
  const router = useRouter();

  const { data, error } = TransactionSWR(router.query.id);
  const [transaction, setTransaction]: any = useState(null);
  const [loading, setLoading] = useState(false);
  const [value, setValue] = useState(0);
  const [state, dispatch]: any = useAppState();
  const { handleModal }: any = useContext(ModalContext);
  const [guestAnchorEl, setGuestAnchorEl] = useState(null);
  const [stayAnchorEl, setStayAnchorEl] = useState(null);
  const [customerAnchorEl, setCustomerAnchorEl] = useState(null);
  const [activeSessionID, setActiveSessionID] = useState<any>(null);

  const { data: listData, error: listError } = CashierSessionListSWR({});

  const handleGuestClick = (event: any) => {
    setGuestAnchorEl(event.currentTarget);
  };

  const handleGuestClose = () => {
    setGuestAnchorEl(null);
  };

  const handleStayClick = (event: any) => {
    setStayAnchorEl(event.currentTarget);
  };

  const handleStayClose = () => {
    setStayAnchorEl(null);
  };

  const handleCustomerClick = (event: any) => {
    setCustomerAnchorEl(event.currentTarget);
  };

  const handleCustomerClose = () => {
    setCustomerAnchorEl(null);
  };

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  function a11yProps(index: number) {
    return {
      id: `simple-tab-${index}`,
      "aria-controls": `simple-tabpanel-${index}`,
    };
  }

  useEffect(() => {
    if (data) {
      setTransaction(data);
    }
  }, [data]);
  const [cashierOpen, setCashierOpen] = useState(false);

  const fetchTest = async () => {
    if (listData) {
      let filteredItemData = listData.filter(
        (event: any) => event.IsActive === true
      );
      if (filteredItemData && filteredItemData.length) {
        setActiveSessionID(listData[0].SessionID);
      } else {
        setActiveSessionID("-1");
      }
    }
  };

  useEffect(() => {
    fetchTest();
  }, [listData]);

  const handleCashierOpen = () => {
    setCashierOpen(true);
  };

  const handleCashierClose = () => {
    setCashierOpen(false);
    router.replace("/payment/cashier");
  };

  return (
    <>
      <Box>
        {loading ? (
          <Box sx={{ width: "100%" }}>
            <Skeleton height={60} />
            <Skeleton animation="wave" height={40} />
            <Skeleton animation={false} height={200} />
          </Box>
        ) : transaction ? (
          <Fade in={true} timeout={800}>
            <Box>
              {/* Transaction Header Card */}
              <Card
                sx={{
                  borderRadius: '16px',
                  boxShadow: '0 12px 40px rgba(0,0,0,0.08)',
                  border: '1px solid rgba(0,0,0,0.04)',
                  overflow: 'hidden'
                }}
              >
                <CardContent sx={{ p: 0 }}>
                  <TransactionHeader transaction={transaction} />
                  {/* Enhanced Three-Panel Layout */}
                  <ThreePanelLayout
                    transaction={transaction}
                    guestAnchorEl={guestAnchorEl}
                    stayAnchorEl={stayAnchorEl}
                    customerAnchorEl={customerAnchorEl}
                    handleGuestClick={handleGuestClick}
                    handleGuestClose={handleGuestClose}
                    handleStayClick={handleStayClick}
                    handleStayClose={handleStayClose}
                    handleCustomerClick={handleCustomerClick}
                    handleCustomerClose={handleCustomerClose}
                    handleModal={handleModal}
                    router={router}
                    dispatch={dispatch}
                  />
                  <Box sx={{ width: "100%" }}>
                    <Card
                      sx={{
                        borderRadius: '0 0 16px 16px',
                        boxShadow: '0 12px 40px rgba(0,0,0,0.08)',
                        border: '1px solid rgba(0,0,0,0.04)',
                        overflow: 'hidden'
                      }}
                    >
                      <Box
                        sx={{
                          borderBottom: 1,
                          borderColor: "divider",
                        }}
                      >
                        <Tabs
                          value={value}
                          onChange={handleChange}
                          aria-label="transaction tabs"
                          sx={{
                            px: 3,
                            '& .MuiTab-root': {
                              fontWeight: 600,
                              fontSize: '1rem',
                              textTransform: 'none',
                              minHeight: 64,
                              transition: 'all 0.3s ease',
                              '&.Mui-selected': {
                                color: 'primary.main',
                                backgroundColor: 'rgba(102, 126, 234, 0.08)'
                              },
                              '&:hover': {
                                backgroundColor: 'rgba(102, 126, 234, 0.04)'
                              }
                            },
                            '& .MuiTabs-indicator': {
                              height: 4,
                              borderRadius: '4px 4px 0 0',
                              background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)'
                            }
                          }}
                        >
                          <Tab
                            label={intl.formatMessage({ id: 'TabGeneralInfo' })}
                            icon={<PersonIcon />}
                            iconPosition="start"
                            {...a11yProps(0)}
                          />
                          <Tab
                            label={intl.formatMessage({ id: 'TabRoomCharge' })}
                            icon={<HotelIcon />}
                            iconPosition="start"
                            {...a11yProps(1)}
                          />
                          <Tab
                            label={intl.formatMessage({ id: 'TabFolio' })}
                            icon={<ReceiptIcon />}
                            iconPosition="start"
                            {...a11yProps(2)}
                          />
                        </Tabs>
                      </Box>

                      <TabPanel value={value} index={0}>
                        <Box sx={{ minHeight: '500px' }}>
                          <Grid container spacing={4}>
                            <Grid item xs={12} lg={8}>
                              <Fade in={value === 0} timeout={600}>
                                <Card
                                  sx={{
                                    borderRadius: '0 0 16px 16px',
                                    boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
                                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                                    border: '1px solid rgba(0,0,0,0.04)',
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
                                      background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
                                      borderRadius: '16px 16px 0 0'
                                    }
                                  }}
                                >
                                  <CardContent sx={{ p: 4 }}>
                                    <SharerInformation
                                      TransactionID={transaction.TransactionID}
                                    />
                                  </CardContent>
                                </Card>
                              </Fade>
                            </Grid>
                            <Grid item xs={12} lg={4}>
                              <Stack spacing={3}>
                                <Fade in={value === 0} timeout={800}>
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
                                        background: 'linear-gradient(90deg, #4facfe 0%, #00f2fe 100%)',
                                        borderRadius: '16px 16px 0 0'
                                      }
                                    }}
                                  >
                                    <CardContent sx={{ p: 4 }}>
                                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
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
                                          <SummaryIcon sx={{ fontSize: 20 }} />
                                        </Box>
                                        <Typography variant="h6" sx={{ fontWeight: 700, color: 'text.primary' }}>
                                          {intl.formatMessage({ id: 'TextSummary' })}
                                        </Typography>
                                      </Box>
                                      <Summary
                                        TransactionID={transaction.TransactionID}
                                      />
                                    </CardContent>
                                  </Card>
                                </Fade>
                                <Fade in={value === 0} timeout={1000}>
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
                                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
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
                                          <CommentIcon sx={{ fontSize: 20 }} />
                                        </Box>
                                        <Typography variant="h6" sx={{ fontWeight: 700, color: 'text.primary' }}>
                                          {intl.formatMessage({ id: 'TextRemarks' })}
                                        </Typography>
                                      </Box>
                                      <RemarkList
                                        TransactionID={transaction.TransactionID}
                                      />
                                    </CardContent>
                                  </Card>
                                </Fade>
                              </Stack>
                            </Grid>
                          </Grid>
                        </Box>
                      </TabPanel>

                      <TabPanel value={value} index={1}>
                        <Box>
                          <Fade in={value === 1} timeout={600}>
                            <Card
                              sx={{
                                borderRadius: '0 0 16px 16px',
                                boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
                                border: '1px solid rgba(0,0,0,0.04)',
                                position: 'relative',
                                overflow: 'visible',
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
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
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
                                    <HotelIcon sx={{ fontSize: 20 }} />
                                  </Box>
                                  <Typography variant="h6" sx={{ fontWeight: 700, color: 'text.primary' }}>
                                    {intl.formatMessage({ id: 'TextRoomChargeTitle' })}
                                  </Typography>
                                </Box>
                                <RoomCharge
                                  TransactionID={transaction.TransactionID}
                                  RoomTypeID={transaction.RoomTypeID}
                                />
                              </CardContent>
                            </Card>
                          </Fade>
                        </Box>
                      </TabPanel>

                      <TabPanel value={value} index={2}>
                        <Box>
                          <Fade in={value === 2} timeout={600}>
                            <Card
                              sx={{
                                borderRadius: '0 0 16px 16px',
                                boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
                                border: '1px solid rgba(0,0,0,0.04)',
                                position: 'relative',
                                overflow: 'visible',
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
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
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
                                    <ReceiptIcon sx={{ fontSize: 20 }} />
                                  </Box>
                                  <Typography variant="h6" sx={{ fontWeight: 700, color: 'text.primary' }}>
                                    {intl.formatMessage({ id: 'TextFolioTitle' })}
                                  </Typography>
                                </Box>
                                <Folio
                                  TransactionID={transaction.TransactionID}
                                />
                              </CardContent>
                            </Card>
                          </Fade>
                        </Box>
                      </TabPanel>
                    </Card>
                  </Box>
                </CardContent>
              </Card>
            </Box>
          </Fade>
        ) : (
          <div></div>
        )}
      </Box>
      <Dialog
        open={cashierOpen}
        onClose={handleCashierClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <Stack direction="column" gap={1}>
              <Stack
                direction="row"
                alignItems="center"
                gap={1}
              >
                <InfoIcon />
                <Typography variant="h6">
                  Ээлж эхлүүлнэ үү!
                </Typography>
              </Stack>
            </Stack>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCashierClose} autoFocus>
            ОК
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default TransactionEdit;
