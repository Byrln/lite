import { TextField } from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";
import { useState, useEffect } from "react";

const NumberSelect = ({
    register,
    errors,
    nameKey,
    label,
    numberMin,
    numberMax,
    defaultValue,
    onChange,
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
            error={errors[nameKey]?.message}
            helperText={errors[nameKey]?.message}
            size="small"
            defaultValue={defaultValue ? defaultValue : 0}
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
