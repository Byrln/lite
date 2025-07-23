import { TextField, Grid, MenuItem } from "@mui/material";

import { Controller } from "react-hook-form";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import moment from "moment";

import ReservationTypeSelect from "components/select/reservation-type";
import ReservationSourceSelect from "components/select/reservation-source";
import { dateStringToObj } from "lib/utils/helpers";
import CustomerSelect from "components/select/customer";

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
                            label="Эхлэх огноо"
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
                                    error={!!errors.CurrDate?.message}
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
