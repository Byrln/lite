import { Controller, useForm } from "react-hook-form";
import { FormControlLabel, TextField } from "@mui/material";
import Checkbox from "@mui/material/Checkbox";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

import NewEditForm from "components/common/new-edit-form";
import { NotificationAPI, listUrl } from "lib/api/notification";
import { useAppState } from "lib/context/app";

const validationSchema = yup.object().shape({
    NotificationName: yup.string().required("Бөглөнө үү"),
    NotificationDescription: yup.string().required("Бөглөнө үү"),
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
            api={NotificationAPI}
            listUrl={listUrl}
            additionalValues={{
                NotificationID: state.editId,
            }}
            reset={reset}
            handleSubmit={handleSubmit}
        >
            <TextField
                size="small"
                fullWidth
                id="NotificationType"
                label="Notification Type"
                {...register("NotificationType")}
                margin="dense"
                error={errors.NotificationType?.message}
                helperText={errors.NotificationType?.message}
            />

            <TextField
                size="small"
                fullWidth
                id="TextType"
                label="TextType"
                {...register("TextType")}
                margin="dense"
                error={errors.TextType?.message}
                helperText={errors.TextType?.message}
            />

            <TextField
                size="small"
                fullWidth
                id="TextType"
                label="TextType"
                {...register("TextType")}
                margin="dense"
                error={errors.TextType?.message}
                helperText={errors.TextType?.message}
            />
        </NewEditForm>
    );
};

export default NewEdit;
