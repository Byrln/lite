import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";

import CustomSelect from "components/common/custom-select";
import { PromotionTypeSWR } from "lib/api/promotion-type";

const PromotionTypeSelect = ({ register, errors }: any) => {
    const { data, error } = PromotionTypeSWR();

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
            field="PromotionTypeID"
            label="Promotion Type"
            options={data}
            optionValue="PromtionTypeID"
            optionLabel="PromotionTypeName"
        />
    );
};

export default PromotionTypeSelect;
