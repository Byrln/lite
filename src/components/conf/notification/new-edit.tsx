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
                id="NotificationName"
                label="NotificationName"
                {...register("NotificationName")}
                margin="dense"
                error={errors.NotificationName?.message}
                helperText={errors.NotificationName?.message}
            />

            <TextField
                size="small"
                fullWidth
                id="NotificationDescription"
                label="NotificationDescription"
                {...register("NotificationDescription")}
                margin="dense"
                error={errors.NotificationDescription?.message}
                helperText={errors.NotificationDescription?.message}
            />

            <FormControlLabel
                control={
                    <Controller
                        name="ShowWarning"
                        control={control}
                        render={(props: any) => (
                            <Checkbox
                                {...register("ShowWarning")}
                                checked={props.field.value}
                                onChange={(e) =>
                                    props.field.onChange(e.target.checked)
                                }
                            />
                        )}
                    />
                }
                label="ShowWarning"
            />
        </NewEditForm>
    );
};

export default NewEdit;
