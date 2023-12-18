import { useContext } from "react";
import { Button } from "@mui/material";

import { ModalContext } from "lib/context/modal";
import NewEdit from "./new-edit";

const Cancel = ({ id, entity, listUrl }: any) => {
    const { handleModal }: any = useContext(ModalContext);

    return (
        <Button
            key={id}
            onClick={() => {
                handleModal(
                    true,
                    `Захиалга цуцлах`,
                    <NewEdit
                        handleModal={handleModal}
                        entity={entity}
                        listUrl={listUrl}
                    />,
                    ""
                );
            }}
        >
            Захиалга цуцлах
        </Button>
    );
};

export default Cancel;
