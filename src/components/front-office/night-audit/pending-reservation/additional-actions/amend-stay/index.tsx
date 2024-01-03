import { useContext } from "react";
import { Button } from "@mui/material";

import { ModalContext } from "lib/context/modal";
import NewEdit from "./new-edit";

const AmendStay = ({ id, entity, listUrl, workingDate }: any) => {
    const { handleModal }: any = useContext(ModalContext);

    return (
        <Button
            key={id}
            onClick={() => {
                handleModal(
                    true,
                    `Хугацаа өөрчлөх`,
                    <NewEdit
                        handleModal={handleModal}
                        entity={entity}
                        listUrl={listUrl}
                        workingDate={workingDate}
                    />,
                    ""
                );
            }}
        >
            Хугацаа өөрчлөх
        </Button>
    );
};

export default AmendStay;
