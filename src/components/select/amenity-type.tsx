import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";

import CustomSelect from "components/common/custom-select";
import { AmenityTypeSWR } from "lib/api/amenity-type";

const AmenityTypeSelect = ({ register, errors }: any) => {
    const { data, error } = AmenityTypeSWR();

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
            field="AmenityTypeID"
            label="Онцлогийн төрөл"
            options={data}
            optionValue="AmenityTypeID"
            optionLabel="AmenityTypeName"
        />
    );
};

export default AmenityTypeSelect;
