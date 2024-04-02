import { TextField } from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";
import { useEffect } from "react";

import { CustomerSWR } from "lib/api/customer";
import { elementAcceptingRef } from "@mui/utils";
import CustomSelect from "components/common/custom-select";

const CustomerSelect = ({
    register,
    errors,
    entity,
    setEntity,
    isCustomSelect = false,
    CustomerGroupID,
    isNA,
}: any) => {
    const { data, error } = CustomerSWR(CustomerGroupID);

    if (error) return <Alert severity="error">{error.message}</Alert>;

    if (!error && !data)
        return (
            <Box sx={{ width: "100%" }}>
                <Skeleton />
                <Skeleton animation="wave" />
            </Box>
        );

    return isCustomSelect ? (
        <CustomSelect
            register={register}
            errors={errors}
            field="CustomerID"
            label="Customer"
            options={data}
            optionValue="CustomerID"
            optionLabel="CustomerName"
            onChange={setEntity}
            isNA={isNA}
        />
    ) : (
        <TextField
            fullWidth
            id="CustomerID"
            label="Customer"
            {...register("CustomerID")}
            select
            margin="dense"
            error={errors.CustomerID?.message}
            helperText={errors.CustomerID?.message}
            size="small"
        >
            {isNA == true ? (
                <MenuItem key="0" value="0">
                    N/A
                </MenuItem>
            ) : (
                <></>
            )}

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
