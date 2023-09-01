import { TextField, Grid } from "@mui/material";
import ChargeTypeGroupSelect from "components/select/charge-type-group";

const Search = ({ register, errors, control, reset }: any) => {
    return (
        <Grid container spacing={1}>
            <Grid item xs={3}>
                <TextField
                    size="small"
                    fullWidth
                    id="SearchStr"
                    label="Extra Charge"
                    {...register("SearchStr")}
                    margin="dense"
                    error={errors.SearchStr?.message}
                    helperText={errors.SearchStr?.message}
                />
            </Grid>

            <Grid item xs={3}>
                <ChargeTypeGroupSelect register={register} errors={errors} />
            </Grid>
        </Grid>
    );
};

export default Search;
