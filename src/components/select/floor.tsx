import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";

import CustomSelect from "components/common/custom-select";
import { FloorSWR } from "lib/api/floor";

const FloorSelect = ({
    register,
    errors,
    customField,
    isFloorIdIsValue = true,
    multiple = false,
}: any) => {
    const { data, error } = FloorSWR();

    if (error) return <Alert severity="error">{error.message}</Alert>;

    if (!error && !data)
        return (
            <Box sx={{ width: "100%" }}>
                <Skeleton />
                <Skeleton animation="wave" />
            </Box>
        );

    const sortedData = data ? [...data].sort((b, a) => {
        const aFloorNo = parseInt(a.FloorNo) || 0;
        const bFloorNo = parseInt(b.FloorNo) || 0;
        return aFloorNo - bFloorNo;
    }) : [];

    return (
        <CustomSelect
            register={register}
            errors={errors}
            field={customField ? customField : "FloorID"}
            label="Давхар"
            options={sortedData}
            optionValue={isFloorIdIsValue ? "FloorID" : "FloorNo"}
            optionLabel="FloorNo"
            multiple={multiple}
        />
    );
};

export default FloorSelect;
