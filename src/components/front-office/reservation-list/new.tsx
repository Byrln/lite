import { useForm, useFieldArray, Controller } from "react-hook-form";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { useIntl } from "react-intl";
import {
    Card,
    CardContent,
    Button,
    Grid,
    TextField,
    Typography,
    Divider,
    Checkbox,
    FormControlLabel,
} from "@mui/material";
import CheckroomIcon from "@mui/icons-material/Checkroom";
import moment from "moment";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { useState, useEffect } from "react";
import ReceiptIcon from "@mui/icons-material/Receipt";

import ColorPicker from "components/select/color";
import ReservationSourceSelect from "components/select/reservation-source";
import { ReservationTypeSelect } from "components/select";
import NewEditForm from "components/common/new-edit-form";
import { ReservationAPI } from "lib/api/reservation";
import { listUrl } from "lib/api/front-office";
import { dateStringToObj } from "lib/utils/helpers";
import PaymentMethodSelect from "components/select/payment-method";
import CurrencySelect from "components/select/currency";
import RoomTypeSelect from "components/select/room-type";
import { formatPrice } from "lib/utils/helpers";
import { countNights } from "lib/utils/format-time";
import ReferenceSelect from "components/select/reference";
import NewForm from "./new-form";
import CustomerSelect from "components/select/customer";
import AvailableRoomTypes from "./available-room-types";
import { RateTypeSWR } from "lib/api/rate-type";

const validationSchema = yup.object().shape({
    ArrivalDate: yup.string().required("Ирэх огноо сонгоно уу!"),
    ArrivalTime: yup.string().required("Ирэх цаг сонгоно уу!"),
    DepartureDate: yup.string().required("Гарах огноо сонгоно уу!"),
    DepartureTime: yup.string().required("Гарах цаг сонгоно уу!"),
    TransactionDetail: yup
        .array()
        .nullable()
        .of(
            yup.object().shape({
                RoomTypeID: yup.string().required("Өрөөний төрөл сонгоно уу!"),
                Adult: yup.string().required("Том хүний тоо оруулна уу!"),
                Name: yup.string().required("Зочны нэр оруулна уу!"),
            })
        ),
});

const NewEdit = ({
    dateStart,
    dateEnd,
    roomType,
    room,
    BaseAdult,
    BaseChild,
    MaxAdult,
    MaxChild,
    workingDate,
    groupID,
    customRerender,
}: any) => {
    const intl = useIntl();
    const [CustomerID, setCustomerID]: any = useState(0);
    const [ArrivalDate, setArrivalDate]: any = useState(
        dateStart ? dateStart : workingDate
    );
    const [ArrivalTime, setArrivalTime]: any = useState("14:00");
    const [DepartureTime, setDepartureTime]: any = useState(
        dateStart &&
            dateEnd &&
            dateStart.getFullYear() === dateEnd.getFullYear() &&
            dateStart.getMonth() === dateEnd.getMonth() &&
            dateStart.getDate() === dateEnd.getDate()
            ? "18:00"
            : "12:00"
    );
    const { data: rateTypeData, error: rateTypeError } = RateTypeSWR({});
    const [DepartureDate, setDepartureDate]: any = useState(
        dateEnd
            ? dateEnd
            : moment(dateStringToObj(workingDate)).add(1, "days").startOf("day")
    );
    const [BreakfastIncluded, setBreakfastIncluded]: any = useState("");
    const [TaxIncluded, setTaxIncluded]: any = useState("");
    const [ReservationSourceChecked, setReservationSourceChecked]: any =
        useState(false);
    const [ReservationTypeID, setReservationTypeID]: any = useState(1);
    const [newGroupCount, setNewGroupCount]: any = useState(1);
    const [newRoomTypeID, setNewRoomTypeID]: any = useState<any>(null);
    const [nights, setNights]: any = useState<any>(1);
    const [totalAmount, setTotalAmount]: any = useState<any>(0);
    const [billingInfo, setBillingInfo]: any = useState<any>(null);
    const [isBooker, setIsBooker]: any = useState<any>(false);
    const [isGuide, setIsGuide]: any = useState<any>(false);
    const [groupColor, setGroupColor]: any = useState("#0033ff");
    const [Currency, setCurrency]: any = useState("");

    const setRange = (dateStart: Date, dateEnd: Date) => {
        var nights: number;
        nights = countNights(dateStart, dateEnd);
        setNights(nights);
    };

    useEffect(() => {
        if (ArrivalDate && DepartureDate) {
            setRange(ArrivalDate, DepartureDate);
        }
    }, [ArrivalDate, DepartureDate]);

    const [PaymentMethodID, setPaymentMethodID]: any = useState(null);
    const {
        register,
        reset,
        resetField,
        handleSubmit,
        control,
        getValues,
        setValue,
        formState: { errors },
    } = useForm({
        defaultValues: {
            ArrivalTime: "14:00",
            DepartureTime: "  :00",
            Remarks: null,
            BookerName: null,
            BookerPhone: null,
            GuideName: null,
            GuidePhone: null,
            IsBooker: null,
            IsGuide: null,
            ReservationSourceChecked: null,
            TaxIncluded: null,
            BreakfastIncluded: null,
            PayAmount: null,
            ArrivalDate: dateStart
                ? moment(
                      dateStringToObj(moment(dateStart).format("YYYY-MM-DD")),
                      "YYYY-MM-DD"
                  ).format("YYYY-MM-DD")
                : moment(
                      dateStringToObj(moment(workingDate).format("YYYY-MM-DD")),
                      "YYYY-MM-DD"
                  ).format("YYYY-MM-DD"),
            DepartureDate: dateEnd
                ? moment(
                      dateStringToObj(moment(dateEnd).format("YYYY-MM-DD")),
                      "YYYY-MM-DD"
                  ).format("YYYY-MM-DD")
                : moment(
                      dateStringToObj(moment(workingDate).format("YYYY-MM-DD")),
                      "YYYY-MM-DD"
                  )
                      .add(1, "days")
                      .format("YYYY-MM-DD"),
            TransactionDetail: [
                dateStart && dateEnd && roomType && room
                    ? {
                          ArrivalDate: dateStart,
                          DepartureDate: dateEnd,
                          RoomTypeID: roomType,
                          RoomID: room,
                          ReservationTypeID: 1,
                          GuestDetail: {
                              Name: null,
                              Email: null,
                              Mobile: null,
                          },
                      }
                    : {
                          ArrivalDate: dateStart ? dateStart : workingDate,
                          DepartureDate: dateEnd
                              ? dateEnd
                              : moment(
                                    dateStringToObj(
                                        moment(workingDate).format("YYYY-MM-DD")
                                    ),
                                    "YYYY-MM-DD"
                                )
                                    .add(1, "days")
                                    .format("YYYY-MM-DD"),
                          GuestDetail: {
                              Name: null,
                              Email: null,
                              Mobile: null,
                          },
                      },
            ],
        },
        resolver: yupResolver(validationSchema),
    });

    const { fields, append, prepend, remove, insert } = useFieldArray({
        control,
        name: "TransactionDetail",
    });

    useEffect(() => {
        if (getValues() && getValues().TransactionDetail) {
            setTotalAmount(
                getValues().TransactionDetail.reduce(
                    (acc: any, obj: any) =>
                        Number(acc) +
                        (obj.CurrencyAmount ? Number(obj.CurrencyAmount) : 0),
                    0
                )
            );
        }
    }, [getValues()]);

    const customResetEvent = (data: any) => {
        reset({
            TransactionDetail: [data],
        });
    };

    const customSubmit = async (values: any) => {
        try {
            let tempValues = { ...values };
            tempValues.TransactionDetail[0].PayAmount = values.PayAmount;
            tempValues.TransactionDetail[0].PayCurrencyID =
                values.PayCurrencyID;
            tempValues.TransactionDetail[0].PaymentMethodID =
                values.PaymentMethodID;
            tempValues.TransactionDetail[0].ReservationSourceID =
                values.ReservationSourceID;
            tempValues.TransactionDetail[0].CustomerID = values.CustomerID;
            tempValues.TransactionDetail[0].GroupColor = groupColor;
            tempValues.TransactionDetail[0].Remarks = values.Remarks;
            tempValues.ArrivalDate = values.ArrivalDate + " " + ArrivalTime;
            tempValues.DepartureDate =
                values.DepartureDate + " " + DepartureTime;
            tempValues.GroupColor = groupColor;

            if (groupID) {
                tempValues.IsGroup = true;
                tempValues.IsGroup = groupID;
                tempValues.TransactionDetail[0].IsGroup = true;
                tempValues.TransactionDetail[0].GroupID = groupID;
            }
            if (isBooker == true) {
                tempValues.TransactionDetail[0].BookerName = values.BookerName;
                tempValues.TransactionDetail[0].BookerPhone =
                    values.BookerPhone;
            } else {
                delete tempValues.BookerName;
                delete tempValues.BookerPhone;
            }

            if (isGuide == true) {
                tempValues.TransactionDetail[0].GuideName = values.GuideName;
                tempValues.TransactionDetail[0].GuidePhone = values.GuidePhone;
            } else {
                delete tempValues.GuideName;
                delete tempValues.GuidePhone;
            }

            values.TransactionDetail.forEach((detail: any, index: any) => {
                tempValues.TransactionDetail[index].Amount =
                    detail.CurrencyAmount / nights;
                tempValues.TransactionDetail[index].TaxIncluded = TaxIncluded;
                tempValues.TransactionDetail[index].BreakfastIncluded =
                    BreakfastIncluded;
                tempValues.TransactionDetail[index].ReservationTypeID =
                    values.ReservationTypeID;
                tempValues.TransactionDetail[index].ReservationSourceID =
                    values.ReservationSourceID;
                tempValues.TransactionDetail[index].ArrivalDate =
                    values.ArrivalDate + " " + ArrivalTime;
                tempValues.TransactionDetail[index].DepartureDate =
                    values.DepartureDate + " " + DepartureTime;
                tempValues.TransactionDetail[index].CustomerID =
                    values.CustomerID;
                tempValues.TransactionDetail[index].GuestDetail.Name =
                    values.TransactionDetail[index].Name;
                tempValues.TransactionDetail[index].CurrencyID =
                    Currency && Currency.CurrencyID ? Currency.CurrencyID : "";

                if (isBooker == true) {
                    tempValues.TransactionDetail[index].BookerName =
                        values.BookerName;
                    tempValues.TransactionDetail[index].BookerPhone =
                        values.BookerPhone;
                }

                if (isGuide == true) {
                    tempValues.TransactionDetail[index].GuideName =
                        values.GuideName;
                    tempValues.TransactionDetail[index].GuidePhone =
                        values.GuidePhone;
                }

                if (groupID) {
                    tempValues.TransactionDetail[index].IsGroup = true;
                    tempValues.TransactionDetail[index].GroupID = groupID;
                }

                tempValues.TransactionDetail[index].GroupColor = groupColor;
                tempValues.TransactionDetail[index].Remarks = values.Remarks;
            });
            await ReservationAPI.new(tempValues);
            if (customRerender) {
                customRerender();
            }
        } finally {
        }
    };

    const onColorChange = (color: any) => {
        setGroupColor(color);
    };

    return (
        <NewEditForm
            api={ReservationAPI}
            listUrl={listUrl}
            reset={reset}
            handleSubmit={handleSubmit}
            customResetEvent={customResetEvent}
            customSubmitTitle={intl.formatMessage({
                id: "TextReservation",
            })}
            customSubmit={customSubmit}
        >
            {ArrivalDate && DepartureDate && (
                <AvailableRoomTypes
                    ArrivalDate={ArrivalDate}
                    DepartureDate={DepartureDate}
                />
            )}

            <LocalizationProvider // @ts-ignore
                dateAdapter={AdapterDateFns}
            >
                <Card className="mb-3">
                    <CardContent>
                        <Grid key="General" container spacing={1}>
                            <Grid
                                item
                                sm={6}
                                xs={12}
                                style={{
                                    padding: "10px",
                                    borderRadius: "16px",
                                    border: "1px solid #E6E8EE",
                                }}
                            >
                                <Grid key="dates" container spacing={1}>
                                    <Grid item xs={8}>
                                        <Controller
                                            name={`ArrivalDate`}
                                            control={control}
                                            render={({
                                                field: { onChange, value },
                                            }) => (
                                                <DatePicker
                                                    label={intl.formatMessage({
                                                        id: "TextArrivalDate",
                                                    })}
                                                    value={value}
                                                    onChange={(value) => {
                                                        onChange(
                                                            moment(
                                                                value
                                                            ).format(
                                                                "YYYY-MM-DD"
                                                            )
                                                        );
                                                        setArrivalDate(
                                                            moment(
                                                                value
                                                            ).format(
                                                                "YYYY-MM-DD"
                                                            )
                                                        );
                                                        if (
                                                            new Date(
                                                                moment(
                                                                    value
                                                                ).format(
                                                                    "YYYY-MM-DD"
                                                                )
                                                            ) >
                                                            new Date(
                                                                DepartureDate
                                                            )
                                                        ) {
                                                            setDepartureDate(
                                                                moment(value)
                                                                    .add(
                                                                        1,
                                                                        "days"
                                                                    )
                                                                    .format(
                                                                        "YYYY-MM-DD"
                                                                    )
                                                            );
                                                            setValue(
                                                                "DepartureDate",
                                                                moment(value)
                                                                    .add(
                                                                        1,
                                                                        "days"
                                                                    )
                                                                    .format(
                                                                        "YYYY-MM-DD"
                                                                    )
                                                            );
                                                        }
                                                    }}
                                                    renderInput={(params) => (
                                                        <TextField
                                                            size="small"
                                                            id={`ArrivalDate`}
                                                            {...register(
                                                                `ArrivalDate`
                                                            )}
                                                            margin="dense"
                                                            fullWidth
                                                            {...params}
                                                            error={
                                                                !!errors
                                                                    .ArrivalDate
                                                                    ?.message
                                                            }
                                                            helperText={
                                                                errors
                                                                    .ArrivalDate
                                                                    ?.message
                                                            }
                                                        />
                                                    )}
                                                />
                                            )}
                                        />
                                    </Grid>
                                    <Grid item xs={4}>
                                        {" "}
                                        <TextField
                                            id="ArrivalTime"
                                            label={intl.formatMessage({
                                                id: "TextArrivalTime",
                                            })}
                                            type="time"
                                            margin="dense"
                                            {...register("ArrivalTime")}
                                            InputLabelProps={{
                                                shrink: true,
                                            }}
                                            sx={{ width: "100%" }}
                                            size="small"
                                            value={ArrivalTime}
                                            onChange={(value) =>
                                                setArrivalTime(
                                                    value.target.value
                                                )
                                            }
                                        />
                                    </Grid>
                                    <Grid item xs={8}>
                                        {" "}
                                        <Controller
                                            name={`DepartureDate`}
                                            control={control}
                                            render={({
                                                field: { onChange, value },
                                            }) => (
                                                <DatePicker
                                                    label={intl.formatMessage({
                                                        id: "TextDepartureDate",
                                                    })}
                                                    value={value}
                                                    minDate={
                                                        new Date(ArrivalDate)
                                                    }
                                                    onChange={(value) => (
                                                        moment(ArrivalDate).set(
                                                            {
                                                                hour: 0,
                                                                minute: 0,
                                                                second: 0,
                                                            }
                                                        ) >
                                                        moment(value).set({
                                                            hour: 0,
                                                            minute: 0,
                                                            second: 0,
                                                        })
                                                            ? null
                                                            : onChange(
                                                                  moment(
                                                                      value
                                                                  ).format(
                                                                      "YYYY-MM-DD"
                                                                  )
                                                                  // moment(
                                                                  //     dateStringToObj(
                                                                  //         moment(
                                                                  //             value
                                                                  //         ).format(
                                                                  //             "YYYY-MM-DD"
                                                                  //         )
                                                                  //     ),
                                                                  //     "YYYY-MM-DD"
                                                                  // )
                                                                  // moment(value, "YYYY-MM-DD")
                                                              ),
                                                        moment(ArrivalDate).set(
                                                            {
                                                                hour: 0,
                                                                minute: 0,
                                                                second: 0,
                                                            }
                                                        ) >
                                                        moment(value).set({
                                                            hour: 0,
                                                            minute: 0,
                                                            second: 0,
                                                        })
                                                            ? null
                                                            : setDepartureDate(
                                                                  moment(
                                                                      value
                                                                  ).format(
                                                                      "YYYY-MM-DD"
                                                                  )
                                                              ),
                                                        moment(
                                                            ArrivalDate
                                                        ).format(
                                                            "yyyy-MM-DD"
                                                        ) ==
                                                            moment(
                                                                value
                                                            ).format(
                                                                "yyyy-MM-DD"
                                                            ) &&
                                                            setDepartureTime(
                                                                ArrivalTime
                                                            )
                                                    )}
                                                    renderInput={(params) => (
                                                        <TextField
                                                            size="small"
                                                            id={`DepartureDate`}
                                                            {...register(
                                                                `DepartureDate`
                                                            )}
                                                            margin="dense"
                                                            fullWidth
                                                            {...params}
                                                            error={
                                                                !!errors
                                                                    .DepartureDate
                                                                    ?.message
                                                            }
                                                            helperText={
                                                                errors
                                                                    .DepartureDate
                                                                    ?.message
                                                            }
                                                        />
                                                    )}
                                                />
                                            )}
                                        />
                                    </Grid>
                                    {DepartureTime && (
                                        <Grid item xs={4}>
                                            {" "}
                                            <TextField
                                                id="DepartureTime"
                                                label={intl.formatMessage({
                                                    id: "TextDepartureTime",
                                                })}
                                                inputProps={{
                                                    min:
                                                        moment(ArrivalDate).set(
                                                            {
                                                                hour: 0,
                                                                minute: 0,
                                                                second: 0,
                                                            }
                                                        ) ==
                                                        moment(
                                                            DepartureDate
                                                        ).set({
                                                            hour: 0,
                                                            minute: 0,
                                                            second: 0,
                                                        })
                                                            ? ArrivalTime
                                                            : "9:00",
                                                }}
                                                type="time"
                                                margin="dense"
                                                {...register("DepartureTime")}
                                                InputLabelProps={{
                                                    shrink: true,
                                                }}
                                                sx={{ width: "100%" }}
                                                size="small"
                                                value={DepartureTime}
                                                onChange={(value) =>
                                                    moment(ArrivalDate).format(
                                                        "yyyy-MM-DD"
                                                    ) ==
                                                    moment(
                                                        DepartureDate
                                                    ).format("yyyy-MM-DD")
                                                        ? value.target.value <
                                                          ArrivalTime
                                                            ? ""
                                                            : setDepartureTime(
                                                                  value.target
                                                                      .value
                                                              )
                                                        : setDepartureTime(
                                                              value.target.value
                                                          )
                                                }
                                            />
                                        </Grid>
                                    )}
                                </Grid>
                            </Grid>

                            <Grid
                                item
                                sm={6}
                                xs={12}
                                style={{
                                    padding: "10px",
                                    borderRadius: "16px",
                                    border: "1px solid #E6E8EE",
                                }}
                            >
                                <Grid key="otherSettings" container spacing={1}>
                                    <Grid item xs={16}>
                                        <CustomerSelect
                                            register={register}
                                            errors={errors}
                                            setEntity={setCustomerID}
                                            isCustomSelect={true}
                                        />
                                    </Grid>
                                    <Grid item xs={16}>
                                        <FormControlLabel
                                            control={
                                                <Controller
                                                    name={`IsBooker`}
                                                    control={control}
                                                    render={(props: any) => (
                                                        <Checkbox
                                                            checked={
                                                                isBooker == true
                                                                    ? true
                                                                    : false
                                                            }
                                                            onChange={(e) =>
                                                                setIsBooker(
                                                                    e.target
                                                                        .checked
                                                                )
                                                            }
                                                        />
                                                    )}
                                                />
                                            }
                                            label={intl.formatMessage({
                                                id: "TextBookerInformation",
                                            })}
                                        />
                                    </Grid>
                                    {isBooker ? (
                                        <>
                                            <Grid item xs={6}>
                                                <TextField
                                                    size="small"
                                                    fullWidth
                                                    id="BookerName"
                                                    label={intl.formatMessage({
                                                        id: "TextName",
                                                    })}
                                                    {...register(`BookerName`)}
                                                    margin="dense"
                                                />
                                            </Grid>
                                            <Grid item xs={6}>
                                                <TextField
                                                    size="small"
                                                    fullWidth
                                                    id="BookerPhone"
                                                    label={intl.formatMessage({
                                                        id: "TextPhone",
                                                    })}
                                                    {...register(`BookerPhone`)}
                                                    margin="dense"
                                                />
                                            </Grid>
                                        </>
                                    ) : null}
                                    <Grid item xs={12}>
                                        <FormControlLabel
                                            control={
                                                <Controller
                                                    name={`IsGuide`}
                                                    control={control}
                                                    render={(props: any) => (
                                                        <Checkbox
                                                            checked={
                                                                isGuide == true
                                                                    ? true
                                                                    : false
                                                            }
                                                            onChange={(e) =>
                                                                setIsGuide(
                                                                    e.target
                                                                        .checked
                                                                )
                                                            }
                                                        />
                                                    )}
                                                />
                                            }
                                            label={intl.formatMessage({
                                                id: "TextGuideInformation",
                                            })}
                                        />
                                    </Grid>

                                    {isGuide ? (
                                        <>
                                            <Grid item xs={6}>
                                                <TextField
                                                    size="small"
                                                    fullWidth
                                                    id="GuideName"
                                                    label={intl.formatMessage({
                                                        id: "TextName",
                                                    })}
                                                    {...register(`GuideName`)}
                                                    margin="dense"
                                                />
                                            </Grid>
                                            <Grid item xs={6}>
                                                <TextField
                                                    size="small"
                                                    fullWidth
                                                    id="GuidePhone"
                                                    label={intl.formatMessage({
                                                        id: "TextPhone",
                                                    })}
                                                    {...register(`GuidePhone`)}
                                                    margin="dense"
                                                />
                                            </Grid>
                                        </>
                                    ) : null}
                                </Grid>
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>
                <Card className="mb-3" key={"Room"}>
                    <CardContent>
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                flexWrap: "wrap",
                            }}
                        >
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                }}
                            >
                                <div
                                    style={{
                                        width: "32px",
                                        height: "32px",
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        background:
                                            "linear-gradient(135.79deg, rgba(128, 40, 210, 0.05) 4.62%, rgba(92, 33, 228, 0.05) 95.64%)",
                                        borderRadius: "8px",
                                        color: "#7856DE",
                                    }}
                                >
                                    <CheckroomIcon
                                        sx={{ fontSize: "16 !important" }}
                                    />
                                </div>
                                <Typography
                                    variant="subtitle1"
                                    style={{ marginLeft: "16px" }}
                                >
                                    {intl.formatMessage({
                                        id: "TextRoomInformation",
                                    })}
                                </Typography>
                            </div>

                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "flex-end",
                                    flexWrap: "wrap",
                                }}
                            >
                                <div
                                    style={{
                                        width: "150px",
                                        marginRight: "10px",
                                    }}
                                >
                                    <RoomTypeSelect
                                        register={register}
                                        errors={errors}
                                        onRoomTypeChange={setNewRoomTypeID}
                                        RoomTypeID={
                                            newRoomTypeID &&
                                            newRoomTypeID.RoomTypeID
                                                ? newRoomTypeID.RoomTypeID
                                                : null
                                        }
                                    />
                                </div>
                                <TextField
                                    label={intl.formatMessage({
                                        id: "TextQuantity",
                                    })}
                                    type="number"
                                    margin="dense"
                                    size="small"
                                    style={{
                                        width: "100px",
                                        marginRight: "10px",
                                    }}
                                    value={newGroupCount}
                                    onChange={(e: any) => {
                                        setNewGroupCount(e.target.value);
                                    }}
                                />
                                <ColorPicker onColorChange={onColorChange} />

                                <Button
                                    variant="outlined"
                                    onClick={() =>
                                        //@ts-ignore
                                        {
                                            let tempValue = {
                                                ...getValues(
                                                    //@ts-ignore
                                                    `TransactionDetail[0]`
                                                ),
                                            };
                                            // let tempValue = getValues(
                                            //     //@ts-ignore
                                            //     `TransactionDetail[0]`
                                            // );
                                            if (newRoomTypeID) {
                                                tempValue.RoomTypeID =
                                                    newRoomTypeID.RoomTypeID;
                                                tempValue.Adult =
                                                    newRoomTypeID.BaseAdult;
                                                tempValue.Child =
                                                    newRoomTypeID.BaseChild;
                                            }
                                            tempValue.RoomID = null;
                                            for (
                                                let i = 0;
                                                i < newGroupCount;
                                                i++
                                            ) {
                                                append(tempValue);
                                            }
                                            setNewGroupCount(1);
                                        }
                                    }
                                    size="small"
                                    style={{
                                        height: "34.25px",
                                        width: "120px",
                                        marginBottom: "4px",
                                    }}
                                >
                                    +{" "}
                                    {intl.formatMessage({
                                        id: "ButtonAddRoom",
                                    })}
                                </Button>
                            </div>
                        </div>

                        {fields.map((field, index) => (
                            <>
                                <Divider className="mt-3 mb-3" />
                                <NewForm
                                    id={index}
                                    register={register}
                                    control={control}
                                    errors={errors}
                                    getValues={getValues}
                                    resetField={resetField}
                                    reset={reset}
                                    field={field}
                                    BaseAdult={BaseAdult}
                                    BaseChild={BaseChild}
                                    MaxAdult={MaxAdult}
                                    MaxChild={MaxChild}
                                    workingDate={workingDate}
                                    remove={remove}
                                    append={append}
                                    BreakfastIncluded={BreakfastIncluded}
                                    TaxIncluded={TaxIncluded}
                                    setBreakfastIncluded={setBreakfastIncluded}
                                    setTaxIncluded={setTaxIncluded}
                                    ArrivalDate={ArrivalDate}
                                    setArrivalDate={setArrivalDate}
                                    DepartureDate={DepartureDate}
                                    setDepartureDate={setDepartureDate}
                                    CustomerID={CustomerID}
                                    rateTypeData={rateTypeData}
                                    setCurrency={setCurrency}
                                    Currency={Currency}
                                />
                            </>
                        ))}
                    </CardContent>
                </Card>

                <Grid container spacing={1}>
                    <Grid item sm={12} md={4}>
                        <Typography variant="caption" gutterBottom>
                            {intl.formatMessage({
                                id: "TextNights",
                            })}
                            : {nights}
                        </Typography>
                    </Grid>
                    <Grid item sm={12} md={4}>
                        <Typography variant="caption" gutterBottom>
                            {intl.formatMessage({
                                id: "ReportTotalRooms",
                            })}
                            : {fields.length}
                        </Typography>
                    </Grid>
                    <Grid item sm={12} md={4}>
                        <Typography variant="caption" gutterBottom>
                            {intl.formatMessage({
                                id: "ReportTotalCharge",
                            })}
                            : {formatPrice(totalAmount)}
                        </Typography>
                    </Grid>
                </Grid>
                <Card
                    className="mb-3"
                    key={"Payment"}
                    style={{ display: "none" }}
                >
                    <CardContent>
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                            }}
                        >
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                }}
                            >
                                <div
                                    style={{
                                        width: "32px",
                                        height: "32px",
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        background:
                                            "linear-gradient(135.79deg, rgba(128, 40, 210, 0.05) 4.62%, rgba(92, 33, 228, 0.05) 95.64%)",
                                        borderRadius: "8px",
                                        color: "#7856DE",
                                    }}
                                >
                                    <ReceiptIcon
                                        sx={{ fontSize: "16 !important" }}
                                    />
                                </div>
                                <Typography
                                    variant="subtitle1"
                                    style={{ marginLeft: "16px" }}
                                >
                                    {intl.formatMessage({
                                        id: "TextPayment",
                                    })}
                                </Typography>
                            </div>
                        </div>
                        <br />
                        <Grid key="Payment" container spacing={1}>
                            <Grid item xs={12} sm={6}>
                                <div
                                    style={{
                                        padding: "30px",
                                        borderRadius: "16px",
                                        gap: "50px",
                                        border: "1px solid #E6E8EE",
                                    }}
                                >
                                    <Grid container spacing={1}>
                                        <Grid item xs={12}>
                                            <ReservationTypeSelect
                                                register={register}
                                                errors={errors}
                                                reset={reset}
                                                customRegisterName={`ReservationTypeID`}
                                                ReservationTypeID={
                                                    ReservationTypeID
                                                }
                                                setReservationTypeID={
                                                    setReservationTypeID
                                                }
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <FormControlLabel
                                                control={
                                                    <Controller
                                                        name={`BreakfastIncluded`}
                                                        control={control}
                                                        render={(
                                                            props: any
                                                        ) => (
                                                            <Checkbox
                                                                {...register(
                                                                    `BreakfastIncluded`
                                                                )}
                                                                checked={
                                                                    BreakfastIncluded ==
                                                                    true
                                                                        ? true
                                                                        : false
                                                                }
                                                                onChange={(e) =>
                                                                    setBreakfastIncluded(
                                                                        e.target
                                                                            .checked
                                                                    )
                                                                }
                                                            />
                                                        )}
                                                    />
                                                }
                                                label={intl.formatMessage({
                                                    id: "RowHeaderBreakfastIncluded",
                                                })}
                                            />
                                            <FormControlLabel
                                                control={
                                                    <Controller
                                                        name={`TaxIncluded`}
                                                        control={control}
                                                        render={(
                                                            props: any
                                                        ) => (
                                                            <Checkbox
                                                                {...register(
                                                                    `TaxIncluded`
                                                                )}
                                                                checked={
                                                                    TaxIncluded ==
                                                                    true
                                                                        ? true
                                                                        : false
                                                                }
                                                                onChange={(e) =>
                                                                    setTaxIncluded(
                                                                        e.target
                                                                            .checked
                                                                    )
                                                                }
                                                            />
                                                        )}
                                                    />
                                                }
                                                label={intl.formatMessage({
                                                    id: "TextTaxIncluded",
                                                })}
                                            />
                                        </Grid>

                                        <Grid item xs={12}>
                                            <FormControlLabel
                                                control={
                                                    <Controller
                                                        name={`ReservationSourceChecked`}
                                                        control={control}
                                                        render={(
                                                            props: any
                                                        ) => (
                                                            <Checkbox
                                                                checked={
                                                                    ReservationSourceChecked ==
                                                                    true
                                                                        ? true
                                                                        : false
                                                                }
                                                                onChange={(e) =>
                                                                    setReservationSourceChecked(
                                                                        e.target
                                                                            .checked
                                                                    )
                                                                }
                                                            />
                                                        )}
                                                    />
                                                }
                                                label={intl.formatMessage({
                                                    id: "TextReservationSource",
                                                })}
                                            />
                                        </Grid>

                                        {ReservationSourceChecked ? (
                                            <Grid item sm={12}>
                                                <ReservationSourceSelect
                                                    register={register}
                                                    errors={errors}
                                                    ChannelID={2}
                                                />
                                            </Grid>
                                        ) : (
                                            <></>
                                        )}

                                        <Grid item sm={12} md={4}>
                                            <Typography
                                                variant="caption"
                                                gutterBottom
                                            >
                                                {intl.formatMessage({
                                                    id: "TextNights",
                                                })}
                                                : {nights}
                                            </Typography>
                                        </Grid>
                                        <Grid item sm={12} md={4}>
                                            <Typography
                                                variant="caption"
                                                gutterBottom
                                            >
                                                {intl.formatMessage({
                                                    id: "ReportTotalRooms",
                                                })}
                                                : {fields.length}
                                            </Typography>
                                        </Grid>
                                        <Grid item sm={12} md={4}>
                                            <Typography
                                                variant="caption"
                                                gutterBottom
                                            >
                                                {intl.formatMessage({
                                                    id: "ReportTotalCharge",
                                                })}
                                                : {formatPrice(totalAmount)}
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                </div>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <div
                                    style={{
                                        padding: "30px",
                                        borderRadius: "16px",
                                        gap: "50px",
                                        border: "1px solid #E6E8EE",
                                    }}
                                >
                                    <Grid container spacing={1}>
                                        <Grid item xs={12} sm={6}>
                                            <PaymentMethodSelect
                                                register={register}
                                                errors={errors}
                                                customRegisterName={`PaymentMethodID`}
                                                PaymentMethodID={
                                                    PaymentMethodID
                                                }
                                                setPaymentMethodID={
                                                    setPaymentMethodID
                                                }
                                            />
                                        </Grid>

                                        <Grid item xs={12} sm={6}>
                                            <CurrencySelect
                                                register={register}
                                                errors={errors}
                                                nameKey={`PayCurrencyID`}
                                            />
                                        </Grid>

                                        <Grid item xs={12} sm={6}>
                                            <TextField
                                                id={`PayAmount`}
                                                label={intl.formatMessage({
                                                    id: "TextAmount",
                                                })}
                                                type="number"
                                                {...register(`PayAmount`)}
                                                margin="dense"
                                                size="small"
                                                style={{
                                                    width: "100%",
                                                }}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <ReferenceSelect
                                                register={register}
                                                errors={errors}
                                                type="BillingInfo"
                                                label={intl.formatMessage({
                                                    id: "TextBillingInformation",
                                                })}
                                                optionValue="BillingID"
                                                optionLabel="BillingName"
                                                customField="GroupBillTo"
                                                entity={billingInfo}
                                                setEntity={setBillingInfo}
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <TextField
                                                size="small"
                                                fullWidth
                                                id="Remarks"
                                                label={intl.formatMessage({
                                                    id: "TextSetMessage",
                                                })}
                                                {...register(`Remarks`)}
                                                margin="dense"
                                                multiline
                                                maxRows={3}
                                            />
                                        </Grid>
                                    </Grid>
                                </div>
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>
            </LocalizationProvider>
        </NewEditForm>
    );
};

export default NewEdit;
