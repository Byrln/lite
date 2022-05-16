import {
    Box,
    Paper,
    Skeleton,
    InputLabel,
    Checkbox,
    Grid,
    Typography,
    Alert,
} from "@mui/material";

import {RoomTypeAmenitySWR} from "lib/api/amenity";

const RoomAmenitySelect = ({register, errors}: any) => {
    const {data, error} = RoomTypeAmenitySWR();

    if (error) return <Alert severity="error">{error.message}</Alert>;

    if (!error && !data)
        return (
            <Box sx={{width: "100%"}}>
                <Skeleton/>
                <Skeleton animation="wave"/>
            </Box>
        );

    return (
        <Paper sx={{padding: 2, marginTop: 3}}>
            <Typography variant="body1" gutterBottom>
                Room Amenities
            </Typography>

            <Grid container spacing={2}>
                {data.map((element: any, index: number) => (
                    <Grid key={index} item xs={5}>
                        <InputLabel htmlFor="my-input" className="mt-3">
                            {element.AmenityName}
                        </InputLabel>
                        <Checkbox {...register("AmenityID")} />
                    </Grid>
                ))}
            </Grid>
        </Paper>
    );
};

export default RoomAmenitySelect;
