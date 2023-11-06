import { Controller, useForm } from "react-hook-form";
import { FormControlLabel, TextField, Grid } from "@mui/material";
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
    // Password: yup.string().required("Бөглөнө үү"),
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
            <Grid container spacing={1}>
                <Grid item xs={6}>
                    <TextField
                        size="small"
                        fullWidth
                        id="UserName"
                        label="Хэрэглэгчин нэр"
                        {...register("UserName")}
                        margin="dense"
                        error={errors.UserName?.message}
                        helperText={errors.UserName?.message}
                    />
                </Grid>
                <Grid item xs={6}>
                    <TextField
                        size="small"
                        fullWidth
                        id="LoginName"
                        label="Нэвтрэх нэр"
                        {...register("LoginName")}
                        margin="dense"
                        error={errors.LoginName?.message}
                        helperText={errors.LoginName?.message}
                    />
                </Grid>
                <Grid item xs={6}>
                    <UserRoleSelect
                        register={register}
                        errors={errors}
                        field="UserRoleID"
                    />
                </Grid>
                <Grid item xs={6}>
                    <LanguageSelect register={register} errors={errors} />
                </Grid>
                <Grid item xs={6}>
                    <TextField
                        size="small"
                        fullWidth
                        id="Email"
                        label="Цахим шуудан"
                        {...register("Email")}
                        margin="dense"
                        error={errors.Email?.message}
                        helperText={errors.Email?.message}
                    />
                </Grid>
                {/* <Grid item xs={6}>
                    <TextField
                        size="small"
                        type="password"
                        fullWidth
                        id="Password"
                        label="Нууц үг"
                        {...register("Password")}
                        margin="dense"
                        error={errors.Password?.message}
                        helperText={errors.Password?.message}
                    />
                </Grid> */}
            </Grid>
        </NewEditForm>
    );
};

export default NewEdit;
