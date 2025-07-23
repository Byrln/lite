import { TextField, Grid } from "@mui/material";
import { Controller } from "react-hook-form";
import { useIntl } from "react-intl";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import moment from "moment";

import CashierSessionSelect from "components/select/cashier-session";

const Search = ({
    register,
    errors,
    control,
    setReportType,
    year,
    setYear,
    month,
    setMonth,
    sessionId,
    setSessionId,
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
                            label={intl.formatMessage({id:"TextStartDate"}) }
                            value={`${year}-${month}-01`}
                            onChange={(value) => (
                                setMonth(Number(moment(value).month()) + 1),
                                setYear(moment(value).year())
                            )}
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
            {year && month && (
                <Grid item xs={9}>
                    <CashierSessionSelect
                        register={register}
                        errors={errors}
                        StartYear={year}
                        StartMonth={month}
                        label="Cashier"
                        onChange={setSessionId}
                    />
                </Grid>
            )}
        </Grid>
    );
};

export default Search;
