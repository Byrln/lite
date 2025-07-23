import { TextField, Grid, MenuItem } from "@mui/material";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { Controller } from "react-hook-form";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import moment from "moment";
import { useIntl } from "react-intl";
import ChargeTypeGroupSelect from "components/select/charge-type-group";
import RoomTypeSelect from "components/select/room-type";
import RoomSelect from "components/select/room";

const Search = ({
    register,
    errors,
    control,
    setReportType,
    ReportType,
}: any) => {
    const intl = useIntl();
    const handleReportType = (event: SelectChangeEvent) => {
     
        setReportType(event.target.value as string);
    };
    return (
        <Grid container spacing={1}>
            <Grid item xs={3}>
                <Controller
                    name="StartDate"
                    control={control}
                    defaultValue={null}
                    render={({ field: { onChange, value } }) => (
                        <DatePicker
                        label={intl.formatMessage({id:"TextStartDate"}) }
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
                                    error={!!errors.StartDate?.message}
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
                        label={intl.formatMessage({id:"TextEndDate"}) }
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
                                    error={!!errors.EndDate?.message}
                                    helperText={errors.EndDate?.message}
                                />
                            )}
                        />
                    )}
                />
            </Grid>
            <Grid item xs={3}>
                <ChargeTypeGroupSelect register={register} errors={errors} />
            </Grid>
            <Grid item xs={3}>
                <RoomTypeSelect
                    register={register}
                    errors={errors}
                    isSearch={true}
                />
            </Grid>
            <Grid item xs={3}>
                <RoomSelect
                    register={register}
                    errors={errors}
                    baseStay={{
                        TransactionID: 0,
                        roomType: "all",
                        dateStart: new Date(),
                        dateEnd: new Date(),
                        nights: 1,
                    }}
                    isSearch={true}
                />
            </Grid>
        </Grid>
    );
};

export default Search;
