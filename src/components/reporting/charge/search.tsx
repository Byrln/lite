import { TextField, Grid } from "@mui/material";
import { Controller } from "react-hook-form";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import moment from "moment";
import { useIntl } from "react-intl";
import CustomerSelect from "components/select/customer";
import RoomTypeSelect from "components/select/room-type";
import RoomSelect from "components/select/room";

const Search = ({ register, errors, control }: any) => {
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
                        label={intl.formatMessage({id:"RowHeaderStayDate"}) }
                            value={value}
                            onChange={(value) =>
                                onChange(moment(value, "YYYY-MM-DD"))
                            }
                            renderInput={(params) => (
                                <TextField
                                    size="small"
                                    id="StartDate"
                                    {...register("StartDate")}
                                    margin="dense"
                                    fullWidth
                                    {...params}
                                    error={errors.StartDate?.message}
                                    helperText={errors.StartDate?.message}
                                />
                            )}
                        />
                    )}
                />
            </Grid>

            {/* <Grid item xs={3}>
                <Controller
                    name="EndDate"
                    control={control}
                    defaultValue={null}
                    render={({ field: { onChange, value } }) => (
                        <DatePicker
                            label="Дуусах огноо"
                            value={value}
                            onChange={(value) =>
                                onChange(moment(value, "YYYY-MM-DD"))
                            }
                            renderInput={(params) => (
                                <TextField
                                    size="small"
                                    id="EndDate"
                                    {...register("EndDate")}
                                    margin="dense"
                                    fullWidth
                                    {...params}
                                    error={errors.EndDate?.message}
                                    helperText={errors.EndDate?.message}
                                />
                            )}
                        />
                    )}
                />
            </Grid> */}

            {/* <Grid item xs={3}>
                <CustomerSelect
                    register={register}
                    errors={errors}
                    isCustomSelect={true}
                    isNA={true}
                />
            </Grid> */}
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
