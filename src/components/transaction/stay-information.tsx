import Box from "@mui/material/Box";

const StayInformation = ({
    reservationDate,
    arrivalDate,
    departureDate,
    pax,
    rateType,
}: any) => {
    return (
        <Box sx={{ p: 1, border: "1px solid grey" }}>
            Reservation Date : {reservationDate}
            <br />
            Arrival Date : {arrivalDate}
            <br />
            Departure Date : {departureDate}
            <br />
            Pax : {pax}
            <br />
            Rate Type : {rateType}
        </Box>
    );
};

export default StayInformation;
