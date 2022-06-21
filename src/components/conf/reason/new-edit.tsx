import { Controller, useForm } from "react-hook-form";
import { FormControlLabel, TextField } from "@mui/material";
import Checkbox from "@mui/material/Checkbox";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

import NewEditForm from "components/common/new-edit-form";
import { ReasonAPI, listUrl } from "lib/api/reason";
import { useAppState } from "lib/context/app";
import ReasonType from "components/select/reason";

const validationSchema = yup.object().shape({
    ReasonType: yup.string().required("Бөглөнө үү"),
    ReasonName: yup.string().required("Бөглөнө үү"),
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
            api={ReasonAPI}
            listUrl={listUrl}
            additionalValues={{
                ReasonID: state.editId,
            }}
            reset={reset}
            handleSubmit={handleSubmit}
        >
            <ReasonType register={register} errors={errors} />

            <TextField
                size="small"
                fullWidth
                id="ReasonName"
                label="ReasonName"
                {...register("ReasonName")}
                margin="dense"
                error={errors.ReasonName?.message}
                helperText={errors.ReasonName?.message}
            />
        </NewEditForm>
    );
};
export default NewEdit;
