import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Skeleton from "@mui/material/Skeleton";
import InputLabel from "@mui/material/InputLabel";
import Checkbox from "@mui/material/Checkbox";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";

import { RoomTypeAmenitySWR } from "lib/api/amenity";

const AmenitySelect = ({ register, errors }: any) => {
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
        <Paper sx={{ padding: 2, marginTop: 3 }}>
            <Typography variant="body1" gutterBottom>
                Amenities
            </Typography>

            <Grid container spacing={2}>
                {data.map((element: any) => (
                    <Grid item xs={5}>
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

export default AmenitySelect;
