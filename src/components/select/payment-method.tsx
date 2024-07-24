import { TextField, MenuItem, Alert, Box, Skeleton } from "@mui/material";
import { useIntl } from "react-intl";
import { useState, useEffect, useContext } from "react";

import { PaymentMethodAPI } from "lib/api/payment-method";
import { ApiResponseModel } from "models/response/ApiResponseModel";

const PaymentMethodSelect = ({
    register,
    errors,
    customRegisterName,
    PaymentMethodID,
    setPaymentMethodID,
    PaymentMethodGroupID,
}: any) => {
    const intl = useIntl();
    const [data, setData]: any = useState(null);

    useEffect(() => {
        const fetchDatas = async () => {
            const response = await PaymentMethodAPI.list({
                PaymentMethodGroupID: PaymentMethodGroupID,
                SearchStr: "",
                IsCustomerRelated: false,
                Status: false,
                EmptyRow: false,
            });
            if (response) {
                setData(response);
            } else {
                setData(null);
            }
        };
        fetchDatas();
    }, [PaymentMethodGroupID]);

    const onchange = (val: any) => {
        setPaymentMethodID(val);
    };

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
            error={
                errors[
                    customRegisterName ? customRegisterName : "PaymentMethodID"
                ] &&
                errors[
                    customRegisterName ? customRegisterName : "PaymentMethodID"
                ].message
            }
            helperText={
                errors[
                    customRegisterName ? customRegisterName : "PaymentMethodID"
                ] &&
                errors[
                    customRegisterName ? customRegisterName : "PaymentMethodID"
                ].message
            }
        >
            {data &&
                data.map((element: any) => (
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
