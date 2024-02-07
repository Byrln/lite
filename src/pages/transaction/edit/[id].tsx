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
} from "@mui/material";

import { ApiResponseModel } from "models/response/ApiResponseModel";
import { TransactionAPI } from "lib/api/transaction";
import GuestInformation from "components/transaction/guest-information";
import StayInformation from "components/transaction/stay-information";
import OtherInformation from "components/transaction/other-information";
import SharerInformation from "components/transaction/general-information/sharer-information";
import Summary from "components/transaction/general-information/summary";
import RoomCharge from "components/transaction/room-charge";
import Folio from "components/transaction/folio";
import RemarkList from "components/reservation/remark/list";

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
                const response: ApiResponseModel = await TransactionAPI.get(
                    router.query.id
                );
                setTransaction(response);
            } finally {
                setLoading(false);
            }
        };

        fetchDatas();
    }, [router]);

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
                            </Box>
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
                                            Зочны мэдээлэл
                                        </Box>
                                        <GuestInformation
                                            name={transaction.GuestName}
                                            phone={transaction.BookerPhone}
                                            email="test@mail.com"
                                            address="test address"
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
                                            reservationDate="testDate"
                                            arrivalDate={
                                                transaction.ArrivalDate
                                            }
                                            departureDate={
                                                transaction.DepartureDate
                                            }
                                            pax="testPax"
                                            rateType="testRate"
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
                                            checkInNo="checkInNo"
                                            company="company"
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
                                        label="Өрөөний тооцоо"
                                        {...a11yProps(1)}
                                    />
                                    <Tab label="Тооцоо" {...a11yProps(2)} />
                                </Tabs>
                            </Box>

                            <TabPanel value={value} index={0}>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={4}>
                                        <Card>
                                            <CardContent>
                                                <SharerInformation />
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                    <Grid item xs={12} sm={4}>
                                        <Card>
                                            <CardContent>
                                                <RemarkList
                                                    TransactionID={
                                                        transaction.TransactionID
                                                    }
                                                />
                                            </CardContent>
                                        </Card>
                                    </Grid>

                                    <Grid item xs={12} sm={4}>
                                        <Card>
                                            <CardContent>
                                                <Summary
                                                    TransactionID={
                                                        transaction.TransactionID
                                                    }
                                                />
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                </Grid>
                            </TabPanel>

                            <TabPanel value={value} index={1}>
                                {/* <Grid container spacing={2}>
                                    <Grid item xs={6}>
                                    <RoomCharge
                                            TransactionID={
                                                transaction.TransactionID
                                            }
                                        />
                                    </Grid>
                                </Grid> */}
                                <RoomCharge
                                    TransactionID={transaction.TransactionID}
                                    RoomTypeID={transaction.RoomTypeID}
                                />
                            </TabPanel>

                            <TabPanel value={value} index={2}>
                                <Folio FolioID={transaction.FolioID} />
                                {/* <Grid container spacing={2}>
                                    <Grid item xs={6}>
                                        <div>CHARGE PAYMENT</div>
                                        <div>Date</div>
                                        <div>Type</div>
                                        <div>Amount</div>
                                        <div>Date</div>
                                        <div>Folio</div>
                                        <div>Description</div>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <div>TEST TABLE</div>
                                    </Grid>
                                </Grid> */}
                            </TabPanel>
                        </Box>
                    </>
                ) : (
                    ""
                )}
            </Container>
        </>
    );
};

export default TransactionEdit;
