import { Controller, useForm } from "react-hook-form";
import { FormControlLabel, TextField } from "@mui/material";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

import NewEditForm from "components/common/new-edit-form";
import { HouseStatusAPI, listUrl } from "lib/api/house-status";
import { useAppState } from "lib/context/app";

const validationSchema = yup.object().shape({
    HouseStatusName: yup.string().required("Бөглөнө үү"),
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
            api={HouseStatusAPI}
            listUrl={listUrl}
            additionalValues={{
                HouseStatusID: state.editId,
            }}
            reset={reset}
            handleSubmit={handleSubmit}
        >
            <TextField
                size="small"
                fullWidth
                id="HouseStatusName"
                label="HouseStatusName"
                {...register("HouseStatusName")}
                margin="dense"
                error={errors.HouseStatusName?.message}
                helperText={errors.HouseStatusName?.message}
            />
        </NewEditForm>
    );
};

export default NewEdit;
