import { Controller, useForm } from "react-hook-form";
import { FormControlLabel, TextField } from "@mui/material";
import Checkbox from "@mui/material/Checkbox";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

import NewEditForm from "components/common/new-edit-form";
import { PosApiAPI, listUrl } from "lib/api/pos-api";
import { useAppState } from "lib/context/app";

const validationSchema = yup.object().shape({
    PosApiName: yup.string().required("Бөглөнө үү"),
    PosApiDescription: yup.string().required("Бөглөнө үү"),
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
            api={PosApiAPI}
            listUrl={listUrl}
            additionalValues={{
                PosApiID: state.editId,
            }}
            reset={reset}
            handleSubmit={handleSubmit}
        >
            <TextField
                size="small"
                fullWidth
                id="PosApiName"
                label="PosApiName"
                {...register("PosApiName")}
                margin="dense"
                error={errors.PosApiName?.message}
                helperText={errors.PosApiName?.message}
            />

            <TextField
                size="small"
                fullWidth
                id="PosApiDescription"
                label="PosApiDescription"
                {...register("PosApiDescription")}
                margin="dense"
                error={errors.PosApiDescription?.message}
                helperText={errors.PosApiDescription?.message}
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
