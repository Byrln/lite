import Box from "@mui/material/Box";

const OtherInformation = ({
    reservationNo,
    folioNo,
    checkInNo,
    company,
}: any) => {
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
                <div>Захиалгын дугаар : </div>
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
                <div>Тооцооны дугаар : </div>
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
                <div>Бүртгэлийн дугаар : </div>
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
                <div>Компани : </div>
                <div style={{ fontWeight: "600" }}>{company}</div>
            </Box>
        </Box>
    );
};

export default OtherInformation;
