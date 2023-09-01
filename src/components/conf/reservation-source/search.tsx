import { TextField, Grid } from "@mui/material";

import UserRoleSelect from "components/select/user-role";

const Search = ({ register, errors, control, reset }: any) => {
    return (
        <Grid container spacing={1}>
            <Grid item xs={3}>
                <TextField
                    size="small"
                    fullWidth
                    id="SearchStr"
                    label="Reservation Source"
                    {...register("SearchStr")}
                    margin="dense"
                    error={errors.SearchStr?.message}
                    helperText={errors.SearchStr?.message}
                />
            </Grid>
        </Grid>
    );
};

export default Search;
