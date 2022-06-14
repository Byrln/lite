import { Controller, useForm } from "react-hook-form";
import { FormControlLabel, TextField } from "@mui/material";
import Checkbox from "@mui/material/Checkbox";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

import NewEditForm from "components/common/new-edit-form";
import { UserRoleAPI, listUrl } from "lib/api/user-role";
import { useAppState } from "lib/context/app";

const validationSchema = yup.object().shape({
    UserRoleShortName: yup
        .number()
        .required("Бөглөнө үү")
        .typeError("Бөглөнө үү"),
    UserRoleName: yup.string().required("Бөглөнө үү"),
    Description: yup.string().required("Бөглөнө үү"),
    ParentID: yup.number().required("Бөглөнө үү").typeError("Бөглөнө үү"),
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
                id="UserRoleShortName"
                label="Short Code"
                {...register("UserRoleShortName")}
                margin="dense"
                error={errors.UserRoleShortName?.message}
                helperText={errors.UserRoleShortName?.message}
            />

            <TextField
                size="small"
                fullWidth
                id="UserRoleName"
                label="User Role"
                {...register("UserRoleName")}
                margin="dense"
                error={errors.UserRoleName?.message}
                helperText={errors.UserRoleName?.message}
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
