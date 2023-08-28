import { TextField } from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";
import { useEffect, useState } from "react";
import { RateTypeSWR } from "lib/api/rate-type";
import { RateAPI } from "lib/api/rate";
import { elementAcceptingRef } from "@mui/utils";

const RoomRateTypeSelect = ({
    register,
    errors,
    reservationModel,
    setReservationModel,
    baseGroupStay,
    reset,
    groupIndex,
    customRegisterName,
}: any) => {
    const [data, setData]: any = useState([]);

    const fetchRoomTypeRates = async () => {
        let d = await RateAPI.list({
            RoomTypeID: reservationModel.roomType.RoomTypeID,
            RateTypeID: 0,
            ChannelID: 0,
            SourceID: 0,
            CustomerID: 0,
            TaxIncluded: true,
            RoomChargeDurationID: 0,
        });
        setData(d);
    };

    useEffect(() => {
        fetchRoomTypeRates();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [reservationModel.roomType]);

    const onChange = (evt: any) => {
        var rate = null;
        for (var r of data) {
            if (r.RateTypeID === evt.target.value) {
                rate = r;
                break;
            }
        }
        if (rate) {
            console.log("groupIndex", groupIndex);
            if (groupIndex == null) {
                setReservationModel({
                    ...reservationModel,
                    rate: rate,
                });
            } else {
                let tempReservation = { ...baseGroupStay };
                tempReservation[groupIndex].rate = rate;
                setReservationModel(tempReservation);
                console.log("tempReservation", tempReservation);
            }
        }
    };

    return (
        <TextField
            fullWidth
            id="RateTypeID"
            label="Rate Type"
            {...register(
                customRegisterName ? customRegisterName : "RateTypeID"
            )}
            select
            margin="dense"
            error={errors.RateTypeID?.message}
            helperText={errors.RateTypeID?.message}
            onChange={onChange}
            size="small"
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
