import { TextField, Grid } from "@mui/material";
import ChargeTypeGroupSelect from "components/select/charge-type-group";
import { useIntl } from "react-intl";
const Search = ({ register, errors, control, reset }: any) => {
    const intl = useIntl();
    return (
        <Grid container spacing={1}>
            <Grid item xs={3}>
                <TextField
                    size="small"
                    fullWidth
                    id="SearchStr"
                    label={intl.formatMessage({id:"RowHeaderExtraCharge"}) }
                    {...register("SearchStr")}
                    margin="dense"
                    error={!!errors.SearchStr?.message}
                    helperText={errors.SearchStr?.message as string}
                />
            </Grid>

            <Grid item xs={3}>
                <ChargeTypeGroupSelect register={register} errors={errors} />
            </Grid>
        </Grid>
    );
};

export default Search;
