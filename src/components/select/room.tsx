import { TextField } from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import { useEffect, useState } from "react";
import { useIntl } from "react-intl";

import { RoomAPI } from "lib/api/room";
import { dateToSimpleFormat } from "lib/utils/format-time";

const RoomSelect = ({
    register,
    errors,
    baseStay,
    onRoomChange,
    roomAutoAssign,
    customRegisterName,
    groupIndex,
    roomType,
    isSearch,
    resetField,
    setBaseStay,
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
            if (
                typeof baseStay == "undefined" ||
                baseStay.room?.RoomID != room?.RoomID ||
                typeof baseStay.room?.RoomName != "string"
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
                (baseStay.roomType || roomType) &&
                baseStay.dateStart &&
                baseStay.dateEnd
            )
        ) {
            return;
        }
        var values = {
            TransactionID: baseStay?.TransactionID,
            RoomTypeID: roomType
                ? roomType.RoomTypeID
                : baseStay.roomType?.RoomTypeID == "all"
                ? 0
                : baseStay.roomType?.RoomTypeID,
            StartDate: dateToSimpleFormat(baseStay.dateStart),
            EndDate: dateToSimpleFormat(baseStay.dateEnd),
        };
        var d = await RoomAPI.listAvailable(values);

        setData(d);

        // setBaseStay({
        //     ...baseStay,
        //     room: d[0],
        // });
        // onRoomChange(d[0]);

        // Only auto-select first room if explicitly requested via roomAutoAssign
        // Don't auto-select when no room is initially assigned
    };
    useEffect(() => {
        if (data && data.length > 0) {
            if (baseStay?.room?.RoomID) {
                eventRoomChange(baseStay.room.RoomID);
            } else {
                // Auto-select first available room as default
                eventRoomChange(data[0].RoomID);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data]);

    useEffect(() => {
        fetchRooms();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [baseStay?.roomType, baseStay?.dateStart, baseStay?.dateEnd]);

    useEffect(() => {
        if (roomAutoAssign && data.length > 0 && data) {
            // @ts-ignore
            onRoomChange(data[0]);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [roomAutoAssign]);

    return (
        <TextField
            fullWidth
            id="RoomTypeID"
            label={intl.formatMessage({
                id: "TextRoom",
            })}
            {...register(customRegisterName ? customRegisterName : "RoomID")}
            select
            margin="dense"
            error={!!errors.RoomID?.message}
            helperText={errors.RoomID?.message as string}
            onChange={(evt: any) => {
                eventRoomChange(evt.target.value);
            }}
            value={baseStay?.room?.RoomID || ""}
            InputLabelProps={{
                shrink: !!baseStay?.room?.RoomID,
            }}
            shrink
            size="small"
        >
            {isSearch && (
                <MenuItem key={"all"} value={0}>
                    {intl.formatMessage({
                        id: "TextAll",
                    })}
                </MenuItem>
            )}
            {data.map((room: any) => {
                return baseStay?.roomType != "all" ? (
                    roomType && roomType?.RoomTypeID === room.RoomTypeID ? (
                        <MenuItem key={room.RoomID} value={room.RoomID}>
                            {`${room.RoomFullName}`}
                        </MenuItem>
                    ) : (
                        baseStay?.roomType?.RoomTypeID === room.RoomTypeID && (
                            <MenuItem key={room.RoomID} value={room.RoomID}>
                                {`${room.RoomFullName}`}
                            </MenuItem>
                        )
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
