import { TextField } from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";

import { RoomTypeSWR } from "lib/api/room-type";

const RoomTypeSelect = ({ register, errors, entity, setEntity }: any) => {
    const { data, error } = RoomTypeSWR();

    const onChange = (event: any) => {
        if (setEntity) {
            setEntity({
                ...entity,
                RoomTypeID: event.target.value,
            });
        }
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
            id="RoomTypeID"
            label="Өрөөний төрөл"
            {...register("RoomTypeID")}
            select
            margin="dense"
            error={errors.RoomTypeID?.message}
            helperText={errors.RoomTypeID?.message}
            onChange={onChange}
        >
            {data.map((element: any) => (
                <MenuItem key={element.RoomTypeID} value={element.RoomTypeID}>
                    {element.RoomTypeName}
                </MenuItem>
            ))}
        </TextField>
    );
};

export default RoomTypeSelect;
