import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";

import { ReasonSWR } from "lib/api/reason";
import CustomSelect from "components/common/custom-select";

const ReasonTypeSelect = ({
    register,
    errors,
    label,
    ReasonTypeID = 0,
}: any) => {
    const { data, error } = ReasonSWR(ReasonTypeID);

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
