import { TextField } from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";

import { PackageSWR } from "lib/api/package";

const PackageSelect = ({ register, errors, entity, setEntity }: any) => {
    const { data, error } = PackageSWR([]);

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
            size="small"
            fullWidth
            id="PackageID"
            label="Package"
            {...register("PackageID")}
            select
            margin="dense"
            error={!!errors.PackageID?.message}
            helperText={errors.PackageID?.message}
            value={entity && entity.PackageID}
            InputLabelProps={{
                shrink: entity && entity.PackageID,
            }}
            onChange={(evt: any) => {
                setEntity &&
                    setEntity({
                        ...entity,
                        PackageID: evt.target.value,
                    });
            }}
        >
            {data.map((country: any) => (
                <MenuItem key={country.PackageID} value={country.PackageID}>
                    {country.PackageName}
                </MenuItem>
            ))}
        </TextField>
    );
};

export default PackageSelect;
