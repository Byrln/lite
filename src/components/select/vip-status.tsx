import { TextField } from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";
import { useIntl } from "react-intl";

import { VipStatusSWR } from "lib/api/vip-status";

const VipStatusSelect = ({
    register,
    errors,
    entity,
    setEntity,
    customRegisterName,
}: any) => {
    const intl = useIntl();
    const { data, error } = VipStatusSWR();

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
            id="VipStatusID"
            label={intl.formatMessage({
                id: "TextVipStatus",
            })}
            {...register(
                customRegisterName ? customRegisterName : "VipStatusID"
            )}
            select
            margin="dense"
            error={errors.VipStatusID?.message}
            helperText={errors.VipStatusID?.message}
            size="small"
            value={entity && entity.VipStatusID}
            InputLabelProps={{
                shrink: entity && entity.VipStatusID,
            }}
            onChange={(evt: any) => {
                setEntity({
                    ...entity,
                    VipStatusID: evt.target.value,
                });
            }}
        >
            {data.map((element: any) => {
                return (
                    <MenuItem
                        key={element.VipStatusID}
                        value={element.VipStatusID}
                    >
                        {`${element.VipStatusName}`}
                    </MenuItem>
                );
            })}
        </TextField>
    );
};

export default VipStatusSelect;
