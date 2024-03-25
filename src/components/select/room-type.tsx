/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import { TextField } from "@mui/material";
import MenuItem from "@mui/material/MenuItem";

import { RoomTypeAPI } from "lib/api/room-type";

const RoomTypeSelect = ({
    register,
    errors,
    onRoomTypeChange,
    baseStay,
    customRegisterName,
    RoomTypeID,
}: any) => {
    const [data, setData]: any = useState([]);

    const fetchRoomTypes = async () => {
        const values = {
            RoomTypeID: 0,
            SearchStr: "",
            EmptyRow: 0,
        };
        const response = await RoomTypeAPI.list(values);

        setData(response);
    };

    const eventRoomTypeChange = (val: any) => {
        let rt;
        let roomType = null;

        for (rt of data) {
            if (rt.RoomTypeID === val) {
                roomType = rt;
            }
        }

        onRoomTypeChange && onRoomTypeChange(roomType);
    };

    useEffect(() => {
        fetchRoomTypes();
    }, []);

    useEffect(() => {
        if (data && data.length > 0 && RoomTypeID) {
            eventRoomTypeChange(RoomTypeID);
        }
    }, [data]);

    return (
        <TextField
            size="small"
            fullWidth
            id="RoomTypeID"
            label="Өрөөний төрөл"
            {...register(
                customRegisterName ? customRegisterName : "RoomTypeID"
            )}
            select
            margin="dense"
            error={errors.RoomTypeID?.message}
            helperText={errors.RoomTypeID?.message}
            onChange={(evt: any) => {
                eventRoomTypeChange(evt.target.value);
            }}
            value={
                baseStay &&
                (baseStay?.roomType
                    ? baseStay?.roomType?.RoomTypeID
                    : baseStay?.RoomTypeID)
            }
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
