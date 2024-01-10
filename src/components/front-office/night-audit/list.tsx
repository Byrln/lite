import { useState } from "react";
import { Stepper, Step, StepLabel, Button, Box } from "@mui/material";
import { toast } from "react-toastify";

import CustomTable from "components/common/custom-table";
import { NightAuditSWR, NightAuditAPI, listUrl } from "lib/api/night-audit";
import PendingReservation from "./pending-reservation";
import PendingDueOut from "./PendingDueOut";
import PendingRoomCharge from "./pending-room-charge";
import NewWorkingDate from "./new-working-date";

const steps = [
    "Хүлээгдэж буй захиалга",
    "Өрөөний төлөв",
    "Хоногийн төлбөр",
    "Шинэ өдөр эхлүүлэх",
];

const NightAuditList = ({ title, workingDate }: any) => {
    const [activeStep, setActiveStep] = useState(0);
    const [pendingReservationCompleted, setPendingReservationCompleted] =
        useState(false);
    const [pendingDueOutCompleted, setPendingDueOutCompleted] = useState(false);
    const [
        pendingPendingRoomChargeCompleted,
        setPendingPendingRoomChargeCompleted,
    ] = useState(false);

    const handleNext = () => {
        if (activeStep == 0) {
            if (pendingReservationCompleted) {
                setActiveStep((prevActiveStep) => prevActiveStep + 1);
            } else {
                toast("Хүлээгдэж буй захиалга.");
            }
        } else if (activeStep == 1) {
            if (pendingDueOutCompleted) {
                setActiveStep((prevActiveStep) => prevActiveStep + 1);
            } else {
                toast("Хүлээгдэж буй гарах зочид.");
            }
        } else if (activeStep == 2) {
            if (pendingPendingRoomChargeCompleted) {
                setActiveStep((prevActiveStep) => prevActiveStep + 1);
            } else {
                toast("Хоногийн төлбөр.");
            }
        } else {
            setActiveStep((prevActiveStep) => prevActiveStep + 1);
        }
    };
    console.log("activeStep", activeStep);
    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    return (
        <>
            <Stepper activeStep={activeStep} alternativeLabel>
                {steps.map((label) => (
                    <Step key={label}>
                        <StepLabel>{label}</StepLabel>
                    </Step>
                ))}
            </Stepper>
            {activeStep == 0 ? (
                <Box sx={{ pt: 2 }}>
                    <PendingReservation
                        setPendingReservationCompleted={
                            setPendingReservationCompleted
                        }
                        workingDate={workingDate}
                    />
                </Box>
            ) : activeStep == 1 ? (
                <Box sx={{ pt: 2 }}>
                    <PendingDueOut
                        setPendingDueOutCompleted={setPendingDueOutCompleted}
                        workingDate={workingDate}
                    />
                </Box>
            ) : activeStep == 2 ? (
                <Box sx={{ pt: 2 }}>
                    <PendingRoomCharge
                        setPendingPendingRoomChargeCompleted={
                            setPendingPendingRoomChargeCompleted
                        }
                    />
                </Box>
            ) : activeStep == 3 ? (
                <Box sx={{ pt: 2 }}>
                    <NewWorkingDate workingDate={workingDate} />
                </Box>
            ) : (
                <></>
            )}
            <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
                <Button
                    color="inherit"
                    disabled={activeStep === 0}
                    onClick={handleBack}
                    sx={{ mr: 1 }}
                >
                    Буцах
                </Button>
                <Box sx={{ flex: "1 1 auto" }} />

                {activeStep < 3 && (
                    <Button onClick={handleNext}>
                        {activeStep === steps.length - 1
                            ? "Дуусгах"
                            : "Дараагийнх"}
                    </Button>
                )}
            </Box>
        </>
    );
};

export default NightAuditList;
