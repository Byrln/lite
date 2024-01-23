import { Button } from "@mui/material";
import { useContext } from "react";

import { ModalContext } from "lib/context/modal";
import NewForm from "./new-form";

const Asign = ({ RoomID, listUrl, RoomTypeName, RoomNo }: any) => {
    const { handleModal }: any = useContext(ModalContext);

    return (
        <>
            <Button
                key={RoomID}
                onClick={(evt: any) => {
                    handleModal(
                        true,
                        "Өрөөний үйлчлэгч оноох",
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
                Ө.үйлч оноох
            </Button>
        </>
    );
};

export default Asign;
