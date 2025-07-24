import { useForm } from "react-hook-form";
import { Typography, Grid, TextField } from "@mui/material";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";
import { mutate } from "swr";
import { toast } from "react-toastify";

import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";

import { ReservationAPI } from "lib/api/reservation";
import SubmitButton from "components/common/submit-button";
import ReasonSelect from "components/select/reason";

const validationSchema = yup.object().shape({
    ReasonID: yup.string().required("Сонгоно үү"),
    Fee: yup.number().required("Бөглөнө үү"),
});

const NewEdit = ({ handleModal, entity, listUrl }: any) => {
    const [loading, setLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({ resolver: yupResolver(validationSchema) });

    const onSubmit = async (values: any) => {
        setLoading(true);

        try {
            values.TransactionID = entity.TransactionID;
            await ReservationAPI.cancel(values);
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
        <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={1}>
                <Grid item xs={12}>
                    <Typography variant="subtitle2" component="div">
                        <Grid container spacing={1} className="mt-2">
                            <Grid item xs={6}>
                                <b> Өрөө.дугаар/Төрөл:</b>
                            </Grid>
                            <Grid item xs={6}>
                                {entity.RoomFullName}
                            </Grid>
                            <Grid item xs={6}>
                                <b>Одоогийн тариф:</b>
                            </Grid>
                            <Grid item xs={6}>
                                {entity.CurrentBalance}
                            </Grid>
                            <Grid item xs={6}>
                                <b>Нийт / Төлсөн:</b>
                            </Grid>
                            <Grid item xs={6}>
                                {entity.TotalAmount}/{entity.Deposit}
                            </Grid>
                            <Grid item xs={6}>
                                <b> Том хүн/Хүүхэд:</b>
                            </Grid>
                            <Grid item xs={6}>
                                {entity.GuestName}
                                {/* ({entity.adult}/{entity.child}) */}
                            </Grid>
                        </Grid>
                    </Typography>
                    <Grid container spacing={1} className="mt-2">
                        <Grid item xs={6}>
                            <ReasonSelect
                                register={register}
                                errors={errors}
                                ReasonTypeID={1}
                                nameKey={"ReasonID"}
                            />
                        </Grid>

                        <Grid item xs={6}>
                            <TextField
                                fullWidth
                                id="Fee"
                                label="Fee"
                                {...register("Fee")}
                                size="small"
                                margin="dense"
                                error={!!errors.Fee?.message}
                                helperText={errors.Fee?.message as string}
                            />
                        </Grid>
                    </Grid>

                    <SubmitButton loading={loading} />
                </Grid>
            </Grid>
        </form>
    );
};

export default NewEdit;
