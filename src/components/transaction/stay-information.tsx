import { format } from "date-fns";

import Box from "@mui/material/Box";

const StayInformation = ({
    reservationDate,
    arrivalDate,
    departureDate,
    pax,
    rateType,
}: any) => {
    console.log("reservationDate", reservationDate);
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
                <div>Захиалгын огноо : </div>
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
                <div>Ирэх хугацаа : </div>
                <div style={{ fontWeight: "600" }}>
                    {format(
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
                <div>Буух өдөр : </div>
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
                <div>Хүний тоо : </div>
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
                <div>Тарифийн төрөл : </div>
                <div style={{ fontWeight: "600" }}>{rateType}</div>
            </Box>
        </Box>
    );
};

export default StayInformation;
