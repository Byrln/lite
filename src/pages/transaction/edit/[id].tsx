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
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

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

import { useAppState } from "lib/context/app";
import { ModalContext } from "lib/context/modal";

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
    const router = useRouter();

    const { data, error } = TransactionSWR(router.query.id);

    const [transaction, setTransaction]: any = useState(null);
    const [loading, setLoading] = useState(false);
    const [value, setValue] = useState(0);
    const [state, dispatch]: any = useAppState();
    const { handleModal }: any = useContext(ModalContext);
    const [guestAnchorEl, setGuestAnchorEl] = useState(null);
    const [stayAnchorEl, setStayAnchorEl] = useState(null);

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
                                                display: "flex",
                                                justifyContent: "space-between",
                                            }}
                                        >
                                            Зочны мэдээлэл
                                            <Button
                                                key={2}
                                                variant={"text"}
                                                aria-controls={`guest`}
                                                size="small"
                                                onClick={handleGuestClick}
                                            >
                                                <KeyboardArrowDownIcon
                                                    fontSize={"large"}
                                                />
                                            </Button>
                                            <Menu
                                                id={`guest`}
                                                anchorEl={guestAnchorEl}
                                                open={Boolean(guestAnchorEl)}
                                                onClose={handleGuestClose}
                                            >
                                                <MenuItem key={`guestReplace`}>
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
                                                display: "flex",
                                                justifyContent: "space-between",
                                            }}
                                            className="mb-3"
                                        >
                                            Хоногийн мэдээлэл
                                            <Button
                                                key={2}
                                                variant={"text"}
                                                aria-controls={`stay`}
                                                size="small"
                                                onClick={handleStayClick}
                                            >
                                                <KeyboardArrowDownIcon
                                                    fontSize={"large"}
                                                />
                                            </Button>
                                            <Menu
                                                id={`stay`}
                                                anchorEl={stayAnchorEl}
                                                open={Boolean(stayAnchorEl)}
                                                onClose={handleStayClose}
                                            >
                                                <MenuItem
                                                    key={`stayAmend`}
                                                    onClick={() => {
                                                        handleModal(
                                                            true,
                                                            "Хугацаа өөрчлөх",
                                                            <AmendStayForm
                                                                transactionInfo={{
                                                                    TransactionID:
                                                                        transaction.TransactionID,
                                                                    ArrivalDate:
                                                                        transaction.ArrivalDate,
                                                                    DepartureDate:
                                                                        transaction.DepartureDate,
                                                                }}
                                                                additionalMutateUrl="/api/FrontOffice/TransactionInfo"
                                                            />
                                                        );
                                                    }}
                                                >
                                                    Хугацаа өөрчлөх
                                                </MenuItem>
                                            </Menu>
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
                                            pax={
                                                (transaction.Adult > 0
                                                    ? transaction.Adult
                                                    : "0") +
                                                "/" +
                                                (transaction.Child > 0
                                                    ? transaction.Child
                                                    : "0")
                                            }
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
                                <RoomCharge
                                    TransactionID={transaction.TransactionID}
                                    RoomTypeID={transaction.RoomTypeID}
                                />
                            </TabPanel>

                            <TabPanel value={value} index={2}>
                                <Folio
                                    TransactionID={transaction.TransactionID}
                                />
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
