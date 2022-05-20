import "react-calendar-timeline/lib/Timeline.css";
import { useRouter } from "next/router";
import { useState, useEffect, useContext } from "react";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { Tabs, Tab } from "@mui/material";

import { ApiResponseModel } from "models/response/ApiResponseModel";
import { TransactionAPI } from "lib/api/transaction";
import GuestInformation from "components/transaction/guest-information";
import StayInformation from "components/transaction/stay-information";
import OtherInformation from "components/transaction/other-information";
import SharerInformation from "components/transaction/general-information/sharer-information";
import Remarks from "components/transaction/general-information/remarks";
import Summary from "components/transaction/general-information/summary";

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
            {loading ? (
                <Box sx={{ width: "100%" }}>
                    <Skeleton />
                    <Skeleton animation="wave" />
                    <Skeleton animation={false} />
                </Box>
            ) : transaction ? (
                <>
                    <Grid container spacing={2} className="mb-3">
                        <Grid item xs={6}>
                            <h2>Edit transaction</h2>
                        </Grid>
                        <Grid item xs={6}>
                            Room № {transaction.RoomFullNo}
                        </Grid>
                    </Grid>
                    <Grid container spacing={2} className="mb-3">
                        <Grid item xs={4}>
                            <h3 className="mb-1">Guest Information</h3>
                            <GuestInformation
                                name={transaction.GuestName}
                                phone={transaction.BookerPhone}
                                email="test@mail.com"
                                address="test address"
                            />
                        </Grid>
                        <Grid item xs={4}>
                            <h3 className="mb-1">Stay Information</h3>
                            <StayInformation
                                reservationDate="testDate"
                                arrivalDate={transaction.ArrivalDate}
                                departureDate={transaction.DepartureDate}
                                pax="testPax"
                                rateType="testRate"
                            />
                        </Grid>
                        <Grid item xs={4}>
                            <h3 className="mb-1">Other Information</h3>
                            <OtherInformation
                                reservationNo={transaction.ReservationNo}
                                folioNo={transaction.FolioNo}
                                checkInNo="checkInNo"
                                company="company"
                            />
                        </Grid>
                    </Grid>

                    <Box sx={{ width: "100%" }}>
                        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                            <Tabs
                                value={value}
                                onChange={handleChange}
                                aria-label="basic tabs example"
                            >
                                <Tab
                                    label="General Information"
                                    {...a11yProps(0)}
                                />
                                <Tab label="Room Charge" {...a11yProps(1)} />
                                <Tab label="Folio" {...a11yProps(2)} />
                            </Tabs>
                        </Box>

                        <TabPanel value={value} index={0}>
                            <Grid container spacing={2}>
                                <Grid item xs={4}>
                                    <SharerInformation />
                                </Grid>
                                <Grid item xs={4}>
                                    <Remarks />
                                </Grid>
                                <Grid item xs={4}>
                                    <Summary />
                                </Grid>
                            </Grid>
                        </TabPanel>

                        <TabPanel value={value} index={1}>
                            <Grid container spacing={2}>
                                <Grid item xs={6}>
                                    <div>Date</div>
                                    <div>Rate Type</div>
                                    <div>Pax (A / C)</div>
                                    <div>Override Rate</div>
                                    <div>Rate</div>
                                    <div>Apply to Selected Date</div>
                                    <div>Apply to Whole Stay</div>
                                </Grid>
                                <Grid item xs={6}>
                                    <div>TEST TABLE</div>
                                </Grid>
                            </Grid>
                        </TabPanel>

                        <TabPanel value={value} index={2}>
                            <Grid container spacing={2}>
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
                            </Grid>
                        </TabPanel>
                    </Box>
                </>
            ) : (
                ""
            )}
        </>
    );
};

export default TransactionEdit;
