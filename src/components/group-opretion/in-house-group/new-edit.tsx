import { Controller, useForm } from "react-hook-form";
import { FormControlLabel, TextField } from "@mui/material";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

import NewEditForm from "components/common/new-edit-form";
import { InHouseGroupAPI, listUrl } from "lib/api/in-house-group";
import { useAppState } from "lib/context/app";

const validationSchema = yup.object().shape({
    InHouseGroupName: yup.string().required("Бөглөнө үү"),
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
            api={InHouseGroupAPI}
            listUrl={listUrl}
            additionalValues={{
                InHouseGroupID: state.editId,
            }}
            reset={reset}
            handleSubmit={handleSubmit}
        >
            <TextField
                size="small"
                fullWidth
                id="InHouseGroupName"
                label="InHouseGroupName"
                {...register("InHouseGroupName")}
                margin="dense"
                error={errors.InHouseGroupName?.message}
                helperText={errors.InHouseGroupName?.message}
            />
        </NewEditForm>
    );
};

export default NewEdit;
