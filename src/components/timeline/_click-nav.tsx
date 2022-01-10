import { useContext } from "react";
import { Button } from "@mui/material";
import { ModalContext } from "lib/context/modal";
import NewEdit from "components/reservation/new-edit";
export const ClickNav = (props: any) => {
    const { handleModal }: any = useContext(ModalContext);

    return (
        <>
            <Button
                variant={"text"}
                onClick={() => {
                    handleModal(true, "New Reservation", <NewEdit />);
                }}
            >
                New Reservation
            </Button>
            <Button variant={"text"}>Block</Button>
        </>
    );
};
