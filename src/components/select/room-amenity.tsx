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
                                            entity.amenity &&
                                            entity.amenity[element.AmenityID] &&
                                            entity.amenity[element.AmenityID]
                                        }
                                        onClick={(evt: any) => {
                                            let tempEntity: any;

                                            if (entity) {
                                                tempEntity = { ...entity };

                                                if (tempEntity.amenity) {
                                                    if (
                                                        tempEntity.amenity[
                                                            element.AmenityID
                                                        ]
                                                    ) {
                                                        delete tempEntity
                                                            .amenity[
                                                            element.AmenityID
                                                        ];
                                                    } else {
                                                        tempEntity.amenity[
                                                            element.AmenityID
                                                        ] = true;
                                                    }
                                                } else {
                                                    tempEntity.amenity = [];
                                                    tempEntity.amenity[
                                                        element.AmenityID
                                                    ] = true;
                                                }
                                            } else {
                                                tempEntity = {};

                                                tempEntity.amenity = [];
                                                tempEntity.amenity[
                                                    element.AmenityID
                                                ] = true;
                                            }

                                            setEntity(tempEntity);
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
