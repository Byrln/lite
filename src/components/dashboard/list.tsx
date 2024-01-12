import { Grid, Typography, TextField } from "@mui/material";
import Poll from "mdi-material-ui/Poll";
import DoorOpen from "mdi-material-ui/DoorOpen";
import DoorClosedLock from "mdi-material-ui/DoorClosedLock";
import Door from "mdi-material-ui/Door";
import Doorbell from "mdi-material-ui/Doorbell";
import BedQueen from "mdi-material-ui/BedQueen";
import StoreCheck from "mdi-material-ui/StoreCheck";
import StoreMinus from "mdi-material-ui/StoreMinus";
import StoreRemove from "mdi-material-ui/StoreRemove";
import StoreClock from "mdi-material-ui/StoreClock";
import StoreAlert from "mdi-material-ui/StoreAlert";
import StoreOff from "mdi-material-ui/StoreOff";
import Store from "mdi-material-ui/Store";
import Cancel from "mdi-material-ui/Cancel";
import AccountCancel from "mdi-material-ui/AccountCancel";
import CashMultiple from "mdi-material-ui/CashMultiple";
import CashCheck from "mdi-material-ui/CashCheck";
import RoomService from "mdi-material-ui/RoomService";
import Sale from "mdi-material-ui/Sale";
import GlassCocktail from "mdi-material-ui/GlassCocktail";
import SilverwareForkKnife from "mdi-material-ui/SilverwareForkKnife";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import { useState } from "react";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { mutate } from "swr";
import { format } from "date-fns";
import moment from "moment";

import { DashboardSWR, dailyUrl, weeklyUrl } from "lib/api/dashboard";
import DashboardCard from "components/common/dashboard-card";
import { dateStringToObj } from "lib/utils/helpers";

const Dashboard = ({ workingDate }: any) => {
    console.log("workingDate", workingDate);
    const [dashboardType, setDashboardType] = useState("daily");
    const [dashboardDate, setDashboardDate] = useState(new Date(workingDate));

    const { data, error } = DashboardSWR(dashboardType, dashboardDate);

    const randColor = () => {
        return (
            "#" +
            Math.floor(Math.random() * 16777215)
                .toString(16)
                .padStart(6, "0")
                .toUpperCase()
        );
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        // @ts-ignore
        let value = (event.target as HTMLInputElement).value;
        setDashboardType(value);
    };

    const handleDateChange = (value: any) => {
        // @ts-ignore
        // let value = (event.target as HTMLInputElement).value;
        // console.log(value);
        setDashboardDate(value);
        // if (dashboardType == "daily") {
        //     mutate(dailyUrl, { CurrDate: format(value, "yyyy-MM-dd") });
        // } else {
        //     mutate(weeklyUrl, { CurrDate: format(value, "yyyy-MM-dd") });
        // }
        // setDashboardType(value);
    };

    return (
        <>
            <Typography variant="subtitle1">
                {data &&
                    data[0] && // @ts-ignore
                    data[0][0] && // @ts-ignore
                    data[0][0].ValueDate &&
                    format(
                        // @ts-ignore
                        new Date(data[0][0].ValueDate.replace(/ /g, "T")),
                        "yyyy/MM/dd"
                    )}
                {data &&
                    data[0] && // @ts-ignore
                    data[0][0] && // @ts-ignore
                    data[0][0].StartDate &&
                    format(
                        // @ts-ignore
                        new Date(data[0][0].StartDate.replace(/ /g, "T")),
                        "yyyy/MM/dd"
                    ) + " - "}
                {data &&
                    data[0] && // @ts-ignore
                    data[0][0] && // @ts-ignore
                    data[0][0].EndDate &&
                    format(
                        // @ts-ignore
                        new Date(data[0][0].EndDate.replace(/ /g, "T")),
                        "yyyy/MM/dd"
                    )}
            </Typography>

            <RadioGroup
                row
                aria-labelledby="demo-row-radio-buttons-group-label"
                name="row-radio-buttons-group"
                onChange={handleChange}
                defaultValue={"daily"}
            >
                <FormControlLabel
                    value="daily"
                    control={<Radio />}
                    label="Daily"
                />
                <FormControlLabel
                    value="weekly"
                    control={<Radio />}
                    label="Weekly"
                />
                <FormControlLabel
                    value="monthly"
                    control={<Radio />}
                    label="Monthly"
                />
            </RadioGroup>
            {data &&
                data.map((element: any) => (
                    <Grid
                        container
                        spacing={2}
                        style={{ marginBottom: "20px" }}
                        key={element[0].ParameterGroupName}
                    >
                        <Grid item xs={12}>
                            <Typography variant="h6" gutterBottom>
                                {element[0].ParameterGroupName}
                            </Typography>
                        </Grid>

                        {element.map((childElement: any) => (
                            <Grid
                                item
                                xs={4}
                                sm={3}
                                md={2}
                                key={childElement.ParameterName}
                            >
                                <DashboardCard
                                    title={childElement.ParameterName}
                                    stats={childElement.ParameterValue}
                                    icon={
                                        childElement.ParameterName ==
                                        "Total Rooms" ? (
                                            <DoorOpen />
                                        ) : childElement.ParameterName ==
                                          "Blocked Rooms" ? (
                                            <DoorClosedLock
                                                sx={{ fontSize: 40 }}
                                            />
                                        ) : childElement.ParameterName ==
                                          "Sold Rooms" ? (
                                            <Door />
                                        ) : childElement.ParameterName ==
                                          "Available Rooms" ? (
                                            <BedQueen />
                                        ) : childElement.ParameterName ==
                                          "Room Occupancy" ? (
                                            <Doorbell />
                                        ) : childElement.ParameterName ==
                                          "Checked In" ? (
                                            <StoreCheck />
                                        ) : childElement.ParameterName ==
                                          "Checked Out" ? (
                                            <StoreMinus />
                                        ) : childElement.ParameterName ==
                                          "Unconfirmed Reservations" ? (
                                            <StoreRemove />
                                        ) : childElement.ParameterName ==
                                          "Pending Reservations" ? (
                                            <StoreClock />
                                        ) : childElement.ParameterName ==
                                          "Due Out" ? (
                                            <StoreAlert />
                                        ) : childElement.ParameterName ==
                                          "Deleted Bookings" ? (
                                            <StoreOff />
                                        ) : childElement.ParameterName ==
                                          "Void Bookings" ? (
                                            <Store />
                                        ) : childElement.ParameterName ==
                                          "Cancelled Bookings" ? (
                                            <Cancel />
                                        ) : childElement.ParameterName ==
                                          "No Show" ? (
                                            <AccountCancel />
                                        ) : childElement.ParameterName ==
                                          "Total Charges" ? (
                                            <CashCheck />
                                        ) : childElement.ParameterName ==
                                          "Extra Charges" ? (
                                            <CashMultiple />
                                        ) : childElement.ParameterName ==
                                          "Room Charges" ? (
                                            <RoomService />
                                        ) : childElement.ParameterName ==
                                          "Discount" ? (
                                            <Sale />
                                        ) : childElement.ParameterName ==
                                          "Mini Bar" ? (
                                            <GlassCocktail />
                                        ) : childElement.ParameterName ==
                                          "Restaurant" ? (
                                            <SilverwareForkKnife />
                                        ) : (
                                            <Poll />
                                        )
                                    }
                                    color={randColor()}
                                />
                            </Grid>
                        ))}
                    </Grid>
                ))}
        </>
    );
};

export default Dashboard;
