import { TextField, Grid, MenuItem } from "@mui/material";
import { Controller } from "react-hook-form";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import moment from "moment";
import { useIntl } from "react-intl";

import ReservationTypeSelect from "components/select/reservation-type";
import ReservationSourceSelect from "components/select/reservation-source";
import { dateStringToObj } from "lib/utils/helpers";
import CustomerSelect from "components/select/customer";

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
                            label={intl.formatMessage({
                                id: "RowHeaderEndDate",
                            })}
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
            </Grid>

            <Grid item xs={3}>
                <ReservationTypeSelect
                    register={register}
                    errors={errors}
                    reset={reset}
                />
            </Grid>

            <Grid item xs={3}>
                <ReservationSourceSelect
                    register={register}
                    errors={errors}
                    label={intl.formatMessage({
                        id: "TextReservationSource",
                    })}
                />
            </Grid>

            <Grid item xs={3}>
                <TextField
                    size="small"
                    fullWidth
                    id="GuestName"
                    label={intl.formatMessage({
                        id: "RowHeaderGuestName",
                    })}
                    {...register("GuestName")}
                    margin="dense"
                    error={!!errors.GuestName?.message}
                    helperText={errors.GuestName?.message as string}
                />
            </Grid>

            <Grid item xs={3}>
                <TextField
                    size="small"
                    fullWidth
                    id="GuestPhone"
                    label={intl.formatMessage({
                        id: "RowHeaderPhone",
                    })}
                    {...register("GuestPhone")}
                    margin="dense"
                    error={!!errors.GuestPhone?.message}
                    helperText={errors.GuestPhone?.message as string}
                />
            </Grid>

            <Grid item xs={3}>
                <TextField
                    size="small"
                    fullWidth
                    id="GuestEmail"
                    label={intl.formatMessage({
                        id: "TextEmail",
                    })}
                    {...register("GuestEmail")}
                    margin="dense"
                    error={!!errors.GuestEmail?.message}
                    helperText={errors.GuestEmail?.message as string}
                />
            </Grid>

            <Grid item xs={3}>
                <TextField
                    fullWidth
                    id="StatusGroup"
                    label={intl.formatMessage({
                        id: "ReportStatus",
                    })}
                    {...register("StatusGroup")}
                    select
                    margin="dense"
                    error={!!errors.StatusGroup?.message}
                    helperText={errors.StatusGroup?.message as string}
                    size="small"
                >
                    <MenuItem key={1} value={1}>
                        Reservations
                    </MenuItem>
                    <MenuItem key={3} value={3}>
                        Checked out
                    </MenuItem>
                    <MenuItem key={2} value={2}>
                        Arrived, Stay over, Due out
                    </MenuItem>
                    <MenuItem key={0} value={0}>
                        Cancel, Void, No Show
                    </MenuItem>
                </TextField>
            </Grid>

            <Grid item xs={3}>
                <CustomerSelect
                    register={register}
                    errors={errors}
                    isCustomSelect={true}
                />
            </Grid>
        </Grid>
    );
};

export default Search;
