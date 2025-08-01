import { Controller, useForm } from "react-hook-form";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TextField, Grid } from "@mui/material";
import moment from "moment";

import { dateStringToObj } from "lib/utils/helpers";
import RoomTypeSelect from "components/select/room-type";
const Search = ({
    register,
    errors,
    control,
    reset,
    workingDate,
    setSearch,
    setSearchCurrDate,
    setSearchRoomTypeID,
}: any) => {
    const onRoomTypeChange = (rt: any, index?: number) => {
        setSearchRoomTypeID(rt.RoomTypeID);
    };

    return (
        <Grid container spacing={1}>
            <Grid item xs={3}>
                <Controller
                    name="CurrDate"
                    control={control}
                    defaultValue={workingDate}
                    render={({ field: { onChange, value } }) => (
                        <DatePicker
                            label="Эхлэх огноо"
                            value={value}
                            onAccept={(acceptedValue) => {
                                if (acceptedValue) {
                                    const formatted =
                                        moment(acceptedValue).format(
                                            "YYYY-MM-DD"
                                        );
                                    onChange(formatted);
                                    setSearchCurrDate(formatted);
                                }
                            }}
                            onChange={
                                (value) =>
                                    value &&
                                    onChange(moment(value).format("YYYY-MM-DD"))
                                // setSearchCurrDate(
                                //     moment(value).format("YYYY-MM-DD")
                                // ))
                            }
                            // minDate={new Date("1900-01-01")}
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
                                    onBlur={(e) => {
                                        const typedValue = new Date(
                                            e.target.value
                                        );

                                        const parsedDate = moment(
                                            typedValue,
                                            "YYYY-MM-DD",
                                            true
                                        );

                                        if (parsedDate.isValid()) {
                                            const formatted =
                                                parsedDate.format("YYYY-MM-DD");

                                            onChange(formatted);
                                            setSearchCurrDate(formatted);
                                        }
                                    }}
                                />
                            )}
                        />
                    )}
                />
            </Grid>

            <Grid item xs={3}>
                <RoomTypeSelect
                    register={register}
                    errors={errors}
                    onRoomTypeChange={onRoomTypeChange}
                />
            </Grid>
        </Grid>
    );
};

export default Search;
