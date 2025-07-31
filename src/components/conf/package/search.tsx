import { TextField, Grid } from "@mui/material";
import { Controller } from "react-hook-form";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import moment from "moment";
import { useIntl } from "react-intl";
import { dateStringToObj } from "lib/utils/helpers";

const Search = ({ register, errors, control, reset }: any) => {
    const intl = useIntl();
    reset({
        BeginDate: new Date(new Date().getFullYear(), 0, 1),
        EndDate: new Date(new Date().getFullYear(), 11, 31),
    });
    return (
        <Grid container spacing={1}>
            <Grid item xs={3}>
                <TextField
                    size="small"
                    fullWidth
                    id="SearchStr"
                        label={intl.formatMessage({id:"RowHeaderEndDate"}) }
                        {...register("SearchStr")}
                    margin="dense"
                    error={!!errors.SearchStr?.message}
                    helperText={errors.SearchStr?.message as string}
                />
            </Grid>

            {/* <Grid item xs={3}>
                <Controller
                    name="BeginDate"
                    control={control}
                    defaultValue={null}
                    render={({ field: { onChange, value } }) => (
                        <DatePicker
                            label="Эхлэх огноо"
                            value={value}
                            onChange={(value) =>
                                onChange(
                                    moment(
                                        dateStringToObj(
                                            moment(value).format("YYYY-MM-DD")
                                        ),
                                        "YYYY-MM-DD"
                                    )
                                )
                            }
                            renderInput={(params) => (
                                <TextField
                                    size="small"
                                    id="BeginDate"
                                    {...register("BeginDate")}
                                    margin="dense"
                                    fullWidth
                                    {...params}
                                    error={!!errors.BeginDate?.message}
                                    helperText={errors.BeginDate?.message as string}
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
                                onChange(
                                    moment(
                                        dateStringToObj(
                                            moment(value).format("YYYY-MM-DD")
                                        ),
                                        "YYYY-MM-DD"
                                    )
                                )
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
            </Grid> */}
        </Grid>
    );
};

export default Search;
