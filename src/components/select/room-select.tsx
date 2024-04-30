import { TextField } from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import { useEffect, useState } from "react";
import { useIntl } from "react-intl";

import { RoomSWR, RoomAPI } from "lib/api/room";

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
    RoomID,
}: any) => {
    const intl = useIntl();

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

            onRoomChange(
                room,
                typeof groupIndex != "undefined" ? groupIndex : null
            );
            // }
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

    return (
        <TextField
            fullWidth
            id="RoomTypeID"
            label={intl.formatMessage({
                id: "RowHeaderRoom",
            })}
            {...register(customRegisterName ? customRegisterName : "RoomID")}
            select
            margin="dense"
            error={errors.RoomID?.message}
            helperText={errors.RoomID?.message}
            onChange={(evt: any) => {
                eventRoomChange(evt.target.value);
            }}
            value={RoomID}
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
