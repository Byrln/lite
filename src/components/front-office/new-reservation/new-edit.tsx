import { Controller, useForm } from "react-hook-form";
import { FormControlLabel, TextField } from "@mui/material";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

import NewEditForm from "components/common/new-edit-form";
import { NewRevervationAPI, listUrl } from "lib/api/new-revervation";
import { useAppState } from "lib/context/app";

const validationSchema = yup.object().shape({
    NewRevervationName: yup.string().required("Бөглөнө үү"),
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
            api={NewRevervationAPI}
            listUrl={listUrl}
            additionalValues={{
                NewRevervationID: state.editId,
            }}
            reset={reset}
            handleSubmit={handleSubmit}
        >
            <TextField
                size="small"
                fullWidth
                id="NewRevervationName"
                label="NewRevervationName"
                {...register("NewRevervationName")}
                margin="dense"
                error={errors.NewRevervationName?.message}
                helperText={errors.NewRevervationName?.message}
            />
        </NewEditForm>
    );
};

export default NewEdit;
