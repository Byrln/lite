import { useState } from "react";
import { Stepper, Step, StepLabel, Button, Box } from "@mui/material";

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

const NightAuditList = ({ title }: any) => {
    const [activeStep, setActiveStep] = useState(0);

    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

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
                    <PendingReservation />
                </Box>
            ) : activeStep == 1 ? (
                <Box sx={{ pt: 2 }}>
                    <PendingDueOut />
                </Box>
            ) : activeStep == 2 ? (
                <Box sx={{ pt: 2 }}>
                    <PendingRoomCharge />
                </Box>
            ) : activeStep == 3 ? (
                <Box sx={{ pt: 2 }}>
                    <NewWorkingDate />
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

                <Button onClick={handleNext}>
                    {activeStep === steps.length - 1 ? "Дуусгах" : "Дараагийнх"}
                </Button>
            </Box>
        </>
    );
};

export default NightAuditList;
