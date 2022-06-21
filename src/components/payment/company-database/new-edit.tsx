import { Controller, useForm } from "react-hook-form";
import { FormControlLabel, TextField } from "@mui/material";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

import NewEditForm from "components/common/new-edit-form";
import { CompanyDatabaseAPI, listUrl } from "lib/api/night-audit";
import { useAppState } from "lib/context/app";

const validationSchema = yup.object().shape({
    CompanyDatabaseName: yup.string().required("Бөглөнө үү"),
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
            api={CompanyDatabaseAPI}
            listUrl={listUrl}
            additionalValues={{
                CompanyDatabaseID: state.editId,
            }}
            reset={reset}
            handleSubmit={handleSubmit}
        >
            <TextField
                size="small"
                fullWidth
                id="CompanyDatabaseName"
                label="CompanyDatabaseName"
                {...register("CompanyDatabaseName")}
                margin="dense"
                error={errors.CompanyDatabaseName?.message}
                helperText={errors.CompanyDatabaseName?.message}
            />
        </NewEditForm>
    );
};

export default NewEdit;
