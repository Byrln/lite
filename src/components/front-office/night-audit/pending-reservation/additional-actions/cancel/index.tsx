import { useContext } from "react";
import { Button } from "@mui/material";
import { useIntl } from "react-intl";

import { ModalContext } from "lib/context/modal";
import CancelReservationForm from "components/reservation/cancel-reservation";

const Cancel = ({ id, entity, listUrl }: any) => {
    const intl = useIntl();

    const { handleModal }: any = useContext(ModalContext);

    return (
        <Button
            key={id}
            onClick={() => {
                handleModal(
                    true,
                    intl.formatMessage({
                        id: "ButtonCancelReservation",
                    }),
                    <CancelReservationForm
                        transactionInfo={entity}
                        reservation={entity}
                        customMutateUrl={listUrl}
                    />,

                    ""
                );
            }}
        >
            {intl.formatMessage({
                id: "ButtonCancelReservation",
            })}
        </Button>
    );
};

export default Cancel;
