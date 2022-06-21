import { Controller, useForm } from "react-hook-form";
import { FormControlLabel, TextField } from "@mui/material";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

import NewEditForm from "components/common/new-edit-form";
import { WorkOrderAPI, listUrl } from "lib/api/work-order";
import { useAppState } from "lib/context/app";

const validationSchema = yup.object().shape({
    WorkOrderName: yup.string().required("Бөглөнө үү"),
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
            api={WorkOrderAPI}
            listUrl={listUrl}
            additionalValues={{
                WorkOrderID: state.editId,
            }}
            reset={reset}
            handleSubmit={handleSubmit}
        >
            <TextField
                size="small"
                fullWidth
                id="WorkOrderName"
                label="WorkOrderName"
                {...register("WorkOrderName")}
                margin="dense"
                error={errors.WorkOrderName?.message}
                helperText={errors.WorkOrderName?.message}
            />
        </NewEditForm>
    );
};

export default NewEdit;
