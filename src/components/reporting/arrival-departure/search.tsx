import { TextField, Grid, MenuItem } from "@mui/material";
import Select, { SelectChangeEvent } from "@mui/material/Select";

import { Controller } from "react-hook-form";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import moment from "moment";

const Search = ({
    register,
    errors,
    control,
    setReportType,
    ReportType,
}: any) => {
    const handleReportType = (event: SelectChangeEvent) => {
        setReportType(event.target.value as string);
    };
    return (
        <Grid container spacing={1}>
            <Grid item xs={3}>
                <Select
                    value={ReportType}
                    onChange={handleReportType}
                    size="small"
                    className="mt-2"
                    style={{ width: "100%" }}
                    // name="ReportType"
                    // {...register("CurrDate")}
                >
                    <MenuItem key={"arrival"} value={"arrival"}>
                        Arrival
                    </MenuItem>

                    <MenuItem key={"departure"} value={"departure"}>
                        Departure
                    </MenuItem>
                </Select>
            </Grid>
            <Grid item xs={3}>
                <Controller
                    name="CurrDate"
                    control={control}
                    defaultValue={null}
                    render={({ field: { onChange, value } }) => (
                        <DatePicker
                            label="Огноо"
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
