import { TextField } from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";
import { RoomChargeDurationSWR } from "lib/api/room-charge-duration";
import { useEffect } from "react";

const RoomChargeDurationSelect = ({
    register,
    errors,
    reset,
    customRegisterName,
}: any) => {
    const { data, error } = RoomChargeDurationSWR();

    useEffect(() => {
        if (data && data.length > 0 && reset) {
            reset({ RoomChargeDurationID: data[0].RoomChargeDurationID });
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
            id="RoomChargeDurationID"
            label="Хугацаа"
            {...register(
                customRegisterName ? customRegisterName : "RoomChargeDurationID"
            )}
            select
            margin="dense"
            error={errors.RoomChargeDurationID?.message}
            helperText={errors.RoomChargeDurationID?.message}
            size="small"
        >
            {data.map((element: any) => {
                return (
                    <MenuItem
                        key={element.RoomChargeDurationID}
                        value={element.RoomChargeDurationID}
                    >
                        {`${element.RoomChargeDurationName}`}
                    </MenuItem>
                );
            })}
        </TextField>
    );
};

export default RoomChargeDurationSelect;
