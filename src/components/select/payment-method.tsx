import { TextField } from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";

import { PaymentMethodSWR } from "lib/api/payment-method";

const PaymentMethodSelect = ({ register, errors }: any) => {
    const { data, error } = PaymentMethodSWR();

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
            id="PaymentMethodID"
            label="Төлбөрийн хэлбэр"
            {...register("PaymentMethodID")}
            select
            margin="dense"
            error={errors.PaymentMethodID?.message}
            helperText={errors.PaymentMethodID?.message}
        >
            {data.map((element: any) => (
                <MenuItem
                    key={element.PaymentMethodID}
                    value={element.PaymentMethodID}
                >
                    {element.PaymentMethodName}
                </MenuItem>
            ))}
        </TextField>
    );
};

export default PaymentMethodSelect;
