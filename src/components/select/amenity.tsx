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

const AmenitySelect = ({
    register,
    errors,
    customRegisterName,
    entity,
    customTitle,
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

    const handleChange = (e: any) => {
        console.log("e", e);
    };
    return (
        <FormControl sx={{ mt: 2 }} component="fieldset" variant="standard">
            <FormLabel component="legend">
                {customTitle ? customTitle : "Онцлогууд"}
            </FormLabel>

            <FormGroup>
                <Box display="flex" flexWrap="wrap">
                    {data.map((element: any, index: number) => (
                        <Box key={index}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        name={element.AmenityName}
                                        key={`amenity-${element.AmenityID}`}
                                        value={element.AmenityID}
                                        checked={
                                            entity &&
                                            entity.amenity2 &&
                                            entity.amenity2[
                                                element.AmenityID
                                            ] &&
                                            entity.amenity2[element.AmenityID]
                                        }
                                        onClick={(evt: any) => {
                                            let tempEntity: any;
                                            console.log(
                                                "evt.target.value",
                                                evt.target.value
                                            );
                                            console.log("entity", entity);
                                            if (entity) {
                                                tempEntity = { ...entity };
                                            }

                                            if (
                                                tempEntity.amenity2[
                                                    element.AmenityID
                                                ]
                                            ) {
                                                delete tempEntity.amenity2[
                                                    element.AmenityID
                                                ];
                                            } else {
                                                tempEntity.amenity2[
                                                    element.AmenityID
                                                ] = true;
                                            }

                                            setEntity(entity);
                                        }}
                                        {...register(
                                            customRegisterName
                                                ? customRegisterName
                                                : `AmenityID`
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

export default AmenitySelect;
