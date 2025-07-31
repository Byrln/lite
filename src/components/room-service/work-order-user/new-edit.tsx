import { Controller, useForm } from "react-hook-form";
import { FormControlLabel, TextField } from "@mui/material";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

import NewEditForm from "components/common/new-edit-form";
import { HouseKeepingAPI, listCurrentUrl } from "lib/api/house-keeping";
import { useAppState } from "lib/context/app";

const validationSchema = yup.object().shape({
    HouseKeepingName: yup.string().required("Бөглөнө үү"),
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
            api={HouseKeepingAPI}
            listUrl={listCurrentUrl}
            additionalValues={{
                HouseKeepingID: state.editId,
            }}
            reset={reset}
            handleSubmit={handleSubmit}
        >
            <TextField
                size="small"
                fullWidth
                id="HouseKeepingName"
                label="HouseKeepingName"
                {...register("HouseKeepingName")}
                margin="dense"
                error={!!errors.HouseKeepingName?.message}
                helperText={errors.HouseKeepingName?.message as string}
            />
        </NewEditForm>
    );
};

export default NewEdit;
