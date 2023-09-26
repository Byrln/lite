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
            <FormLabel component="legend">Онцлогууд</FormLabel>

            <FormGroup>
                <Box display="flex" flexWrap="wrap">
                    {data.map((element: any, index: number) => (
                        <Box key={index}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        name={element.AmenityName}
                                        key={element.AmenityID}
                                        value={element.AmenityID}
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
