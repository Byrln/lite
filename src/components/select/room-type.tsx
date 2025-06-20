/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import { TextField } from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import { useIntl } from "react-intl";

import { RoomTypeAPI } from "lib/api/room-type";

const RoomTypeSelect = ({
    register,
    errors,
    onRoomTypeChange,
    baseStay,
    customRegisterName,
    RoomTypeID,
    customError,
    helperText,
    isSearch,
}: any) => {
    const intl = useIntl();
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
            label={isSearch ? "Room Type" : intl.formatMessage({
                id: "ConfigRoomType",
            })}
            {...register(
                customRegisterName ? customRegisterName : "RoomTypeID"
            )}
            select
            margin="dense"
            error={customError ? customError : errors.RoomTypeID?.message}
            helperText={helperText ? helperText : errors.RoomTypeID?.message}
            onChange={(evt: any) => {
                eventRoomTypeChange(evt.target.value);
            }}
            InputLabelProps={{
                shrink:
                    baseStay &&
                    (baseStay?.roomType
                        ? baseStay?.roomType?.RoomTypeID
                        : baseStay?.RoomTypeID),
            }}
            value={
                baseStay &&
                (baseStay?.roomType
                    ? baseStay?.roomType?.RoomTypeID
                    : baseStay?.RoomTypeID)
            }
            sx={isSearch ? {
                '& .MuiOutlinedInput-root': {
                    borderRadius: '25px',
                    border: 'none',
                    '& fieldset': {
                        border: 'none',
                    },
                    '&:hover fieldset': {
                        border: 'none',
                    },
                    '&.Mui-focused fieldset': {
                        border: 'none',
                    },
                },
                '& .MuiInputLabel-root': {
                    color: '#000000',
                    fontSize: '14px',
                    fontWeight: '600',
                },
                '& .MuiSelect-select': {
                    color: '#000000',
                    fontSize: '14px',
                    fontWeight: '600',
                    padding: '8px 12px',
                },
            } : {}}
        >
            {isSearch && (
                <MenuItem key={"all"} value={0}>
                    All Room Types
                </MenuItem>
            )}
            {data.map((element: any) => (
                <MenuItem key={element.RoomTypeID} value={element.RoomTypeID}>
                    {element.RoomTypeName}
                </MenuItem>
            ))}
        </TextField>
    );
};

export default RoomTypeSelect;
