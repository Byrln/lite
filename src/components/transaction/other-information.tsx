import Box from "@mui/material/Box";

const OtherInformation = ({
    reservationNo,
    folioNo,
    checkInNo,
    company,
}: any) => {
    return (
        <Box sx={{ p: 1, border: "1px solid grey" }}>
            Reservation No : {reservationNo}
            <br />
            Folio No : {folioNo}
            <br />
            Check In No : {checkInNo}
            <br />
            Company : {company}
        </Box>
    );
};

export default OtherInformation;
