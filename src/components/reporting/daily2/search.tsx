import { TextField, Grid, FormControlLabel, FormGroup } from "@mui/material";
import { useState, useEffect } from "react";

import { Controller } from "react-hook-form";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import Checkbox from "@mui/material/Checkbox";

import FloorSelect from "components/select/floor";
import moment from "moment";
import { FloorSWR } from "lib/api/floor";

const Search = ({ register, errors, control, search }: any) => {
    const { data, error } = FloorSWR();
    const [floors, setFloors]: any = useState([]);

    useEffect(() => {
        if (search && search.Floors) {
            setFloors(search.Floors);
        }
    }, [search]);

    const handleToggle = (element: any) => (e: any) => {
        let tempValue = [...floors];
        if (tempValue && tempValue.includes(String(element.FloorID))) {
            tempValue.splice(tempValue.indexOf(element.FloorID), 1);
        } else {
            tempValue.push(String(element.FloorID));
        }
        setFloors(tempValue);
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
            <FormGroup>
                <Grid container spacing={2}>
                    {data &&
                        data.map((element: any) => (
                            <Grid key={element.FloorID} item xs={3}>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={
                                                floors &&
                                                floors.includes(
                                                    String(element.FloorID)
                                                )
                                                    ? true
                                                    : false
                                            }
                                            {...register("Floors")}
                                            value={element.FloorID}
                                            onChange={handleToggle(element)}
                                        />
                                    }
                                    label={`${element.FloorNo} давхар`}
                                />
                            </Grid>
                        ))}
                </Grid>
            </FormGroup>
            {/* <Grid item xs={3}>
                <FloorSelect
                    register={register}
                    errors={errors}
                    multiple={true}
                />
            </Grid> */}
        </Grid>
    );
};

export default Search;
