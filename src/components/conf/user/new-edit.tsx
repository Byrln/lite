import { Controller, useForm } from "react-hook-form";
import { FormControlLabel, TextField } from "@mui/material";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

import NewEditForm from "components/common/new-edit-form";
import { UserAPI, listUrl } from "lib/api/user";
import { useAppState } from "lib/context/app";
import LanguageSelect from "components/select/language";
import UserRoleSelect from "components/select/user-role";

const validationSchema = yup.object().shape({
    UserName: yup.string().required("Бөглөнө үү"),
    LoginName: yup.string().required("Бөглөнө үү"),
    UserRoleID: yup.number().required("Бөглөнө үү").typeError("Бөглөнө үү"),
    Language: yup.string().required("Бөглөнө үү"),
    Email: yup.string().email().required("Бөглөнө үү"),
    Password: yup.string().required("Бөглөнө үү"),
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
            api={UserAPI}
            listUrl={listUrl}
            additionalValues={{
                UserID: state.editId,
            }}
            reset={reset}
            handleSubmit={handleSubmit}
        >
            <TextField
                size="small"
                fullWidth
                id="UserName"
                label="User Name"
                {...register("UserName")}
                margin="dense"
                error={errors.UserName?.message}
                helperText={errors.UserName?.message}
            />

            <TextField
                size="small"
                fullWidth
                id="LoginName"
                label="Login Name"
                {...register("LoginName")}
                margin="dense"
                error={errors.LoginName?.message}
                helperText={errors.LoginName?.message}
            />

            <UserRoleSelect
                register={register}
                errors={errors}
                field="UserRoleID"
            />

            <LanguageSelect register={register} errors={errors} />

            <TextField
                size="small"
                fullWidth
                id="Email"
                label="Email"
                {...register("Email")}
                margin="dense"
                error={errors.Email?.message}
                helperText={errors.Email?.message}
            />

            <TextField
                size="small"
                type="password"
                fullWidth
                id="Password"
                label="Password"
                {...register("Password")}
                margin="dense"
                error={errors.Password?.message}
                helperText={errors.Password?.message}
            />
        </NewEditForm>
    );
};

export default NewEdit;
