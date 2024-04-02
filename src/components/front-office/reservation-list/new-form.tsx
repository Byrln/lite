import { Controller } from "react-hook-form";
import {
    Grid,
    TextField,
    Tooltip,
    IconButton,
    Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";

import { useEffect, useState } from "react";
import NumberSelect from "components/select/number-select";

import RoomTypeSelect from "components/select/room-type";
import RoomSelect from "components/select/room-select";
import RoomRateTypeSelect from "components/select/room-rate-type";
import CurrencyAmount from "components/reservation/currency-amount";
import GuestSelect from "components/select/guest-select";
import CountrySelect from "components/select/country";
import VipStatusSelect from "components/select/vip-status";

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
    remove,
    append,
    TaxIncluded,
    BreakfastIncluded,
    setBreakfastIncluded,
    setTaxIncluded,
    ArrivalDate,
    setArrivalDate,
    DepartureDate,
    setDepartureDate,
    CustomerID,
    rateTypeData,
}: any) => {
    const [RoomTypeID, setRoomTypeID]: any = useState("");
    const [RoomType, setRoomType]: any = useState("");
    const [RoomID, setRoomID]: any = useState("");
    const [Rate, setRate]: any = useState("");
    const [Nights, setNights]: any = useState("");
    const [currencyAmount, setCurrencyAmount]: any = useState("");
    const [Currency, setCurrency]: any = useState("");
    const [selectedGuest, setSelectedGuest]: any = useState(null);
    const [ReservationTypeID, setReservationTypeID]: any = useState(1);
    const [selectedAdult, setSelectedAdult]: any = useState(1);
    const [selectedChild, setSelectedChild]: any = useState(0);
    const [country, setCountry]: any = useState(null);
    const [vip, setVip]: any = useState(null);

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
            if (getValues(`TransactionDetail[${id}].RoomTypeID`)) {
                setRoomTypeID(getValues(`TransactionDetail[${id}].RoomTypeID`));
            }
            if (getValues(`TransactionDetail[${id}].RoomID`)) {
                setRoomID(Number(getValues(`TransactionDetail[${id}].RoomID`)));
            }

            if (getValues(`TransactionDetail[${id}].RateTypeID`)) {
                var rate = null;
                if (rateTypeData) {
                    for (var r of rateTypeData) {
                        if (
                            r.RateTypeID ===
                            getValues(`TransactionDetail[${id}].RateTypeID`)
                        ) {
                            rate = r;
                            break;
                        }
                    }
                    if (rate) {
                        setRate(rate);
                        if (rate.BreakfastIncluded && setBreakfastIncluded) {
                            setBreakfastIncluded(rate.BreakfastIncluded);
                        }
                        if (rate.TaxIncluded && setTaxIncluded) {
                            setTaxIncluded(rate.TaxIncluded);
                        }
                    }
                }

                // setRate({
                //     RateTypeID: Number(
                //         getValues(`TransactionDetail[${id}].RateTypeID`)
                //     ),
                // });
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

            if (getValues(`TransactionDetail.${id}.GuestDetail.CountryID`)) {
                setCountry({
                    CountryID: getValues(
                        `TransactionDetail.${id}.GuestDetail.CountryID`
                    ),
                });
            }

            if (getValues(`TransactionDetail.${id}.GuestDetail.VipStatusID`)) {
                setVip({
                    VipStatusID: getValues(
                        `TransactionDetail.${id}.GuestDetail.VipStatusID`
                    ),
                });
            }

            if (id > 0) {
                let tempRoomType: any = {};
                let baseAdult = 0;
                let baseChild = 0;
                if (getValues(`TransactionDetail[${id}].Adult`)) {
                    baseAdult = getValues(`TransactionDetail[${id}].Adult`);
                }

                if (getValues(`TransactionDetail[${id}].Child`)) {
                    baseChild = getValues(`TransactionDetail[${id}].Child`);
                }
                tempRoomType.BaseAdult = baseAdult;
                tempRoomType.BaseChild = baseChild;

                setRoomType(tempRoomType);
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
            <input
                type="hidden"
                {...register(`TransactionDetail.${id}.ArrivalDate`)}
                name={`TransactionDetail.${id}.ArrivalDate`}
            />
            <input
                type="hidden"
                {...register(`TransactionDetail.${id}.DepartureDate`)}
                name={`TransactionDetail.${id}.DepartureDate`}
            />
            <input
                type="hidden"
                {...register(`TransactionDetail.${id}.ReservationSourceID`)}
                name={`TransactionDetail.${id}.ReservationSourceID`}
                value={1}
            />
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
                {...register(`TransactionDetail.${id}.GuestDetail.GenderID`)}
                name={`TransactionDetail.${id}.GuestDetail.GenderID`}
                value={0}
            />
            <input
                type="hidden"
                {...register(`TransactionDetail.${id}.GuestDetail.CountryID`)}
                name={`TransactionDetail.${id}.GuestDetail.CountryID`}
                value={0}
            />
            <input
                type="hidden"
                {...register(`TransactionDetail.${id}.GuestDetail.VipStatusID`)}
                name={`TransactionDetail.${id}.GuestDetail.VipStatusID`}
                value={0}
            />
            <Grid item xs={12}>
                <Typography variant="caption" gutterBottom>
                    Өрөө {id + 1}
                </Typography>
            </Grid>
            <Grid item xs={6} sm={4} md={2}>
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
                    <Grid item xs={6} sm={4} md={1}>
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
                    <Grid item xs={6} sm={2} md={1}>
                        <NumberSelect
                            numberMin={1}
                            numberMax={
                                RoomType?.MaxAdult ? RoomType?.MaxAdult : 0
                            }
                            defaultValue={RoomType?.BaseAdult}
                            nameKey={`TransactionDetail.${id}.Adult`}
                            register={register}
                            errors={errors}
                            label={"Том хүн"}
                            onChange={onAdultChange}
                        />
                    </Grid>

                    <Grid item xs={6} sm={2} md={1}>
                        <NumberSelect
                            numberMin={0}
                            numberMax={
                                RoomType?.MaxChild ? RoomType?.MaxChild : 0
                            }
                            defaultValue={RoomType?.BaseChild}
                            nameKey={`TransactionDetail.${id}.Child`}
                            register={register}
                            errors={errors}
                            label={"Хүүхэд"}
                            onChange={onChildChange}
                        />
                    </Grid>

                    <Grid item xs={6} sm={4} md={2}>
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

                    <Grid item xs={6} sm={3} md={2}>
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
                            isRoomList={true}
                            CustomerID={CustomerID}
                            ContractRate={Rate.ContractRate}
                        />
                    </Grid>
                    <Grid item xs={11} sm={4} md={2}>
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

                    <Grid
                        item
                        xs={1}
                        sm={1}
                        lg={1}
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "flex-end",
                        }}
                    >
                        <Tooltip title="Duplicate">
                            <IconButton
                                aria-label="close"
                                onClick={() =>
                                    append(
                                        getValues(
                                            //@ts-ignore
                                            `TransactionDetail[${id}]`
                                        )
                                    )
                                }
                            >
                                <ContentCopyIcon />
                            </IconButton>
                        </Tooltip>

                        <Tooltip title="Remove">
                            <IconButton
                                aria-label="close"
                                onClick={() => remove(id)}
                                disabled={id == 0}
                            >
                                <DeleteIcon />
                            </IconButton>
                        </Tooltip>
                    </Grid>

                    {selectedGuest &&
                    (selectedGuest.value == null ||
                        selectedGuest.value == "" ||
                        selectedGuest.value == "createNew") ? (
                        <>
                            <Grid item xs={6} sm={3} md={2}>
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

                            <Grid item xs={6} sm={3} md={2}>
                                <TextField
                                    size="small"
                                    fullWidth
                                    id="Surname"
                                    label="Овог"
                                    {...register(
                                        `TransactionDetail.${id}.GuestDetail.Surname`
                                    )}
                                    margin="dense"
                                />
                            </Grid>

                            <Grid item xs={6} sm={3} md={2}>
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

                            <Grid item xs={6} sm={3} md={2}>
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
                            <Grid item xs={6} sm={4} md={1}>
                                <CountrySelect
                                    register={register}
                                    errors={errors}
                                    entity={country}
                                    setEntity={setCountry}
                                    customRegisterName={`TransactionDetail.${id}.GuestDetail.CountryID`}
                                />
                            </Grid>
                            <Grid item xs={6} sm={4} md={1}>
                                <VipStatusSelect
                                    register={register}
                                    errors={errors}
                                    entity={vip}
                                    setEntity={setVip}
                                    customRegisterName={`TransactionDetail.${id}.GuestDetail.VipStatusID`}
                                />
                            </Grid>
                            <Grid item xs={6} sm={4} md={2}>
                                <TextField
                                    size="small"
                                    fullWidth
                                    id="RegistryNo"
                                    label="Регистрийн дугаар"
                                    {...register(
                                        "TransactionDetail.${id}.GuestDetail.RegistryNo"
                                    )}
                                    margin="dense"
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
