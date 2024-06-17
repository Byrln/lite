import { TextField, MenuItem, Alert, Box, Skeleton } from "@mui/material";
import { useIntl } from "react-intl";

import { PaymentMethodSWR } from "lib/api/payment-method";

const PaymentMethodSelect = ({
    register,
    errors,
    customRegisterName,
    PaymentMethodID,
    setPaymentMethodID,
    PaymentMethodGroupID,
}: any) => {
    const intl = useIntl();
    const { data, error } = PaymentMethodSWR(PaymentMethodGroupID);

    const onchange = (val: any) => {
        setPaymentMethodID(val);
    };

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
            id={customRegisterName ? customRegisterName : "PaymentMethodID"}
            label={intl.formatMessage({
                id: "TextPaymentMethod",
            })}
            {...register(
                customRegisterName ? customRegisterName : "PaymentMethodID"
            )}
            select
            margin="dense"
            size="small"
            value={PaymentMethodID ? PaymentMethodID : ""}
            onChange={(evt: any) => {
                onchange(evt.target.value);
            }}
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
