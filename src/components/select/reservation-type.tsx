import { TextField } from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";
import { ReservationTypeSWR } from "lib/api/reservation-type";
import { useEffect } from "react";

const ReservationTypeSelect = ({ register, errors, reset }: any) => {
    const { data, error } = ReservationTypeSWR();

    useEffect(() => {
        if (data && data.length > 0) {
            reset({ ReservationTypeID: data[0].ReservationTypeID });
        }
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
            id="ReservationTypeID"
            label="ReservationType"
            {...register("ReservationTypeID")}
            select
            margin="dense"
            error={errors.ReservationTypeID?.message}
            helperText={errors.ReservationTypeID?.message}
            size="small"
        >
            {data.map((element: any) => {
                return (
                    <MenuItem
                        key={element.ReservationTypeID}
                        value={element.ReservationTypeID}
                    >
                        {`${element.ReservationTypeName}`}
                    </MenuItem>
                );
            })}
        </TextField>
    );
};

export default ReservationTypeSelect;
