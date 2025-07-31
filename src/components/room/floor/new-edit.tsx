import { useForm } from "react-hook-form";
import { TextField, Grid } from "@mui/material";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

import NewEditForm from "components/common/new-edit-form";
import { FloorAPI, listUrl } from "lib/api/floor";
import { useAppState } from "lib/context/app";

const validationSchema = yup.object().shape({
    FloorNo: yup.string().required("Бөглөнө үү").typeError("Бөглөнө үү"),
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
            api={FloorAPI}
            listUrl={listUrl}
            reset={reset}
            handleSubmit={handleSubmit}
        >
            <Grid container spacing={1}>
                <Grid item xs={6}>
                    <TextField
                        size="small"
                        type="number"
                        fullWidth
                        id="FloorNo"
                        label="Давхар"
                        {...register("FloorNo")}
                        margin="dense"
                        error={!!errors.SortOrder?.message}
                        helperText={errors.SortOrder?.message as string}
                    />
                </Grid>
            </Grid>
        </NewEditForm>
    );
};

export default NewEdit;
