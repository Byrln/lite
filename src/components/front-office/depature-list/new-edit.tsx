import { Controller, useForm } from "react-hook-form";
import { FormControlLabel, TextField } from "@mui/material";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

import NewEditForm from "components/common/new-edit-form";
import { ReservationAPI, listUrl } from "lib/api/reservation";
import { useAppState } from "lib/context/app";

const validationSchema = yup.object().shape({
    DeparturedListName: yup.string().required("Бөглөнө үү"),
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
            api={ReservationAPI}
            listUrl={listUrl}
            additionalValues={{
                DeparturedListID: state.editId,
            }}
            reset={reset}
            handleSubmit={handleSubmit}
        >
            <TextField
                size="small"
                fullWidth
                id="DeparturedListName"
                label="DeparturedListName"
                {...register("DeparturedListName")}
                margin="dense"
                error={!!errors.DeparturedListName?.message}
                helperText={errors.DeparturedListName?.message}
            />
        </NewEditForm>
    );
};

export default NewEdit;
