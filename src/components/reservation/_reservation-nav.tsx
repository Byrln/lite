import { ReservationApi } from "lib/api/reservation";
import { useState, useEffect } from "react";
import { Grid, Box, Paper, Typography, Button } from "@mui/material";
import { fToCustom } from "lib/utils/format-time";

const sx = {
    display: "flex",
    flexDirection: "column",
    border: "1px solid #efefef",
    Button: {
        fontWeight: "700",
        borderBottom: "1px solid #efefef",
    },
};

const ReservationNav = ({ reservation, itemInfo }: any) => {
    return (
        <Box sx={sx}>
            <Button variant={"text"}>Card</Button>
            <Button variant={"text"}>Check In</Button>
            <Button variant={"text"}>Mark No Show</Button>
            <Button variant={"text"}>Edit Transaction</Button>
            <Button variant={"text"}>Extra Charge</Button>
            <Button variant={"text"}>Edit Group</Button>
            <Button variant={"text"}>Room Move</Button>
            <Button variant={"text"}>Amend Stay</Button>
            <Button variant={"text"}>Set Message</Button>
            <Button variant={"text"}>Void Transaction</Button>
            <Button variant={"text"}>Cancel Reservation</Button>
            <Button variant={"text"}>Unassign Room</Button>
            <Button variant={"text"}>Audit Trail</Button>
        </Box>
    );
};

export default ReservationNav;
