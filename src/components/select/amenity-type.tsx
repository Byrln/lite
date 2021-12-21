import { TextField } from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
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
        <TextField
            fullWidth
            id="AmenityTypeID"
            label="Онцлогийн төрөл"
            {...register("AmenityTypeID")}
            select
            margin="dense"
            error={errors.AmenityTypeID?.message}
            helperText={errors.AmenityTypeID?.message}
        >
            {data.map((element: any) => (
                <MenuItem
                    key={element.AmenityTypeID}
                    value={element.AmenityTypeID}
                >
                    {element.AmenityTypeName}
                </MenuItem>
            ))}
        </TextField>
    );
};

export default AmenityTypeSelect;
