import { useContext } from "react";
import { Button } from "@mui/material";

import { ModalContext } from "lib/context/modal";
import NewEdit from "./new-edit";
import CancelReservationForm from "components/reservation/cancel-reservation";

const Cancel = ({ id, entity, listUrl }: any) => {
    const { handleModal }: any = useContext(ModalContext);

    return (
        <Button
            key={id}
            onClick={() => {
                handleModal(
                    true,
                    `Захиалга цуцлах`,
                    <CancelReservationForm
                        transactionInfo={entity}
                        reservation={entity}
                        customMutateUrl={listUrl}
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
