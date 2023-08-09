import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";

import CustomSelect from "components/common/custom-select";
import { ExchangeRateSWR } from "lib/api/exchange-rate";

const ExchangeRateSelect = ({ register, errors, field }: any) => {
    const { data, error } = ExchangeRateSWR();

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
            field={field}
            label="User Role"
            options={data}
            optionValue="ExchangeRateID"
            optionLabel="ExchangeRateName"
        />
    );
};

export default ExchangeRateSelect;
