import { useContext } from "react";
import { Button } from "@mui/material";

import { ModalContext } from "lib/context/modal";
import NewEdit from "./new-edit";
const RoomMove = ({ id, entity, listUrl }: any) => {
    const { handleModal }: any = useContext(ModalContext);

    return (
        <Button
            key={id}
            onClick={() => {
                handleModal(
                    true,
                    `Өрөө шилжүүлэх`,
                    <NewEdit
                        handleModal={handleModal}
                        entity={entity}
                        listUrl={listUrl}
                    />,
                    "",
                    "large"
                );
            }}
        >
            Өрөө шилжих
        </Button>
    );
};

export default RoomMove;
