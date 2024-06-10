import { TextField } from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import { useIntl } from "react-intl";

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
}: any) => {
    const intl = useIntl();
    const { data, error } = RateTypeSWR({});

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
            if (rate.BreakfastIncluded && setBreakfastIncluded) {
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
