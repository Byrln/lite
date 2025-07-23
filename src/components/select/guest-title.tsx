import { TextField } from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";
import { useIntl } from "react-intl";

import { GuestTitleSWR } from "lib/api/guest-title";

const GuestTitleSelect = ({ register, errors, entity, setEntity }: any) => {
    const intl = useIntl();
    const { data, error } = GuestTitleSWR();

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
            id="GuestTitleID"
            label="Title"
            {...register("GuestTitleID")}
            select
            margin="dense"
            error={!!errors.GuestTitleID?.message}
            helperText={errors.GuestTitleID?.message}
            value={entity && entity.GuestTitleID}
            InputLabelProps={{
                shrink: entity && entity.GuestTitleID,
            }}
            onChange={(evt: any) => {
                setEntity({
                    ...entity,
                    GuestTitleID: evt.target.value,
                });
            }}
        >
            {data.map((guestTitle: any) => (
                <MenuItem
                    key={guestTitle.GuestTitleID}
                    value={guestTitle.GuestTitleID}
                >
                    {guestTitle.GuestTitle}
                </MenuItem>
            ))}
        </TextField>
    );
};

export default GuestTitleSelect;
