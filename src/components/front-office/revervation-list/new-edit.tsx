import { Controller, useForm } from "react-hook-form";
import { FormControlLabel, TextField } from "@mui/material";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

import NewEditForm from "components/common/new-edit-form";
import { RevervationAPI, listUrl } from "lib/api/revervation";
import { useAppState } from "lib/context/app";

const validationSchema = yup.object().shape({
    RevervationName: yup.string().required("Бөглөнө үү"),
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
            api={RevervationAPI}
            listUrl={listUrl}
            additionalValues={{
                RevervationID: state.editId,
            }}
            reset={reset}
            handleSubmit={handleSubmit}
        >
            <TextField
                size="small"
                fullWidth
                id="RevervationName"
                label="RevervationName"
                {...register("RevervationName")}
                margin="dense"
                error={errors.RevervationName?.message}
                helperText={errors.RevervationName?.message}
            />
        </NewEditForm>
    );
};

export default NewEdit;
