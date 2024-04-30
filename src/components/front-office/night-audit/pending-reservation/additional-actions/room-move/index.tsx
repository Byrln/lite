import { useContext } from "react";
import { Button } from "@mui/material";
import { useIntl } from "react-intl";

import { ModalContext } from "lib/context/modal";
import NewEdit from "./new-edit";
const RoomMove = ({ id, entity, listUrl }: any) => {
    const intl = useIntl();

    const { handleModal }: any = useContext(ModalContext);

    return (
        <Button
            key={id}
            onClick={() => {
                handleModal(
                    true,
                    intl.formatMessage({
                        id: "ButtonRoomMove",
                    }),
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
            {intl.formatMessage({
                id: "ButtonRoomMove",
            })}
        </Button>
    );
};

export default RoomMove;
