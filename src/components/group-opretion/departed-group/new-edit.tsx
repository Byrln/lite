import { Controller, useForm } from "react-hook-form";
import { FormControlLabel, TextField } from "@mui/material";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

import NewEditForm from "components/common/new-edit-form";
import { DepartedGroupAPI, listUrl } from "lib/api/departed-group";
import { useAppState } from "lib/context/app";

const validationSchema = yup.object().shape({
    DepartedGroupName: yup.string().required("Бөглөнө үү"),
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
            api={DepartedGroupAPI}
            listUrl={listUrl}
            additionalValues={{
                DepartedGroupID: state.editId,
            }}
            reset={reset}
            handleSubmit={handleSubmit}
        >
            <TextField
                size="small"
                fullWidth
                id="DepartedGroupName"
                label="DepartedGroupName"
                {...register("DepartedGroupName")}
                margin="dense"
                error={errors.DepartedGroupName?.message}
                helperText={errors.DepartedGroupName?.message}
            />
        </NewEditForm>
    );
};

export default NewEdit;
