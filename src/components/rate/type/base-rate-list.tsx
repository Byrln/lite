import Alert from "@mui/material/Alert";
import Skeleton from "@mui/material/Skeleton";
import {
    Box,
    Checkbox,
    FormControlLabel,
    Grid,
    TextField,
    Typography,
} from "@mui/material";

import { BaseRateSWR } from "lib/api/rate-type";
import { Controller } from "react-hook-form";

const BaseRateList = ({ id, register, errors, control }: any) => {
    const { data, error } = BaseRateSWR(id);

    if (error) return <Alert severity="error">{error.message}</Alert>;

    if (!error && !data)
        return (
            <Box sx={{ width: "100%" }}>
                <Skeleton />
                <Skeleton animation="wave" />
            </Box>
        );

    return (
        <>
            <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                sx={{ my: 1 }}
            >
                <Typography variant="h6">Өрөөний төрөл</Typography>
            </Box>

            {data.map((element: any, index: any) => (
                <Grid key={element.RoomTypeID} container spacing={1}>
                    <input
                        type="hidden"
                        {...register(`RoomTypes[${index}].RateTypeID`)}
                        value={element.RateTypeID}
                    />
                    <input
                        type="hidden"
                        {...register(`RoomTypes[${index}].RoomTypeID`)}
                        value={element.RoomTypeID}
                    />
                    <Grid item xs={3}>
                        <FormControlLabel
                            control={
                                <Controller
                                    name="Status"
                                    control={control}
                                    render={(props: any) => (
                                        <Checkbox
                                            {...register(
                                                `RoomTypes[${index}].Status`
                                            )}
                                            checked={props.field.value}
                                            onChange={(e) =>
                                                props.field.onChange(
                                                    e.target.checked
                                                )
                                            }
                                        />
                                    )}
                                />
                            }
                            label={element.RoomTypeName}
                        />
                    </Grid>
                    <Grid item xs={3}>
                        <TextField
                            size="small"
                            type="number"
                            fullWidth
                            id="BaseRate"
                            label="Тариф"
                            {...register(`RoomTypes[${index}].BaseRate`)}
                            margin="dense"
                            error={errors.BaseRate?.message}
                            helperText={errors.BaseRate?.message}
                        />
                    </Grid>
                    <Grid item xs={3}>
                        <TextField
                            size="small"
                            type="number"
                            fullWidth
                            id="Extra Adult"
                            label="Нэмэлт Т/Хүн"
                            {...register(`RoomTypes[${index}].ExtraAdult`)}
                            margin="dense"
                            error={errors.ExtraAdult?.message}
                            helperText={errors.ExtraAdult?.message}
                        />
                    </Grid>
                    <Grid item xs={3}>
                        <TextField
                            size="small"
                            type="number"
                            fullWidth
                            id={`Extra Child`}
                            label="Нэмэлт хүүхэд"
                            {...register(`RoomTypes[${index}].ExtraChild`)}
                            margin="dense"
                            error={errors.ExtraChild?.message}
                            helperText={errors.ExtraChild?.message}
                        />
                    </Grid>
                </Grid>
            ))}
        </>
    );
};

export default BaseRateList;
