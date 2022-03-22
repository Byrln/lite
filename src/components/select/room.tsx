import {TextField} from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";
import {useEffect, useState} from "react";
import {RoomSWR, RoomAPI} from "lib/api/room";
import {dateToSimpleFormat} from "lib/utils/format-time";

const RoomSelect = (
    {
        register,
        errors,
        baseStay,
        onRoomChange,
    }: any
) => {
    // const { data, error } = RoomSWR();
    const [data, setData]: any = useState([]);

    const eventRoomChange = (val: any) => {
        if (onRoomChange) {
            var r;
            var room = null;
            for (r of data) {
                if (r.RoomID === val) {
                    room = r;
                }
            }
            if (room) {
                onRoomChange(room);
            }
        }
    };

    const fetchRooms = async () => {

        console.log(baseStay);

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
        setData(d);
    };

    useEffect(() => {
        if (data && data.length > 0 && baseStay.room) {
            eventRoomChange(baseStay.room?.RoomID);
        }
    }, [data]);

    useEffect(() => {

        console.log("===== baseStay change =====");

        fetchRooms();
    }, [baseStay.roomType, baseStay.dateStart, baseStay.dateEnd]);

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
            onChange={(evt: any) => {
                eventRoomChange(evt.target.value);
            }}
            value={baseStay?.room?.RoomID}
        >
            {data.map((room: any) => {
                return (
                    baseStay?.roomType?.RoomTypeID === room.RoomTypeID && (
                        <MenuItem key={room.RoomID} value={room.RoomID}>
                            {`${room.RoomFullName}`}
                        </MenuItem>
                    )
                );
            })}
        </TextField>
    );
};

export default RoomSelect;
