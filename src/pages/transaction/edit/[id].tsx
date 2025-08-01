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
  Container,
  Paper,
  Card,
  CardContent,
  Divider,
  Button,
  Menu,
  MenuItem,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  Stack,
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import InfoIcon from "@mui/icons-material/Info";
import PersonIcon from "@mui/icons-material/Person";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import BusinessIcon from "@mui/icons-material/Business";

import { ApiResponseModel } from "models/response/ApiResponseModel";
import { TransactionSWR, TransactionAPI, listUrl } from "lib/api/transaction";
import GuestInformation from "components/transaction/guest-information";
import StayInformation from "components/transaction/stay-information";
import OtherInformation from "components/transaction/other-information";
import SharerInformation from "components/transaction/general-information/sharer-information";
import Summary from "components/transaction/general-information/summary";
import RoomCharge from "components/transaction/room-charge";
import Folio from "components/transaction/folio";
import RemarkList from "components/reservation/remark/list";
import GuestNewEdit from "components/front-office/guest-database/new-edit";
import GuestDocuments from "components/common/custom-upload";
import AmendStayForm from "components/reservation/amend-stay";
import GuestReplace from "./guest-replace";
import CustomerReplace from "./customer-replace";

import { useAppState } from "lib/context/app";
import { ModalContext } from "lib/context/modal";
import {
  CashierSessionActiveSWR,
  CashierSessionListSWR,
} from "lib/api/cashier-session";
import { useIntl } from "react-intl";

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
  const { data: cashierActive, error: cashierActiveError } =
    CashierSessionActiveSWR();

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
      console.log('TransactionEdit - Setting transaction data:', data);
      setTransaction(data);
    }
  }, [data]);

  // Debug transaction state
  console.log('TransactionEdit - Current transaction:', transaction);
  console.log('TransactionEdit - Current tab value:', value);
  console.log('TransactionEdit - Loading state:', loading);

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
      <Container maxWidth="xl">
        {loading ? (
          <Box sx={{ width: "100%" }}>
            <Skeleton />
            <Skeleton animation="wave" />
            <Skeleton animation={false} />
          </Box>
        ) : transaction ? (
          <>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                width: "100%",
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  width: "fit-content",
                }}
              >
                Гүйлгээ засах
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  gap: 2,
                  width: "fit-content",
                }}
              >
                <Box
                  sx={{
                    width: "fit-content",
                  }}
                >
                  {transaction.RoomTypeName} -{" "}
                  {transaction.RoomNo}
                </Box>
                <Paper
                  elevation={2}
                  sx={{
                    px: 1,
                    backgroundColor:
                      "#" + transaction.StatusColor,
                    color: "white",
                    mb: 3,
                    width: "fit-content",
                  }}
                >
                  <Typography>
                    {
                      intl.formatMessage({
                        id: transaction.StatusCode,
                      })}
                  </Typography>
                </Paper>
              </Box>
            </Box>

            <Divider className="mb-3" />

            <Grid container spacing={2} className="mb-3">
              <Grid item xs={12} sm={4}>
                <Card
                  sx={{
                    borderRadius: 2,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                      transform: 'translateY(-2px)'
                    }
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Box
                      sx={{
                        fontWeight: "bold",
                        fontSize: '1.1rem',
                        color: 'primary.main',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                      }}
                      className="mb-3"
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <PersonIcon sx={{ color: 'primary.main' }} />
                        Зочны мэдээлэл
                      </Box>
                      <Button
                        key={2}
                        variant={"outlined"}
                        aria-controls={`guest`}
                        size="small"
                        onClick={handleGuestClick}
                        sx={{
                          minWidth: 'auto',
                          borderRadius: '50%',
                          width: 32,
                          height: 32
                        }}
                      >
                        <KeyboardArrowDownIcon
                          fontSize={"small"}
                        />
                      </Button>
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
                                TransactionID={
                                  router.query
                                    .id
                                }
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
                                GuestID={
                                  transaction.GuestID
                                }
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
                                GuestID={
                                  transaction.GuestID
                                }
                                IsDocument={
                                  true
                                }
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
              </Grid>
              <Grid item xs={12} sm={4}>
                <Card
                  sx={{
                    borderRadius: 2,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                      transform: 'translateY(-2px)'
                    }
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Box
                      sx={{
                        fontWeight: "bold",
                        fontSize: '1.1rem',
                        color: 'primary.main',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                      }}
                      className="mb-3"
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <CalendarTodayIcon sx={{ color: 'primary.main' }} />
                        Хоногийн мэдээлэл
                      </Box>
                      <Button
                        key={2}
                        variant={"outlined"}
                        aria-controls={`stay`}
                        size="small"
                        onClick={handleStayClick}
                        sx={{
                          minWidth: 'auto',
                          borderRadius: '50%',
                          width: 32,
                          height: 32
                        }}
                      >
                        <KeyboardArrowDownIcon
                          fontSize={"small"}
                        />
                      </Button>
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
                                  TransactionID:
                                    transaction.TransactionID,
                                  ReservationID:
                                    transaction.ReservationID,
                                  RoomID:
                                    transaction.RoomID,
                                  RoomTypeID:
                                    transaction.RoomTypeID,
                                  RoomRateTypeID:
                                    transaction.RoomRateTypeID,
                                  CurrencyID:
                                    transaction.CurrencyID,
                                  Adult:
                                    transaction.Adult,
                                  Child:
                                    transaction.Child,
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
                      reservationDate={
                        transaction.ReservationDate
                      }
                      arrivalDate={
                        transaction.ArrivalDate
                      }
                      departureDate={
                        transaction.DepartureDate
                      }
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
              </Grid>
              <Grid item xs={12} sm={4}>
                <Card
                  sx={{
                    borderRadius: 2,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                      transform: 'translateY(-2px)'
                    }
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Box
                      sx={{
                        fontWeight: "bold",
                        fontSize: '1.1rem',
                        color: 'primary.main',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                      }}
                      className="mb-3"
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <BusinessIcon sx={{ color: 'primary.main' }} />
                        Бусад мэдээлэл
                      </Box>
                      <Button
                        key={2}
                        variant={"outlined"}
                        aria-controls={`other`}
                        size="small"
                        onClick={handleCustomerClick}
                        sx={{
                          minWidth: 'auto',
                          borderRadius: '50%',
                          width: 32,
                          height: 32
                        }}
                      >
                        <KeyboardArrowDownIcon
                          fontSize={"small"}
                        />
                      </Button>
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
                              "Бусад засвар",
                              <CustomerReplace
                                TransactionID={
                                  router.query
                                    .id
                                }
                              />
                            );
                          }}
                        >
                          Бусад засвар
                        </MenuItem>
                      </Menu>
                    </Box>
                    <OtherInformation
                      reservationNo={
                        transaction.ReservationNo
                      }
                      folioNo={transaction.FolioNo}
                      checkInNo={transaction.CheckinNo}
                      company={transaction.CustomerName}
                    />
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
            <Box sx={{ width: "100%" }}>
              <Box
                sx={{
                  borderBottom: 1,
                  borderColor: "divider",
                  backgroundColor: 'background.paper',
                  borderRadius: '8px 8px 0 0',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                }}
              >
                <Tabs
                  value={value}
                  onChange={handleChange}
                  aria-label="basic tabs example"
                  sx={{
                    '& .MuiTab-root': {
                      fontWeight: 600,
                      fontSize: '0.95rem',
                      textTransform: 'none',
                      minHeight: 56,
                      '&.Mui-selected': {
                        color: 'primary.main'
                      }
                    },
                    '& .MuiTabs-indicator': {
                      height: 3,
                      borderRadius: '3px 3px 0 0'
                    }
                  }}
                >
                  <Tab
                    label="Ерөнхий мэдээлэл"
                    {...a11yProps(0)}
                  />
                  <Tab
                    label="Өрөөний тооцоо"
                    {...a11yProps(1)}
                  />
                  <Tab label="Тооцоо" {...a11yProps(2)} />
                </Tabs>
              </Box>

              <TabPanel className="bg-white rounded-b-xl shadow-md" value={value} index={0}>
                <Box sx={{ minHeight: '400px' }}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={8}>
                      <Card
                        sx={{
                          borderRadius: 3,
                          boxShadow: '0 6px 20px rgba(0,0,0,0.1)',
                          transition: 'all 0.3s ease',
                          border: '1px solid rgba(0,0,0,0.05)',
                          '&:hover': {
                            boxShadow: '0 12px 32px rgba(0,0,0,0.15)',
                            transform: 'translateY(-4px)'
                          }
                        }}
                      >
                        <CardContent sx={{ p: 3 }}>
                          <SharerInformation
                            TransactionID={
                              transaction.TransactionID
                            }
                          />
                        </CardContent>
                      </Card>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <Card
                        sx={{
                          borderRadius: 3,
                          boxShadow: '0 6px 20px rgba(0,0,0,0.1)',
                          transition: 'all 0.3s ease',
                          border: '1px solid rgba(0,0,0,0.05)',
                          '&:hover': {
                            boxShadow: '0 12px 32px rgba(0,0,0,0.15)',
                            transform: 'translateY(-4px)'
                          }
                        }}
                      >
                        <CardContent sx={{ p: 3 }}>
                          <Summary
                            TransactionID={
                              transaction.TransactionID
                            }
                          />
                        </CardContent>
                      </Card>
                    </Grid>
                  </Grid>
                  <Grid item sx={{ pt: 2 }} xs={12} sm={4}>
                    <Card
                      sx={{
                        borderRadius: 3,
                        boxShadow: '0 6px 20px rgba(0,0,0,0.1)',
                        transition: 'all 0.3s ease',
                        border: '1px solid rgba(0,0,0,0.05)',
                        '&:hover': {
                          boxShadow: '0 12px 32px rgba(0,0,0,0.15)',
                          transform: 'translateY(-4px)'
                        }
                      }}
                    >
                      <CardContent sx={{ p: 3 }}>
                        <RemarkList
                          TransactionID={
                            transaction.TransactionID
                          }
                        />
                      </CardContent>
                    </Card>
                  </Grid>
                </Box>
              </TabPanel>

              <TabPanel className="bg-white rounded-b-xl shadow-md" value={value} index={1}>
                <RoomCharge
                  TransactionID={transaction.TransactionID}
                  RoomTypeID={transaction.RoomTypeID}
                />
              </TabPanel>

              <TabPanel className="bg-white rounded-b-xl shadow-md" value={value} index={2}>
                <Folio
                  TransactionID={transaction.TransactionID}
                />
              </TabPanel>
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
        ) : (
          <div></div>
        )}
      </Container>
    </>
  );
};

export default TransactionEdit;
