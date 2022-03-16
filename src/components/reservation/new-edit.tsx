import {useState, useEffect, useContext, createRef} from "react";
import {useForm} from "react-hook-form";
import {TextField, Grid, Box, Checkbox, FormControlLabel, Button, Alert, Typography} from "@mui/material";
import * as yup from "yup";
import {yupResolver} from "@hookform/resolvers/yup";
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
    countNights
} from "lib/utils/format-time";
import {listUrl} from "lib/api/front-office";
import {LoadingButton} from "@mui/lab";
import {mutate} from "swr";
import {toast} from "react-toastify";
import {ModalContext} from "../../lib/context/modal";
import RoomRateTypeSelect from "../select/room-rate-type";
import ReplayIcon from '@mui/icons-material/Replay';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CurrencyAmount from "./currency-amount";
import {ReservationApi} from "../../lib/api/reservation";
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
    mx: -4,
    px: 2,
    backgroundColor: "#efefef",
};

const styleAccordionContent = {
    mx: -4,
    px: 2,
};

const NewEdit = (
    {
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
        onColorChange
    }: any
) => {
    const [activeStep, setActiveStep]: any = useState(defaultData?.guest ? "main" : "guest");
    const formRef = createRef<HTMLButtonElement>();

    const baseStayDefault = isMain ?
        {
            TransactionID: 0,
            guest: defaultData ? defaultData.guest : null,
            roomType: {
                RoomTypeID: timelineCoord.RoomTypeID,
            },
            room: {
                RoomID: timelineCoord.RoomID,
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
        } :
        {
            TransactionID: 0,
            guest: defaultData ? defaultData.guest : null,
            roomType: {
                RoomTypeID: timelineCoord.RoomTypeID,
            },
            room: null,
            rate: null,
            dateStart: defaultData.dateStart,
            dateEnd: defaultData.dateEnd,
            Nights: defaultData.Nights,
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
    const formOptions = {resolver: yupResolver(validationSchema)};

    const {
        register,
        handleSubmit,
        formState: {errors},
        reset,
    } = useForm(formOptions);

    const guestSelected = (guest: any) => {

        if (!guest) {
            toast(<Alert severity="error">Зочин сонгоно уу!</Alert>, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            return;
        }

        setBaseStay({
            ...baseStay,
            guest: guest
        });
        reset({
            GuestID: guest.GuestID,
        });
        setActiveStep("main");
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
        setRange(timelineCoord.TimeStart, timelineCoord.TimeEnd);
    }, []);

    useEffect(() => {
        if (submitting == true) {
            formRef.current?.click();
        }
    }, [submitting]);

    const onArrivalDateChange = (evt: any) => {
        var dateStart = new Date(evt.target.value);
        var dateEnd = new Date(baseStay.dateEnd.getTime());
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
        var dateStart = new Date(baseStay.dateStart.getTime());
        var dateEnd = new Date(evt.target.value);
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
        onSingleSubmit(values, keyIndex);
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
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "space-between",
                            width: "100%",
                        }}
                    >

                        <Typography
                            variant="subtitle1"
                            component="div"
                        >{`${keyIndex + 1}. ${baseStay.guest?.GuestFullName}`}</Typography>

                        <Typography
                            variant="subtitle1"
                            component="div"
                        >{`${baseStay.roomType?.RoomTypeName}(${baseStay.room?.RoomNo})`}</Typography>

                    </Box>
                </AccordionSummary>
                <AccordionDetails sx={styleAccordionContent}>

                    <Box sx={{display: activeStep === "guest" ? "inline" : "none"}}>
                        <GuestSelect guestSelected={guestSelected}/>
                    </Box>
                    <form onSubmit={handleSubmit(onSubmit)}>

                        <input
                            type="hidden"
                            {...register("GuestID")}
                            name="GuestID"
                            value={baseStay.guest?.GuestID}
                        />

                        <Box sx={{display: activeStep === "main" ? "inline" : "none"}}>

                            <Grid container spacing={4}>
                                <Grid item xs={6}>

                                    <Box
                                        sx={{
                                            display: "flex",
                                            flexDirection: "row",
                                            alignItems: "center",
                                            justifyContent: "space-between",
                                            mb: 2
                                        }}
                                    >

                                        <Typography
                                            variant="h6"
                                            component="div"
                                        >{`${baseStay.guest?.GuestFullName} /${baseStay.guest?.IdentityValue}/`}</Typography>

                                        <Button
                                            variant={"outlined"}
                                            onClick={() => {
                                                setActiveStep("guest");
                                            }}
                                        >
                                            <ReplayIcon/>
                                        </Button>
                                    </Box>

                                    <Grid container spacing={2}>
                                        <Grid item xs={8}>
                                            <RoomTypeSelect
                                                register={register}
                                                errors={errors}
                                                onRoomTypeChange={onRoomTypeChange}
                                                baseStay={baseStay}
                                            />
                                        </Grid>
                                        <Grid item xs={4}>
                                            <RoomSelect
                                                register={register}
                                                errors={errors}
                                                baseStay={baseStay}
                                                onRoomChange={onRoomChange}
                                            />
                                        </Grid>
                                    </Grid>

                                    <Grid container spacing={2}>
                                        <Grid item xs={4}>
                                            <NumberSelect
                                                numberMin={
                                                    baseStay.roomType?.BaseAdult
                                                        ? baseStay.roomType?.BaseAdult
                                                        : 0
                                                }
                                                numberMax={
                                                    baseStay.roomType?.MaxAdult
                                                        ? baseStay.roomType?.MaxAdult
                                                        : 0
                                                }
                                                nameKey={"Adult"}
                                                register={register}
                                                errors={errors}
                                                label={"Adult"}
                                            />
                                        </Grid>
                                        <Grid item xs={4}>
                                            <NumberSelect
                                                numberMin={
                                                    baseStay.roomType?.BaseChild
                                                        ? baseStay.roomType?.BaseChild
                                                        : 0
                                                }
                                                numberMax={
                                                    baseStay.roomType?.MaxChild
                                                        ? baseStay.roomType?.MaxChild
                                                        : 0
                                                }
                                                nameKey={"Child"}
                                                register={register}
                                                errors={errors}
                                                label={"Child"}
                                            />
                                        </Grid>
                                        <Grid item xs={4}>
                                            <TextField
                                                id="Nights"
                                                label="Nights"
                                                type="number"
                                                {...register("Nights")}
                                                margin="dense"
                                                error={errors.Nights?.message}
                                                helperText={errors.Nights?.message}
                                                InputLabelProps={{shrink: true}}
                                                value={baseStay.Nights}
                                                onChange={(evt: any) => {
                                                    reset({Nights: evt.target.value});
                                                }}
                                                disabled
                                            />
                                        </Grid>
                                    </Grid>


                                    <Grid container spacing={2}>
                                        <Grid item xs={6}>
                                            <TextField
                                                type="date"
                                                fullWidth
                                                id="ArrivalDate"
                                                label="Эхлэх огноо"
                                                {...register("ArrivalDate")}
                                                margin="dense"
                                                error={errors.ArrivalDate?.message}
                                                helperText={errors.ArrivalDate?.message}
                                                InputLabelProps={{shrink: true}}
                                                onChange={(evt: any) => {
                                                    onArrivalDateChange(evt);
                                                }}
                                            />
                                        </Grid>
                                        <Grid item xs={4}>
                                            <TextField
                                                id="ArrivalTime"
                                                label="Ирэх цаг"
                                                type="time"
                                                margin="dense"
                                                fullWidth
                                                {...register("ArrivalTime")}
                                                InputLabelProps={{
                                                    shrink: true,
                                                }}
                                                inputProps={{
                                                    step: 600, // 5 min
                                                }}
                                                sx={{width: 150}}
                                            />
                                        </Grid>
                                    </Grid>

                                    <Grid container spacing={2}>
                                        <Grid item xs={6}>
                                            <TextField
                                                type="date"
                                                fullWidth
                                                id="DepartureDate"
                                                label="Гарах огноо"
                                                {...register("DepartureDate")}
                                                margin="dense"
                                                error={errors.DepartureDate?.message}
                                                helperText={
                                                    errors.DepartureDate?.message
                                                }
                                                InputLabelProps={{shrink: true}}
                                                onChange={(evt: any) => {
                                                    onDepartureDateChange(evt);
                                                }}
                                            />
                                        </Grid>
                                        <Grid item xs={3}>
                                            <TextField
                                                id="DepartureTime"
                                                label="Гарах цаг"
                                                type="time"
                                                margin="dense"
                                                {...register("DepartureTime")}
                                                InputLabelProps={{
                                                    shrink: true,
                                                }}
                                                inputProps={{
                                                    step: 600, // 5 min
                                                }}
                                                sx={{width: 150}}
                                                onChange={(evt: any) => {
                                                }}
                                            />
                                        </Grid>
                                    </Grid>

                                    <Grid container spacing={2}>
                                        <Grid item xs={6}>
                                            <FormControlLabel
                                                sx={{my: 2}}
                                                control={
                                                    <Checkbox
                                                        id={"BreakfastIncluded"}
                                                        {...register("BreakfastIncluded")}
                                                    />
                                                }
                                                label="BreakFast Included"
                                            />
                                        </Grid>
                                        <Grid item xs={6}>
                                            <ReservationTypeSelect
                                                register={register}
                                                errors={errors}
                                                reset={reset}
                                            />
                                        </Grid>
                                    </Grid>


                                </Grid>
                                <Grid item xs={6}>

                                    <Box>
                                        <RateModeSelect
                                            register={register}
                                            errors={errors}
                                            entity={baseStay}
                                            setEntity={setBaseStay}
                                            reset={reset}
                                        />
                                    </Box>

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

                                    <Box sx={{mt: 1.5}}>
                                        <RoomRateTypeSelect
                                            register={register}
                                            errors={errors}
                                            reservationModel={baseStay}
                                            setReservationModel={setBaseStay}
                                            reset={reset}
                                        />
                                    </Box>

                                    <Box sx={{mb: 2}}>
                                        <CurrencyAmount
                                            register={register}
                                            errors={errors}
                                            reservationModel={baseStay}
                                            setReservationModel={setBaseStay}
                                            reset={reset}
                                        />
                                    </Box>

                                    <RoomChargeDurationSelect
                                        register={register}
                                        errors={errors}
                                        entity={baseStay}
                                        setEntity={setBaseStay}
                                        reset={reset}
                                    />

                                    <Box sx={{mt: 4}}>

                                        <Button
                                            variant={"text"}
                                            onClick={() => {
                                                setActiveStep("deposit");
                                            }}
                                        >Deposit</Button>

                                    </Box>

                                </Grid>
                            </Grid>

                            <Box sx={{display: "none"}}>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    ref={formRef}
                                >Submit</Button>
                            </Box>

                        </Box>

                        <Box sx={{display: activeStep === "deposit" ? "inline" : "none"}}>

                            Deposit
                            <Grid container spacing={2}>
                                <Grid item xs={4}>
                                    <PaymentMethodSelect
                                        register={register}
                                        errors={errors}
                                    />
                                </Grid>
                                <Grid item xs={3}>
                                    <CurrencySelect
                                        register={register}
                                        errors={errors}
                                        nameKey={"PayCurrencyID"}
                                    />
                                </Grid>
                                <Grid item xs={5}>
                                    <TextField
                                        id="PayAmount"
                                        label="PayAmount"
                                        type="number"
                                        {...register("PayAmount")}
                                        margin="dense"
                                        error={errors.PayAmount?.message}
                                        helperText={errors.PayAmount?.message}
                                    />
                                </Grid>
                            </Grid>
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
                            />
                            <PaymentMethodGroupSelect
                                register={register}
                                errors={errors}
                            />

                            <Box>
                                <Button
                                    variant={"text"}
                                    onClick={() => {
                                        setActiveStep("main");
                                    }}
                                ><ArrowBackIcon/> Back to main</Button>
                            </Box>


                        </Box>

                    </form>


                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "end",
                            alignItems: "center"
                        }}
                    >

                        {
                            (isMain && activeStep == "main") &&
                            <ColorPicker onColorChange={onColorChange}/>
                        }

                        {
                            (isMain && activeStep == "main") &&
                            <GroupAdd
                                baseStay={baseStay}
                                addReservations={addReservations}
                            />
                        }
                    </Box>


                </AccordionDetails>
            </Accordion>
        </>
    );
};

export default NewEdit;
