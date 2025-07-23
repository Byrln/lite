import { TextField, Grid } from "@mui/material";
import { Controller } from "react-hook-form";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import moment from "moment";
import { useState } from "react";
import { useIntl } from "react-intl";
import RoomSelect from "components/select/room";

const Search = ({ register, errors, control, reset }: any) => {
    const intl = useIntl();
    const [baseStay, setBaseStay]: any = useState({
        TransactionID: 0,
        roomType: "all",
        dateStart: new Date(),
        dateEnd: new Date(),
        nights: 1,
        room: {
            RoomID: null,
        },
    });

    const onRoomChange = (r: any, index: any) => {
        setBaseStay({
            ...baseStay,
            room: r,
        });
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
                        label={intl.formatMessage({id:"RowHeaderBeginDate"}) }
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
                        label={intl.formatMessage({id:"RowHeaderEndDate"}) }
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
                <RoomSelect
                    register={register}
                    errors={errors}
                    baseStay={baseStay}
                    onRoomChange={onRoomChange}
                    customRegisterName="RoomID"
                />
            </Grid>
        </Grid>
    );
};

export default Search;
