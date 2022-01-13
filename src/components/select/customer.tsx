import { TextField } from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";
import { useEffect } from "react";

import { CustomerSWR } from "lib/api/customer";
import { elementAcceptingRef } from "@mui/utils";

const CustomerSelect = ({ register, errors, entity, setEntity }: any) => {
    const { data, error } = CustomerSWR();

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
            id="CustomerID"
            label="Customer"
            {...register("CustomerID")}
            select
            margin="dense"
            error={errors.CustomerID?.message}
            helperText={errors.CustomerID?.message}
        >
            {data.map((element: any) => {
                return (
                    <MenuItem
                        key={element.CustomerID}
                        value={element.CustomerID}
                    >
                        {`${element.CustomerName}`}
                    </MenuItem>
                );
            })}
        </TextField>
    );
};

export default CustomerSelect;
