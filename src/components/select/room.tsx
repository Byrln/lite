import { TextField } from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";
import { useEffect, useState } from "react";
import { RoomSWR, RoomAPI } from "lib/api/room";
import { dateToSimpleFormat } from "lib/utils/format-time";

const RoomSelect = ({ register, errors, entity, setEntity, baseStay }: any) => {
    // const { data, error } = RoomSWR();
    const [data, setData]: any = useState([]);

    const fetchRooms = async () => {
        if (!(baseStay.roomType && baseStay.dateStart && baseStay.dateEnd)) {
            return;
        }
        var values = {
            TransactionID: baseStay.TransactionID,
            RoomTypeID: baseStay.roomType?.RoomTypeID,
            StartDate: dateToSimpleFormat(baseStay.dateStart),
            EndDate: dateToSimpleFormat(baseStay.dateEnd),
        };
        var d = await RoomAPI.listAvailable(values);
        console.log(d);
        setData(d);
    };

    useEffect(() => {
        fetchRooms();
    }, [baseStay]);

    const onChange = (event: any) => {
        if (setEntity) {
            setEntity({
                ...entity,
                RoomID: event.target.value,
            });
        }
    };

    // if (error) return <Alert severity="error">{error.message}</Alert>;

    // if (!error && !data)
    //     return (
    //         <Box sx={{ width: "100%" }}>
    //             <Skeleton />
    //             <Skeleton animation="wave" />
    //         </Box>
    //     );

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
