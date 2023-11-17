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
    TransactionID,
    RoomTypeID,
    ArrivalDate,
    DepartureDate,
    groupIndex,
}: any) => {
    const [data, setData]: any = useState([]);
    console.log("ArrivalDate", ArrivalDate);
    console.log("DepartureDate", DepartureDate);
    console.log("RoomTypeID", RoomTypeID);

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
        if (!(RoomTypeID && ArrivalDate && DepartureDate)) {
            return;
        }
        var values = {
            TransactionID: TransactionID ? TransactionID : "",
            RoomTypeID: RoomTypeID,
            StartDate: ArrivalDate,
            EndDate: DepartureDate,
        };
        var d = await RoomAPI.listAvailable(values);
        setData(d);
    };

    useEffect(() => {
        fetchRooms();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [RoomTypeID, ArrivalDate, DepartureDate]);

    // if (error) return <Alert severity="error">{error.message}</Alert>;

    // if (!error && !data)
    //     return (
    //         <Box sx={{ width: "100%" }}>
    //             <Skeleton />
    //             <Skeleton animation="wave" />
    //         </Box>
    //     );
    console.log("data", data);
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
            size="small"
        >
            {data.map((room: any) => {
                return (
                    RoomTypeID === room.RoomTypeID && (
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
