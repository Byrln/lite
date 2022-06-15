import { useForm } from "react-hook-form";
import { TextField } from "@mui/material";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

import NewEditForm from "components/common/new-edit-form";
import { UserRoleAPI, listUrl } from "lib/api/user-role";
import { useAppState } from "lib/context/app";
import UserRoleSelect from "components/select/user-role";

const validationSchema = yup.object().shape({
    UserRoleShortName: yup.string().required("Бөглөнө үү"),
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
                multiline
                rows={3}
                id="Description"
                label="Description"
                {...register("Description")}
                margin="dense"
                error={errors.Description?.message}
                helperText={errors.Description?.message}
            />

            <UserRoleSelect
                register={register}
                errors={errors}
                field="ParentID"
            />
        </NewEditForm>
    );
};

export default NewEdit;
