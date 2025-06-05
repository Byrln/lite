import { format } from "date-fns";
import { useIntl } from "react-intl";

import Box from "@mui/material/Box";

const StayInformation = ({
    reservationDate,
    arrivalDate,
    departureDate,
    pax,
    rateType,
}: any) => {
    const intl = useIntl();

    return (
        <Box>
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    width: "100%",
                    flexWrap: "wrap",
                }}
                className="mb-1"
            >
                <div>
                    {intl.formatMessage({
                        id: "TextReservationDate",
                    })}{" "}
                    :{" "}
                </div>
                <div style={{ fontWeight: "600" }}>
                    {" "}
                    {reservationDate &&
                        format(
                            new Date(reservationDate.replace(/ /g, "T")),
                            "MM/dd/yyyy"
                        )}
                </div>
            </Box>
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    width: "100%",
                    flexWrap: "wrap",
                }}
                className="mb-1"
            >
                <div>
                    {intl.formatMessage({
                        id: "TextArrivalDate",
                    })}{" "}
                    :{" "}
                </div>
                <div style={{ fontWeight: "600" }}>
                    {arrivalDate &&
                        format(
                            new Date(arrivalDate.replace(/ /g, "T")),
                            "MM/dd/yyyy"
                        )}
                </div>
            </Box>

            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    width: "100%",
                    flexWrap: "wrap",
                }}
                className="mb-1"
            >
                <div>
                    {intl.formatMessage({
                        id: "TextDepartureDate",
                    })}{" "}
                    :{" "}
                </div>
                <div style={{ fontWeight: "600" }}>
                    {format(
                        new Date(departureDate.replace(/ /g, "T")),
                        "MM/dd/yyyy"
                    )}
                </div>
            </Box>

            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    width: "100%",
                    flexWrap: "wrap",
                }}
                className="mb-1"
            >
                <div>
                    {intl.formatMessage({
                        id: "TextPax",
                    })}{" "}
                    :{" "}
                </div>
                <div style={{ fontWeight: "600" }}>{pax}</div>
            </Box>
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    width: "100%",
                    flexWrap: "wrap",
                }}
            >
                <div>
                    {" "}
                    {intl.formatMessage({
                        id: "TextRateType",
                    })}{" "}
                    :{" "}
                </div>
                <div style={{ fontWeight: "600" }}>{rateType}</div>
            </Box>
        </Box>
    );
};

export default StayInformation;
