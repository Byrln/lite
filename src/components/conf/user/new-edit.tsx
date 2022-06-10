import { Controller, useForm } from "react-hook-form";
import { FormControlLabel, TextField } from "@mui/material";
import Checkbox from "@mui/material/Checkbox";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

import NewEditForm from "components/common/new-edit-form";
import { UserAPI, listUrl } from "lib/api/user";
import { useAppState } from "lib/context/app";

const validationSchema = yup.object().shape({
    UserName: yup.string().required("Бөглөнө үү"),
    User: yup.string().required("Бөглөнө үү"),
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
                id="User Name"
                label="UserName"
                {...register("UserName")}
                margin="dense"
                error={errors.UserName?.message}
                helperText={errors.UserName?.message}
            />

            <TextField
                size="small"
                fullWidth
                id="Login Name"
                label="LoginName"
                {...register("LoginName")}
                margin="dense"
                error={errors.LoginName?.message}
                helperText={errors.LoginName?.message}
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
