import { TextField } from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";

import { NotificationTypeSWR } from "lib/api/notification";

const NotificationTypeSelect = ({
    register,
    errors,
    entity,
    setEntity,
    setNotificationTypeID,
}: any) => {
    const { data, error } = NotificationTypeSWR();

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
            id="NotificationTypeID"
            label="Type"
            {...register("NotificationTypeID")}
            select
            margin="dense"
            error={errors.NotificationTypeID?.message}
            helperText={errors.NotificationTypeID?.message}
            size="small"
            value={entity && entity.NotificationTypeID}
            InputLabelProps={{
                shrink: entity && entity.NotificationTypeID,
            }}
            onChange={(evt: any) => {
                setEntity({
                    ...entity,
                    NotificationTypeID: evt.target.value,
                });
                setNotificationTypeID(evt.target.value);
            }}
        >
            {data.map((element: any) => {
                return (
                    <MenuItem
                        key={element.NotificationTypeID}
                        value={element.NotificationTypeID}
                    >
                        {`${element.NotificationTypeName}`}
                    </MenuItem>
                );
            })}
        </TextField>
    );
};

export default NotificationTypeSelect;
