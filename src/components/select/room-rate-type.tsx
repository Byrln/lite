import {TextField} from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";
import {useEffect, useState} from "react";
import {RateTypeSWR} from "lib/api/rate-type";
import {RateAPI} from "lib/api/rate";
import {elementAcceptingRef} from "@mui/utils";

const RoomRateTypeSelect = ({register, errors, roomType}: any) => {
    const [data, setData]: any = useState([]);

    useEffect(() => {

        let d = RateAPI.list({
            RoomTypeID: roomType.RoomTypeID,
            RateTypeID: 0,
            ChannelID: 0,
            SourceID: 0,
            CustomerID: 0,
            TaxIncluded: true,
            RoomChargeDurationID: 1
        });
        setData(d);

    }, [roomType]);

    return (
        <TextField
            fullWidth
            id="RateTypeID"
            label="Rate Type"
            {...register("RateTypeID")}
            select
            margin="dense"
            error={errors.RateTypeID?.message}
            helperText={errors.RateTypeID?.message}
        >
            {data.map((element: any) => {
                return (
                    <MenuItem
                        key={element.RateTypeID}
                        value={element.RateTypeID}
                    >
                        {`${element.RateTypeName}`}
                    </MenuItem>
                );
            })}
        </TextField>
    );
};

export default RoomRateTypeSelect;
