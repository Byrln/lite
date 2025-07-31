import { Controller, useForm } from "react-hook-form";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TextField, Grid } from "@mui/material";
import moment from "moment";
import { useIntl } from "react-intl";
import { dateStringToObj } from "lib/utils/helpers";
import RoomTypeSelect from "components/select/room-type";
const Search = ({ register, errors, control, reset }: any) => {
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
                        label={intl.formatMessage({id:"RowHeaderStarDate"}) }
                            value={value}
                            onChange={(value) =>
                                onChange(moment(value).format("YYYY-MM-DD"))
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
                                    helperText={errors.CurrDate?.message as string}
                                />
                            )}
                        />
                    )}
                />
            </Grid>

            <Grid item xs={3}>
                <RoomTypeSelect register={register} errors={errors} />
            </Grid>
        </Grid>
    );
};

export default Search;
