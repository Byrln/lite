import { Controller } from "react-hook-form";
import {
    Grid,
    TextField,
    Checkbox,
    FormControlLabel,
    Typography,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import moment from "moment";
import { useEffect, useState } from "react";
import NumberSelect from "components/select/number-select";
import { dateStringToObj } from "lib/utils/helpers";
import RoomTypeSelect from "components/select/room-type";
import RoomSelect from "components/select/room-select";
import { ReservationTypeSelect } from "components/select";
import RoomRateTypeSelect from "components/select/room-rate-type";
import CurrencyAmount from "components/reservation/currency-amount";
import GuestSelect from "components/select/guest-select";
import PaymentMethodSelect from "components/select/payment-method";
import CurrencySelect from "components/select/currency";

import { countNights } from "lib/utils/format-time";

const NewEdit = ({
    id,
    register,
    control,
    errors,
    getValues,
    resetField,
    reset,
    field,
    BaseAdult,
    BaseChild,
    MaxAdult,
    MaxChild,
    workingDate,
}: any) => {
    const [RoomTypeID, setRoomTypeID]: any = useState("");
    const [RoomType, setRoomType]: any = useState("");
    const [RoomID, setRoomID]: any = useState("");
    const [ArrivalDate, setArrivalDate]: any = useState("");
    const [DepartureDate, setDepartureDate]: any = useState("");
    const [Rate, setRate]: any = useState("");
    const [Nights, setNights]: any = useState("");
    const [TaxIncluded, setTaxIncluded]: any = useState("");
    const [currencyAmount, setCurrencyAmount]: any = useState("");
    const [Currency, setCurrency]: any = useState("");
    const [BreakfastIncluded, setBreakfastIncluded]: any = useState("");
    const [selectedGuest, setSelectedGuest]: any = useState(null);
    const [PaymentMethodID, setPaymentMethodID]: any = useState(null);
    const [ReservationTypeID, setReservationTypeID]: any = useState(1);
    const [selectedAdult, setSelectedAdult]: any = useState(1);
    const [selectedChild, setSelectedChild]: any = useState(0);

    const setRange = (dateStart: Date, dateEnd: Date) => {
        var nights: number;
        nights = countNights(dateStart, dateEnd);

        setNights(nights);
        resetField(`TransactionDetail.${id}.Nights`, {
            defaultValue: nights,
        });
    };

    useEffect(() => {
        if (ArrivalDate && DepartureDate) {
            setRange(ArrivalDate, DepartureDate);
        }
    }, [ArrivalDate, DepartureDate]);

    useEffect(() => {
        if (getValues(`TransactionDetail[${id}]`)) {
            if (id > 0) {
            }
            if (getValues(`TransactionDetail[${id}].RoomTypeID`)) {
                setRoomTypeID(
                    Number(getValues(`TransactionDetail[${id}].RoomTypeID`))
                );
            }
            if (getValues(`TransactionDetail[${id}].RoomID`)) {
                setRoomID(Number(getValues(`TransactionDetail[${id}].RoomID`)));
            }
            if (getValues(`TransactionDetail[${id}].ArrivalDate`)) {
                setArrivalDate(
                    getValues(`TransactionDetail[${id}].ArrivalDate`)
                );
            }
            if (getValues(`TransactionDetail[${id}].DepartureDate`)) {
                setDepartureDate(
                    getValues(`TransactionDetail[${id}].DepartureDate`)
                );
            }
            if (getValues(`TransactionDetail[${id}].RateTypeID`)) {
                setRate({
                    RateTypeID: Number(
                        getValues(`TransactionDetail[${id}].RateTypeID`)
                    ),
                });
            }
            if (getValues(`TransactionDetail[${id}].CurrencyAmount`)) {
                setCurrencyAmount(
                    Number(getValues(`TransactionDetail[${id}].CurrencyAmount`))
                );
            }
            if (getValues(`TransactionDetail[${id}].CurrencyID`)) {
                setCurrency({
                    CurrencyID: Number(
                        getValues(`TransactionDetail[${id}].CurrencyID`)
                    ),
                });
            }
            if (getValues(`TransactionDetail[${id}].BreakfastIncluded`)) {
                setBreakfastIncluded(
                    getValues(`TransactionDetail[${id}].BreakfastIncluded`)
                );
            }
            if (getValues(`TransactionDetail[${id}].ReservationTypeID`)) {
                setReservationTypeID(
                    Number(
                        getValues(`TransactionDetail[${id}].ReservationTypeID`)
                    )
                );
            }

            if (getValues(`TransactionDetail[${id}].GuestName`)) {
                setSelectedGuest({
                    value: Number(
                        Number(getValues(`TransactionDetail[${id}].GuestID`))
                    ),
                    label: getValues(`TransactionDetail[${id}].GuestName`),
                });
            }
            if (id > 0) {
                let baseAdult = 0;
                let baseChild = 0;
                if (getValues(`TransactionDetail[${id}].Adult`)) {
                    baseAdult = getValues(`TransactionDetail[${id}].Adult`);
                }

                if (getValues(`TransactionDetail[${id}].Child`)) {
                    baseChild = getValues(`TransactionDetail[${id}].Child`);
                }

                setRoomType({
                    BaseAdult: baseAdult,
                    BaseChild: baseChild,
                });
            } else {
                setRoomType({
                    BaseAdult: BaseAdult,
                    BaseChild: BaseChild,
                    MaxAdult: MaxAdult,
                    MaxChild: MaxChild,
                });
            }
        }
    }, [id]);

    const onRoomTypeChange = (rt: any, index: number) => {
        setRoomTypeID(rt.RoomTypeID);
        setRoomType(rt);
        resetField(`TransactionDetail.${id}.Adult`, {
            defaultValue: rt.BaseAdult,
        });
        resetField(`TransactionDetail.${id}.Child`, {
            defaultValue: rt.BaseChild,
        });
    };
    const onRoomChange = (r: any, index: any) => {
        setRoomID(r.RoomID);
    };

    const onAdultChange = (evt: any) => {
        setSelectedAdult(evt.target.value);
    };

    const onChildChange = (evt: any) => {
        setSelectedChild(evt.target.value);
    };

    return (
        <Grid key={id} container spacing={1}>
            <Grid item xs={12}>
                <Typography variant="subtitle1" component="div">
                    Захиалгын мэдээлэл
                </Typography>
            </Grid>
            <input
                type="hidden"
                {...register(`TransactionDetail.${id}.Nights`)}
                name={`TransactionDetail.${id}.Nights`}
            />
            <input
                type="hidden"
                {...register(`TransactionDetail.${id}.Amount`)}
                name={`TransactionDetail.${id}.Amount`}
            />
            <input
                type="hidden"
                {...register(`TransactionDetail.${id}.RateModeID`)}
                name={`TransactionDetail.${id}.RateModeID`}
                value={1}
            />
            <Grid item xs={6} sm={2}>
                <input
                    type="hidden"
                    {...register(`TransactionDetail.${id}.IsReserved`)}
                    name={`TransactionDetail.${id}.IsReserved`}
                    value={true}
                />
                <input
                    type="hidden"
                    {...register(`TransactionDetail.${id}.IsCheckIn`)}
                    name={`TransactionDetail.${id}.IsCheckIn`}
                    value={false}
                />
                <input
                    type="hidden"
                    {...register(`TransactionDetail.${id}.DurationEnabled`)}
                    name={`TransactionDetail.${id}.DurationEnabled`}
                    value={true}
                />
                <input
                    type="hidden"
                    {...register(`TransactionDetail.${id}.ReservationSourceID`)}
                    name={`TransactionDetail.${id}.ReservationSourceID`}
                    value={1}
                />
                <Controller
                    name={`TransactionDetail.${id}.ArrivalDate`}
                    control={control}
                    defaultValue={null}
                    render={({ field: { onChange, value } }) => (
                        <DatePicker
                            label="Эхлэх огноо"
                            value={value}
                            minDate={new Date(workingDate)}
                            onChange={(value) => (
                                onChange(
                                    moment(
                                        dateStringToObj(
                                            moment(value).format("YYYY-MM-DD")
                                        ),
                                        "YYYY-MM-DD"
                                    )
                                ),
                                setArrivalDate(
                                    moment(
                                        dateStringToObj(
                                            moment(value).format("YYYY-MM-DD")
                                        ),
                                        "YYYY-MM-DD"
                                    ).format("YYYY-MM-DD")
                                )
                            )}
                            renderInput={(params) => (
                                <TextField
                                    size="small"
                                    id={`TransactionDetail.${id}.ArrivalDate`}
                                    name={`TransactionDetail.${id}.ArrivalDate`}
                                    {...register(
                                        `TransactionDetail.${id}.ArrivalDate`
                                    )}
                                    margin="dense"
                                    fullWidth
                                    {...params}
                                    error={errors.ArrivalDate?.message}
                                    helperText={errors.ArrivalDate?.message}
                                />
                            )}
                        />
                    )}
                />
            </Grid>
            <Grid item xs={6} sm={2}>
                <Controller
                    name={`TransactionDetail.${id}.DepartureDate`}
                    control={control}
                    defaultValue={null}
                    render={({ field: { onChange, value } }) => (
                        <DatePicker
                            label="Гарах огноо"
                            value={value}
                            minDate={new Date(workingDate)}
                            onChange={(value) => (
                                onChange(
                                    moment(
                                        dateStringToObj(
                                            moment(value).format("YYYY-MM-DD")
                                        ),
                                        "YYYY-MM-DD"
                                    )
                                ),
                                setDepartureDate(
                                    moment(
                                        dateStringToObj(
                                            moment(value).format("YYYY-MM-DD")
                                        ),
                                        "YYYY-MM-DD"
                                    ).format("YYYY-MM-DD")
                                )
                            )}
                            renderInput={(params) => (
                                <TextField
                                    size="small"
                                    id={`TransactionDetail.${id}.DepartureDate`}
                                    name={`TransactionDetail.${id}.DepartureDate`}
                                    {...register(
                                        `TransactionDetail.${id}.DepartureDate`
                                    )}
                                    margin="dense"
                                    fullWidth
                                    {...params}
                                    error={errors.DepartureDate?.message}
                                    helperText={errors.DepartureDate?.message}
                                />
                            )}
                        />
                    )}
                />
            </Grid>
            <Grid item xs={4} sm={3}>
                <input
                    type="hidden"
                    {...register(`TransactionDetail.${id}.GuestID`)}
                    name={`TransactionDetail.${id}.GuestID`}
                    value={
                        selectedGuest &&
                        selectedGuest.value &&
                        selectedGuest.value != "createNew"
                            ? selectedGuest.value
                            : null
                    }
                />
                <input
                    type="hidden"
                    {...register(
                        `TransactionDetail.${id}.GuestDetail.GuestTitleID`
                    )}
                    name={`TransactionDetail.${id}.GuestDetail.GuestTitleID`}
                    value={0}
                />
                <input
                    type="hidden"
                    {...register(
                        `TransactionDetail.${id}.GuestDetail.GenderID`
                    )}
                    name={`TransactionDetail.${id}.GuestDetail.GenderID`}
                    value={0}
                />
                <input
                    type="hidden"
                    {...register(
                        `TransactionDetail.${id}.GuestDetail.CountryID`
                    )}
                    name={`TransactionDetail.${id}.GuestDetail.CountryID`}
                    value={0}
                />
                <input
                    type="hidden"
                    {...register(
                        `TransactionDetail.${id}.GuestDetail.VipStatusID`
                    )}
                    name={`TransactionDetail.${id}.GuestDetail.VipStatusID`}
                    value={0}
                />
                <GuestSelect
                    register={register}
                    errors={errors}
                    onRoomTypeChange={onRoomTypeChange}
                    customRegisterName={`TransactionDetail.${id}.GuestName`}
                    baseStay={{ RoomTypeID: RoomTypeID }}
                    RoomTypeID={RoomTypeID}
                    resetField={resetField}
                    control={control}
                    field={field}
                    selectedGuest={selectedGuest}
                    setSelectedGuest={setSelectedGuest}
                    id={id}
                />
            </Grid>

            {selectedGuest &&
            (selectedGuest.value == null ||
                selectedGuest.value == "" ||
                selectedGuest.value == "createNew") ? (
                <>
                    <Grid item xs={4} sm={2}>
                        <TextField
                            size="small"
                            fullWidth
                            id="Name"
                            label="Нэр"
                            {...register(
                                `TransactionDetail.${id}.GuestDetail.Name`
                            )}
                            margin="dense"
                        />
                    </Grid>

                    <Grid item xs={4} sm={2}>
                        <TextField
                            size="small"
                            fullWidth
                            id="Email"
                            label="Имэйл"
                            type="email"
                            {...register(
                                `TransactionDetail.${id}.GuestDetail.Email`
                            )}
                            margin="dense"
                        />
                    </Grid>

                    <Grid item xs={4} sm={2}>
                        <TextField
                            size="small"
                            fullWidth
                            id="Mobile"
                            label="Гар утас"
                            {...register(
                                `TransactionDetail.${id}.GuestDetail.Mobile`
                            )}
                            margin="dense"
                        />
                    </Grid>
                </>
            ) : (
                ""
            )}

            <Grid item xs={4} sm={3}>
                <RoomTypeSelect
                    register={register}
                    errors={errors}
                    onRoomTypeChange={onRoomTypeChange}
                    customRegisterName={`TransactionDetail.${id}.RoomTypeID`}
                    baseStay={{ RoomTypeID: RoomTypeID }}
                    RoomTypeID={RoomTypeID}
                />
            </Grid>

            {RoomTypeID && (
                <>
                    <Grid item xs={4} sm={2}>
                        <RoomSelect
                            register={register}
                            errors={errors}
                            DepartureDate={DepartureDate}
                            RoomTypeID={RoomTypeID}
                            onRoomChange={onRoomChange}
                            customRegisterName={`TransactionDetail.${id}.RoomID`}
                            TransactionID={""}
                            ArrivalDate={ArrivalDate}
                            RoomID={RoomID}
                        />
                    </Grid>
                    <Grid item xs={2} sm={1}>
                        <NumberSelect
                            numberMin={1}
                            numberMax={
                                RoomType?.MaxAdult ? RoomType?.MaxAdult : 0
                            }
                            defaultValue={
                                RoomType?.BaseAdult ? RoomType?.BaseAdult : 0
                            }
                            nameKey={`TransactionDetail.${id}.Adult`}
                            register={register}
                            errors={errors}
                            label={"Том хүн"}
                            onChange={onAdultChange}
                        />
                    </Grid>
                    <Grid item xs={2} sm={1}>
                        <NumberSelect
                            numberMin={0}
                            numberMax={
                                RoomType?.MaxChild ? RoomType?.MaxChild : 0
                            }
                            defaultValue={
                                RoomType?.BaseChild ? RoomType?.BaseChild : 0
                            }
                            nameKey={`TransactionDetail.${id}.Child`}
                            register={register}
                            errors={errors}
                            label={"Хүүхэд"}
                            onChange={onChildChange}
                        />
                    </Grid>

                    <Grid item xs={6} sm={2}>
                        <ReservationTypeSelect
                            register={register}
                            errors={errors}
                            reset={reset}
                            customRegisterName={`TransactionDetail.${id}.ReservationTypeID`}
                            ReservationTypeID={ReservationTypeID}
                            setReservationTypeID={setReservationTypeID}
                        />
                    </Grid>

                    <Grid item xs={6} sm={2}>
                        <RoomRateTypeSelect
                            register={register}
                            errors={errors}
                            reset={reset}
                            customRegisterName={`TransactionDetail.${id}.RateTypeID`}
                            RoomTypeID={RoomTypeID}
                            setRate={setRate}
                            Rate={Rate}
                            setBreakfastIncluded={setBreakfastIncluded}
                            setTaxIncluded={setTaxIncluded}
                        />
                    </Grid>

                    <Grid item xs={6} sm={2}>
                        <FormControlLabel
                            control={
                                <Controller
                                    name={`TransactionDetail.${id}.BreakfastIncluded`}
                                    control={control}
                                    render={(props: any) => (
                                        <Checkbox
                                            {...register(
                                                `TransactionDetail.${id}.BreakfastIncluded`
                                            )}
                                            checked={
                                                BreakfastIncluded == true
                                                    ? true
                                                    : false
                                            }
                                            onChange={(e) =>
                                                setBreakfastIncluded(
                                                    e.target.checked
                                                )
                                            }
                                        />
                                    )}
                                />
                            }
                            label="Өглөөний цай"
                        />
                        <FormControlLabel
                            control={
                                <Controller
                                    name={`TransactionDetail.${id}.TaxIncluded`}
                                    control={control}
                                    render={(props: any) => (
                                        <Checkbox
                                            {...register(
                                                `TransactionDetail.${id}.TaxIncluded`
                                            )}
                                            checked={
                                                TaxIncluded == true
                                                    ? true
                                                    : false
                                            }
                                            onChange={(e) =>
                                                setTaxIncluded(e.target.checked)
                                            }
                                        />
                                    )}
                                />
                            }
                            label="Татвар"
                        />
                    </Grid>

                    <CurrencyAmount
                        register={register}
                        errors={errors}
                        reset={reset}
                        ArrivalDate={ArrivalDate}
                        RoomTypeID={RoomTypeID}
                        RateTypeID={Rate && Rate.RateTypeID}
                        TaxIncluded={TaxIncluded}
                        Nights={Nights}
                        setCurrencyAmount={setCurrencyAmount}
                        currencyAmount={currencyAmount}
                        resetField={resetField}
                        id={id}
                        setCurrency={setCurrency}
                        Currency={Currency}
                        control={control}
                        Controller={Controller}
                        selectedAdult={selectedAdult}
                        selectedChild={selectedChild}
                        rateCurrencyID={Rate.CurrencyID}
                        getValues={getValues}
                    />

                    {id == 0 ? (
                        <>
                            <Grid item xs={12}>
                                <Typography variant="subtitle1" component="div">
                                    Төлбөр тооцоо
                                </Typography>
                            </Grid>
                            <Grid item xs={6} sm={2}>
                                <PaymentMethodSelect
                                    register={register}
                                    errors={errors}
                                    customRegisterName={`TransactionDetail.${id}.PaymentMethodID`}
                                    PaymentMethodID={PaymentMethodID}
                                    setPaymentMethodID={setPaymentMethodID}
                                />
                            </Grid>
                            <Grid item xs={6} sm={2}>
                                <CurrencySelect
                                    register={register}
                                    errors={errors}
                                    nameKey={`TransactionDetail.${id}.PayCurrencyID`}
                                />
                            </Grid>
                            <Grid item xs={6} sm={2}>
                                <TextField
                                    id={`TransactionDetail.${id}.PayAmount`}
                                    label="PayAmount"
                                    type="number"
                                    {...register(
                                        `TransactionDetail.${id}.PayAmount`
                                    )}
                                    margin="dense"
                                    size="small"
                                    style={{
                                        width: "100%",
                                    }}
                                />
                            </Grid>
                        </>
                    ) : (
                        ""
                    )}
                </>
            )}
        </Grid>
    );
};

export default NewEdit;
