import { Grid, Box } from "@mui/material";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { useState, useContext, useEffect } from "react";
import { mutate } from "swr";
import { useIntl } from "react-intl";

import { ReservationAPI } from "lib/api/reservation";
import { ModalContext } from "lib/context/modal";
import { listUrl } from "lib/api/front-office";
import ReasonSelect from "../select/reason";
import SubmitButton from "components/common/submit-button";

const VoidTransactionForm = ({
    transactionInfo,
    reservation,
    customMutateUrl,
    customRerender,
}: any) => {
    const { handleModal }: any = useContext(ModalContext);
    const intl = useIntl();
    const [loading, setLoading] = useState(false);

    const validationSchema = yup.object().shape({
        TransactionID: yup.string().notRequired(),
        ReasonID: yup.number().typeError(intl.formatMessage({ id: "ValidationSelectRequired" })).required(intl.formatMessage({ id: "ValidationSelectRequired" })),
    });
    const formOptions = { resolver: yupResolver(validationSchema) };

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm(formOptions);
    useEffect(() => {
        reset({
            TransactionID: transactionInfo.TransactionID,
        });
    }, []);

    const onSubmit = async (values: any) => {
        setLoading(true);
        try {
            if (
                transactionInfo.length != "undefined" &&
                transactionInfo.length > 0
            ) {
                transactionInfo.forEach(async (room: any) => {
                    if (room.isChecked == true) {
                        let tempValue: any = {};
                        tempValue.ReasonID = values.ReasonID;
                        tempValue.TransactionID = room.TransactionID;
                        const res = await ReservationAPI.void(tempValue);
                    }
                });
            } else {
                values.TransactionID = transactionInfo.TransactionID;
                const res = await ReservationAPI.void(values);
            }

            await mutate(customMutateUrl ? customMutateUrl : listUrl);

            if (customRerender) {
                customRerender();
            }
            // toast("Амжилттай.");

            setLoading(false);
            handleModal();
        } catch (error) {
            setLoading(false);
            handleModal();
        }
    };

    return (
        <>
            <form id="modal-form" onSubmit={handleSubmit(onSubmit)}>
                <input type="hidden" {...register("TransactionID")} />

                <Grid container spacing={2}>
                    <Grid item xs={6}>
                        <ReasonSelect
                            register={register}
                            errors={errors}
                            ReasonTypeID={2}
                            nameKey={"ReasonID"}
                        />
                    </Grid>
                </Grid>

                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        width: "100%",
                        flexWrap: "wrap",
                        flexDirection: "row-reverse",
                    }}
                    className="mb-1"
                >
                    <SubmitButton fullWidth={false}>
                        {intl.formatMessage({ id: "ButtonSave" })}
                    </SubmitButton>
                </Box>
            </form>
        </>
    );
};

export default VoidTransactionForm;
