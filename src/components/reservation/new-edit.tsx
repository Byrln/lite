import { useState, useEffect, createRef, useContext } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import {
    TextField,
    Grid,
    Box,
    Checkbox,
    FormControlLabel,
    Button,
    Alert,
    Typography,
    Card,
    CardContent,
    MenuItem,
    Accordion,
    AccordionDetails,
} from "@mui/material";
import ReplayIcon from "@mui/icons-material/Replay";
import SaveIcon from "@mui/icons-material/Save";
import * as yup from "yup";
import { toast } from "react-toastify";
import { yupResolver } from "@hookform/resolvers/yup";

import {
    dateToSimpleFormat,
    dateToCustomFormat,
    countNights,
} from "lib/utils/format-time";
import { ReservationAPI } from "lib/api/reservation";
import { GuestAPI } from "lib/api/guest";
import { fToUniversal } from "lib/utils/format-time";
import { ApiResponseModel } from "models/response/ApiResponseModel";
import {
    RateModeSelect,
    RoomChargeDurationSelect,
    ReservationTypeSelect,
} from "components/select";

import RoomTypeSelect from "components/select/room-type";
import RoomSelect from "components/select/room";
import NumberSelect from "components/select/number-select";
import CurrencySelect from "components/select/currency";
import CustomerSelect from "components/select/customer";
import GenderSelect from "components/select/gender";
import CountrySelect from "components/select/country";
import PaymentMethodGroupSelect from "components/select/payment-method-group";
import PaymentMethodSelect from "components/select/payment-method";
import CustomerGroupSelect from "components/select/customer-group";
import GroupAdd from "components/reservation/group-add";
import GuestTitleSelect from "components/select/guest-title";
import SelectList from "components/guest/select-list";
import CurrencyAmount from "./currency-amount";
import ColorPicker from "../select/color";
import { ModalContext } from "../../lib/context/modal";

const styleAccordion = {
    boxShadow: "none",
};

const styleAccordionContent = {
    mx: -4,
    px: 2,
};

const NewEdit = ({
    timelineCoord,
    keyIndex,
    isMain,
    defaultData,
    onAccordionChange,
    openIndex,
    submitting,
    dateStart,
    roomType,
    room,
}: any) => {
    const [loading, setLoading] = useState(false);
    const { handleModal }: any = useContext(ModalContext);
    const [entity, setEntity]: any = useState(null);
    const [idEditing, setIdEditing]: any = useState(null);
    const [activeStep, setActiveStep]: any = useState(
        defaultData?.guest ? "main" : "guest"
    );
    const formRef = createRef<HTMLButtonElement>();

    const baseStayDefault = isMain
        ? {
              TransactionID: 0,
              guest: defaultData ? defaultData.guest : null,
              roomType: {
                  RoomTypeID: timelineCoord
                      ? timelineCoord.RoomTypeID
                      : roomType
                      ? roomType
                      : null,
              },
              room: {
                  RoomID: timelineCoord
                      ? timelineCoord.RoomID
                      : room
                      ? room
                      : null,
              },
              rate: null,
              dateStart: dateStart ? dateStart : null,
              dateEnd: null,
              Nights: 1,
              RateModeID: 1,
              RoomChargeDurationID: 1,
              TaxIncluded: true,
              CurrencyAmount: null,
              Adult: 0,
              Child: 0,
              GroupColor: "#F17013",
          }
        : {
              TransactionID: 0,
              guest: defaultData ? defaultData.guest : null,
              roomType: {
                  RoomTypeID: timelineCoord
                      ? timelineCoord.RoomTypeID
                      : roomType
                      ? roomType
                      : null,
              },
              room: {
                  RoomID: timelineCoord
                      ? timelineCoord.RoomID
                      : room
                      ? room
                      : null,
              },
              rate: null,
              dateStart: defaultData
                  ? defaultData.dateStart
                  : dateStart
                  ? dateStart
                  : null,
              dateEnd: defaultData ? defaultData.dateEnd : null,
              Nights: defaultData ? defaultData.Nights : null,
              RateModeID: 1,
              RoomChargeDurationID: 1,
              TaxIncluded: true,
              CurrencyAmount: null,
              Adult: 0,
              Child: 0,
              GroupColor: "#F17013",
          };

    const [baseStay, setBaseStay]: any = useState(baseStayDefault);
    const [baseGroupStay, setBaseGroupStay]: any = useState([baseStayDefault]);

    const onRoomTypeChange = (rt: any, index: number) => {
        if (index == null) {
            setBaseStay({
                ...baseStay,
                roomType: rt,
            });
        } else {
            const newArray = { ...baseGroupStay };
            newArray[index] = { ...baseStay };
            newArray[index].roomType = rt;
            newArray[index].room = null;
            newArray[index].rate = null;

            setBaseGroupStay(newArray);
        }
    };

    const onRoomChange = (r: any, index: any) => {
        if (index == null) {
            setBaseStay({
                ...baseStay,
                room: r,
            });
        } else {
            const newArray = { ...baseGroupStay };
            newArray[index].room = r;
            newArray[index].rate = null;
            setBaseGroupStay(newArray);
        }
    };

    const validationSchema = yup.object().shape({
        RoomTypeID: yup.number().required("Сонгоно уу"),
        Adult: yup.number().required("Сонгоно уу"),
        RateTypeID: yup.number().required("Сонгоно уу"),
        ReservationTypeID: yup.number().required("Сонгоно уу"),
        CurrencyID: yup.number().required("Сонгоно уу"),
        RateModeID: yup.number().required("Сонгоно уу"),
        RoomChargeDurationID: yup.number().required("Сонгоно уу"),
        Name: yup.string().required("Бөглөнө үү"),
        Surname: yup.string().notRequired(),
        GenderID: yup.number().required("Бөглөнө үү"),
        RegistryNo: yup.string().when("IdentityTypeID", {
            is: (IdentityTypeID: number) => {
                return IdentityTypeID === 1;
            },
            then: yup.string().required("Бөглөнө үү"),
            otherwise: yup.string().notRequired(),
        }),
        DriverLicenseNo: yup.string().when("IdentityTypeID", {
            is: (IdentityTypeID: number) => {
                return IdentityTypeID === 2;
            },
            then: yup.string().required("Бөглөнө үү"),
            otherwise: yup.string().notRequired(),
        }),
        groupReservation: yup.array().notRequired(),
        GroupColor: yup.string().notRequired(),
    });
    const formOptions = { resolver: yupResolver(validationSchema) };

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        control,
        resetField,
        setValue,
        getValues,
    } = useForm(formOptions);

    const { fields, append, prepend, remove } = useFieldArray({
        name: "groupReservation",
        control,
    });

    const setRange = (dateStart: Date, dateEnd: Date) => {
        var nights: number;
        nights = countNights(dateStart, dateEnd);

        setBaseStay({
            ...baseStay,
            dateStart: dateStart,
            dateEnd: dateEnd,
            Nights: nights,
        });

        reset({
            ArrivalDate: dateToSimpleFormat(dateStart),
            DepartureDate: dateToSimpleFormat(dateEnd),
            Nights: nights,
            ArrivalTime: dateToCustomFormat(dateStart, "kk:mm"),
            DepartureTime: dateToCustomFormat(dateEnd, "kk:mm"),
        });
    };

    useEffect(() => {
        if (timelineCoord) {
            setRange(timelineCoord.TimeStart, timelineCoord.TimeEnd);
        }
        if (dateStart) {
            setRange(
                new Date(dateStart),
                new Date(new Date(dateStart).getTime() + 86400000)
            );
        }
    }, []);

    useEffect(() => {
        if (submitting == true) {
            formRef.current?.click();
        }
    }, [submitting]);

    const onArrivalDateChange = (evt: any) => {
        var dateStart = new Date(evt.target.value);
        var dateEnd = new Date(baseStay.dateEnd && baseStay.dateEnd.getTime());
        setBaseStay({
            ...baseStay,
            dateStart: evt.target.value,
        });

        if (
            dateToCustomFormat(dateStart, "yyyyMMdd") >
            dateToCustomFormat(dateEnd, "yyyyMMdd")
        ) {
            dateEnd = new Date(dateStart.getTime());
            dateEnd.setDate(dateEnd.getDate() + 1);
        }
        setRange(dateStart, dateEnd);
    };

    const onDepartureDateChange = (evt: any) => {
        var dateStart = new Date(
            baseStay.dateStart && baseStay.dateStart.getTime()
        );
        var dateEnd = new Date(evt.target.value);
        setBaseStay({
            ...baseStay,
            dateEnd: evt.target.value,
        });

        if (
            dateToCustomFormat(dateStart, "yyyyMMdd") >
            dateToCustomFormat(dateEnd, "yyyyMMdd")
        ) {
            dateStart = new Date(dateEnd.getTime());
            dateStart.setDate(dateStart.getDate() - 1);
        }
        setRange(dateStart, dateEnd);
    };

    const onSubmit = async (values: any) => {
        try {
            setLoading(true);

            if (!values.Nights) {
                values.Nights = countNights(
                    baseStay.dateStart,
                    baseStay.dateEnd
                );
            }

            if (!values.CurrencyAmount) {
                values.CurrencyAmount = baseStay.CurrencyAmount;
            }

            if (!values.GroupColor) {
                values.GroupColor = baseStay.GroupColor;
            }

            let tempValues = values;
            let groupReservation = entity.groupReservation;
            delete values.groupReservation;

            values.TransactionDetail = {};
            values = {};
            values.TransactionDetail = [];
            values.TransactionDetail.push(tempValues);

            if (groupReservation) {
                groupReservation.forEach((element: any) =>
                    values.TransactionDetail.push(tempValues)
                );
            }

            let finalValues: any = {};
            finalValues.TransactionDetail = [];
            values.TransactionDetail.forEach((element: any, index: any) => {
                let temp1 = { ...element };
                temp1.ArrivalDate =
                    fToUniversal(element.ArrivalDate) +
                    " " +
                    element.ArrivalTime;

                temp1.DepartureDate =
                    fToUniversal(element.DepartureDate) +
                    " " +
                    element.DepartureTime;

                temp1.IsReserved = true;
                temp1.IsCheckIn = false;
                temp1.DurationEnabled = true;
                temp1.ReservationSourceID = 1;
                temp1.GuestDetail = {};

                if (idEditing[index]) {
                    temp1.GuestID = idEditing[index];
                    temp1.GuestDetail.GuestID = idEditing[index];
                } else {
                    temp1.GuestDetail.GuestID = idEditing[0];
                    temp1.GuestID = idEditing[0];
                }

                if (
                    index > 0 &&
                    groupReservation &&
                    groupReservation[index - 1]
                ) {
                    if (groupReservation[index - 1].Name) {
                        temp1.GuestDetail.Name =
                            groupReservation[index - 1].Name;
                    } else {
                        temp1.GuestDetail.Name = "";
                    }

                    if (groupReservation[index - 1].Address) {
                        temp1.GuestDetail.Address =
                            groupReservation[index - 1].Address;
                    } else {
                        temp1.GuestDetail.Address = "";
                    }

                    if (groupReservation[index - 1].DriverLicenseNo) {
                        temp1.GuestDetail.DriverLicenseNo =
                            groupReservation[index - 1].DriverLicenseNo;
                    } else {
                        temp1.GuestDetail.DriverLicenseNo = "";
                    }

                    if (groupReservation[index - 1].GuestTitleID) {
                        temp1.GuestDetail.GuestTitleID =
                            groupReservation[index - 1].GuestTitleID;
                    } else {
                        temp1.GuestDetail.GuestTitleID = "";
                    }

                    if (groupReservation[index - 1].Surname) {
                        temp1.GuestDetail.Surname =
                            groupReservation[index - 1].Surname;
                    } else {
                        temp1.GuestDetail.Surname = "";
                    }

                    if (groupReservation[index - 1].GenderID) {
                        temp1.GuestDetail.GenderID =
                            groupReservation[index - 1].GenderID;
                    } else {
                        temp1.GuestDetail.GenderID = "";
                    }

                    if (groupReservation[index - 1].RegistryNo) {
                        temp1.GuestDetail.RegistryNo =
                            groupReservation[index - 1].RegistryNo;
                    } else {
                        temp1.GuestDetail.RegistryNo = "";
                    }

                    if (groupReservation[index - 1].DriverLicenseNo) {
                        temp1.GuestDetail.DriverLicenseNo =
                            groupReservation[index - 1].DriverLicenseNo;
                    } else {
                        temp1.GuestDetail.DriverLicenseNo = "";
                    }

                    if (groupReservation[index - 1].Email) {
                        temp1.GuestDetail.Email =
                            groupReservation[index - 1].Email;
                    } else {
                        temp1.GuestDetail.Email = "";
                    }

                    if (groupReservation[index - 1].Mobile) {
                        temp1.GuestDetail.Mobile =
                            groupReservation[index - 1].Mobile;
                    } else {
                        temp1.GuestDetail.Mobile = "";
                    }
                } else {
                    temp1.GuestDetail.Name = values.TransactionDetail[0].Name;
                    temp1.GuestDetail.Address =
                        values.TransactionDetail[0].Address;
                    temp1.GuestDetail.DriverLicenseNo =
                        values.TransactionDetail[0].DriverLicenseNo;
                    temp1.GuestDetail.GuestTitleID =
                        values.TransactionDetail[0].GuestTitleID;
                    temp1.GuestDetail.Surname =
                        values.TransactionDetail[0].Surname;
                    temp1.GuestDetail.GenderID =
                        values.TransactionDetail[0].GenderID;
                    temp1.GuestDetail.GenderID =
                        values.TransactionDetail[0].RegistryNo;
                    temp1.GuestDetail.DriverLicenseNo =
                        values.TransactionDetail[0].DriverLicenseNo;
                    temp1.GuestDetail.Email = values.TransactionDetail[0].Email;
                    temp1.GuestDetail.Mobile =
                        values.TransactionDetail[0].Mobile;
                }
                finalValues.TransactionDetail.push(temp1);
            });
            console.log("finalValues", finalValues);
            await ReservationAPI.new(finalValues);

            handleModal();
            toast("Амжилттай.");
        } finally {
            setLoading(false);
        }
    };

    const setGuest = (guest: any, groupIndex: any) => {
        const fetchDatas = async (GuestID: any, index: any) => {
            const response: ApiResponseModel = await GuestAPI.get(GuestID);

            if (response.status === 200 && response.data.length === 1) {
                let newEntity = response.data[0];
                newEntity._id = newEntity.GuestID;
                if (index != null) {
                    let tempEntity = { ...entity };
                    tempEntity.groupReservation = [];
                    tempEntity.groupReservation[index] = newEntity;
                    setEntity(tempEntity);
                } else {
                    setEntity(newEntity);
                }
            } else {
                setEntity(null);
            }
        };
        if (typeof groupIndex == "undefined") {
            let tempGuest = { ...idEditing };

            tempGuest[0] = guest.GuestID;
            fetchDatas(guest.GuestID, null);

            setIdEditing(tempGuest);
        } else {
            let tempGuest = { ...idEditing };
            tempGuest[groupIndex + 1] = guest.GuestID;
            setIdEditing(tempGuest);
            fetchDatas(guest.GuestID, groupIndex);
        }
    };

    const [filterValues, setFilterValues]: any = useState({
        GuestID: 0,
        GuestName: "",
        CountryID: "0",
        IdentityValue: "",
        Phone: "",
        TransactionID: "",
        IsMainOnly: false,
    });

    const onFilterValueChange = ({ key, value }: any) => {
        if (key == "GuestName") {
            setFilterValues({
                ...filterValues,
                GuestName: value,
            });
        }
        if (key == "IdentityValue") {
            setFilterValues({
                ...filterValues,
                IdentityValue: value,
            });
        }
        if (key == "Phone") {
            setFilterValues({
                ...filterValues,
                Phone: value,
            });
        }
    };

    const [identityType, setIdentityType] = useState(1);

    const onIdentityTypeChange = (evt: any) => {
        setEntity({
            ...entity,
            IdentityTypeID: evt.target.value,
        });
        setIdentityType(evt.target.value);
    };

    const onColorChange = (color: any) => {
        setValue("GroupColor", color);
    };

    const onCheckChange = (name: any, value: any) => {
        setValue(name, getValues(name) == true ? false : true);
    };

    return (
        <>
            <Accordion
                sx={styleAccordion}
                expanded={openIndex === keyIndex}
                onChange={() => {
                    if (onAccordionChange) {
                        onAccordionChange(keyIndex);
                    }
                }}
            >
                <AccordionDetails sx={styleAccordionContent}>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <input
                            type="hidden"
                            {...register("GuestID")}
                            name="GuestID"
                            value={baseStay.guest?.GuestID}
                        />

                        <Box
                        // sx={{
                        //     display:
                        //         activeStep === "main" ? "inline" : "none",
                        // }}
                        >
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={4}>
                                    <Card>
                                        <CardContent>
                                            <Typography
                                                variant="h6"
                                                component="div"
                                                className="mb-3"
                                            >
                                                Хоногийн мэдээлэл
                                            </Typography>
                                            <Grid container spacing={1}>
                                                <Grid item xs={12} sm={8}>
                                                    <TextField
                                                        type="date"
                                                        fullWidth
                                                        id="ArrivalDate"
                                                        label="Эхлэх огноо"
                                                        {...register(
                                                            "ArrivalDate"
                                                        )}
                                                        margin="dense"
                                                        error={
                                                            errors.ArrivalDate
                                                                ?.message
                                                        }
                                                        helperText={
                                                            errors.ArrivalDate
                                                                ?.message
                                                        }
                                                        InputLabelProps={{
                                                            shrink: true,
                                                        }}
                                                        onChange={(
                                                            evt: any
                                                        ) => {
                                                            onArrivalDateChange(
                                                                evt
                                                            );
                                                        }}
                                                        size="small"
                                                    />
                                                </Grid>
                                                <Grid item xs={12} sm={4}>
                                                    <TextField
                                                        id="ArrivalTime"
                                                        label="Ирэх цаг"
                                                        type="time"
                                                        margin="dense"
                                                        fullWidth
                                                        {...register(
                                                            "ArrivalTime"
                                                        )}
                                                        InputLabelProps={{
                                                            shrink: true,
                                                        }}
                                                        inputProps={{
                                                            step: 600, // 5 min
                                                        }}
                                                        sx={{
                                                            width: "100%",
                                                        }}
                                                        size="small"
                                                    />
                                                </Grid>

                                                <Grid item xs={12} sm={8}>
                                                    <TextField
                                                        type="date"
                                                        fullWidth
                                                        id="DepartureDate"
                                                        label="Гарах огноо"
                                                        {...register(
                                                            "DepartureDate"
                                                        )}
                                                        margin="dense"
                                                        error={
                                                            errors.DepartureDate
                                                                ?.message
                                                        }
                                                        helperText={
                                                            errors.DepartureDate
                                                                ?.message
                                                        }
                                                        InputLabelProps={{
                                                            shrink: true,
                                                        }}
                                                        onChange={(
                                                            evt: any
                                                        ) => {
                                                            onDepartureDateChange(
                                                                evt
                                                            );
                                                        }}
                                                        size="small"
                                                    />
                                                </Grid>
                                                <Grid item xs={12} sm={4}>
                                                    <TextField
                                                        id="DepartureTime"
                                                        label="Гарах цаг"
                                                        type="time"
                                                        margin="dense"
                                                        {...register(
                                                            "DepartureTime"
                                                        )}
                                                        InputLabelProps={{
                                                            shrink: true,
                                                        }}
                                                        inputProps={{
                                                            step: 600, // 5 min
                                                        }}
                                                        sx={{
                                                            width: "100%",
                                                        }}
                                                        onChange={(
                                                            evt: any
                                                        ) => {}}
                                                        size="small"
                                                    />
                                                </Grid>

                                                <Grid item xs={12} sm={8}>
                                                    <RoomTypeSelect
                                                        register={register}
                                                        errors={errors}
                                                        onRoomTypeChange={
                                                            onRoomTypeChange
                                                        }
                                                        baseStay={baseStay}
                                                    />
                                                </Grid>
                                                <Grid item xs={12} sm={4}>
                                                    <RoomSelect
                                                        register={register}
                                                        errors={errors}
                                                        baseStay={baseStay}
                                                        onRoomChange={
                                                            onRoomChange
                                                        }
                                                    />
                                                </Grid>

                                                <Grid item xs={12} sm={4}>
                                                    <NumberSelect
                                                        numberMin={
                                                            baseStay.roomType
                                                                ?.BaseAdult
                                                                ? baseStay
                                                                      .roomType
                                                                      ?.BaseAdult
                                                                : 0
                                                        }
                                                        numberMax={
                                                            baseStay.roomType
                                                                ?.MaxAdult
                                                                ? baseStay
                                                                      .roomType
                                                                      ?.MaxAdult
                                                                : 0
                                                        }
                                                        nameKey={"Adult"}
                                                        register={register}
                                                        errors={errors}
                                                        label={"Том хүн"}
                                                    />
                                                </Grid>
                                                <Grid item xs={12} sm={4}>
                                                    <NumberSelect
                                                        numberMin={
                                                            baseStay.roomType
                                                                ?.BaseChild
                                                                ? baseStay
                                                                      .roomType
                                                                      ?.BaseChild
                                                                : 0
                                                        }
                                                        numberMax={
                                                            baseStay.roomType
                                                                ?.MaxChild
                                                                ? baseStay
                                                                      .roomType
                                                                      ?.MaxChild
                                                                : 0
                                                        }
                                                        nameKey={"Child"}
                                                        register={register}
                                                        errors={errors}
                                                        label={"Хүүхэд"}
                                                    />
                                                </Grid>
                                                <Grid item xs={12} sm={4}>
                                                    <TextField
                                                        id="Nights"
                                                        label="Хоног"
                                                        type="number"
                                                        {...register("Nights")}
                                                        margin="dense"
                                                        error={
                                                            errors.Nights
                                                                ?.message
                                                        }
                                                        helperText={
                                                            errors.Nights
                                                                ?.message
                                                        }
                                                        InputLabelProps={{
                                                            shrink: true,
                                                        }}
                                                        value={baseStay.Nights}
                                                        onChange={(
                                                            evt: any
                                                        ) => {
                                                            reset({
                                                                Nights: evt
                                                                    .target
                                                                    .value,
                                                            });
                                                        }}
                                                        disabled
                                                        size="small"
                                                        style={{
                                                            width: "100%",
                                                        }}
                                                    />
                                                </Grid>
                                            </Grid>
                                        </CardContent>
                                    </Card>
                                </Grid>

                                <Grid item xs={12} sm={4}>
                                    <Card>
                                        <CardContent>
                                            <Typography
                                                variant="h6"
                                                component="div"
                                                className="mb-3"
                                            >
                                                Зочны мэдээлэл
                                            </Typography>
                                            {/* <GuestSelect
                                        guestSelected={guestSelected}
                                    /> */}
                                            <Grid container spacing={2}>
                                                <Grid item xs={6}>
                                                    <GuestTitleSelect
                                                        register={register}
                                                        errors={errors}
                                                        entity={entity}
                                                        setEntity={setEntity}
                                                    />
                                                </Grid>
                                                <Grid item xs={6}>
                                                    <TextField
                                                        size="small"
                                                        fullWidth
                                                        id="Surname"
                                                        label="Овог"
                                                        {...register("Surname")}
                                                        margin="dense"
                                                        error={
                                                            errors.Surname
                                                                ?.message
                                                        }
                                                        helperText={
                                                            errors.Surname
                                                                ?.message
                                                        }
                                                        value={
                                                            entity &&
                                                            entity.Surname
                                                        }
                                                        InputLabelProps={{
                                                            shrink:
                                                                entity &&
                                                                entity.Surname,
                                                        }}
                                                        onChange={(
                                                            evt: any
                                                        ) => {
                                                            setEntity({
                                                                ...entity,
                                                                Surname:
                                                                    evt.target
                                                                        .value,
                                                            });
                                                        }}
                                                    />
                                                </Grid>
                                            </Grid>
                                            <Grid container spacing={2}>
                                                <Grid item xs={6}>
                                                    <TextField
                                                        size="small"
                                                        fullWidth
                                                        id="Name"
                                                        label="Нэр"
                                                        {...register("Name")}
                                                        margin="dense"
                                                        error={
                                                            errors.Name?.message
                                                        }
                                                        helperText={
                                                            errors.Name?.message
                                                        }
                                                        value={
                                                            entity &&
                                                            entity.Name
                                                        }
                                                        InputLabelProps={{
                                                            shrink:
                                                                entity &&
                                                                entity.Name,
                                                        }}
                                                        onChange={(
                                                            evt: any
                                                        ) => {
                                                            setEntity({
                                                                ...entity,
                                                                Name: evt.target
                                                                    .value,
                                                            });
                                                            if (
                                                                onFilterValueChange
                                                            ) {
                                                                onFilterValueChange(
                                                                    {
                                                                        key: "GuestName",
                                                                        value: evt
                                                                            .target
                                                                            .value,
                                                                    }
                                                                );
                                                            }
                                                        }}
                                                    />
                                                </Grid>
                                                <Grid item xs={6}>
                                                    <TextField
                                                        size="small"
                                                        fullWidth
                                                        id="IdentityTypeID"
                                                        label="IdentityType"
                                                        select
                                                        margin="dense"
                                                        error={
                                                            errors
                                                                .IdentityTypeID
                                                                ?.message
                                                        }
                                                        helperText={
                                                            errors
                                                                .IdentityTypeID
                                                                ?.message
                                                        }
                                                        onChange={
                                                            onIdentityTypeChange
                                                        }
                                                        value={
                                                            entity &&
                                                            entity.IdentityTypeID
                                                                ? entity.IdentityTypeID
                                                                : ""
                                                        }
                                                    >
                                                        <MenuItem value={1}>
                                                            {"Пасспорт"}
                                                        </MenuItem>
                                                        <MenuItem value={2}>
                                                            {"Жолооны үнэмлэх"}
                                                        </MenuItem>
                                                    </TextField>
                                                </Grid>
                                                {(identityType === 1 ||
                                                    true) && (
                                                    <Grid item xs={6}>
                                                        <TextField
                                                            size="small"
                                                            fullWidth
                                                            id="RegistryNo"
                                                            label="Регистерийн дугаар"
                                                            {...register(
                                                                "RegistryNo"
                                                            )}
                                                            margin="dense"
                                                            error={
                                                                errors
                                                                    .RegistryNo
                                                                    ?.message
                                                            }
                                                            helperText={
                                                                errors
                                                                    .RegistryNo
                                                                    ?.message
                                                            }
                                                            value={
                                                                entity &&
                                                                entity.IdentityTypeID ===
                                                                    1 &&
                                                                entity.IdentityValue
                                                                    ? entity.IdentityValue
                                                                    : ""
                                                            }
                                                            InputLabelProps={{
                                                                shrink:
                                                                    entity &&
                                                                    entity.RegistryNo,
                                                            }}
                                                            onChange={(
                                                                evt: any
                                                            ) => {
                                                                setEntity({
                                                                    ...entity,
                                                                    IdentityTypeID: 1,
                                                                    IdentityValue:
                                                                        evt
                                                                            .target
                                                                            .value,
                                                                });

                                                                if (
                                                                    onFilterValueChange
                                                                ) {
                                                                    onFilterValueChange(
                                                                        {
                                                                            key: "IdentityValue",
                                                                            value: evt
                                                                                .target
                                                                                .value,
                                                                        }
                                                                    );
                                                                }
                                                            }}
                                                        />
                                                    </Grid>
                                                )}

                                                {(identityType === 2 ||
                                                    true) && (
                                                    <Grid item xs={6}>
                                                        <TextField
                                                            size="small"
                                                            fullWidth
                                                            id="DriverLicenseNo"
                                                            label="Жолооны үнэмлэхний дугаар"
                                                            {...register(
                                                                "DriverLicenseNo"
                                                            )}
                                                            margin="dense"
                                                            error={
                                                                errors
                                                                    .DriverLicenseNo
                                                                    ?.message
                                                            }
                                                            helperText={
                                                                errors
                                                                    .DriverLicenseNo
                                                                    ?.message
                                                            }
                                                            value={
                                                                entity &&
                                                                entity.IdentityTypeID ===
                                                                    2 &&
                                                                entity.IdentityValue
                                                                    ? entity.IdentityValue
                                                                    : ""
                                                            }
                                                            InputLabelProps={{
                                                                shrink:
                                                                    entity &&
                                                                    entity.DriverLicenseNo,
                                                            }}
                                                            onChange={(
                                                                evt: any
                                                            ) => {
                                                                setEntity({
                                                                    ...entity,
                                                                    IdentityTypeID: 2,
                                                                    IdentityValue:
                                                                        evt
                                                                            .target
                                                                            .value,
                                                                });
                                                                if (
                                                                    onFilterValueChange
                                                                ) {
                                                                    onFilterValueChange(
                                                                        {
                                                                            key: "IdentityValue",
                                                                            value: evt
                                                                                .target
                                                                                .value,
                                                                        }
                                                                    );
                                                                }
                                                            }}
                                                        />
                                                    </Grid>
                                                )}
                                            </Grid>
                                            <GenderSelect
                                                register={register}
                                                errors={errors}
                                                entity={entity}
                                                setEntity={setEntity}
                                                control={control}
                                            />
                                            <CountrySelect
                                                register={register}
                                                errors={errors}
                                                entity={entity}
                                                setEntity={setEntity}
                                            />
                                            <Grid container spacing={2}>
                                                <Grid item xs={6}>
                                                    <TextField
                                                        size="small"
                                                        fullWidth
                                                        id="Email"
                                                        label="Емэйл"
                                                        {...register("Email")}
                                                        margin="dense"
                                                        error={
                                                            errors.Email
                                                                ?.message
                                                        }
                                                        helperText={
                                                            errors.Email
                                                                ?.message
                                                        }
                                                        value={
                                                            entity &&
                                                            entity.Email
                                                        }
                                                        InputLabelProps={{
                                                            shrink:
                                                                entity &&
                                                                entity.Email,
                                                        }}
                                                        onChange={(
                                                            evt: any
                                                        ) => {
                                                            setEntity({
                                                                ...entity,
                                                                Email: evt
                                                                    .target
                                                                    .value,
                                                            });
                                                        }}
                                                    />
                                                </Grid>
                                                <Grid item xs={6}>
                                                    <TextField
                                                        size="small"
                                                        fullWidth
                                                        id="Mobile"
                                                        label="Гар утас"
                                                        {...register("Mobile")}
                                                        margin="dense"
                                                        error={
                                                            errors.Mobile
                                                                ?.message
                                                        }
                                                        helperText={
                                                            errors.Mobile
                                                                ?.message
                                                        }
                                                        value={
                                                            entity &&
                                                            entity.Mobile
                                                        }
                                                        InputLabelProps={{
                                                            shrink:
                                                                entity &&
                                                                entity.Mobile,
                                                        }}
                                                        onChange={(
                                                            evt: any
                                                        ) => {
                                                            setEntity({
                                                                ...entity,
                                                                Mobile: evt
                                                                    .target
                                                                    .value,
                                                            });
                                                            if (
                                                                onFilterValueChange
                                                            ) {
                                                                onFilterValueChange(
                                                                    {
                                                                        key: "Phone",
                                                                        value: evt
                                                                            .target
                                                                            .value,
                                                                    }
                                                                );
                                                            }
                                                        }}
                                                    />
                                                </Grid>
                                            </Grid>
                                            <TextField
                                                size="small"
                                                fullWidth
                                                id="Address"
                                                label="Хаягийн мэдээлэл"
                                                {...register("Address")}
                                                margin="dense"
                                                error={errors.Address?.message}
                                                helperText={
                                                    errors.Address?.message
                                                }
                                                value={entity && entity.Address}
                                                InputLabelProps={{
                                                    shrink:
                                                        entity &&
                                                        entity.Address,
                                                }}
                                                onChange={(evt: any) => {
                                                    setEntity({
                                                        ...entity,
                                                        Address:
                                                            evt.target.value,
                                                    });
                                                }}
                                            />
                                            <Box
                                                sx={{
                                                    display: "flex",
                                                    flexDirection: "row",
                                                    alignItems: "center",
                                                    justifyContent: "end",
                                                    mt: 2,
                                                }}
                                            >
                                                <Button
                                                    variant="text"
                                                    onClick={(evt: any) => {
                                                        setEntity({});
                                                        reset({
                                                            Surname: null,
                                                            Name: null,
                                                            GenderID: null,
                                                            Mobile: null,
                                                            Address: null,
                                                        });
                                                    }}
                                                >
                                                    RESET
                                                </Button>
                                            </Box>
                                            <SelectList
                                                filterValues={filterValues}
                                                setGuest={setGuest}
                                            />
                                        </CardContent>
                                    </Card>
                                </Grid>

                                <Grid item xs={12} sm={4}>
                                    <Card>
                                        <CardContent>
                                            <Typography
                                                variant="h6"
                                                component="div"
                                                className="mb-3"
                                            >
                                                Төлбөр, баримт
                                            </Typography>
                                            <Grid container spacing={1}>
                                                <Grid item xs={12} sm={8}>
                                                    <ReservationTypeSelect
                                                        register={register}
                                                        errors={errors}
                                                        reset={reset}
                                                    />
                                                </Grid>

                                                <Grid item xs={12} sm={4}>
                                                    <FormControlLabel
                                                        sx={{ my: 2 }}
                                                        control={
                                                            <Checkbox
                                                                id={
                                                                    "BreakfastIncluded"
                                                                }
                                                                {...register(
                                                                    "BreakfastIncluded"
                                                                )}
                                                                {...register(
                                                                    "ShowWarning"
                                                                )}
                                                            />
                                                        }
                                                        label="Өглөөний цай орсон"
                                                    />
                                                </Grid>
                                                <Grid item xs={12}>
                                                    <Box>
                                                        <RateModeSelect
                                                            register={register}
                                                            errors={errors}
                                                            entity={baseStay}
                                                            setEntity={
                                                                setBaseStay
                                                            }
                                                            reset={reset}
                                                        />
                                                    </Box>
                                                </Grid>

                                                <Grid item xs={12}>
                                                    <FormControlLabel
                                                        control={
                                                            <Checkbox
                                                                defaultChecked
                                                                id={
                                                                    "TaxIncluded"
                                                                }
                                                                // {...register(
                                                                //     "TaxIncluded"
                                                                // )}
                                                                onChange={(e) =>
                                                                    onCheckChange(
                                                                        "TaxIncluded",
                                                                        e.target
                                                                            .checked
                                                                    )
                                                                }
                                                            />
                                                        }
                                                        label="Татвар шингэсэн"
                                                    />
                                                </Grid>

                                                <Grid item xs={12} sm={6}>
                                                    {/* <RoomRateTypeSelect
                                                        register={register}
                                                        errors={errors}
                                                        // reservationModel={
                                                        //     baseStay
                                                        // }
                                                        // setReservationModel={
                                                        //     setBaseStay
                                                        // }
                                                        reset={reset}
                                                    /> */}
                                                </Grid>

                                                <Grid item xs={12} sm={6}>
                                                    <CurrencyAmount
                                                        register={register}
                                                        errors={errors}
                                                        reservationModel={
                                                            baseStay
                                                        }
                                                        setReservationModel={
                                                            setBaseStay
                                                        }
                                                        reset={reset}
                                                    />
                                                </Grid>
                                                <Grid item xs={12}>
                                                    <RoomChargeDurationSelect
                                                        register={register}
                                                        errors={errors}
                                                        entity={baseStay}
                                                        setEntity={setBaseStay}
                                                        reset={reset}
                                                    />
                                                </Grid>

                                                <Grid item xs={4}>
                                                    <PaymentMethodSelect
                                                        register={register}
                                                        errors={errors}
                                                    />
                                                </Grid>
                                                <Grid item xs={2}>
                                                    <CurrencySelect
                                                        register={register}
                                                        errors={errors}
                                                        nameKey={
                                                            "PayCurrencyID"
                                                        }
                                                    />
                                                </Grid>
                                                <Grid item xs={6}>
                                                    <TextField
                                                        id="PayAmount"
                                                        label="PayAmount"
                                                        type="number"
                                                        {...register(
                                                            "PayAmount"
                                                        )}
                                                        margin="dense"
                                                        error={
                                                            errors.PayAmount
                                                                ?.message
                                                        }
                                                        helperText={
                                                            errors.PayAmount
                                                                ?.message
                                                        }
                                                        size="small"
                                                        style={{
                                                            width: "100%",
                                                        }}
                                                    />
                                                </Grid>
                                            </Grid>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            </Grid>

                            <Grid
                                container
                                direction="row"
                                justifyContent="space-between"
                                alignItems="center"
                                className="mt-3"
                            >
                                {/* <Button
                                    variant={"outlined"}
                                    onClick={() => {
                                        setActiveStep("guest");
                                    }}
                                    size="small"
                                >
                                    <ReplayIcon className="mr-1" /> Back to
                                    Guest
                                </Button> */}
                            </Grid>
                        </Box>

                        <Box
                            sx={{
                                display:
                                    activeStep === "deposit"
                                        ? "inline"
                                        : "none",
                            }}
                        >
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={8}>
                                    <ReservationTypeSelect
                                        register={register}
                                        errors={errors}
                                        reset={reset}
                                    />
                                </Grid>

                                <Grid item xs={12} sm={4}>
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                id={"BreakfastIncluded"}
                                                {...register(
                                                    "BreakfastIncluded"
                                                )}
                                            />
                                        }
                                        label="BreakFast Included"
                                    />
                                </Grid>

                                <Grid item xs={12} md={6}>
                                    <RateModeSelect
                                        register={register}
                                        errors={errors}
                                        entity={baseStay}
                                        setEntity={setBaseStay}
                                        reset={reset}
                                    />
                                </Grid>

                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            defaultChecked
                                            id={"TaxIncluded"}
                                            {...register("TaxIncluded")}
                                        />
                                    }
                                    label="Tax Included"
                                />

                                {/* <RoomRateTypeSelect
                                    register={register}
                                    errors={errors}
                                    reservationModel={baseStay}
                                    setReservationModel={setBaseStay}
                                    reset={reset}
                                /> */}

                                <CurrencyAmount
                                    register={register}
                                    errors={errors}
                                    reservationModel={baseStay}
                                    setReservationModel={setBaseStay}
                                    reset={reset}
                                />

                                <RoomChargeDurationSelect
                                    register={register}
                                    errors={errors}
                                    entity={baseStay}
                                    setEntity={setBaseStay}
                                    reset={reset}
                                />

                                <Grid item xs={6} sm={4}>
                                    <PaymentMethodSelect
                                        register={register}
                                        errors={errors}
                                    />
                                </Grid>
                                <Grid item xs={6} sm={2}>
                                    <CurrencySelect
                                        register={register}
                                        errors={errors}
                                        nameKey={"PayCurrencyID"}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        id="PayAmount"
                                        label="PayAmount"
                                        type="number"
                                        {...register("PayAmount")}
                                        margin="dense"
                                        error={errors.PayAmount?.message}
                                        helperText={errors.PayAmount?.message}
                                        size="small"
                                        style={{ width: "100%" }}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <CustomerGroupSelect
                                        register={register}
                                        errors={errors}
                                    />
                                </Grid>

                                <Grid item xs={6}>
                                    <CustomerSelect
                                        register={register}
                                        errors={errors}
                                    />
                                </Grid>
                            </Grid>
                            ////testeetsetsetes
                            <Grid container spacing={2}>
                                <Grid item xs={6}>
                                    <CustomerGroupSelect
                                        register={register}
                                        errors={errors}
                                    />
                                </Grid>

                                <Grid item xs={6}>
                                    <CustomerSelect
                                        register={register}
                                        errors={errors}
                                    />
                                </Grid>
                            </Grid>
                            <TextField
                                id="setMessage"
                                label="Set Message"
                                multiline
                                maxRows={4}
                                margin="dense"
                                error={errors.setMessage?.message}
                                helperText={errors.setMessage?.message}
                                size="small"
                                style={{ width: "100%" }}
                            />
                            <PaymentMethodGroupSelect
                                register={register}
                                errors={errors}
                            />
                            <Grid
                                container
                                direction="row"
                                justifyContent="space-between"
                                alignItems="center"
                            >
                                <Button
                                    variant={"outlined"}
                                    onClick={() => {
                                        setActiveStep("main");
                                    }}
                                    className="mt-3"
                                    size="small"
                                >
                                    <ReplayIcon className="mr-1" /> Back to Main
                                </Button>

                                <Button
                                    type="submit"
                                    variant="contained"
                                    ref={formRef}
                                    className="mt-3"
                                >
                                    <SaveIcon className="mr-1" />
                                    Reservation
                                </Button>
                            </Grid>
                        </Box>

                        <Button
                            type="submit"
                            variant="contained"
                            ref={formRef}
                            disabled={loading}
                        >
                            <SaveIcon className="mr-1" />
                            Reservation
                        </Button>
                    </form>

                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "end",
                            alignItems: "center",
                        }}
                    >
                        <ColorPicker onColorChange={onColorChange} />

                        <GroupAdd
                            baseStay={baseStay}
                            baseGroupStay={baseGroupStay}
                            addReservations={append}
                            setBaseGroupStay={setBaseGroupStay}
                        />
                    </Box>
                    {fields.map((field: any, index: number) => {
                        return (
                            <section key={field.id}>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={2}>
                                        <RoomTypeSelect
                                            register={register}
                                            errors={errors}
                                            onRoomTypeChange={onRoomTypeChange}
                                            baseStay={baseGroupStay[index]}
                                            customRegisterName={`groupReservation.${index}.RoomTypeID`}
                                            groupIndex={index}
                                        />
                                    </Grid>
                                    {baseGroupStay[index] &&
                                        baseGroupStay[index].roomType && (
                                            <Grid item xs={12} sm={1}>
                                                <RoomSelect
                                                    register={register}
                                                    errors={errors}
                                                    baseStay={
                                                        baseGroupStay[index]
                                                    }
                                                    onRoomChange={onRoomChange}
                                                    groupIndex={index}
                                                    customRegisterName={`groupReservation.${index}.RoomID`}
                                                />
                                            </Grid>
                                        )}

                                    {baseGroupStay[index] &&
                                        baseGroupStay[index].roomType &&
                                        baseGroupStay[index].room && (
                                            <Grid item xs={12} sm={2}>
                                                {/* <RoomRateTypeSelect
                                                    register={register}
                                                    errors={errors}
                                                    reservationModel={
                                                        baseGroupStay[index]
                                                    }
                                                    setReservationModel={
                                                        setBaseGroupStay
                                                    }
                                                    baseGroupStay={
                                                        baseGroupStay
                                                    }
                                                    reset={reset}
                                                    groupIndex={index}
                                                    customRegisterName={`groupReservation.${index}.RateTypeID`}
                                                /> */}
                                            </Grid>
                                        )}
                                    {baseGroupStay[index] &&
                                        baseGroupStay[index].roomType &&
                                        baseGroupStay[index].room &&
                                        baseGroupStay[index].rate &&
                                        baseGroupStay[index].dateStart &&
                                        baseGroupStay[index].Nights &&
                                        baseGroupStay[index].TaxIncluded && (
                                            <>
                                                <Grid item xs={12} sm={1}>
                                                    <CurrencyAmount
                                                        register={register}
                                                        errors={errors}
                                                        reservationModel={
                                                            baseGroupStay[index]
                                                        }
                                                        setReservationModel={
                                                            setBaseGroupStay
                                                        }
                                                        baseGroupStay={
                                                            baseGroupStay
                                                        }
                                                        reset={reset}
                                                        groupIndex={index}
                                                        customRegisterName={`groupReservation.${index}.CurrencyAmount`}
                                                        setValue={setValue}
                                                    />
                                                </Grid>

                                                <Grid item xs={12} sm={1}>
                                                    <NumberSelect
                                                        numberMin={
                                                            baseGroupStay[index]
                                                                .roomType
                                                                ?.BaseAdult
                                                                ? baseGroupStay[
                                                                      index
                                                                  ].roomType
                                                                      ?.BaseAdult
                                                                : 0
                                                        }
                                                        numberMax={
                                                            baseGroupStay[index]
                                                                .roomType
                                                                ?.MaxAdult
                                                                ? baseGroupStay[
                                                                      index
                                                                  ].roomType
                                                                      ?.MaxAdult
                                                                : 0
                                                        }
                                                        nameKey={`groupReservation.${index}.Adult`}
                                                        register={register}
                                                        errors={errors}
                                                        label={"Adult"}
                                                    />
                                                </Grid>
                                                <Grid item xs={12} sm={1}>
                                                    <NumberSelect
                                                        numberMin={
                                                            baseGroupStay[index]
                                                                .roomType
                                                                ?.BaseChild
                                                                ? baseGroupStay[
                                                                      index
                                                                  ].roomType
                                                                      ?.BaseChild
                                                                : 0
                                                        }
                                                        numberMax={
                                                            baseGroupStay[index]
                                                                .roomType
                                                                ?.MaxChild
                                                                ? baseGroupStay[
                                                                      index
                                                                  ].roomType
                                                                      ?.MaxChild
                                                                : 0
                                                        }
                                                        nameKey={`groupReservation.${index}.Adult`}
                                                        register={register}
                                                        errors={errors}
                                                        label={"Child"}
                                                    />
                                                </Grid>

                                                <Grid item xs={12} sm={2}>
                                                    <TextField
                                                        size="small"
                                                        fullWidth
                                                        id="Surname"
                                                        label="Овог"
                                                        {...register(
                                                            `groupReservation.${index}.Surname`
                                                        )}
                                                        margin="dense"
                                                        value={
                                                            entity &&
                                                            entity.groupReservation &&
                                                            entity
                                                                .groupReservation[
                                                                index
                                                            ] &&
                                                            entity
                                                                .groupReservation[
                                                                index
                                                            ].Surname &&
                                                            entity
                                                                .groupReservation[
                                                                index
                                                            ].Surname
                                                        }
                                                        InputLabelProps={{
                                                            shrink:
                                                                entity &&
                                                                entity.groupReservation &&
                                                                entity
                                                                    .groupReservation[
                                                                    index
                                                                ] &&
                                                                entity
                                                                    .groupReservation[
                                                                    index
                                                                ].Surname &&
                                                                entity
                                                                    .groupReservation[
                                                                    index
                                                                ].Surname,
                                                        }}
                                                        onChange={(
                                                            evt: any
                                                        ) => {
                                                            let tempReservation =
                                                                {
                                                                    ...baseGroupStay,
                                                                };
                                                            tempReservation[
                                                                index
                                                            ].Surname =
                                                                evt.target.value;
                                                            setBaseGroupStay(
                                                                tempReservation
                                                            );
                                                        }}
                                                    />
                                                </Grid>

                                                <Grid item xs={12} sm={2}>
                                                    <TextField
                                                        size="small"
                                                        fullWidth
                                                        id="Name"
                                                        label="Нэр"
                                                        {...register(
                                                            `groupReservation.${index}.Name`
                                                        )}
                                                        margin="dense"
                                                        value={
                                                            entity &&
                                                            entity.groupReservation &&
                                                            entity
                                                                .groupReservation[
                                                                index
                                                            ] &&
                                                            entity
                                                                .groupReservation[
                                                                index
                                                            ].Name
                                                        }
                                                        InputLabelProps={{
                                                            shrink:
                                                                entity &&
                                                                entity.groupReservation &&
                                                                entity
                                                                    .groupReservation[
                                                                    index
                                                                ] &&
                                                                entity
                                                                    .groupReservation[
                                                                    index
                                                                ].Name,
                                                        }}
                                                        onChange={(
                                                            evt: any
                                                        ) => {
                                                            let tempReservation =
                                                                {
                                                                    ...baseGroupStay,
                                                                };
                                                            tempReservation[
                                                                index
                                                            ].Name =
                                                                evt.target.value;
                                                            setBaseGroupStay(
                                                                tempReservation
                                                            );
                                                            if (
                                                                onFilterValueChange
                                                            ) {
                                                                onFilterValueChange(
                                                                    {
                                                                        key: "GuestName",
                                                                        value: evt
                                                                            .target
                                                                            .value,
                                                                    }
                                                                );
                                                            }
                                                        }}
                                                    />
                                                </Grid>
                                            </>
                                        )}
                                </Grid>
                                <SelectList
                                    filterValues={filterValues}
                                    setGuest={setGuest}
                                    groupIndex={index}
                                />
                            </section>
                        );
                    })}
                </AccordionDetails>
            </Accordion>
        </>
    );
};

export default NewEdit;
