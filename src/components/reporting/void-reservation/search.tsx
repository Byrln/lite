import { TextField, Grid, MenuItem } from "@mui/material";

import { Controller } from "react-hook-form";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import moment from "moment";

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
                    name="StartDate"
                    control={control}
                    defaultValue={null}
                    render={({ field: { onChange, value } }) => (
                        <DatePicker
                            label="Эхлэх огноо"
                            value={value}
                            onChange={(value) =>
                                onChange(moment(value, "YYYY-MM-DD"))
                            }
                            renderInput={(params) => (
                                <TextField
                                    size="small"
                                    id="StartDate"
                                    {...register("StartDate")}
                                    margin="dense"
                                    fullWidth
                                    {...params}
                                    error={!!errors.StartDate?.message}
                                    helperText={errors.StartDate?.message as string}
                                />
                            )}
                        />
                    )}
                />
            </Grid>

            <Grid item xs={3}>
                <Controller
                    name="EndDate"
                    control={control}
                    defaultValue={null}
                    render={({ field: { onChange, value } }) => (
                        <DatePicker
                            label="Дуусах огноо"
                            value={value}
                            onChange={(value) =>
                                onChange(moment(value, "YYYY-MM-DD"))
                            }
                            renderInput={(params) => (
                                <TextField
                                    size="small"
                                    id="EndDate"
                                    {...register("EndDate")}
                                    margin="dense"
                                    fullWidth
                                    {...params}
                                    error={!!errors.EndDate?.message}
                                    helperText={errors.EndDate?.message as string}
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
