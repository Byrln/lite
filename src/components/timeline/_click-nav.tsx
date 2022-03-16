import {useContext} from "react";
import {Button} from "@mui/material";
import {ModalContext} from "lib/context/modal";
import ReservationMake from "components/reservation/make";
import RoomBlockForm from "components/room/block/new-edit";

export const ClickNav = ({timelineCoord, workingDate}: any) => {
    const {handleModal}: any = useContext(ModalContext);

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

            <Button
                variant={"text"}
                onClick={() => {
                    handleModal(
                        true,
                        "Block Room",
                        <RoomBlockForm
                            timelineCoord={timelineCoord}
                        />
                    );
                }}
            >Block</Button>
        </>
    );
};
