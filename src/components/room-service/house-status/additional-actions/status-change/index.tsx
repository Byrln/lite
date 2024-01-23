import { Button } from "@mui/material";
import { useContext } from "react";

import { ModalContext } from "lib/context/modal";
import NewForm from "./new-form";

const StatusChange = ({ RoomID, listUrl, RoomTypeName, RoomNo }: any) => {
    const { handleModal }: any = useContext(ModalContext);

    return (
        <>
            <Button
                key={RoomID}
                onClick={(evt: any) => {
                    handleModal(
                        true,
                        "Төлөв өөрчлөх",
                        <NewForm
                            RoomID={RoomID}
                            customMutateUrl={listUrl}
                            RoomTypeName={RoomTypeName}
                            RoomNo={RoomNo}
                        />,
                        null,
                        "large"
                    );
                }}
            >
                Төлөв өөрчлөх
            </Button>
        </>
    );
};

export default StatusChange;
