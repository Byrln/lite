import { Controller, useForm } from "react-hook-form";
import { Checkbox, FormControlLabel, TextField, Grid } from "@mui/material";
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
            <Grid container spacing={1}>
                <Grid item xs={6}>
                    <TextField
                        size="small"
                        fullWidth
                        id="OrderId"
                        label="Ажлын дугаар"
                        {...register("OrderId")}
                        margin="dense"
                        error={errors.OrderId?.message}
                        helperText={errors.OrderId?.message}
                    />
                </Grid>
                <Grid item xs={6}>
                    <TextField
                        size="small"
                        fullWidth
                        id="Priority"
                        label="Зэрэглэл"
                        {...register("Priority")}
                        margin="dense"
                        error={errors.Priority?.message}
                        helperText={errors.Priority?.message}
                    />
                </Grid>
                <Grid item xs={6}>
                    <TextField
                        size="small"
                        fullWidth
                        id="Status"
                        label="Төлөв"
                        {...register("Status")}
                        margin="dense"
                        error={errors.Status?.message}
                        helperText={errors.Status?.message}
                    />
                </Grid>
                <Grid item xs={6}>
                    <TextField
                        size="small"
                        fullWidth
                        multiline
                        rows={3}
                        id="Description"
                        label="Тайлбар"
                        {...register("Description")}
                        margin="dense"
                        error={errors.Description?.message}
                        helperText={errors.Description?.message}
                    />
                </Grid>

                <Grid item xs={6}>
                    <TextField
                        size="small"
                        fullWidth
                        id="Room"
                        label="Өрөө"
                        {...register("Room")}
                        margin="dense"
                        error={errors.Room?.message}
                        helperText={errors.Room?.message}
                    />
                </Grid>
                <Grid item xs={6}>
                    <TextField
                        size="small"
                        fullWidth
                        id="AssignedTo"
                        label="Оноогдсон"
                        {...register("AssignedTo")}
                        margin="dense"
                        error={errors.AssignedTo?.message}
                        helperText={errors.AssignedTo?.message}
                    />
                </Grid>
                <Grid item xs={6}>
                    <TextField
                        size="small"
                        fullWidth
                        id="DeadLine"
                        label="Сүүлийн хугацаа"
                        {...register("DeadLine")}
                        margin="dense"
                        error={errors.DeadLine?.message}
                        helperText={errors.DeadLine?.message}
                    />
                </Grid>
            </Grid>
            <FormControlLabel
                control={
                    <Controller
                        name="RoomBlock"
                        control={control}
                        render={(props: any) => (
                            <Checkbox
                                {...register("RoomBlock")}
                                checked={props.field.value}
                                onChange={(e) =>
                                    props.field.onChange(e.target.checked)
                                }
                            />
                        )}
                    />
                }
                label="Өрөө блоклох"
            />
        </NewEditForm>
    );
};

export default NewEdit;
