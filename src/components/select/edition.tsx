import { TextField } from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";

import { EditionSWR } from "lib/api/edition";

const EditionSelect = ({ register, errors, entity, setEntity }: any) => {
    const { data, error } = EditionSWR();

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
            id="EditionID"
            label="Багцын нэр"
            {...register("EditionID")}
            select
            margin="dense"
            error={errors.EditionID?.message}
            helperText={errors.EditionID?.message}
            value={entity && entity.EditionID}
            InputLabelProps={{
                shrink: entity && entity.EditionID,
            }}
            onChange={(evt: any) => {
                setEntity &&
                    setEntity({
                        ...entity,
                        EditionID: evt.target.value,
                    });
            }}
        >
            {data.map((country: any) => (
                <MenuItem key={country.EditionID} value={country.EditionID}>
                    {country.EditionName}
                </MenuItem>
            ))}
        </TextField>
    );
};

export default EditionSelect;
