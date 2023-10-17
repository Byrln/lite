import { TextField, Grid } from "@mui/material";

import CountrySelect from "components/select/country";

const Search = ({ register, errors, control, reset }: any) => {
    return (
        <Grid container spacing={1}>
            <Grid item xs={3}>
                <TextField
                    size="small"
                    fullWidth
                    id="GuestName"
                    label="Зочны нэр"
                    {...register("GuestName")}
                    margin="dense"
                    error={errors.GuestName?.message}
                    helperText={errors.GuestName?.message}
                />
            </Grid>

            <Grid item xs={3}>
                <CountrySelect register={register} errors={errors} />
            </Grid>

            <Grid item xs={3}>
                <TextField
                    size="small"
                    fullWidth
                    id="Phone"
                    label="Phone"
                    {...register("Phone")}
                    margin="dense"
                    error={errors.Phone?.message}
                    helperText={errors.Phone?.message}
                />
            </Grid>

            <Grid item xs={3}>
                <TextField
                    size="small"
                    fullWidth
                    id="Email"
                    label="Цахим шуудан"
                    {...register("Email")}
                    margin="dense"
                    error={errors.Email?.message}
                    helperText={errors.Email?.message}
                    //todo
                />
            </Grid>
        </Grid>
    );
};

export default Search;
