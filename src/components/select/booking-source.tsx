import { TextField } from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";
import { BookingSourceSWR } from "lib/api/reservation-source";
import { useEffect } from "react";

const BookingSourceSelect = ({
    register,
    errors,
    reset,
    customRegisterName,
    entity,
    setEntity,
}: any) => {
    const { data, error } = BookingSourceSWR();

    // useEffect(() => {
    //     if (data && data.length > 0 && reset) {
    //         reset({ ReservationSourceID: data[0].ReservationSourceID });
    //     }
    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, [data]);

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
            id="ChannelSourceID"
            label="Суваг"
            {...register(customRegisterName ? customRegisterName : "Суваг")}
            select
            margin="dense"
            error={errors.ChannelSourceID?.message}
            helperText={errors.ChannelSourceID?.message}
            size="small"
            value={
                entity &&
                entity[
                    customRegisterName ? customRegisterName : "ChannelSourceID"
                ]
            }
            onChange={(evt: any) => {
                setEntity &&
                    setEntity({
                        ...entity,
                        ChannelSourceID: evt.target.value,
                    });
            }}
        >
            {data.map((element: any) => {
                return (
                    <MenuItem
                        key={element.BookingSourceID}
                        value={element.BookingSourceID}
                    >
                        {`${element.SourceName}`}
                    </MenuItem>
                );
            })}
        </TextField>
    );
};

export default BookingSourceSelect;
