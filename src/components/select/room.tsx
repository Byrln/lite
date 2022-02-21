import { TextField } from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";
import { useEffect } from "react";
import { RoomSWR } from "lib/api/room";

const RoomSelect = ({ register, errors, entity, setEntity }: any) => {
    const { data, error } = RoomSWR();

    useEffect(() => {}, [entity]);

    const onChange = (event: any) => {
        if (setEntity) {
            setEntity({
                ...entity,
                RoomID: event.target.value,
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
            label="Өрөө"
            {...register("RoomID")}
            select
            margin="dense"
            error={errors.RoomID?.message}
            helperText={errors.RoomID?.message}
            value={entity && entity.RoomID}
            InputLabelProps={{
                shrink: entity && entity.RoomID,
            }}
            onChange={onChange}
        >
            {data.map((room: any) => {
                return (
                    entity?.RoomTypeID === room.RoomTypeID && (
                        <MenuItem key={room.RoomID} value={room.RoomID}>
                            {`${room.RoomTypeName}  ${room.RoomNo}`}
                        </MenuItem>
                    )
                );
            })}
        </TextField>
    );
};

export default RoomSelect;
