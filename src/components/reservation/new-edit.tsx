import { useState, useEffect, Fragment } from "react";
import { useForm } from "react-hook-form";
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
    Radio,
    RadioGroup,
    FormControlLabel,
} from "@mui/material";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import RoomTypeSelect from "components/select/room-type";
import RoomSelect from "components/select/room";
import RateTypeSelect from "components/select/rate-type";
import CurrencySelect from "components/select/currency";
import CustomerSelect from "components/select/customer";

import PaymentMethodGroupSelect from "components/select/payment-method-group";
import PaymentMethodSelect from "components/select/payment-method";
import CustomerGroupSelect from "components/select/customer-group";

import NewEditForm from "components/common/new-edit-form";
import { ReservationApi } from "lib/api/reservation";

const steps = ["Guest Information", "Stay Information", "Billing and Payment"];

const NewEdit = (props: any) => {
    const [entity, setEntity]: any = useState(null);
    const [activeStep, setActiveStep] = useState(0);

    const isStepOptional = (step: number) => {
        return step === 1;
    };

    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const validationSchema = yup.object().shape({
        RoomTypeID: yup.number().required("Сонгоно уу"),
        RoomID: yup.number().required("Сонгоно уу"),
    });
    const formOptions = { resolver: yupResolver(validationSchema) };

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm(formOptions);

    return (
        <>
            <NewEditForm
                api={ReservationApi}
                entity={entity}
                handleSubmit={handleSubmit}
            >
                <Stepper activeStep={activeStep}>
                    {steps.map((label, index) => {
                        const stepProps: { completed?: boolean } = {};
                        const labelProps: {
                            optional?: React.ReactNode;
                        } = {};

                        return (
                            <Step key={label} {...stepProps}>
                                <StepLabel {...labelProps}>{label}</StepLabel>
                            </Step>
                        );
                    })}
                </Stepper>
                {activeStep === 1 ? (
                    <>
                        <RoomTypeSelect
                            register={register}
                            errors={errors}
                            entity={entity}
                            setEntity={setEntity}
                        />
                        <RoomSelect
                            register={register}
                            errors={errors}
                            entity={entity}
                            setEntity={setEntity}
                        />

                        <RateTypeSelect
                            register={register}
                            errors={errors}
                            entity={entity}
                            setEntity={setEntity}
                        />
                        {console.log("entity", entity)}
                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <TextField
                                    id="Adult"
                                    label="Adult"
                                    type="number"
                                    defaultValue={entity?.BaseAdult}
                                    {...register("Adult")}
                                    margin="dense"
                                    error={errors.Adult?.message}
                                    helperText={errors.Adult?.message}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    id="Child"
                                    label="Child"
                                    type="number"
                                    {...register("Child")}
                                    margin="dense"
                                    error={errors.Child?.message}
                                    helperText={errors.Child?.message}
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
                                    InputLabelProps={{ shrink: true }}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    type="date"
                                    fullWidth
                                    id="DepartureDate"
                                    label="Гарах огноо"
                                    {...register("DepartureDate")}
                                    margin="dense"
                                    error={errors.DepartureDate?.message}
                                    helperText={errors.DepartureDate?.message}
                                    InputLabelProps={{ shrink: true }}
                                />
                            </Grid>
                        </Grid>
                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <TextField
                                    id="Nights"
                                    label="Nights"
                                    type="number"
                                    {...register("Nights")}
                                    margin="dense"
                                    error={errors.Nights?.message}
                                    helperText={errors.Nights?.message}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    id="ReservationSourceID"
                                    label="ReservationSourceID"
                                    type="number"
                                    {...register("ReservationSourceID")}
                                    margin="dense"
                                    error={errors.ReservationSourceID?.message}
                                    helperText={
                                        errors.ReservationSourceID?.message
                                    }
                                />
                            </Grid>
                        </Grid>

                        <InputLabel htmlFor="my-input" className="mt-3">
                            BreakFast Included
                        </InputLabel>
                        <Checkbox {...register("BreakfastIncluded")} />

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
                                sx={{ mr: 1 }}
                            >
                                Back
                            </Button>
                            <Box sx={{ flex: "1 1 auto" }} />

                            <Button
                                onClick={handleNext}
                                disabled={activeStep === steps.length - 1}
                            >
                                Next
                            </Button>
                        </Box>
                    </>
                ) : activeStep === 2 ? (
                    <>
                        <RadioGroup
                            row
                            {...register("BreakfastIncluded")}
                            aria-label="gender"
                            name="row-radio-buttons-group"
                        >
                            <FormControlLabel
                                value="normal"
                                control={<Radio />}
                                label="Normal"
                            />
                            <FormControlLabel
                                value="manual"
                                control={<Radio />}
                                label="Manual"
                            />
                            <FormControlLabel
                                value="contactRate"
                                control={<Radio />}
                                label="Contact Rate"
                            />
                        </RadioGroup>
                        <RadioGroup
                            row
                            {...register("BreakfastIncluded")}
                            aria-label="gender"
                            name="row-radio-buttons-group"
                        >
                            <FormControlLabel
                                value="daily"
                                control={<Radio />}
                                label="Daily"
                            />
                            <FormControlLabel
                                value="weekly"
                                control={<Radio />}
                                label="Weekly"
                            />
                            <FormControlLabel
                                value="monthly"
                                control={<Radio />}
                                label="Monthly"
                            />
                        </RadioGroup>
                        <InputLabel htmlFor="my-input" className="mt-3">
                            Tax Included
                        </InputLabel>
                        <Checkbox {...register("TaxIncluded")} />
                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <CurrencySelect
                                    register={register}
                                    errors={errors}
                                    entity={entity}
                                    setEntity={setEntity}
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
                                    entity={entity}
                                    setEntity={setEntity}
                                />
                            </Grid>
                            <Grid item xs={3}>
                                <CurrencySelect
                                    register={register}
                                    errors={errors}
                                    entity={entity}
                                    setEntity={setEntity}
                                />
                            </Grid>
                            <Grid item xs={5}>
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
                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <CustomerGroupSelect
                                    register={register}
                                    errors={errors}
                                    entity={entity}
                                    setEntity={setEntity}
                                />
                            </Grid>

                            <Grid item xs={6}>
                                <CustomerSelect
                                    register={register}
                                    errors={errors}
                                    entity={entity}
                                    setEntity={setEntity}
                                />
                            </Grid>
                        </Grid>
                        <TextField
                            id="setMessage"
                            label="Set Message"
                            multiline
                            maxRows={4}
                            {...register("Amount")}
                            margin="dense"
                            error={errors.setMessage?.message}
                            helperText={errors.setMessage?.message}
                        />
                        <PaymentMethodGroupSelect
                            register={register}
                            errors={errors}
                            entity={entity}
                            setEntity={setEntity}
                        />
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
                                sx={{ mr: 1 }}
                            >
                                Back
                            </Button>
                            <Box sx={{ flex: "1 1 auto" }} />

                            <Button onClick={handleNext} disabled>
                                Next
                            </Button>
                        </Box>
                    </>
                ) : (
                    <Fragment>
                        <Typography sx={{ mt: 2, mb: 1 }}>
                            Step {activeStep + 1}
                        </Typography>
                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: "row",
                                pt: 2,
                            }}
                        >
                            <Button
                                color="inherit"
                                disabled={activeStep === 0}
                                onClick={handleBack}
                                sx={{ mr: 1 }}
                            >
                                Back
                            </Button>
                            <Box sx={{ flex: "1 1 auto" }} />

                            <Button
                                onClick={handleNext}
                                disabled={activeStep === steps.length - 1}
                            >
                                Next
                            </Button>
                        </Box>
                    </Fragment>
                )}
            </NewEditForm>
        </>
    );
};

export default NewEdit;
