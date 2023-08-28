import { TextField } from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";
import { ReservationChannelSWR } from "lib/api/reservation-channel";
import { useEffect } from "react";

const ReservationChannelSelect = ({ register, errors, reset }: any) => {
    const { data, error } = ReservationChannelSWR();

    useEffect(() => {
        if (data && data.length > 0) {
            reset({ ReservationSourceID: data[0].ReservationSourceID });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data]);

    if (error) return <Alert severity="error">{error.message}</Alert>;

    if (!error && !data)
        return (
            <Box sx={{ width: "100%" }}>
                <Skeleton />
                <Skeleton animation="wave" />
            </Box>
        );

    return (
        <TextField
            fullWidth
            id="ReservationSourceID"
            label="ReservationChannel"
            {...register("ReservationSourceID")}
            select
            margin="dense"
            error={errors.ReservationSourceID?.message}
            helperText={errors.ReservationSourceID?.message}
        >
            {data.map((element: any) => {
                return (
                    <MenuItem key={element.ChannelID} value={element.ChannelID}>
                        {`${element.ChannelName}`}
                    </MenuItem>
                );
            })}
        </TextField>
    );
};

export default ReservationChannelSelect;
