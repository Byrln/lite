import { Controller, useForm } from "react-hook-form";
import { FormControlLabel, TextField } from "@mui/material";
import Checkbox from "@mui/material/Checkbox";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

import NewEditForm from "components/common/new-edit-form";
import { ReasonAPI, listUrl } from "lib/api/reason";
import { useAppState } from "lib/context/app";

const validationSchema = yup.object().shape({
    RoomStatusID: yup.number().required("Бөглөнө үү"),
    Reason: yup.string().required("Бөглөнө үү"),
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
            api={ReasonAPI}
            listUrl={listUrl}
            additionalValues={{
                ReasonID: state.editId,
            }}
            reset={reset}
            handleSubmit={handleSubmit}
        >
            <TextField
                size="small"
                fullWidth
                id="Reason"
                label="Reason"
                {...register("Reason")}
                margin="dense"
                error={errors.Reason?.message}
                helperText={errors.Reason?.message}
            />

            <TextField
                size="small"
                fullWidth
                id="Reason12312"
                label="Reason12312"
                {...register("Reason12312")}
                margin="dense"
                error={errors.Reason12312?.message}
                helperText={errors.Reason12312?.message}
            />
        </NewEditForm>
    );
};

export default NewEdit;
