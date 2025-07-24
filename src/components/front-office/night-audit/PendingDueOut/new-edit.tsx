import { Controller, useForm } from "react-hook-form";
import { FormControlLabel, TextField } from "@mui/material";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

import NewEditForm from "components/common/new-edit-form";
import { NightAuditAPI, listUrl } from "lib/api/night-audit";
import { useAppState } from "lib/context/app";

const validationSchema = yup.object().shape({
    NightAuditName: yup.string().required("Бөглөнө үү"),
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
            api={NightAuditAPI}
            listUrl={listUrl}
            // additionalValues={{
            //     NightAuditID: state.editId,
            // }}
            reset={reset}
            handleSubmit={handleSubmit}
        >
            <TextField
                size="small"
                fullWidth
                id="NightAuditName"
                label="NightAuditName"
                {...register("NightAuditName")}
                margin="dense"
                error={!!errors.NightAuditName?.message}
                helperText={errors.NightAuditName?.message as string}
            />
        </NewEditForm>
    );
};

export default NewEdit;
