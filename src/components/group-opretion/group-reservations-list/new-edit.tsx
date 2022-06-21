import { Controller, useForm } from "react-hook-form";
import { FormControlLabel, TextField } from "@mui/material";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

import NewEditForm from "components/common/new-edit-form";
import { GroupReservationAPI, listUrl } from "lib/api/group-reservation";
import { useAppState } from "lib/context/app";

const validationSchema = yup.object().shape({
    GroupReservationName: yup.string().required("Бөглөнө үү"),
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
            api={GroupReservationAPI}
            listUrl={listUrl}
            additionalValues={{
                GroupReservationID: state.editId,
            }}
            reset={reset}
            handleSubmit={handleSubmit}
        >
            <TextField
                size="small"
                fullWidth
                id="GroupReservationName"
                label="GroupReservationName"
                {...register("GroupReservationName")}
                margin="dense"
                error={errors.GroupReservationName?.message}
                helperText={errors.GroupReservationName?.message}
            />
        </NewEditForm>
    );
};

export default NewEdit;
