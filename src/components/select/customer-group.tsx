import { TextField } from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";
import { useEffect } from "react";

import { CustomerGroupSWR } from "lib/api/customer-group";
import { elementAcceptingRef } from "@mui/utils";

const CustomerGroupSelect = ({ register, errors, entity, setEntity }: any) => {
    const { data, error } = CustomerGroupSWR();

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
            id="CustomerGroupID"
            label="Бүлгийн нэр"
            {...register("CustomerGroupID")}
            select
            margin="dense"
            error={errors.CustomerGroupID?.message}
            helperText={errors.CustomerGroupID?.message}
            value={entity && entity.CustomerGroupID}
            onChange={(evt: any) => {
                setEntity &&
                    setEntity({
                        ...entity,
                        CustomerGroupID: evt.target.value,
                    });
            }}
            size="small"
        >
            {data.map((element: any) => {
                return (
                    <MenuItem
                        key={element.CustomerGroupID}
                        value={element.CustomerGroupID}
                    >
                        {`${element.CustomerGroupName}`}
                    </MenuItem>
                );
            })}
        </TextField>
    );
};

export default CustomerGroupSelect;
