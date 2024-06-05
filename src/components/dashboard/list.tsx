import { Grid, Typography, TextField, CardContent, Card } from "@mui/material";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import { useState } from "react";
import { format } from "date-fns";
import CircularSlider from "@fseehawer/react-circular-slider";
import {
    Check,
    ChevronRight,
    Close,
    CreditCard,
    Delete,
    Discount,
    DoNotDisturb,
    DryCleaning,
    HourglassEmpty,
    Key,
    Lock,
    Logout,
    Pending,
    PersonOff,
    Receipt,
    Sell,
    Task,
} from "@mui/icons-material";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import Link from "next/link";
import moment from "moment";

import { DashboardSWR } from "lib/api/dashboard";

import { fNumber } from "lib/utils/format-number";
ChartJS.register(ArcElement, Tooltip, Legend);

const Dashboard = ({ workingDate }: any) => {
    const [dashboardType, setDashboardType] = useState("daily");

    const { data } = DashboardSWR(dashboardType, new Date(workingDate));

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        let value = (event.target as HTMLInputElement).value;
        setDashboardType(value);
    };

    function roomOccupancy(element: any) {
        return element.find(
            (item: any) => item.ParameterName === "Room Occupancy"
        ).ParameterValue;
    }

    function filterData(element: any, index: number) {
        switch (index) {
            case 0:
                return element.filter(
                    (item: any) =>
                        item.ParameterName !== "Room Occupancy" &&
                        item.ParameterName !== "Total Rooms"
                );
            case 1:
                return element.filter(
                    (item: any) =>
                        item.ParameterName !== "Checked In" &&
                        item.ParameterName !== "Booking Occupancy"
                );
            case 2:
                return element.filter(
                    (item: any) => item.ParameterName !== "Total Charges"
                );
        }
    }

    function mainIcon(index: number) {
        const style = {
            fontSize: "24px",
            color: "#7856DE",
        };

        switch (index) {
            case 0:
                return <DryCleaning style={style} />;
            case 1:
                return <Task style={style} />;
            case 2:
                return <Receipt style={style} />;
        }
    }

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
            <Grid container spacing={2} sx={{ width: "100%" }} mt={0.5}>
                {data &&
                    data.map((element: any, index: number) => (
                        <Grid
                            item
                            xl={4}
                            md={6}
                            sm={12}
                            key={element.id}
                            sx={{ backgroundColor: "#fff" }}
                        >
                            <Card sx={{ height: "100%" }}>
                                <CardContent>
                                    <div
                                        style={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            marginBottom: "16px",
                                            paddingBottom: "16px",
                                            borderBottom: "1px solid #E6E8EE",
                                            minHeight: "224px",
                                        }}
                                    >
                                        <div
                                            style={{
                                                display: "flex",
                                                flexDirection: "column",
                                                justifyContent: "space-between",
                                            }}
                                        >
                                            <div
                                                style={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    gap: "16px",
                                                }}
                                            >
                                                <div
                                                    style={{
                                                        width: "48px",
                                                        height: "48px",
                                                        borderRadius: "8px",
                                                        backgroundColor:
                                                            "#8028D20D",
                                                        display: "flex",
                                                        alignItems: "center",
                                                        justifyContent:
                                                            "center",
                                                    }}
                                                >
                                                    {mainIcon(index)}
                                                </div>
                                                <h2
                                                    style={{
                                                        fontSize: "32px",
                                                        fontWeight: 600,
                                                    }}
                                                >
                                                    {
                                                        element[0]
                                                            .ParameterGroupName
                                                    }
                                                </h2>
                                            </div>
                                            <div>
                                                <p style={{ color: "#888A99" }}>
                                                    {
                                                        element.find(
                                                            (item: any) =>
                                                                item.ParameterID ===
                                                                1
                                                        ).ParameterName
                                                    }
                                                </p>
                                                <h2
                                                    style={{
                                                        fontSize: "40px",
                                                    }}
                                                >
                                                    {index !== 2
                                                        ? element.find(
                                                              (item: any) =>
                                                                  item.ParameterID ===
                                                                  1
                                                          ).ParameterValue
                                                        : fNumber(
                                                              element.find(
                                                                  (item: any) =>
                                                                      item.ParameterID ===
                                                                      1
                                                              ).ParameterValue
                                                          ) + "₮"}
                                                </h2>
                                            </div>
                                        </div>
                                        {index !== 2 ? (
                                            <div
                                                style={{
                                                    position: "relative",
                                                }}
                                            >
                                                <div
                                                    style={{
                                                        position: "absolute",
                                                        inset: 0,
                                                        display: "flex",
                                                        justifyContent:
                                                            "center",
                                                        alignItems: "center",
                                                        flexDirection: "column",
                                                        gap: "4px",
                                                    }}
                                                >
                                                    <p
                                                        style={{
                                                            color: "#888A99",
                                                            fontSize: "14px",
                                                        }}
                                                    >
                                                        {index === 0
                                                            ? "Room Occupancy"
                                                            : "Booking Occupancy"}
                                                    </p>
                                                    <h4
                                                        style={{
                                                            fontSize: "24px",
                                                        }}
                                                    >
                                                        {index === 0
                                                            ? `${roomOccupancy(
                                                                  element
                                                              )}%`
                                                            : "0%"}
                                                    </h4>
                                                </div>
                                                <CircularSlider
                                                    max={100}
                                                    dataIndex={
                                                        index === 0
                                                            ? roomOccupancy(
                                                                  element
                                                              )
                                                            : 0
                                                    }
                                                    hideKnob
                                                    knobDraggable={false}
                                                    trackSize={20}
                                                    width={200}
                                                    progressSize={20}
                                                    trackColor="#F0F0F0"
                                                    progressColorFrom="#804fe6"
                                                    progressColorTo="#804fe6"
                                                    hideLabelValue
                                                />
                                            </div>
                                        ) : (
                                            <div
                                                style={{
                                                    width: "200px",
                                                    height: "200px",
                                                    position: "relative",
                                                }}
                                            >
                                                <Pie
                                                    width="200px"
                                                    height="200px"
                                                    style={{
                                                        width: "100%",
                                                        height: "100%",
                                                    }}
                                                    options={{
                                                        plugins: {
                                                            legend: {
                                                                display: false,
                                                            },
                                                        },
                                                    }}
                                                    data={{
                                                        labels: filterData(
                                                            element,
                                                            index
                                                        ).map(
                                                            ({
                                                                ParameterName,
                                                            }: any) => {
                                                                if (
                                                                    ParameterName !==
                                                                        "Mini Bar" &&
                                                                    ParameterName !==
                                                                        "Restaurant"
                                                                ) {
                                                                    return ParameterName;
                                                                }
                                                            }
                                                        ),
                                                        datasets: [
                                                            {
                                                                data: filterData(
                                                                    element,
                                                                    index
                                                                ).map(
                                                                    ({
                                                                        ParameterValue,
                                                                        ParameterName,
                                                                    }: any) => {
                                                                        if (
                                                                            ParameterName !==
                                                                                "Mini Bar" &&
                                                                            ParameterName !==
                                                                                "Restaurant"
                                                                        ) {
                                                                            return ParameterValue;
                                                                        }
                                                                    }
                                                                ),
                                                                backgroundColor:
                                                                    [
                                                                        "#7856DE",
                                                                        "#00CFE8",
                                                                        "#28C76F",
                                                                    ],
                                                            },
                                                        ],
                                                    }}
                                                />
                                            </div>
                                        )}
                                    </div>
                                    <Grid container spacing={2}>
                                        {filterData(element, index).map(
                                            (childElement: any) => (
                                                <Grid
                                                    item
                                                    xs={index === 0 ? 6 : 12}
                                                    key={
                                                        childElement.ParameterID
                                                    }
                                                >
                                                    <DashboardCard
                                                        item={childElement}
                                                        isSmall={index === 0}
                                                        isCharges={index === 2}
                                                        list={element}
                                                        workingDate={
                                                            workingDate
                                                        }
                                                    />
                                                </Grid>
                                            )
                                        )}
                                    </Grid>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
            </Grid>
        </>
    );
};

export default Dashboard;

function DashboardCard({ item, isSmall, isCharges, list, workingDate }: any) {
    const iconStyle = {
        color: "#FFFFFF",
        fontSize: "16px",
    };

    function cardIcon(name: string) {
        switch (name) {
            case "Blocked Rooms":
                return {
                    icon: <Sell sx={iconStyle} />,
                    color: "#EE5C78",
                    link: "/front-office/reservation-list",
                };
            case "Sold Rooms":
                return {
                    icon: <Check sx={iconStyle} />,
                    color: "#7856DE",
                    link: "/front-office/reservation-list",
                };
            case "Available Rooms":
                return {
                    icon: <Lock sx={iconStyle} />,
                    color: "#55C7EB",
                    link: "/front-office/reservation-list",
                };
            case "Checked Out":
                return {
                    icon: <Logout sx={iconStyle} />,
                    color: "#000000",
                    link: `/front-office/reservation-list?StatusGroup=3&StartDate=${moment(
                        workingDate
                    ).format("YYYY-MM-DD")}&EndDate=${moment(workingDate)
                        .add(1, "day")
                        .format("YYYY-MM-DD")}`,
                };
            case "Pending Reservations":
                return {
                    icon: <HourglassEmpty sx={iconStyle} />,
                    color: "#FF9F43",
                    link: "/front-office/reservation-list",
                };
            case "Unconfirmed Reservations":
                return {
                    icon: <Pending sx={iconStyle} />,
                    color: "#EE5C78",
                    link: "/front-office/reservation-list",
                };
            case "Due Out":
                return {
                    icon: <Logout sx={iconStyle} />,
                    color: "#00CFE8",
                    link: "/front-office/reservation-list",
                };
            case "Deleted Bookings":
                return {
                    icon: <Delete sx={iconStyle} />,
                    color: "#EE5C78",
                    link: "/front-office/reservation-list",
                };
            case "Void Bookings":
                return {
                    icon: <Sell sx={iconStyle} />,
                    color: "#7856DE",
                    link: "/front-office/reservation-list",
                };
            case "Cancelled Bookings":
                return {
                    icon: <Close sx={iconStyle} />,
                    color: "#EE5C78",
                    link: "/front-office/reservation-list",
                };
            case "No Show":
                return {
                    icon: <PersonOff sx={iconStyle} />,
                    color: "#000000",
                    link: "/front-office/reservation-list",
                };
            case "Blocked":
                return {
                    icon: <DoNotDisturb sx={iconStyle} />,
                    color: "#EE5C78",
                    link: "/front-office/reservation-list",
                };
            case "Room Charges":
                return {
                    icon: <Key sx={iconStyle} />,
                    color: "#7856DE",
                    link: "/front-office/reservation-list",
                };
            case "Extra Charges":
                return {
                    icon: <CreditCard sx={iconStyle} />,
                    color: "#00CFE8",
                    link: "/front-office/reservation-list",
                };
            case "Discount":
                return {
                    icon: <Discount sx={iconStyle} />,
                    color: "#28C76F",
                    link: "/front-office/reservation-list",
                };
        }
    }

    if (
        item.ParameterName === "Mini Bar" ||
        item.ParameterName === "Restaurant"
    ) {
        return null;
    }

    const currentItem = cardIcon(item.ParameterName);

    const extraCharges = list.filter(
        ({ ParameterName }: any) =>
            ParameterName === "Mini Bar" || ParameterName === "Restaurant"
    );

    if (isSmall) {
        return (
            <Card sx={{ padding: "1rem" }}>
                <div
                    style={{
                        width: "40px",
                        height: "40px",
                        borderRadius: "100%",
                        backgroundColor: currentItem?.color,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                    }}
                >
                    {currentItem?.icon}
                </div>
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "1rem",
                        flex: 1,
                        marginTop: "16px",
                    }}
                >
                    <Typography
                        sx={{
                            fontSize: "16px",
                            fontWeight: 600,
                            width: "172px",
                        }}
                    >
                        {item.ParameterName}
                    </Typography>
                    <Typography
                        sx={{
                            fontSize: "20px",
                            fontWeight: 600,
                        }}
                    >
                        {isCharges
                            ? fNumber(item.ParameterValue) + "₮"
                            : item.ParameterValue}
                    </Typography>
                </div>
            </Card>
        );
    }

    return (
        <Card sx={{ padding: "1rem" }}>
            <Link //@ts-ignore
                href={currentItem?.link}
                passHref
            >
                <a style={{ textDecoration: "unset", color: "black" }}>
                    {" "}
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "16px",
                        }}
                    >
                        <div
                            style={{
                                width: "40px",
                                height: "40px",
                                borderRadius: "100%",
                                backgroundColor: currentItem?.color,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                flexShrink: 0,
                            }}
                        >
                            {currentItem?.icon}
                        </div>
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "1rem",
                                flex: 1,
                            }}
                        >
                            <Typography
                                sx={{
                                    fontSize: "16px",
                                    fontWeight: 600,
                                    width: "172px",
                                }}
                            >
                                {item.ParameterName}
                            </Typography>
                            <Typography
                                sx={{
                                    fontSize: "20px",
                                    fontWeight: 600,
                                }}
                            >
                                {isCharges
                                    ? fNumber(item.ParameterValue) + "₮"
                                    : item.ParameterValue}
                            </Typography>
                        </div>
                        <div
                            style={{
                                width: "40px",
                                height: "40px",
                                borderRadius: "100%",
                                backgroundColor: "#F8F9FA",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                flexShrink: 0,
                            }}
                        >
                            <ChevronRight sx={{ fontSize: "16px" }} />
                        </div>
                    </div>
                    {isCharges && item.ParameterName === "Extra Charges" && (
                        <div
                            style={{
                                marginTop: "16px",
                                borderTop: "1px solid #E6E8EE",
                                paddingTop: "16px",
                                paddingLeft: "56px",
                                flexDirection: "column",
                                display: "flex",
                                gap: "16px",
                            }}
                        >
                            {extraCharges.map((item: any) => (
                                <div
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "1rem",
                                        flex: 1,
                                        color: "#888A99",
                                    }}
                                    key={item.ParameterID}
                                >
                                    <Typography
                                        sx={{
                                            fontSize: "16px",
                                            fontWeight: 600,
                                            width: "172px",
                                        }}
                                    >
                                        {item.ParameterName}
                                    </Typography>
                                    <Typography
                                        sx={{
                                            fontSize: "20px",
                                            fontWeight: 600,
                                        }}
                                    >
                                        {isCharges
                                            ? fNumber(item.ParameterValue) + "₮"
                                            : item.ParameterValue}
                                    </Typography>
                                </div>
                            ))}
                        </div>
                    )}
                </a>
            </Link>
        </Card>
    );
}
