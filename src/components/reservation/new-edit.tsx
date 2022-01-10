import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { TextField, Grid } from "@mui/material";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import RoomTypeSelect from "components/select/room-type";
import RoomSelect from "components/select/room";
import RateTypeSelect from "components/select/rate-type";
import NewEditForm from "components/common/new-edit-form";
import { ReservationApi } from "lib/api/reservation";

const NewEdit = (props: any) => {
    const [entity, setEntity]: any = useState(null);

    const validationSchema = yup.object().shape({
        RoomTypeID: yup.number().required("Сонгоно уу"),
        RoomID: yup.number().required("Сонгоно уу"),
    });
    const formOptions = { resolver: yupResolver(validationSchema) };

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm(formOptions);

    return (
        <NewEditForm
            api={ReservationApi}
            entity={entity}
            handleSubmit={handleSubmit}
        >
            <RoomTypeSelect
                register={register}
                errors={errors}
                entity={entity}
                setEntity={setEntity}
            />
            <RoomSelect
                register={register}
                errors={errors}
                entity={entity}
                setEntity={setEntity}
            />

            <RateTypeSelect
                register={register}
                errors={errors}
                entity={entity}
                setEntity={setEntity}
            />

            <Grid container spacing={2}>
                <Grid item xs={6}>
                    <TextField
                        id="Adult"
                        label="Adult"
                        type="number"
                        {...register("Adult")}
                        margin="dense"
                        error={errors.Adult?.message}
                        helperText={errors.Adult?.message}
                    />
                </Grid>
                <Grid item xs={6}>
                    <TextField
                        id="Child"
                        label="Child"
                        type="number"
                        {...register("Child")}
                        margin="dense"
                        error={errors.Child?.message}
                        helperText={errors.Child?.message}
                    />
                </Grid>
            </Grid>

            <Grid container spacing={2}>
                <Grid item xs={6}>
                    <TextField
                        type="date"
                        fullWidth
                        id="ArrivalDate"
                        label="Эхлэх огноо"
                        {...register("ArrivalDate")}
                        margin="dense"
                        error={errors.ArrivalDate?.message}
                        helperText={errors.ArrivalDate?.message}
                        InputLabelProps={{ shrink: true }}
                    />
                </Grid>
                <Grid item xs={6}>
                    <TextField
                        type="date"
                        fullWidth
                        id="DepartureDate"
                        label="Эхлэх огноо"
                        {...register("DepartureDate")}
                        margin="dense"
                        error={errors.DepartureDate?.message}
                        helperText={errors.DepartureDate?.message}
                        InputLabelProps={{ shrink: true }}
                    />
                </Grid>
            </Grid>
        </NewEditForm>
    );
};

export default NewEdit;
