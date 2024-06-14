import Box from "@mui/material/Box";
import { useIntl } from "react-intl";

const OtherInformation = ({
    reservationNo,
    folioNo,
    checkInNo,
    company,
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
                        id: "TextReservationNo",
                    })}{" "}
                    :{" "}
                </div>
                <div style={{ fontWeight: "600" }}>{reservationNo}</div>
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
                        id: "TextFolioNo",
                    })}{" "}
                    :{" "}
                </div>
                <div style={{ fontWeight: "600" }}>{folioNo}</div>
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
                        id: "TextCheckInNo",
                    })}{" "}
                    :{" "}
                </div>
                <div style={{ fontWeight: "600" }}>{checkInNo}</div>
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
                    {intl.formatMessage({
                        id: "TextCompany",
                    })}{" "}
                    :{" "}
                </div>
                <div style={{ fontWeight: "600" }}>{company}</div>
            </Box>
        </Box>
    );
};

export default OtherInformation;
