import {useState, useEffect, Fragment, useContext} from "react";
import {useForm} from "react-hook-form";
import {
    TextField,
    Grid,
    Stepper,
    Step,
    StepLabel,
    Typography,
    Box,
    Button,
    InputLabel,
    Checkbox,
    FormControlLabel,
} from "@mui/material";
import * as yup from "yup";
import {yupResolver} from "@hookform/resolvers/yup";
import RoomTypeSelect from "components/select/room-type";
import RoomSelect from "components/select/room";
import RateTypeSelect from "components/select/rate-type";
import NumberSelect from "components/select/number-select";
import CurrencySelect from "components/select/currency";
import CustomerSelect from "components/select/customer";
import {
    RateModeSelect,
    RoomChargeDurationSelect,
    ReservationTypeSelect,
    ReservationChannelSelect,
} from "components/select";

import PaymentMethodGroupSelect from "components/select/payment-method-group";
import PaymentMethodSelect from "components/select/payment-method";
import CustomerGroupSelect from "components/select/customer-group";
import GuestSelect from "components/guest/guest-select";

import NewEditForm from "components/common/new-edit-form";
import {ReservationApi} from "lib/api/reservation";
import {TimelineCoordModel} from "models/data/TimelineCoordModel";
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
import timeline from "../../pages/test/timeline";

const steps = ["Guest Information", "Stay Information", "Billing and Payment"];

const NewEdit = ({timelineCoord, workingDate}: any) => {
    const {handleModal}: any = useContext(ModalContext);
    const [loading, setLoading] = useState(false);
    const [activeStep, setActiveStep]: any = useState(0);
    const [baseStay, setBaseStay]: any = useState({
        TransactionID: 0,
        roomType: {
            RoomTypeID: timelineCoord.RoomTypeID,
        },
        room: {
            RoomID: timelineCoord.RoomID,
        },
        dateStart: null,
        dateEnd: null,
        Nights: 0
    });

    const isStepOptional = (step: number) => {
        return step === 1;
    };

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

    const handleNext = () => {
        var step = activeStep;
        step = step + 1;
        setActiveStep(step);
    };

    const handleBack = () => {
        var step = activeStep;
        step = step - 1;
        setActiveStep(step);
    };

    const validationSchema = yup.object().shape({
        RoomTypeID: yup.number().required("Сонгоно уу"),
        Adult: yup.number().required("Сонгоно уу"),
        RateTypeID: yup.number().required("Сонгоно уу"),
        Nights: yup.number().required("Сонгоно уу"),
        ReservationTypeID: yup.number().required("Сонгоно уу"),
        CurrencyID: yup.number().required("Сонгоно уу"),
        Amount: yup.number().required("Сонгоно уу"),
    });
    const formOptions = {resolver: yupResolver(validationSchema)};

    const {
        register,
        handleSubmit,
        formState: {errors},
        reset,
    } = useForm(formOptions);

    const guestSelected = (guest: any) => {
        console.log("===== Guest Selected =====", guest);
        reset({
            GuestID: guest.GuestID,
        });
    };

    const setRange = (dateStart: Date, dateEnd: Date) => {
        var nights: number;
        nights = countNights(dateStart, dateEnd);
        reset({
            ArrivalDate: dateToSimpleFormat(dateStart),
            DepartureDate: dateToSimpleFormat(dateEnd),
            Nights: nights,
            ArrivalTime: dateToCustomFormat(dateStart, "kk:mm"),
            DepartureTime: dateToCustomFormat(dateEnd, "kk:mm"),
        });
        setBaseStay({
            ...baseStay,
            dateStart: dateStart,
            dateEnd: dateEnd,
            Nights: nights,
        });
    };

    useEffect(() => {
        setRange(timelineCoord.TimeStart, timelineCoord.TimeEnd);
    }, []);

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

    const onSubmit = async (values: any) => {

        setLoading(true);

        try {

            //Api calls
            let res = ReservationApi.new(values);

            await mutate(listUrl);

            toast("Амжилттай.", {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });

            setLoading(false);
            handleModal();
        } catch (error) {
            setLoading(false);
            handleModal();
        }
    };

    return (
        <>
            <Stepper activeStep={activeStep}>
                {steps.map((label, index) => {
                    const stepProps: { completed?: boolean } = {};
                    const labelProps: {
                        optional?: React.ReactNode;
                    } = {};
                    if (isStepOptional(index)) {
                        labelProps.optional = (
                            <Typography variant="caption">Optional</Typography>
                        );
                    }

                    return (
                        <Step key={label} {...stepProps}>
                            <StepLabel {...labelProps}>{label}</StepLabel>
                        </Step>
                    );
                })}
            </Stepper>

            <Box sx={{display: activeStep === 0 ? "inline" : "none"}}>
                <GuestSelect guestSelected={guestSelected}/>
            </Box>


            <form onSubmit={handleSubmit(onSubmit)}>

                <input
                    type="hidden"
                    {...register("GuestID")}
                    name="GuestID"
                />

                <Box
                    sx={{
                        display: activeStep === 1 ? "inline" : "none",
                    }}
                >
                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <RoomTypeSelect
                                register={register}
                                errors={errors}
                                onRoomTypeChange={onRoomTypeChange}
                                entity={baseStay}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <RoomSelect
                                register={register}
                                errors={errors}
                                baseStay={baseStay}
                                onRoomChange={onRoomChange}
                            />
                        </Grid>
                    </Grid>

                    <Grid container spacing={2}>
                        <Grid item xs={3}>
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
                        <Grid item xs={3}>
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
                        <Grid item xs={6}>
                            <RateTypeSelect
                                register={register}
                                errors={errors}
                            />
                        </Grid>
                    </Grid>

                    <Grid container spacing={2}>
                        <Grid item xs={6}>
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
                                <Grid item xs={3}>
                                    <TextField
                                        id="ArrivalTime"
                                        label="Ирэх цаг"
                                        type="time"
                                        margin="dense"
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
                                            console.log(evt.target.value);
                                        }}
                                    />
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                id="Nights"
                                label="Nights"
                                type="number"
                                {...register("Nights")}
                                margin="dense"
                                error={errors.Nights?.message}
                                helperText={errors.Nights?.message}
                                InputLabelProps={{shrink: true}}
                                disabled
                            />

                            <ReservationTypeSelect
                                register={register}
                                errors={errors}
                                reset={reset}
                            />
                        </Grid>
                    </Grid>

                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <FormControlLabel
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
                            <ReservationChannelSelect
                                register={register}
                                errors={errors}
                                reset={reset}
                            />
                        </Grid>
                    </Grid>
                </Box>

                <Box
                    sx={{
                        display: activeStep === 2 ? "inline" : "none",
                    }}
                >
                    <Grid container spacing={2}>
                        <Grid item xs={2}>
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
                        </Grid>
                        <Grid item xs={5}>
                            <RateModeSelect
                                register={register}
                                errors={errors}
                            />
                        </Grid>
                        <Grid item xs={5}>
                            <RoomChargeDurationSelect
                                register={register}
                                errors={errors}
                            />
                        </Grid>
                    </Grid>
                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <CurrencySelect
                                register={register}
                                errors={errors}
                                nameKey={"CurrencyID"}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                id="Amount"
                                label="Amount"
                                type="number"
                                {...register("Amount")}
                                margin="dense"
                                error={errors.Amount?.message}
                                helperText={errors.Amount?.message}
                            />
                        </Grid>
                    </Grid>
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
                </Box>

                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "row",
                        pt: 2,
                    }}
                >
                    <Button
                        color="inherit"
                        onClick={handleBack}
                        sx={{mr: 1}}
                        disabled={activeStep === 0}
                    >
                        Back
                    </Button>
                    <Box sx={{flex: "1 1 auto"}}/>

                    <Button
                        onClick={handleNext}
                        disabled={activeStep === steps.length - 1}
                    >
                        Next
                    </Button>
                </Box>

                <LoadingButton
                    size="large"
                    type="submit"
                    variant="contained"
                    loading={loading}
                    className="mt-3"
                >Submit</LoadingButton>

            </form>

        </>
    );
};

export default NewEdit;
