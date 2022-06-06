import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";

import CustomSelect from "components/common/custom-select";
import { FloorSWR } from "lib/api/floor";

const FloorSelect = ({ register, errors }: any) => {
    const { data, error } = FloorSWR();

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
            field="FloorID"
            label="Давхар"
            options={data}
            optionValue="FloorID"
            optionLabel="FloorNo"
        />
    );
};

export default FloorSelect;
