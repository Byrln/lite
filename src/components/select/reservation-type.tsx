import { TextField } from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";
import { ReservationTypeSWR } from "lib/api/reservation-type";
import { useEffect } from "react";
import { useIntl } from "react-intl";

const ReservationTypeSelect = ({
    register,
    errors,
    reset,
    customRegisterName,
    ReservationTypeID,
    setReservationTypeID,
}: any) => {
    const intl = useIntl();
    const { data, error } = ReservationTypeSWR();

    // useEffect(() => {
    //     if (data && data.length > 0) {
    //         reset({ ReservationTypeID: data[0].ReservationTypeID });
    //     }
    // }, [data]);

    const onChange = (evt: any) => {
        setReservationTypeID(evt.target.value);
    };

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
            id={customRegisterName ? customRegisterName : "ReservationTypeID"}
            label={intl.formatMessage({
                id: "TextReservationType",
            })}
            {...register(
                customRegisterName ? customRegisterName : "ReservationTypeID"
            )}
            select
            margin="dense"
            error={errors.ReservationTypeID?.message}
            helperText={errors.ReservationTypeID?.message}
            size="small"
            value={ReservationTypeID}
            onChange={onChange}
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
