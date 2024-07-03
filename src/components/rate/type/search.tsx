import { TextField, Grid } from "@mui/material";
import { useIntl } from "react-intl";

const Search = ({ register, errors, control, reset }: any) => {
    const intl = useIntl();
    return (
        <Grid container spacing={1}>
            <Grid item xs={3}>
                <TextField
                    size="small"
                    fullWidth
                    id="ConfigRoomType"
                        label={intl.formatMessage({id:"ConfigRoomType"}) }
                        {...register("ConfigRoomType")}
                    margin="dense"
                    error={errors.SearchStr?.message}
                    helperText={errors.SearchStr?.message}
                />
            </Grid>
        </Grid>
    );
};

export default Search;
