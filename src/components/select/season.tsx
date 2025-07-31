import { TextField } from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";

import { SeasonSWR } from "lib/api/season";

const SeasonSelect = ({ register, errors }: any) => {
    const { data, error } = SeasonSWR({});

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
            id="SeasonID"
            label="Улирал"
            {...register("SeasonID")}
            select
            margin="dense"
            error={!!errors.SeasonID?.message}
            helperText={errors.SeasonID?.message as string}
            size="small"
        >
            {data.map((element: any) => {
                return (
                    <MenuItem key={element.SeasonID} value={element.SeasonID}>
                        {`${element.SeasonName}`}
                    </MenuItem>
                );
            })}
        </TextField>
    );
};

export default SeasonSelect;
