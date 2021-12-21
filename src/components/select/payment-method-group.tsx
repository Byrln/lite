import { TextField } from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";

import { PaymentMethodGroupSWR } from "lib/api/payment-method-group";

const PaymentMethodGroupSelect = ({ register, errors }: any) => {
    const { data, error } = PaymentMethodGroupSWR();

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
            id="PaymentMethodGroupID"
            label="Төлбөрийн хэлбэр - Групп"
            {...register("PaymentMethodGroupID")}
            select
            margin="dense"
            error={errors.PaymentMethodGroupID?.message}
            helperText={errors.PaymentMethodGroupID?.message}
        >
            {data.map((element: any) => (
                <MenuItem
                    key={element.PaymentMethodGroupID}
                    value={element.PaymentMethodGroupID}
                >
                    {element.PaymentMethodGroupName}
                </MenuItem>
            ))}
        </TextField>
    );
};

export default PaymentMethodGroupSelect;
