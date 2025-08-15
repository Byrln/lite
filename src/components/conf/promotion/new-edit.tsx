import { Controller, useForm } from "react-hook-form";
import {
    Checkbox,
    FormControlLabel,
    TextField,
    Radio,
    RadioGroup,
    FormLabel,
    Grid,
} from "@mui/material";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { DatePicker } from "@mui/lab";
import moment from "moment";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { useIntl } from "react-intl";
import { useState, useContext } from "react";
import { mutate } from "swr";
import { toast } from "react-toastify";

import NewEditForm from "components/common/new-edit-form";
import { PromotionAPI, listUrl } from "lib/api/promotion";
import { useAppState } from "lib/context/app";
import { ModalContext } from "lib/context/modal";
import PromotionTypeSelect from "components/select/promotion-type";
import CustomSelect from "components/common/custom-select";
import ReservationSourceSelect from "components/select/booking-source-check";
import RoomTypeSelect from "components/select/room-type-check";
import { dateStringToObj } from "lib/utils/helpers";

const validationSchema = yup.object().shape({
    PromotionCode: yup.string().required("Бөглөнө үү"),
    PromotionTypeID: yup
        .string()
        .required("Бөглөнө үү")
        .typeError("Бөглөнө үү"),
    Description: yup.string().required("Бөглөнө үү"),
    BeginDate: yup.date().required("Бөглөнө үү"),
    EndDate: yup.date().required("Бөглөнө үү"),
    AvailableOn: yup.number().required("Бөглөнө үү").typeError("Бөглөнө үү"),
    Loyalty: yup.boolean().default(false),
});

const NewEdit = () => {
    const intl = useIntl();
    const [state]: any = useAppState();
    const { handleModal }: any = useContext(ModalContext);
    const {
        register,
        reset,
        resetField,
        handleSubmit,
        control,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(validationSchema),
    });
    const [rateType, setRateType] = useState("NormalRate");
    const [sourceAllCheck, setSourceAllCheck] = useState(false);
    const [roomAllCheck, setRoomAllCheck] = useState(false);
    const [initialCheckedSources, setInitialCheckedSources] = useState<any>([]);
    const [initialCheckedRooms, setInitialCheckedRooms] = useState<any>([]);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        // @ts-ignore
        let value = (event.target as HTMLInputElement).value;
        setRateType(value);
    };

    const customSubmit = async (values: any) => {
        try {
            console.log('Starting customSubmit with values:', values);
            
            if (!state.editId) {
                delete values.PromotionID;
            }

            values.BeginDate = moment(values.BeginDate).format("YYYY-MM-DD");
            values.EndDate = moment(values.EndDate).format("YYYY-MM-DD");

            let RoomTypeIDs: any = [];
            if (values.RoomTypeIDs && Array.isArray(values.RoomTypeIDs)) {
                values.RoomTypeIDs.forEach((RoomType: any) => {
                    RoomTypeIDs.push({ ItemID: Number(RoomType) });
                });
            }
            values.RoomTypeIDs = RoomTypeIDs;

            let SourceIDs: any = [];
            if (values.SourceIDs && Array.isArray(values.SourceIDs)) {
                values.SourceIDs.forEach((SourceID: any) => {
                    SourceIDs.push({ ItemID: Number(SourceID) });
                });
            }
            values.SourceIDs = SourceIDs;
            values.Rates = [];

            if (rateType == "NormalRate") {
                values.Rates.push({
                    WeekDayID: 0,
                    CurrencyID: 1,
                    RateAmount: Number(values.Rate),
                });

                delete values.Rate;
                delete values.MondayRate;
                delete values.TuesdayRate;
                delete values.WednesdayRate;
                delete values.ThursdayRate;
                delete values.FridayRate;
                delete values.SaturdayRate;
                delete values.SundayRate;
            } else {
                delete values.Rate;
                if (values.SundayRate && values.SundayRate > 0) {
                    values.Rates.push({
                        WeekDayID: 1,
                        CurrencyID: 1,
                        RateAmount: Number(values.SundayRate),
                    });
                }

                delete values.SundayRate;

                if (values.MondayRate && values.MondayRate > 0) {
                    values.Rates.push({
                        WeekDayID: 2,
                        CurrencyID: 1,
                        RateAmount: Number(values.MondayRate),
                    });
                }
                delete values.MondayRate;

                if (values.TuesdayRate && values.TuesdayRate > 0) {
                    values.Rates.push({
                        WeekDayID: 3,
                        CurrencyID: 1,
                        RateAmount: Number(values.TuesdayRate),
                    });
                }
                delete values.TuesdayRate;

                if (values.WednesdayRate && values.WednesdayRate > 0) {
                    values.Rates.push({
                        WeekDayID: 4,
                        CurrencyID: 1,
                        RateAmount: Number(values.WednesdayRate),
                    });
                }
                delete values.WednesdayRate;

                if (values.ThursdayRate && values.ThursdayRate > 0) {
                    values.Rates.push({
                        WeekDayID: 5,
                        CurrencyID: 1,
                        RateAmount: Number(values.ThursdayRate),
                    });
                }
                delete values.ThursdayRate;

                if (values.FridayRate && values.FridayRate > 0) {
                    values.Rates.push({
                        WeekDayID: 6,
                        CurrencyID: 1,
                        RateAmount: Number(values.FridayRate),
                    });
                }
                delete values.FridayRate;
                if (values.SaturdayRate && values.SaturdayRate > 0) {
                    values.Rates.push({
                        WeekDayID: 7,
                        CurrencyID: 1,
                        RateAmount: Number(values.SaturdayRate),
                    });
                }
                delete values.SaturdayRate;
            }

            values.AllRoomType = roomAllCheck;
            values.AllSource = sourceAllCheck;
            values.Loyalty = values.Loyalty || false;

            console.log('Final values before API call:', values);
            
            if (state.editId) {
                console.log('Updating promotion with ID:', state.editId);
                await PromotionAPI?.update(values);
                toast.success('Promotion updated successfully!');
            } else {
                console.log('Creating new promotion');
                await PromotionAPI?.new(values);
                toast.success('Promotion created successfully!');
            }
            
            console.log('Save operation completed successfully');
            
            // Refresh the promotion list data
            await mutate(listUrl);
            
            // Close the modal
            handleModal();
            
        } catch (error) {
            console.error('Error in customSubmit:', error);
            toast.error('Failed to save promotion. Please try again.');
            throw error;
        }
    };

    const customResetEvent = (data: any) => {
        // setRoomAllCheck();
        setRoomAllCheck(data[0].AllRoomType);
        setSourceAllCheck(data[0].AllSource);
        if (data[0].DiscountDay == 0) {
            setRateType("NormalRate");
        } else {
            setRateType("WeeklyRate");
        }

        if (data[0].IsDiscountAmount == true) {
        }
        const uniqueSourceIDs = Array.from(
            new Set(data.map((item: any) => String(item.SourceID)))
        );
        setInitialCheckedSources(uniqueSourceIDs);

        const uniqueRoomIDs = Array.from(
            new Set(data.map((item: any) => String(item.RoomTypeID)))
        );
        setInitialCheckedRooms(uniqueRoomIDs);

        reset({
            BeginDate: moment(data[0].BeginData).format("YYYY-MM-DD"),
            EndDate: moment(data[0].EndDate).format("YYYY-MM-DD"),
            SourceIDs: uniqueSourceIDs,
            RoomTypeIDs: uniqueRoomIDs,
            PromotionCode: data[0].PromotionCode,
            PromotionTypeID: data[0].PromotionTypeID,
            Description: data[0].Description,
            AvailableOn: data[0].AvailableOn,
            Loyalty: data[0].Loyalty || false,
            Rate:
                data.filter(
                    (item: any) =>
                        item.DiscountDay == 0 &&
                        (item.DiscountAmount > 0 || item.DiscountPercent > 0)
                ).length > 0
                    ? data.filter(
                          (item: any) =>
                              item.DiscountDay == 0 &&
                              (item.DiscountAmount > 0 ||
                                  item.DiscountPercent > 0)
                      )[0].DiscountAmount > 0
                        ? data.filter(
                              (item: any) =>
                                  item.DiscountDay == 0 &&
                                  (item.DiscountAmount > 0 ||
                                      item.DiscountPercent > 0)
                          )[0].DiscountAmount
                        : data.filter(
                              (item: any) =>
                                  item.DiscountDay == 0 &&
                                  (item.DiscountAmount > 0 ||
                                      item.DiscountPercent > 0)
                          )[0].DiscountPercent
                    : 0,
            MondayRate:
                data.filter(
                    (item: any) =>
                        item.DiscountDay == 2 &&
                        (item.DiscountAmount > 0 || item.DiscountPercent > 0)
                ).length > 0
                    ? data.filter(
                          (item: any) =>
                              item.DiscountDay == 2 &&
                              (item.DiscountAmount > 0 ||
                                  item.DiscountPercent > 0)
                      )[0].DiscountAmount > 0
                        ? data.filter(
                              (item: any) =>
                                  item.DiscountDay == 2 &&
                                  (item.DiscountAmount > 0 ||
                                      item.DiscountPercent > 0)
                          )[0].DiscountAmount
                        : data.filter(
                              (item: any) =>
                                  item.DiscountDay == 2 &&
                                  (item.DiscountAmount > 0 ||
                                      item.DiscountPercent > 0)
                          )[0].DiscountPercent
                    : 0,
            TuesdayRate:
                data.filter(
                    (item: any) =>
                        item.DiscountDay == 3 &&
                        (item.DiscountAmount > 0 || item.DiscountPercent > 0)
                ).length > 0
                    ? data.filter(
                          (item: any) =>
                              item.DiscountDay == 3 &&
                              (item.DiscountAmount > 0 ||
                                  item.DiscountPercent > 0)
                      )[0].DiscountAmount > 0
                        ? data.filter(
                              (item: any) =>
                                  item.DiscountDay == 3 &&
                                  (item.DiscountAmount > 0 ||
                                      item.DiscountPercent > 0)
                          )[0].DiscountAmount
                        : data.filter(
                              (item: any) =>
                                  item.DiscountDay == 3 &&
                                  (item.DiscountAmount > 0 ||
                                      item.DiscountPercent > 0)
                          )[0].DiscountPercent
                    : 0,
            WednesdayRate:
                data.filter(
                    (item: any) =>
                        item.DiscountDay == 4 &&
                        (item.DiscountAmount > 0 || item.DiscountPercent > 0)
                ).length > 0
                    ? data.filter(
                          (item: any) =>
                              item.DiscountDay == 4 &&
                              (item.DiscountAmount > 0 ||
                                  item.DiscountPercent > 0)
                      )[0].DiscountAmount > 0
                        ? data.filter(
                              (item: any) =>
                                  item.DiscountDay == 4 &&
                                  (item.DiscountAmount > 0 ||
                                      item.DiscountPercent > 0)
                          )[0].DiscountAmount
                        : data.filter(
                              (item: any) =>
                                  item.DiscountDay == 4 &&
                                  (item.DiscountAmount > 0 ||
                                      item.DiscountPercent > 0)
                          )[0].DiscountPercent
                    : 0,

            ThursdayRate:
                data.filter(
                    (item: any) =>
                        item.DiscountDay == 5 &&
                        (item.DiscountAmount > 0 || item.DiscountPercent > 0)
                ).length > 0
                    ? data.filter(
                          (item: any) =>
                              item.DiscountDay == 5 &&
                              (item.DiscountAmount > 0 ||
                                  item.DiscountPercent > 0)
                      )[0].DiscountAmount > 0
                        ? data.filter(
                              (item: any) =>
                                  item.DiscountDay == 5 &&
                                  (item.DiscountAmount > 0 ||
                                      item.DiscountPercent > 0)
                          )[0].DiscountAmount
                        : data.filter(
                              (item: any) =>
                                  item.DiscountDay == 5 &&
                                  (item.DiscountAmount > 0 ||
                                      item.DiscountPercent > 0)
                          )[0].DiscountPercent
                    : 0,
            FridayRate:
                data.filter(
                    (item: any) =>
                        item.DiscountDay == 6 &&
                        (item.DiscountAmount > 0 || item.DiscountPercent > 0)
                ).length > 0
                    ? data.filter(
                          (item: any) =>
                              item.DiscountDay == 6 &&
                              (item.DiscountAmount > 0 ||
                                  item.DiscountPercent > 0)
                      )[0].DiscountAmount > 0
                        ? data.filter(
                              (item: any) =>
                                  item.DiscountDay == 6 &&
                                  (item.DiscountAmount > 0 ||
                                      item.DiscountPercent > 0)
                          )[0].DiscountAmount
                        : data.filter(
                              (item: any) =>
                                  item.DiscountDay == 6 &&
                                  (item.DiscountAmount > 0 ||
                                      item.DiscountPercent > 0)
                          )[0].DiscountPercent
                    : 0,

            SaturdayRate:
                data.filter(
                    (item: any) =>
                        item.DiscountDay == 7 &&
                        (item.DiscountAmount > 0 || item.DiscountPercent > 0)
                ).length > 0
                    ? data.filter(
                          (item: any) =>
                              item.DiscountDay == 7 &&
                              (item.DiscountAmount > 0 ||
                                  item.DiscountPercent > 0)
                      )[0].DiscountAmount > 0
                        ? data.filter(
                              (item: any) =>
                                  item.DiscountDay == 7 &&
                                  (item.DiscountAmount > 0 ||
                                      item.DiscountPercent > 0)
                          )[0].DiscountAmount
                        : data.filter(
                              (item: any) =>
                                  item.DiscountDay == 7 &&
                                  (item.DiscountAmount > 0 ||
                                      item.DiscountPercent > 0)
                          )[0].DiscountPercent
                    : 0,

            SundayRate:
                data.filter(
                    (item: any) =>
                        item.DiscountDay == 1 &&
                        (item.DiscountAmount > 0 || item.DiscountPercent > 0)
                ).length > 0
                    ? data.filter(
                          (item: any) =>
                              item.DiscountDay == 1 &&
                              (item.DiscountAmount > 0 ||
                                  item.DiscountPercent > 0)
                      )[0].DiscountAmount > 0
                        ? data.filter(
                              (item: any) =>
                                  item.DiscountDay == 1 &&
                                  (item.DiscountAmount > 0 ||
                                      item.DiscountPercent > 0)
                          )[0].DiscountAmount
                        : data.filter(
                              (item: any) =>
                                  item.DiscountDay == 1 &&
                                  (item.DiscountAmount > 0 ||
                                      item.DiscountPercent > 0)
                          )[0].DiscountPercent
                    : 0,
        });
    };

    return (
        <NewEditForm
            api={PromotionAPI}
            listUrl={listUrl}
            additionalValues={{
                PromotionID: state.editId,
            }}
            reset={reset}
            handleSubmit={handleSubmit}
            customSubmit={customSubmit}
            customResetEvent={customResetEvent}
        >
            <LocalizationProvider
                //@ts-ignore
                dateAdapter={AdapterDateFns}
            >
                <Grid container spacing={1}>
                    <Grid item xs={6}>
                        <TextField
                            size="small"
                            fullWidth
                            id="PromotionCode"
                            label={intl.formatMessage({
                                id: "TextPromotionCode",
                            })}
                            {...register("PromotionCode")}
                            margin="dense"
                            error={!!errors.PromotionCode?.message}
                            helperText={errors.PromotionCode?.message as string}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <PromotionTypeSelect
                            register={register}
                            errors={errors}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <TextField
                            size="small"
                            fullWidth
                            multiline
                            rows={3}
                            id="Description"
                            label={intl.formatMessage({
                                id: "TextDescription",
                            })}
                            {...register("Description")}
                            margin="dense"
                            error={!!errors.Description?.message}
                            helperText={errors.Description?.message as string}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            type="date"
                            fullWidth
                            id="BeginDate"
                            label={intl.formatMessage({
                                id: "RowHeaderBeginDate",
                            })}
                            {...register("BeginDate")}
                            margin="dense"
                            error={!!errors.BeginDate?.message}
                            helperText={errors.BeginDate?.message as string}
                            size="small"
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            type="date"
                            fullWidth
                            id="EndDate"
                            label={intl.formatMessage({
                                id: "RowHeaderEndDate",
                            })}
                            {...register("EndDate")}
                            margin="dense"
                            error={!!errors.EndDate?.message}
                            helperText={errors.EndDate?.message as string}
                            size="small"
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <CustomSelect
                            register={register}
                            errors={errors}
                            field="AvailableOn"
                            label="Available On"
                            options={[
                                { key: 1, value: "Өдөр бүр" },
                                { key: 2, value: "Эхний өдөр" },
                                { key: 3, value: "Сүүлийн өдөр" },
                            ]}
                            optionValue="key"
                            optionLabel="value"
                        />
                        <FormControlLabel
                            control={
                                <Checkbox
                                    {...register("Loyalty")}
                                    color="primary"
                                />
                            }
                            label={intl.formatMessage({
                                id: "TextLoyalty",
                                defaultMessage: "Loyalty Program"
                            })}
                        />
                        <div style={{ width: "100%" }}>
                            <ReservationSourceSelect
                                register={register}
                                errors={errors}
                                title="Booking Source"
                                resetField={resetField}
                                setAllCheck={setSourceAllCheck}
                                allCheck={sourceAllCheck}
                                initialChecks={initialCheckedSources}
                            />
                        </div>
                        <div style={{ width: "100%" }}>
                            <RoomTypeSelect
                                register={register}
                                errors={errors}
                                title="Room Type"
                                resetField={resetField}
                                setAllCheck={setRoomAllCheck}
                                allCheck={roomAllCheck}
                                initialChecks={initialCheckedRooms}
                            />
                        </div>
                    </Grid>
                </Grid>
            </LocalizationProvider>
            <br />
            <FormLabel component="legend">Rate</FormLabel>

            <RadioGroup
                row
                aria-labelledby="demo-row-radio-buttons-group-label"
                name="row-radio-buttons-group"
                value={rateType}
                onChange={handleChange}
                defaultValue={"30"}
            >
                <FormControlLabel
                    value="NormalRate"
                    control={<Radio />}
                    id="NormalRate"
                    label={intl.formatMessage({ id: "ReportNormalRate" })}
                    // {...register("TextWeekly")}
                />
                <FormControlLabel
                    value="WeeklyRate"
                    control={<Radio />}
                    id="WeeklyRate"
                    label={intl.formatMessage({ id: "TextWeeklyRate" })}
                    // {...register("TextWeekly")}
                />
            </RadioGroup>

            {rateType == "NormalRate" ? (
                <TextField
                    size="small"
                    type="number"
                    fullWidth
                    id="Rate"
                    label={intl.formatMessage({ id: "Rate" })}
                    {...register("Rate")}
                    margin="dense"
                    error={!!errors.Rate?.message}
                    helperText={errors.Rate?.message as string}
                />
            ) : (
                <Grid container spacing={1}>
                    <Grid item xs={6}>
                        <TextField
                            size="small"
                            type="number"
                            fullWidth
                            id="MondayRate"
                            label={intl.formatMessage({ id: "Monday" })}
                            {...register("MondayRate")}
                            margin="dense"
                            error={!!errors.MondayRate?.message}
                            helperText={errors.MondayRate?.message as string}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            size="small"
                            type="number"
                            fullWidth
                            id="TuesdayRate"
                            label={intl.formatMessage({ id: "Tuesday" })}
                            {...register("TuesdayRate")}
                            margin="dense"
                            error={!!errors.TuesdayRate?.message}
                            helperText={errors.TuesdayRate?.message as string}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            size="small"
                            type="number"
                            fullWidth
                            id="WednesdayRate"
                            label={intl.formatMessage({ id: "Wednesday" })}
                            {...register("WednesdayRate")}
                            margin="dense"
                            error={!!errors.WednesdayRate?.message}
                            helperText={errors.WednesdayRate?.message as string}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            size="small"
                            type="number"
                            fullWidth
                            id="ThursdayRate"
                            label={intl.formatMessage({ id: "Thursday" })}
                            {...register("ThursdayRate")}
                            margin="dense"
                            error={!!errors.ThursdayRate?.message}
                            helperText={errors.ThursdayRate?.message as string}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            size="small"
                            type="number"
                            fullWidth
                            id="FridayRate"
                            label={intl.formatMessage({ id: "Friday" })}
                            {...register("FridayRate")}
                            margin="dense"
                            error={!!errors.FridayRate?.message}
                            helperText={errors.FridayRate?.message as string}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            size="small"
                            type="number"
                            fullWidth
                            id="SaturdayRate"
                            label={intl.formatMessage({ id: "Saturday" })}
                            {...register("SaturdayRate")}
                            margin="dense"
                            error={!!errors.SaturdayRate?.message}
                            helperText={errors.SaturdayRate?.message as string}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            size="small"
                            type="number"
                            fullWidth
                            id="SundayRate"
                            label={intl.formatMessage({ id: "Sunday" })}
                            {...register("SundayRate")}
                            margin="dense"
                            error={!!errors.SundayRate?.message}
                            helperText={errors.SundayRate?.message as string}
                        />
                    </Grid>
                </Grid>
            )}
        </NewEditForm>
    );
};

export default NewEdit;
