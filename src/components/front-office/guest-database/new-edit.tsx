import { Controller, useForm } from "react-hook-form";
import { FormControlLabel, TextField } from "@mui/material";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

import NewEditForm from "components/common/new-edit-form";
import { GuestdatabaseAPI, listUrl } from "lib/api/guest-database";
import { useAppState } from "lib/context/app";

const validationSchema = yup.object().shape({
    GuestdatabaseName: yup.string().required("Бөглөнө үү"),
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
            api={GuestdatabaseAPI}
            listUrl={listUrl}
            additionalValues={{
                GuestdatabaseID: state.editId,
            }}
            reset={reset}
            handleSubmit={handleSubmit}
        >
            <TextField
                size="small"
                fullWidth
                id="GuestdatabaseName"
                label="GuestdatabaseName"
                {...register("GuestdatabaseName")}
                margin="dense"
                error={errors.GuestdatabaseName?.message}
                helperText={errors.GuestdatabaseName?.message}
            />
        </NewEditForm>
    );
};

export default NewEdit;
