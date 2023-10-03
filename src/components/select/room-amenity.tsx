import {
    Box,
    Skeleton,
    Checkbox,
    Alert,
    FormControl,
    FormLabel,
    FormGroup,
    FormControlLabel,
    FormHelperText,
} from "@mui/material";

import { RoomTypeAmenitySWR } from "lib/api/amenity";

const RoomAmenitySelect = ({
    register,
    errors,
    customRegisterName,
    entity,
    setEntity,
}: any) => {
    const { data, error } = RoomTypeAmenitySWR();

    if (error) return <Alert severity="error">{error.message}</Alert>;

    if (!error && !data)
        return (
            <Box sx={{ width: "100%" }}>
                <Skeleton />
                <Skeleton animation="wave" />
            </Box>
        );
    return (
        <FormControl sx={{ mt: 2 }} component="fieldset" variant="standard">
            <FormLabel component="legend">Өрөөний онцлогууд</FormLabel>

            <FormGroup>
                <Box display="flex" flexWrap="wrap">
                    {data.map((element: any, index: number) => (
                        <Box key={element.AmenityID}>
                            <FormControlLabel
                                key={element.AmenityID}
                                control={
                                    <Checkbox
                                        key={`amenity2-${element.AmenityID}`}
                                        name={element.AmenityID}
                                        value={element.AmenityID}
                                        checked={
                                            entity &&
                                            entity[element.AmenityID] &&
                                            entity[element.AmenityID]
                                        }
                                        onClick={(evt: any) => {
                                            let tempEntity: any;
                                            console.log(
                                                "evt.target.value",
                                                evt.target.value
                                            );
                                            if (entity) {
                                                tempEntity = { ...entity };
                                            }

                                            if (tempEntity[element.AmenityID]) {
                                                delete tempEntity[
                                                    element.AmenityID
                                                ];
                                            } else {
                                                tempEntity[element.AmenityID] =
                                                    true;
                                            }

                                            setEntity({
                                                ...entity,
                                                amenity: tempEntity,
                                            });
                                        }}
                                        {...register(
                                            customRegisterName
                                                ? customRegisterName
                                                : "AmenityID"
                                        )}
                                    />
                                }
                                label={element.AmenityName}
                            />
                        </Box>
                    ))}
                </Box>
            </FormGroup>
            <FormHelperText error>{errors.AmenityID?.message}</FormHelperText>
        </FormControl>
    );
};

export default RoomAmenitySelect;
