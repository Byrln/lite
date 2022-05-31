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
        <FormControl
            fullWidth
            variant="outlined"
            size="small"
            margin="dense"
            {...register("FloorID")}
            error={errors.FloorID?.message}
        >
            <InputLabel variant="outlined" htmlFor="FloorID">
                Давхар
            </InputLabel>
            <NativeSelect
                input={<OutlinedInput label="Давхар" />}
                inputProps={{
                    name: "FloorID",
                    id: "FloorID",
                }}
            >
                <option></option>
                {data.map((element: any) => (
                    <option key={element.FloorID} value={element.FloorID}>
                        {element.FloorNo}
                    </option>
                ))}
            </NativeSelect>
            {errors.FloorID?.message && (
                <FormHelperText error>{errors.FloorID?.message}</FormHelperText>
            )}
        </FormControl>
    );
};

export default FloorSelect;
