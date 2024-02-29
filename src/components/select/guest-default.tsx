import { TextField } from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";

import { GuestSWR } from "lib/api/guest";

const GuestDefaultSelect = ({
    register,
    errors,
    entity,
    setEntity,
    search,
}: any) => {
    const { data, error } = GuestSWR(search);

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
            id="GuestID"
            label="Guest"
            {...register("GuestID")}
            select
            margin="dense"
            error={errors.GuestID?.message}
            helperText={errors.GuestID?.message}
            value={entity && entity.GuestID}
            InputLabelProps={{
                shrink: entity && entity.GuestID,
            }}
            onChange={(evt: any) => {
                setEntity({
                    ...entity,
                    GuestID: evt.target.value,
                });
            }}
        >
            {data.map((guest: any) => (
                <MenuItem key={guest.GuestID} value={guest.GuestID}>
                    {guest.GuestFullName}
                </MenuItem>
            ))}
        </TextField>
    );
};

export default GuestDefaultSelect;
