import { TextField, Grid } from "@mui/material";
import { useIntl } from "react-intl";
import { Controller } from "react-hook-form";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import moment from "moment";

const Search = ({
    register,
    errors,
    control,
    reset,
    setArrivalTime,
    setDepartureTime,
    ArrivalTime,
    DepartureTime,
}: any) => {
    const intl = useIntl();
    return (
        <Grid container spacing={1}>
            <Grid item xs={3}>
                <Controller
                    name="CurrDate"
                    control={control}
                    defaultValue={null}
                    render={({ field: { onChange, value } }) => (
                        <DatePicker
                            views={["year", "month"]}
                            label={intl.formatMessage({id:"RowHeaderBeginDate"}) }
                            value={value}
                            onChange={(value) =>
                                onChange(moment(value, "YYYY-MM-DD"))
                            }
                            renderInput={(params) => (
                                <TextField
                                    size="small"
                                    id="CurrDate"
                                    {...register("CurrDate")}
                                    margin="dense"
                                    fullWidth
                                    {...params}
                                    error={errors.CurrDate?.message}
                                    helperText={errors.CurrDate?.message}
                                />
                            )}
                        />
                    )}
                />
            </Grid>
        </Grid>
    );
};

export default Search;
