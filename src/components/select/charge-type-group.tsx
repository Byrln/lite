import { TextField } from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";

import { ChargeTypeGroupSWR } from "lib/api/charge-type-group";

const ChargeTypeGroupSelect = ({ register, errors, listType }: any) => {
    const { data, error } = ChargeTypeGroupSWR(listType);

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
            id="RoomChargeTypeGroupID"
            label="Нэмэлт тооцооны бүлгүүд"
            {...register("RoomChargeTypeGroupID")}
            select
            margin="dense"
            error={errors.RoomChargeTypeGroupID?.message}
            helperText={errors.RoomChargeTypeGroupID?.message}
        >
            {data.map((element: any) => (
                <MenuItem
                    key={element.RoomChargeTypeGroupID}
                    value={element.RoomChargeTypeGroupID}
                >
                    {element.RoomChargeTypeGroupName}
                </MenuItem>
            ))}
        </TextField>
    );
};

export default ChargeTypeGroupSelect;
