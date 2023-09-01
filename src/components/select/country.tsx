import { TextField } from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";

import { CountrySWR } from "lib/api/country";

const CountrySelect = ({ register, errors, entity, setEntity }: any) => {
    const { data, error } = CountrySWR();

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
            id="CountryID"
            label="Улс сонгох"
            {...register("CountryID")}
            select
            margin="dense"
            error={errors.CountryID?.message}
            helperText={errors.CountryID?.message}
            value={entity && entity.CountryID}
            InputLabelProps={{
                shrink: entity && entity.CountryID,
            }}
            onChange={(evt: any) => {
                setEntity &&
                    setEntity({
                        ...entity,
                        CountryID: evt.target.value,
                    });
            }}
        >
            {data.map((country: any) => (
                <MenuItem key={country.CountryID} value={country.CountryID}>
                    {country.CountryName}
                </MenuItem>
            ))}
        </TextField>
    );
};

export default CountrySelect;
