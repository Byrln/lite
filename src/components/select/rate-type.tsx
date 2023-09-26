import { TextField } from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";
import { useEffect } from "react";

import { RateTypeSWR } from "lib/api/rate-type";
import { elementAcceptingRef } from "@mui/utils";

const RateTypeSelect = ({ register, errors }: any) => {
    const { data, error } = RateTypeSWR({});

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
            id="RateTypeID"
            label="Тарифын төрөл"
            {...register("RateTypeID")}
            select
            margin="dense"
            error={errors.RateTypeID?.message}
            helperText={errors.RateTypeID?.message}
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

export default RateTypeSelect;
