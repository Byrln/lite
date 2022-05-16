import { TextField } from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";
import { RateTypeSWR } from "lib/api/rate-type";
import { ReasonSWR } from "lib/api/reason";

const ReasonSelect = ({ register, errors, ReasonTypeID, nameKey }: any) => {
    const { data, error } = ReasonSWR();

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
            id="RateTypeID"
            label="Reason"
            {...register(nameKey)}
            select
            margin="dense"
            error={errors[nameKey]?.message}
            helperText={errors[nameKey]?.message}
        >
            {data.map((element: any) => {
                return (
                    element.ReasonTypeID === ReasonTypeID && <MenuItem
                        key={element.ReasonID}
                        value={element.ReasonID}
                    >
                        {`${element.ReasonName}`}
                    </MenuItem>
                );
            })}
        </TextField>
    );
};

export default ReasonSelect;
