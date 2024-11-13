import { TextField } from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import { useIntl } from "react-intl";
import { useEffect } from "react";

import { RateTypeSWR } from "lib/api/rate-type";

const RoomRateTypeSelect = ({
    register,
    errors,
    RoomTypeID,
    reset,
    groupIndex,
    customRegisterName,
    setRate,
    Rate,
    setBreakfastIncluded,
    setTaxIncluded,
    id,
    resetField,
}: any) => {
    const intl = useIntl();
    const { data, error } = RateTypeSWR({});

    useEffect(() => {
        if (data) {
            if (setRate) {
                // setRate(data[0]);
                if (data[0].BreakfastIncluded && setBreakfastIncluded) {
                    setBreakfastIncluded(data[0].BreakfastIncluded);
                }
                if (data[0].TaxIncluded && setTaxIncluded) {
                    setTaxIncluded(data[0].TaxIncluded);
                }
            }
            if (resetField && id) {
                resetField(
                    customRegisterName ? customRegisterName : "RateTypeID",
                    {
                        defaultValue: data[0].RateTypeID,
                    }
                );
            }
        }
    }, [data]);

    const onChange = (evt: any) => {
        var rate = null;
        for (var r of data) {
            if (r.RateTypeID === evt.target.value) {
                rate = r;
                break;
            }
        }

        if (rate) {
            setRate(rate);
            if (rate && setBreakfastIncluded) {
                setBreakfastIncluded(rate.BreakfastIncluded);
            }
            if (rate.TaxIncluded && setTaxIncluded) {
                setTaxIncluded(rate.TaxIncluded);
            }
        }
    };

    return (
        <TextField
            fullWidth
            id="RateTypeID"
            label={intl.formatMessage({
                id: "TextRateType",
            })}
            {...register(
                customRegisterName ? customRegisterName : "RateTypeID"
            )}
            select
            margin="dense"
            error={errors.RateTypeID?.message}
            helperText={errors.RateTypeID?.message}
            onChange={onChange}
            size="small"
            value={Rate.RateTypeID}
        >
            {data &&
                data.map((element: any) => {
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
