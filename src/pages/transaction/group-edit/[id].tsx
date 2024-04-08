import "react-calendar-timeline/lib/Timeline.css";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
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
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    Stack,
    Button,
} from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";

import { ApiResponseModel } from "models/response/ApiResponseModel";
import { ReservationAPI } from "lib/api/reservation";
import GuestInformation from "components/transaction/guest-information";
import StayInformation from "components/transaction/stay-information";
import OtherInformation from "components/transaction/other-information";
import GroupRoomType from "components/transaction/group/general-information/room-type";
import Summary from "components/transaction/group/general-information/summary";
import RoomCharge from "components/transaction/room-charge";
import FolioSummary from "components/transaction/group/folio-summary";
import FolioDetail from "components/transaction/group/folio-detail";
import RemarkList from "components/reservation/remark/list";
import RoomList from "components/transaction/group/room";
import {
    CashierSessionActiveSWR,
    CashierSessionListSWR,
} from "lib/api/cashier-session";

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
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
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

const TransactionEdit = () => {
    const [transaction, setTransaction]: any = useState(null);
    const [loading, setLoading] = useState(false);
    const [value, setValue] = useState(0);
    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };
    const { data: cashierActive, error: cashierActiveError } =
        CashierSessionActiveSWR();
    const [activeSessionID, setActiveSessionID] = useState<any>(null);

    const { data: listData, error: listError } = CashierSessionListSWR();

    function a11yProps(index: number) {
        return {
            id: `simple-tab-${index}`,
            "aria-controls": `simple-tabpanel-${index}`,
        };
    }

    const router = useRouter();

    useEffect(() => {
        const fetchDatas = async () => {
            setLoading(true);
            try {
                const response: ApiResponseModel =
                    await ReservationAPI.groupList(router.query.id);
                setTransaction(response);
            } finally {
                setLoading(false);
            }
        };

        fetchDatas();
    }, [router]);

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

    useEffect(() => {
        if (activeSessionID && activeSessionID == "-1") {
            setCashierOpen(true);
        }
    }, [cashierActive, activeSessionID]);

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
                                Групп засварлах
                            </Typography>
                            {/* <Box
                                sx={{
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
                                        {transaction.StatusCode}
                                    </Typography>
                                </Paper>
                            </Box> */}
                        </Box>
                        <Divider className="mb-3" />
                        <Grid container spacing={2} className="mb-3">
                            <Grid item xs={12} sm={4}>
                                <Card>
                                    <CardContent>
                                        <Box
                                            sx={{
                                                fontWeight: "bold",
                                            }}
                                            className="mb-3"
                                        >
                                            Групп ахлагчийн мэдээлэл
                                        </Box>
                                        <GuestInformation
                                            name={transaction.GuestName}
                                            phone={transaction.BookerPhone}
                                            email={transaction.GuestEmail}
                                            address={transaction.GuestAddress}
                                        />
                                    </CardContent>
                                </Card>
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <Card>
                                    <CardContent>
                                        <Box
                                            sx={{
                                                fontWeight: "bold",
                                            }}
                                            className="mb-3"
                                        >
                                            Хоногийн мэдээлэл
                                        </Box>
                                        <StayInformation
                                            reservationDate={
                                                transaction.CreatedDate
                                            }
                                            arrivalDate={
                                                transaction.ArrivalDate
                                            }
                                            departureDate={
                                                transaction.DepartureDate
                                            }
                                            pax={transaction.Pax}
                                            rateType={transaction.RateTypeName}
                                        />
                                    </CardContent>
                                </Card>
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <Card>
                                    <CardContent>
                                        <Box
                                            sx={{
                                                fontWeight: "bold",
                                            }}
                                            className="mb-3"
                                        >
                                            Бусад мэдээлэл
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
                        <Divider className="mb-3" />
                        <Box sx={{ width: "100%" }}>
                            <Box
                                sx={{ borderBottom: 1, borderColor: "divider" }}
                            >
                                <Tabs
                                    value={value}
                                    onChange={handleChange}
                                    aria-label="basic tabs example"
                                >
                                    <Tab
                                        label="Ерөнхий мэдээлэл"
                                        {...a11yProps(0)}
                                    />
                                    <Tab
                                        label="Өрөөний мэдээлэл"
                                        {...a11yProps(1)}
                                    />
                                    <Tab
                                        label="Тооцоо, хураангуй"
                                        {...a11yProps(2)}
                                    />
                                    <Tab
                                        label="Тооцоо, дэлгэрэнгүй"
                                        {...a11yProps(3)}
                                    />
                                </Tabs>
                            </Box>

                            <TabPanel value={value} index={0}>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={4}>
                                        <Card>
                                            <CardContent>
                                                <GroupRoomType
                                                    GroupID={
                                                        transaction.GroupID
                                                    }
                                                />
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                    <Grid item xs={12} sm={4}>
                                        <Card>
                                            <CardContent>
                                                <RemarkList
                                                    TransactionID={
                                                        router.query
                                                            .transactionID
                                                    }
                                                />
                                            </CardContent>
                                        </Card>
                                    </Grid>

                                    <Grid item xs={12} sm={4}>
                                        <Card>
                                            <CardContent>
                                                <Summary
                                                    GroupID={router.query.id}
                                                />
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                </Grid>
                            </TabPanel>

                            <TabPanel value={value} index={1}>
                                <RoomList
                                    GroupID={transaction.GroupID}
                                    arrivalDate={transaction.ArrivalDate}
                                    departureDate={transaction.DepartureDate}
                                />
                            </TabPanel>

                            <TabPanel value={value} index={2}>
                                <FolioSummary
                                    GroupID={transaction.GroupID}
                                    TransactionID={router.query.transactionID}
                                />
                            </TabPanel>

                            <TabPanel value={value} index={3}>
                                <FolioDetail
                                    GroupID={transaction.GroupID}
                                    TransactionID={router.query.transactionID}
                                />
                            </TabPanel>
                        </Box>
                        <Dialog
                            open={cashierOpen}
                            onClose={handleCashierClose}
                            aria-labelledby="alert-dialog-title"
                            aria-describedby="alert-dialog-description"
                        >
                            {/*<DialogTitle id="alert-dialog-title" className=""></DialogTitle>*/}
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
                        aa
                    </>
                ) : (
                    ""
                )}
            </Container>
        </>
    );
};

export default TransactionEdit;
