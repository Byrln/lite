import {
    FormControl,
    FormHelperText,
    InputLabel,
    NativeSelect,
    OutlinedInput,
} from "@mui/material";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";

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
        <FormControl
            fullWidth
            variant="outlined"
            size="small"
            margin="dense"
            {...register("AmenityTypeID")}
            error={errors.AmenityTypeID?.message}
        >
            <InputLabel variant="outlined" htmlFor="AmenityTypeID">
                Онцлогийн төрөл
            </InputLabel>
            <NativeSelect
                input={<OutlinedInput label="Онцлогийн төрөл" />}
                inputProps={{
                    name: "AmenityTypeID",
                    id: "AmenityTypeID",
                }}
            >
                <option></option>
                {data.map((element: any) => (
                    <option
                        key={element.AmenityTypeID}
                        value={element.AmenityTypeID}
                    >
                        {element.AmenityTypeName}
                    </option>
                ))}
            </NativeSelect>
            {errors.AmenityTypeID?.message && (
                <FormHelperText error>
                    {errors.AmenityTypeID?.message}
                </FormHelperText>
            )}
        </FormControl>
    );
};

export default AmenityTypeSelect;
