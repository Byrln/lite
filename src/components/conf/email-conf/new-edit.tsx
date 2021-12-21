import { useForm } from "react-hook-form";
import { TextField } from "@mui/material";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

import NewEditForm from "components/common/new-edit-form";
import { EmailAPI, listUrl } from "lib/api/email-conf";

const NewEdit = ({ entity }: any) => {
    const validationSchema = yup.object().shape({
        Email: yup.string().required("Бөглөнө үү"),
        EmailHost: yup.string().required("Бөглөнө үү"),
        Port: yup.number().required("Бөглөнө үү"),
        UserName: yup.string().required("Бөглөнө үү"),
        Password: yup.string().required("Бөглөнө үү"),
    });
    const formOptions = { resolver: yupResolver(validationSchema) };

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm(formOptions);

    return (
        <NewEditForm
            api={EmailAPI}
            entity={entity}
            listUrl={listUrl}
            handleSubmit={handleSubmit}
            additionalValues={{ HotelID: 0 }}
        >
            <TextField
                fullWidth
                id="Email"
                label="И-Мэйл"
                {...register("Email")}
                margin="dense"
                error={errors.Email?.message}
                helperText={errors.Email?.message}
            />

            <TextField
                fullWidth
                id="EmailHost"
                label="И-Мэйл сервер"
                {...register("EmailHost")}
                margin="dense"
                error={errors.EmailHost?.message}
                helperText={errors.EmailHost?.message}
            />

            <TextField
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
                fullWidth
                id="UserName"
                label="Хэрэглэгчийн нэр"
                {...register("UserName")}
                margin="dense"
                error={errors.UserName?.message}
                helperText={errors.UserName?.message}
            />

            <TextField
                fullWidth
                id="Password"
                label="Нууц үг"
                type="password"
                {...register("Password")}
                margin="dense"
                error={errors.Password?.message}
                helperText={errors.Password?.message}
            />
        </NewEditForm>
    );
};

export default NewEdit;
