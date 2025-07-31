import { TextField } from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";
import { useEffect } from "react";

import { RateTypeSWR } from "lib/api/rate-type";
import { elementAcceptingRef } from "@mui/utils";

const RateTypeSelect = ({
    register,
    errors,
    onChange,
    value,
    channelID,
}: any) => {
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
            error={!!errors.RateTypeID?.message}
            helperText={errors.RateTypeID?.message as string}
            size="small"
            onChange={onChange}
            value={value ? value : null}
            InputLabelProps={{
                shrink: value ? value : null,
            }}
        >
            {data
                .filter((element: any) => {
                    if (channelID) {
                        return element.ChannelID === channelID;
                    }
                    return true;
                })
                .map((element: any) => {
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
