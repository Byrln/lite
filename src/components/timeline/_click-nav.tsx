import { useContext } from "react";
import { Button } from "@mui/material";
import { ModalContext } from "lib/context/modal";
import NewEdit from "components/reservation/new-edit";
import ReservationMake from "components/reservation/make";

export const ClickNav = ({ timelineCoord, workingDate }: any) => {
    const { handleModal }: any = useContext(ModalContext);

    return (
        <>
            <Button
                variant={"text"}
                onClick={() => {
                    handleModal(
                        true,
                        "Make Reservation",
                        <ReservationMake
                            timelineCoord={timelineCoord}
                            workingDate={workingDate}
                        />,
                        true
                    );
                }}
            >Make Reservation</Button>

            <Button variant={"text"}>Block</Button>
        </>
    );
};
