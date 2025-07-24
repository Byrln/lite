import { useState } from "react";
import { useForm } from "react-hook-form";
import { Grid, TextField } from "@mui/material";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useIntl } from "react-intl";
import NewEditForm from "components/common/new-edit-form";
import { ReservationSourceAPI, listUrl } from "lib/api/reservation-source";
import { useAppState } from "lib/context/app";
import ReservationChannelSelect from "components/select/reservation-channel";
import BookingSourceSelect from "components/select/booking-source";

const validationSchema = yup.object().shape({
    ReservationSourceName: yup.string().required("Бөглөнө үү"),
    ChannelID: yup.string().required("Бөглөнө үү"),
    ChannelSourceID: yup.string().notRequired(),
});

const NewEdit = () => {
    const intl = useIntl();
    const [entity, setEntity]: any = useState(null);

    const [state]: any = useAppState();
    const {
        register,
        reset,
        handleSubmit,
        control,
        formState: { errors },
    } = useForm({ resolver: yupResolver(validationSchema) });
    return (
        <NewEditForm
            api={ReservationSourceAPI}
            listUrl={listUrl}
            additionalValues={{
                ReservationSourceID: state.editId,
            }}
            reset={reset}
            handleSubmit={handleSubmit}
            setEntity={setEntity}
        >
            <Grid container spacing={1}>
                <Grid item xs={6}>
                    <TextField
                        size="small"
                        fullWidth
                        id="ReservationSourceName"
                        label={intl.formatMessage({
                            id: "ConfigReservationSource",
                        })}
                        {...register("ReservationSourceName")}
                        margin="dense"
                        error={!!errors.ReservationSourceName?.message}
                        helperText={errors.ReservationSourceName?.message as string}
                    />
                </Grid>
                <Grid item xs={6}>
                    <ReservationChannelSelect
                        register={register}
                        errors={errors}
                        reset={reset}
                        customRegisterName="ChannelID"
                        entity={entity}
                        setEntity={setEntity}
                    />
                </Grid>
                {entity && entity.ChannelID == 2 && (
                    <Grid item xs={6}>
                        <BookingSourceSelect
                            register={register}
                            errors={errors}
                            reset={reset}
                            entity={entity}
                            setEntity={setEntity}
                        />
                    </Grid>
                )}
            </Grid>
        </NewEditForm>
    );
};

export default NewEdit;
