import { useIntl } from "react-intl";
import {
    TextField,
    Grid,
    FormControlLabel,
    FormGroup,
    Checkbox,
} from "@mui/material";
import { Controller } from "react-hook-form";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import moment from "moment";
import { useState, useEffect } from "react";

// import CashierSessionSelect from "components/select/cashier-session";
import { CashierSessionAPI } from "lib/api/cashier-session";

const Search = ({
    register,
    errors,
    control,
    setReportType,
    year,
    setYear,
    month,
    setMonth,
    sessions,
    setSessions,
}: any) => {
    const [entity, setEntity]: any = useState(null);

    const handleToggle = (element: any) => (e: any) => {
        let tempValue = [...sessions];
        if (tempValue && tempValue.includes(String(element.SessionID))) {
            tempValue.splice(tempValue.indexOf(element.SessionID), 1);
        } else {
            tempValue.push(String(element.SessionID));
        }
        setSessions(tempValue);
    };

    useEffect(() => {
        const fetchDatas = async () => {
            if (year && month) {
                try {
                    const arr: any = await CashierSessionAPI?.list({
                        StartYear: year,
                        StartMonth: month,
                    });
                    if (arr) {
                        setEntity(arr);
                    }
                } finally {
                }
            }
        };

        fetchDatas();
    }, [year, month]);

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
                            value={`${year}-${month}-01`}
                            onChange={(value) => (
                                setMonth(Number(moment(value).month()) + 1),
                                setYear(moment(value).year()),
                                setSessions([]),
                                onChange(moment(value).format("YYYY-MM-DD"))
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
                                    helperText={errors.CurrDate?.message as string}
                                />
                            )}
                        />
                    )}
                />
            </Grid>
            <Grid item xs={12} style={{ maxHeight: "200px", overflow: "auto" }}>
                <FormGroup>
                    <Grid container spacing={2}>
                        {entity &&
                            entity.map((element: any) => (
                                <Grid
                                    key={element.SessionID}
                                    item
                                    xs={4}
                                    sm={3}
                                >
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={
                                                    sessions &&
                                                    sessions.includes(
                                                        String(
                                                            element.SessionID
                                                        )
                                                    )
                                                        ? true
                                                        : false
                                                }
                                                {...register("Sessions")}
                                                value={element.SessionID}
                                                onChange={handleToggle(element)}
                                            />
                                        }
                                        label={`${element.FullName}`}
                                    />
                                </Grid>
                            ))}
                    </Grid>
                </FormGroup>
            </Grid>
        </Grid>
    );
};

export default Search;
