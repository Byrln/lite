import { Controller, useForm } from "react-hook-form";
import { FormControlLabel, TextField } from "@mui/material";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

import NewEditForm from "components/common/new-edit-form";
import { RoomBlockAPI, listUrl } from "lib/api/room-block";
import { useAppState } from "lib/context/app";

const validationSchema = yup.object().shape({
    RoomBlockName: yup.string().required("Бөглөнө үү"),
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
            api={RoomBlockAPI}
            listUrl={listUrl}
            additionalValues={{
                RoomBlockID: state.editId,
            }}
            reset={reset}
            handleSubmit={handleSubmit}
        >
            <TextField
                size="small"
                fullWidth
                id="RoomBlockName"
                label="RoomBlockName"
                {...register("RoomBlockName")}
                margin="dense"
                error={errors.RoomBlockName?.message}
                helperText={errors.RoomBlockName?.message}
            />
        </NewEditForm>
    );
};

export default NewEdit;
