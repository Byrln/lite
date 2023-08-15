import { useState, useEffect, useContext, createRef } from "react";
import { useForm } from "react-hook-form";
import {
    TextField,
    Grid,
    Box,
    Checkbox,
    FormControlLabel,
    Button,
    Alert,
    Typography,
    Stepper,
    Step,
    StepLabel,
    Card,
    CardContent,
} from "@mui/material";

import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import RoomTypeSelect from "components/select/room-type";
import RoomSelect from "components/select/room";
import NumberSelect from "components/select/number-select";
import CurrencySelect from "components/select/currency";
import CustomerSelect from "components/select/customer";
import {
    RateModeSelect,
    RoomChargeDurationSelect,
    ReservationTypeSelect,
} from "components/select";

import PaymentMethodGroupSelect from "components/select/payment-method-group";
import PaymentMethodSelect from "components/select/payment-method";
import CustomerGroupSelect from "components/select/customer-group";
import GuestSelect from "components/guest/guest-select";
import {
    dateToSimpleFormat,
    dateToCustomFormat,
    countNights,
} from "lib/utils/format-time";
import { listUrl } from "lib/api/front-office";
import { LoadingButton } from "@mui/lab";
import { mutate } from "swr";
import { toast } from "react-toastify";
import { ModalContext } from "../../lib/context/modal";
import RoomRateTypeSelect from "../select/room-rate-type";
import ReplayIcon from "@mui/icons-material/Replay";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CurrencyAmount from "./currency-amount";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import SaveIcon from "@mui/icons-material/Save";
// import { ReservationApi } from "../../lib/api/reservation";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AccordionDetails from "@mui/material/AccordionDetails";
import ColorPicker from "../select/color";
import GroupAdd from "components/reservation/group-add";
import PositionedMenu from "components/reservation/dropdown-menu";

const styleAccordion = {
    boxShadow: "none",
};

const styleAccordionHeader = {
    // borderRadius: "15px",
};

const styleAccordionContent = {
    mx: -4,
    px: 2,
};

const NewEdit = ({
    timelineCoord,
    workingDate,
    addReservations,
    keyIndex,
    isMain,
    defaultData,
    onAccordionChange,
    openIndex,
    onSingleSubmit,
    submitting,
    onColorChange,
}: any) => {
    const [activeStep, setActiveStep]: any = useState(
        defaultData?.guest ? "main" : "guest"
    );
    const [activeStepper, setActiveStepper]: any = useState(0);
    const formRef = createRef<HTMLButtonElement>();

    const baseStayDefault = isMain
        ? {
              TransactionID: 0,
              guest: defaultData ? defaultData.guest : null,
              roomType: {
                  RoomTypeID: timelineCoord ? timelineCoord.RoomTypeID : null,
              },
              room: {
                  RoomID: timelineCoord ? timelineCoord.RoomID : null,
              },
              rate: null,
              dateStart: null,
              dateEnd: null,
              Nights: 1,
              RateModeID: 1,
              RoomChargeDurationID: 1,
              TaxIncluded: true,
              CurrencyAmount: null,
              Adult: 0,
              Child: 0,
          }
        : {
              TransactionID: 0,
              guest: defaultData ? defaultData.guest : null,
              roomType: {
                  RoomTypeID: timelineCoord ? timelineCoord.RoomTypeID : null,
              },
              room: null,
              rate: null,
              dateStart: defaultData ? defaultData.dateStart : null,
              dateEnd: defaultData ? defaultData.dateEnd : null,
              Nights: defaultData ? defaultData.Nights : null,
              RateModeID: 1,
              RoomChargeDurationID: 1,
              TaxIncluded: true,
              CurrencyAmount: null,
              Adult: 0,
              Child: 0,
          };

    const [baseStay, setBaseStay]: any = useState(baseStayDefault);

    const onRoomTypeChange = (rt: any) => {
        setBaseStay({
            ...baseStay,
            roomType: rt,
        });
    };

    const onRoomChange = (r: any) => {
        setBaseStay({
            ...baseStay,
            room: r,
        });
    };

    const validationSchema = yup.object().shape({
        RoomTypeID: yup.number().required("Сонгоно уу"),
        Adult: yup.number().required("Сонгоно уу"),
        RateTypeID: yup.number().required("Сонгоно уу"),
        ReservationTypeID: yup.number().required("Сонгоно уу"),
        CurrencyID: yup.number().required("Сонгоно уу"),
        RateModeID: yup.number().required("Сонгоно уу"),
        RoomChargeDurationID: yup.number().required("Сонгоно уу"),
    });
    const formOptions = { resolver: yupResolver(validationSchema) };

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm(formOptions);

    const guestSelected = (guest: any) => {
        console.log("guest", guest.GuestID ? "Байна" : "Байхгүй");
        if (!guest.GuestID) {
            guest.GuestID = 0;
        }
        console.log("guest", guest);

        if (!guest) {
            toast(<Alert severity="error">Зочин сонгоно уу!</Alert>);
            return;
        }

        setBaseStay({
            ...baseStay,
            guest: guest,
        });
        reset({
            GuestID: guest.GuestID,
            GuestDetail: { guest },
        });
        setActiveStep("main");
        if (activeStepper != 2) {
            setActiveStepper(1);
        }
    };

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

        console.log("baseStay", baseStay);
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

    const onSubmit = (values: any) => {
        if (!values.Nights) {
            values.Nights = countNights(baseStay.dateStart, baseStay.dateEnd);
        }
        if (!values.CurrencyAmount) {
            values.CurrencyAmount = baseStay.CurrencyAmount;
        }
        console.log(values);
        // onSingleSubmit(values, keyIndex);
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
                <AccordionSummary
                    // expandIcon={<ExpandMoreIcon/>}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                    sx={styleAccordionHeader}
                >
                    <Box
                        sx={{
                            width: "100%",
                        }}
                    >
                        <Stepper activeStep={activeStepper} alternativeLabel>
                            <Step key={0}>
                                <StepLabel>
                                    {baseStay.guest
                                        ? `${baseStay.guest?.GuestFullName}
                                        ${
                                            baseStay.guest?.IdentityValue
                                                ? "/" +
                                                  baseStay.guest
                                                      ?.IdentityValue +
                                                  "/"
                                                : ""
                                        }`
                                        : "Guest"}
                                </StepLabel>
                            </Step>
                            <Step key={1}>
                                <StepLabel>
                                    {baseStay.room?.RoomNo
                                        ? `${baseStay.roomType?.RoomTypeName}(${baseStay.room?.RoomNo})`
                                        : "Room and Billing"}
                                </StepLabel>
                            </Step>
                            {/* <Step key={2}>
                                <StepLabel>Deposit</StepLabel>
                            </Step> */}
                        </Stepper>
                    </Box>
                </AccordionSummary>
                <AccordionDetails sx={styleAccordionContent}>
                    <Box
                        sx={{
                            display: activeStep === "guest" ? "inline" : "none",
                        }}
                    >
                        <GuestSelect guestSelected={guestSelected} />
                    </Box>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <input
                            type="hidden"
                            {...register("GuestID")}
                            name="GuestID"
                            value={baseStay.guest?.GuestID}
                        />
                        <input
                            type="hidden"
                            {...register("GuestDetail")}
                            name="GuestDetail"
                            value={baseStay.guest?.GuestDetail}
                        />
                        {/* <input
                            type="hidden"
                            {...register("Surname")}
                            name="Surname"
                            value={baseStay.guest?.Surname}
                        />
                        <input
                            type="hidden"
                            {...register("GenderID")}
                            name="GenderID"
                            value={baseStay.guest?.GenderID}
                        />
                        <input
                            type="hidden"
                            {...register("RegistryNo")}
                            name="RegistryNo"
                            value={baseStay.guest?.RegistryNo}
                        />
                        <input
                            type="hidden"
                            {...register("DriverLicenseNo")}
                            name="DriverLicenseNo"
                            value={baseStay.guest?.DriverLicenseNo}
                        /> */}

                        <Box
                            sx={{
                                display:
                                    activeStep === "main" ? "inline" : "none",
                            }}
                        >
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6}>
                                    <Card>
                                        <CardContent>
                                            <Typography
                                                variant="h6"
                                                component="div"
                                                className="mb-3"
                                            >
                                                Stay Information
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
                                                        label={"Adult"}
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
                                                        label={"Child"}
                                                    />
                                                </Grid>
                                                <Grid item xs={12} sm={4}>
                                                    <TextField
                                                        id="Nights"
                                                        label="Nights"
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

                                <Grid item xs={12} sm={6}>
                                    <Card>
                                        <CardContent>
                                            <Typography
                                                variant="h6"
                                                component="div"
                                                className="mb-3"
                                            >
                                                Billing and Payment
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
                                                            />
                                                        }
                                                        label="BreakFast Included"
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
                                                                {...register(
                                                                    "TaxIncluded"
                                                                )}
                                                            />
                                                        }
                                                        label="Tax Included"
                                                    />
                                                </Grid>

                                                <Grid item xs={12} sm={6}>
                                                    <RoomRateTypeSelect
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
                                <Button
                                    variant={"outlined"}
                                    onClick={() => {
                                        setActiveStep("guest");
                                    }}
                                    size="small"
                                >
                                    <ReplayIcon className="mr-1" /> Back to
                                    Guest
                                </Button>

                                <Button
                                    type="submit"
                                    variant="contained"
                                    ref={formRef}
                                >
                                    <SaveIcon className="mr-1" />
                                    Reservation
                                </Button>
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

                                <RoomRateTypeSelect
                                    register={register}
                                    errors={errors}
                                    reservationModel={baseStay}
                                    setReservationModel={setBaseStay}
                                    reset={reset}
                                />

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
                    </form>

                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "end",
                            alignItems: "center",
                        }}
                    >
                        {isMain && activeStep == "main" && (
                            <ColorPicker onColorChange={onColorChange} />
                        )}

                        {isMain && activeStep == "main" && (
                            <GroupAdd
                                baseStay={baseStay}
                                addReservations={addReservations}
                            />
                        )}
                    </Box>
                </AccordionDetails>
            </Accordion>
        </>
    );
};

export default NewEdit;
