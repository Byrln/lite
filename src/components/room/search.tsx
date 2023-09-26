import { TextField, Grid } from "@mui/material";
import RoomTypeSelect from "components/select/room-type";
const Search = ({ register, errors, control, reset }: any) => {
    return (
        <Grid container spacing={1}>
            <Grid item xs={3}>
                <TextField
                    size="small"
                    fullWidth
                    id="SearchStr"
                    label="Өрөөний №"
                    {...register("SearchStr")}
                    margin="dense"
                    error={errors.SearchStr?.message}
                    helperText={errors.SearchStr?.message}
                />
            </Grid>

            <Grid item xs={3}>
                <RoomTypeSelect register={register} errors={errors} />
            </Grid>
        </Grid>
    );
};

export default Search;
