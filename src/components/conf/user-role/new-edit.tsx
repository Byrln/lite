import { Controller, useForm } from "react-hook-form";
import { FormControlLabel, TextField } from "@mui/material";
import Checkbox from "@mui/material/Checkbox";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

import NewEditForm from "components/common/new-edit-form";
import { UserRoleAPI, listUrl } from "lib/api/user-role";
import { useAppState } from "lib/context/app";

const validationSchema = yup.object().shape({
    ShortCode: yup.number().required("Бөглөнө үү").typeError("Бөглөнө үү"),
    UserRole: yup.string().required("Бөглөнө үү"),
    Description: yup.string().required("Бөглөнө үү"),
    ShowWarning: yup.boolean(),
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
            api={UserRoleAPI}
            listUrl={listUrl}
            additionalValues={{
                UserRoleID: state.editId,
            }}
            reset={reset}
            handleSubmit={handleSubmit}
        >
            <TextField
                size="small"
                fullWidth
                id="ShortCode"
                label="ShortCode"
                {...register("ShortCode")}
                margin="dense"
                error={errors.ShortCode?.message}
                helperText={errors.ShortCode?.message}
            />

            <TextField
                size="small"
                fullWidth
                id="UserRole"
                label="UserRole"
                {...register("UserRole")}
                margin="dense"
                error={errors.UserRole?.message}
                helperText={errors.UserRole?.message}
            />
            <TextField
                size="small"
                fullWidth
                id="Description"
                label="Description"
                {...register("Description")}
                margin="dense"
                error={errors.Description?.message}
                helperText={errors.Description?.message}
            />
        </NewEditForm>
    );
};

export default NewEdit;
