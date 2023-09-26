import { TextField } from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";
import { useEffect } from "react";

import { CurrencySWR } from "lib/api/currency";
import { elementAcceptingRef } from "@mui/utils";

const CurrencySelect = ({
    register,
    errors,
    entity,
    setEntity,
    nameKey,
}: any) => {
    const { data, error } = CurrencySWR();

    if (error) return <Alert severity="error">{error.message}</Alert>;

    if (!error && !data)
        return (
            <Box sx={{ width: "100%" }}>
                <Skeleton />
                <Skeleton animation="wave" />
            </Box>
        );

    return (
        <TextField
            fullWidth
            id="CurrencyID"
            label="Валют"
            {...register(nameKey)}
            select
            margin="dense"
            error={errors[nameKey]?.message}
            helperText={errors[nameKey]?.message}
            value={entity && entity.CurrencyID}
            size="small"
            onChange={(evt: any) => {
                setEntity &&
                    setEntity({
                        ...entity,
                        CurrencyID: evt.target.value,
                    });
            }}
        >
            {data.map((element: any) => {
                return (
                    <MenuItem key={nameKey} value={element.CurrencyID}>
                        {`${element.CurrencySymbol}`}
                    </MenuItem>
                );
            })}
        </TextField>
    );
};

export default CurrencySelect;
