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

const VoidTransactionForm = ({ transactionInfo, reservation }: any) => {
    const { handleModal }: any = useContext(ModalContext);
    const [loading, setLoading] = useState(false);

    const validationSchema = yup.object().shape({
        TransactionID: yup.number().required("Сонгоно уу"),
        ReasonID: yup.number().required("Сонгоно уу"),
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
            const res = await ReservationAPI.void(values);

            await mutate(listUrl);

            toast("Амжилттай.");

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
                    size="large"
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
