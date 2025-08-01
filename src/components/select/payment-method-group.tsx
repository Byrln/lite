import { Alert, Box, Skeleton } from "@mui/material";
import CustomSelect from "components/common/custom-select";
import { PaymentMethodGroupSWR } from "lib/api/payment-method-group";

const PaymentMethodGroupSelect = ({ register, errors, onChange }: any) => {
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
            onChange={onChange}
        />
    );
};

export default PaymentMethodGroupSelect;
