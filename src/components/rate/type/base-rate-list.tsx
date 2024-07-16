import Alert from "@mui/material/Alert";
import Skeleton from "@mui/material/Skeleton";
import { useIntl } from "react-intl";
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

const BaseRateList = ({
    id,
    register,
    errors,
    control,
    entity,
    setEntity,
}: any) => {
    const { data, error } = BaseRateSWR(id);
    const intl = useIntl();

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
                                            key={`RoomTypes[${index}].Status`}
                                            {...register(
                                                `RoomTypes[${index}].Status`
                                            )}
                                            checked={
                                                entity &&
                                                entity.RoomTypes &&
                                                entity.RoomTypes[
                                                    element.RoomTypeID
                                                ]
                                            }
                                            onChange={(e) => {
                                                if (
                                                    entity &&
                                                    Object.keys(entity).length >
                                                        0 &&
                                                    entity.RoomTypes
                                                ) {
                                                    let newEntity = {
                                                        ...entity,
                                                    };
                                                    newEntity.RoomTypes[
                                                        element.RoomTypeID
                                                    ] = e.target.checked;
                                                    setEntity(newEntity);
                                                } else {
                                                    props.field.onChange(
                                                        e.target.checked
                                                    );
                                                }
                                            }}
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
                            label={intl.formatMessage({id:"BaseRate"}) }
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
                            label={intl.formatMessage({id:"RowHeaderExtraAdult"}) }
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
                            label={intl.formatMessage({id:"RowHeaderExtraChild"}) }
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