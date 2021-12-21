import { TextField } from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";

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
        <TextField
            fullWidth
            id="FloorID"
            label="Давхар"
            {...register("FloorID")}
            select
            margin="dense"
            error={errors.FloorID?.message}
            helperText={errors.FloorID?.message}
        >
            {data.map((element: any) => (
                <MenuItem key={element.FloorID} value={element.FloorID}>
                    {element.FloorNo}
                </MenuItem>
            ))}
        </TextField>
    );
};

export default FloorSelect;
