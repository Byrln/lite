import { TextField, Grid, Checkbox, FormControlLabel } from "@mui/material";
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

const VoidTransactionForm = ({
    transactionInfo,
    reservation,
    customMutateUrl,
}: any) => {
    const { handleModal }: any = useContext(ModalContext);
    const [loading, setLoading] = useState(false);

    const validationSchema = yup.object().shape({
        TransactionID: yup.string().notRequired(),
        ReasonID: yup.number().required("Сонгоно уу"),
    });
    const formOptions = { resolver: yupResolver(validationSchema) };

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm(formOptions);
    console.log("transactionInfo", transactionInfo);
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
                        const res = await ReservationAPI.void(values);
                    }
                });
            } else {
                values.TransactionID = transactionInfo.TransactionID;
                const res = await ReservationAPI.void(values);
            }

            await mutate(customMutateUrl ? customMutateUrl : listUrl);

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
            <form onSubmit={handleSubmit(onSubmit)}>
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

                <LoadingButton
                    size="small"
                    type="submit"
                    variant="contained"
                    loading={loading}
                    className="mt-3"
                >
                    Void Transaction
                </LoadingButton>
            </form>
        </>
    );
};

export default VoidTransactionForm;
