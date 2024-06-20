import { TextField, Grid, MenuItem } from "@mui/material";
import { Controller } from "react-hook-form";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import moment from "moment";
import { useIntl } from "react-intl";

import ReservationTypeSelect from "components/select/reservation-type";
import ReservationSourceSelect from "components/select/reservation-source";
import { dateStringToObj } from "lib/utils/helpers";

const Search = ({ register, errors, control, reset }: any) => {
    const intl = useIntl();

    return (
        <Grid container spacing={1}>
            <Grid item xs={3}>
                <Controller
                    name="StartDate"
                    control={control}
                    defaultValue={null}
                    render={({ field: { onChange, value } }) => (
                        <DatePicker
                            label={intl.formatMessage({
                                id: "TextBeginDate",
                            })}
                            value={value}
                            onChange={(value) =>
                                onChange(moment(value).format("YYYY-MM-DD"))
                            }
                            renderInput={(params) => (
                                <TextField
                                    size="small"
                                    id="StartDate"
                                    {...register("StartDate")}
                                    margin="dense"
                                    fullWidth
                                    {...params}
                                    error={errors.StartDate?.message}
                                    helperText={errors.StartDate?.message}
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
                            label={intl.formatMessage({
                                id: "RowHeaderEndDate",
                            })}
                            value={value}
                            onChange={(value) =>
                                onChange(moment(value).format("YYYY-MM-DD"))
                            }
                            renderInput={(params) => (
                                <TextField
                                    size="small"
                                    id="EndDate"
                                    {...register("EndDate")}
                                    margin="dense"
                                    fullWidth
                                    {...params}
                                    error={errors.EndDate?.message}
                                    helperText={errors.EndDate?.message}
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
