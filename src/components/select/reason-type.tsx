import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";

import { ReferenceSWR } from "lib/api/reference";
import CustomSelect from "components/common/custom-select";

const ReasonTypeSelect = ({
    register,
    errors,
    label,
    ReasonTypeID = 0,
}: any) => {
    const { data, error } = ReferenceSWR("ReasonType");

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
            field="ReasonTypeID"
            label={label}
            options={data}
            optionValue="ReasonTypeID"
            optionLabel="ReasonTypeName"
        />
    );
};

export default ReasonTypeSelect;
