import { Controller, useForm } from "react-hook-form";
import { FormControlLabel, TextField } from "@mui/material";
import Checkbox from "@mui/material/Checkbox";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

import NewEditForm from "components/common/new-edit-form";
import { ReservationSourceAPI, listUrl } from "lib/api/reservation-source";
import { useAppState } from "lib/context/app";

const validationSchema = yup.object().shape({
    ReservationSourceName: yup.string().required("Бөглөнө үү"),
});

const NewEdit = () => {
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
        >
            <TextField
                size="small"
                fullWidth
                id="ReservationSourceName"
                label="ReservationSourceName"
                {...register("ReservationSourceName")}
                margin="dense"
                error={errors.ReservationSourceName?.message}
                helperText={errors.ReservationSourceName?.message}
            />
        </NewEditForm>
    );
};

export default NewEdit;
