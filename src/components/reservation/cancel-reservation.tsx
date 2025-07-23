import { TextField, Grid, Box } from "@mui/material";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { useState, useContext, useEffect } from "react";
import { mutate } from "swr";
import { toast } from "react-toastify";
import { ReservationAPI } from "lib/api/reservation";
import { ModalContext } from "lib/context/modal";
import { listUrl } from "lib/api/front-office";
import { LoadingButton } from "@mui/lab";
import ReasonSelect from "../select/reason";
import SubmitButton from "components/common/submit-button";
import { useIntl } from "react-intl";

const CancelReservationForm = ({
    transactionInfo,
    reservation,
    customMutateUrl,
    customRerender,
}: any) => {
    const intl = useIntl();
    const { handleModal }: any = useContext(ModalContext);
    const [loading, setLoading] = useState(false);

    const validationSchema = yup.object().shape({
        TransactionID: yup.string().notRequired(),
        ReasonID: yup.number().required("Сонгоно уу"),
        Fee: yup.number().required(""),
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
            Fee: 0,
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
                        tempValue.Fee = values.Fee;
                        tempValue.ReasonID = values.ReasonID;
                        tempValue.TransactionID = room.TransactionID;
                        const res = await ReservationAPI.cancel(tempValue);
                    }
                });
            } else {
                values.TransactionID = transactionInfo.TransactionID;
                const res = await ReservationAPI.cancel(values);
            }

            await mutate(customMutateUrl ? customMutateUrl : listUrl);

            if (customRerender) {
                customRerender();
            }

            setLoading(false);
            handleModal();
        } catch (error) {
            setLoading(false);
            handleModal();
        }
    };

    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)}>
                <input type="hidden" {...register("TransactionID")} />

                <Grid container spacing={2}>
                    <Grid item xs={6}>
                        <ReasonSelect
                            register={register}
                            errors={errors}
                            ReasonTypeID={1}
                            nameKey={"ReasonID"}
                        />

                        <TextField
                            fullWidth
                            id="Fee"
                            label={intl.formatMessage({
                                id: "TextCancellationFee",
                            })}
                            {...register("Fee")}
                            margin="dense"
                            error={!!errors.Fee?.message}
                            helperText={errors.Fee?.message}
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
                    <SubmitButton
                        fullWidth={false}
                        title={intl.formatMessage({
                            id: "ButtonCancel",
                        })}
                    ></SubmitButton>
                </Box>
            </form>
        </>
    );
};

export default CancelReservationForm;
