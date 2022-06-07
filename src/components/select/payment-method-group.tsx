import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";

import CustomSelect from "components/common/custom-select";
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
        <CustomSelect
            register={register}
            errors={errors}
            field="PaymentMethodGroupID"
            label="Төлбөрийн хэлбэр - Групп"
            options={data}
            optionValue="PaymentMethodGroupID"
            optionLabel="PaymentMethodGroupName"
        />
    );
};

export default PaymentMethodGroupSelect;
