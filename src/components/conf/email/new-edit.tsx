import { useForm } from "react-hook-form";
import { TextField } from "@mui/material";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

import NewEditForm from "components/common/new-edit-form";
import { EmailAPI, listUrl } from "lib/api/email-conf";
import { useAppState } from "lib/context/app";

const validationSchema = yup.object().shape({
    Email: yup.string().email().required("Бөглөнө үү"),
    EmailHost: yup.string().required("Бөглөнө үү"),
    Port: yup.number().required("Бөглөнө үү").typeError("Бөглөнө үү"),
    UserName: yup.string().required("Бөглөнө үү"),
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
            api={EmailAPI}
            listUrl={listUrl}
            additionalValues={{
                EmailID: state.editId,
            }}
            reset={reset}
            handleSubmit={handleSubmit}
        >
            <TextField
                size="small"
                fullWidth
                id="Email"
                label="И-Мэйл"
                {...register("Email")}
                margin="dense"
                error={errors.Email?.message}
                helperText={errors.Email?.message}
            />

            <TextField
                size="small"
                fullWidth
                id="EmailHost"
                label="И-Мэйл сервер"
                {...register("EmailHost")}
                margin="dense"
                error={errors.EmailHost?.message}
                helperText={errors.EmailHost?.message}
            />

            <TextField
                size="small"
                type="number"
                fullWidth
                id="Port"
                label="Порт"
                {...register("Port")}
                margin="dense"
                error={errors.Port?.message}
                helperText={errors.Port?.message}
            />

            <TextField
                size="small"
                fullWidth
                id="UserName"
                label="Хэрэглэгчийн нэр"
                {...register("UserName")}
                margin="dense"
                error={errors.UserName?.message}
                helperText={errors.UserName?.message}
            />

            {!state.editId && (
                <TextField
                    size="small"
                    fullWidth
                    id="Password"
                    label="Нууц үг"
                    type="password"
                    {...register("Password")}
                    margin="dense"
                    error={errors.Password?.message}
                    helperText={errors.Password?.message}
                />
            )}
        </NewEditForm>
    );
};

export default NewEdit;
