import { TextField } from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import { useState, useEffect } from "react";

const NumberSelect = ({
    register,
    errors,
    nameKey,
    label,
    numberMin,
    numberMax,
    defaultValue,
    value,
    onChange,
    customError,
    customHelperText,
}: any) => {
    const [data, setData]: any = useState([]);
    useEffect(() => {
        var d = [];
        var i;
        for (i = numberMin; i <= numberMax; i++) {
            d.push(i);
        }
        setData(d);
    }, [numberMin, numberMax]);

    return (
        <TextField
            fullWidth
            id={nameKey}
            label={label}
            {...register(nameKey)}
            select
            margin="dense"
            error={customError ? customError : errors[nameKey]?.message}
            helperText={
                customHelperText ? customHelperText : errors[nameKey]?.message
            }
            size="small"
            value={value !== undefined ? value : (defaultValue ? defaultValue : 0)}
            onChange={onChange}
        >
            {data.map((num: any) => {
                return (
                    <MenuItem key={num} value={num}>
                        {`${num}`}
                    </MenuItem>
                );
            })}
        </TextField>
    );
};

export default NumberSelect;
