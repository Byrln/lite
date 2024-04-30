import { Button } from "@mui/material";
import { useState, useContext } from "react";
import { mutate } from "swr";
import { toast } from "react-toastify";
import { ModalContext } from "lib/context/modal";
import { useIntl } from "react-intl";

import { ReservationAPI } from "lib/api/reservation";
import VoidTransactionForm from "components/reservation/void-transaction";

const Void = ({ id, TransactionID, listUrl }: any) => {
    const intl = useIntl();
    const { handleModal }: any = useContext(ModalContext);

    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleOnClick = async () => {
        setLoading(true);
        try {
            await ReservationAPI.void({ TransactionID: TransactionID });
            await mutate(listUrl);
            setLoading(false);
            toast(
                intl.formatMessage({
                    id: "TextSuccess",
                })
            );
            handleClose();
        } catch (error) {
            setLoading(false);
        }
    };

    return (
        <>
            <Button
                key={id}
                onClick={(evt: any) => {
                    handleModal(
                        true,
                        intl.formatMessage({
                            id: "ButtonVoidTransaction",
                        }),
                        <VoidTransactionForm
                            transactionInfo={{ TransactionID: TransactionID }}
                            reservation={{ TransactionID: TransactionID }}
                            customMutateUrl={listUrl}
                        />
                    );
                }}
            >
                {intl.formatMessage({
                    id: "ButtonVoid",
                })}
            </Button>
        </>
    );
};

export default Void;
