import { TextField } from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";
import { useEffect, useState } from "react";
import { RoomSWR, RoomAPI } from "lib/api/room";
import { dateToSimpleFormat } from "lib/utils/format-time";

const RoomSelect = ({
    register,
    errors,
    baseStay,
    onRoomChange,
    roomAutoAssign,
    customRegisterName,
    groupIndex,
}: any) => {
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
            if (
                typeof baseStay == "undefined" ||
                baseStay.room?.RoomID != room?.RoomID ||
                typeof baseStay.room.RoomName != "string"
            ) {
                onRoomChange(
                    room,
                    typeof groupIndex != "undefined" ? groupIndex : null
                );
            }
        }
    };

    const fetchRooms = async () => {
        if (
            !(
                baseStay &&
                baseStay.roomType &&
                baseStay.dateStart &&
                baseStay.dateEnd
            )
        ) {
            return;
        }
        var values = {
            TransactionID: baseStay.TransactionID,
            RoomTypeID:
                baseStay.roomType?.RoomTypeID == "all"
                    ? 0
                    : baseStay.roomType?.RoomTypeID,
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data]);

    useEffect(() => {
        console.log("===== baseStay change =====");

        fetchRooms();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [baseStay.roomType, baseStay.dateStart, baseStay.dateEnd]);

    useEffect(() => {
        if (roomAutoAssign && data.length > 0 && data) {
            // @ts-ignore
            onRoomChange(data[0]);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [roomAutoAssign]);

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
            {...register(customRegisterName ? customRegisterName : "RoomID")}
            select
            margin="dense"
            error={errors.RoomID?.message}
            helperText={errors.RoomID?.message}
            onChange={(evt: any) => {
                eventRoomChange(evt.target.value);
            }}
            value={baseStay?.room?.RoomID}
            InputLabelProps={{
                shrink: baseStay?.room?.RoomID,
            }}
            shrink
            size="small"
        >
            {data.map((room: any) => {
                return baseStay.roomType != "all" ? (
                    baseStay?.roomType?.RoomTypeID === room.RoomTypeID && (
                        <MenuItem key={room.RoomID} value={room.RoomID}>
                            {`${room.RoomFullName}`}
                        </MenuItem>
                    )
                ) : (
                    <MenuItem key={room.RoomID} value={room.RoomID}>
                        {`${room.RoomFullName}`}
                    </MenuItem>
                );
            })}
        </TextField>
    );
};

export default RoomSelect;
