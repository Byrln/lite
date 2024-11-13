import { TextField } from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";

import { CustomerTypeSWR } from "lib/api/customer-type";

const CustomerTypeSelect = ({
    register,
    errors,
    entity,
    setEntity,
    disabled,
}: any) => {
    const { data, error } = CustomerTypeSWR();

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
            id="CustomerTypeID"
            label="Харилцагчийн төрөл"
            {...register("CustomerTypeID")}
            select
            margin="dense"
            error={errors.CustomerTypeID?.message}
            helperText={errors.CustomerTypeID?.message}
            value={entity && entity.CustomerTypeID}
            disabled={disabled}
            onChange={(evt: any) => {
                setEntity &&
                    setEntity({
                        ...entity,
                        CustomerTypeID: evt.target.value,
                    });
            }}
            size="small"
        >
            {data.map((element: any) => {
                return (
                    <MenuItem
                        key={element.CustomerTypeID}
                        value={element.CustomerTypeID}
                    >
                        {`${element.CustomerTypeName}`}
                    </MenuItem>
                );
            })}
        </TextField>
    );
};

export default CustomerTypeSelect;
