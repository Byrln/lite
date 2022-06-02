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
        <FormControl
            fullWidth
            variant="outlined"
            size="small"
            margin="dense"
            {...register("RoomChargeTypeGroupID")}
            error={errors.RoomChargeTypeGroupID?.message}
        >
            <InputLabel variant="outlined" htmlFor="RoomChargeTypeGroupID">
                Нэмэлт тооцооны бүлгүүд
            </InputLabel>
            <NativeSelect
                input={<OutlinedInput label="Нэмэлт тооцооны бүлгүүд" />}
                inputProps={{
                    name: "RoomChargeTypeGroupID",
                    id: "RoomChargeTypeGroupID",
                }}
            >
                <option></option>
                {data.map((element: any) => (
                    <option
                        key={element.RoomChargeTypeGroupID}
                        value={element.RoomChargeTypeGroupID}
                    >
                        {element.RoomChargeTypeGroupName}
                    </option>
                ))}
            </NativeSelect>
            {errors.RoomChargeTypeGroupID?.message && (
                <FormHelperText error>
                    {errors.RoomChargeTypeGroupID?.message}
                </FormHelperText>
            )}
        </FormControl>
    );
};

export default ChargeTypeGroupSelect;
