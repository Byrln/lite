import { TextField, Grid } from "@mui/material";
import { Controller } from "react-hook-form";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import moment from "moment";
import { useIntl } from "react-intl";
import ReservationSourceSelect from "components/select/reservation-source";

const Search = ({ register, errors, control, reset }: any) => {
    const intl = useIntl();
    return (
        <Grid container spacing={1}>
            <Grid item xs={3}>
                <TextField
                    size="small"
                    fullWidth
                    id="SearchStr"
                    label={intl.formatMessage({id:"RowHeaderGroupName"}) }
                    {...register("SearchStr")}
                    margin="dense"
                    error={!!errors.SearchStr?.message}
                    helperText={errors.SearchStr?.message}
                />
            </Grid>
        </Grid>
    );
};

export default Search;
