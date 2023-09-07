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

const RoomAmenitySelect = ({ register, errors }: any) => {
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
            <FormLabel component="legend">Room Amenities</FormLabel>

            <FormGroup>
                <Box display="flex" flexWrap="wrap">
                    {data.map((element: any, index: number) => (
                        <Box key={element.AmenityID}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        key={element.AmenityID}
                                        name={element.AmenityID}
                                        {...register("AmenityID")}
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
