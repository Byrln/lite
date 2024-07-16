import { TextField, Grid, MenuItem } from "@mui/material";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { Controller } from "react-hook-form";
import { useIntl } from "react-intl";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import moment from "moment";

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
