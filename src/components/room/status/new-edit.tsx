import { useForm } from "react-hook-form";
import { TextField, Grid } from "@mui/material";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

import NewEditForm from "components/common/new-edit-form";
import { RoomStatusAPI, listUrl } from "lib/api/room-status";
import { useAppState } from "lib/context/app";

const validationSchema = yup.object().shape({
    StatusColor: yup.string().required("Бөглөнө үү"),
    Description: yup.string().required("Бөглөнө үү"),
});

const NewEdit = () => {
    const [state]: any = useAppState();
    const {
        register,
        reset,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(validationSchema),
    });

    return (
        <NewEditForm
            api={RoomStatusAPI}
            listUrl={listUrl}
            additionalValues={{ RoomStatusID: state.editId }}
            reset={reset}
            handleSubmit={handleSubmit}
        >
            <Grid container spacing={1}>
                <Grid item xs={4}>
                    <TextField
                        size="small"
                        disabled
                        fullWidth
                        id="StatusCode"
                        label="Өрөөний статус"
                        {...register("StatusCode")}
                        margin="dense"
                        error={errors.RoomNo?.message}
                        helperText={errors.RoomNo?.message}
                    />
                </Grid>
                <Grid item xs={4}>
                    <TextField
                        size="small"
                        fullWidth
                        id="StatusColor"
                        label="Өнгө"
                        {...register("StatusColor")}
                        margin="dense"
                        error={errors.StatusColor?.message}
                        helperText={errors.StatusColor?.message}
                    />
                </Grid>
                <Grid item xs={4}>
                    <TextField
                        size="small"
                        fullWidth
                        id="Description"
                        label="Тайлбар"
                        {...register("Description")}
                        margin="dense"
                        error={errors.Description?.message}
                        helperText={errors.Description?.message}
                    />
                </Grid>
            </Grid>
        </NewEditForm>
    );
};

export default NewEdit;
