import { TextField } from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";

import { RoomTypeSWR, RoomTypeAPI } from "lib/api/room-type";
import { useEffect } from "react";

const RoomTypeSelect = ({
    register,
    errors,
    entity,
    setEntity,
    onRoomTypeChange,
}: any) => {
    const { data, error }: any = RoomTypeSWR();

    const eventRoomTypeChange = (val: any) => {
        if (onRoomTypeChange) {
            var rt;
            var roomType = null;
            for (rt of data) {
                if (rt.RoomTypeID === val) {
                    roomType = rt;
                }
            }
            onRoomTypeChange(roomType);
        }
    };

    useEffect(() => {
        if (data && data.length > 0 && entity?.RoomTypeID) {
            eventRoomTypeChange(entity.RoomTypeID);
        }
    }, [data, entity]);

    const onChange = (event: any) => {
        if (setEntity) {
            setEntity({
                ...entity,
                RoomTypeID: event.target.value,
            });
        }
        eventRoomTypeChange(event.target.value);
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
            value={entity && entity.RoomTypeID}
            InputLabelProps={{
                shrink: entity && entity.RoomTypeID,
            }}
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
