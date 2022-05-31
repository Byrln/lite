import { useForm } from "react-hook-form";
import { TextField } from "@mui/material";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

import NewEditForm from "components/common/new-edit-form";
import { RoomAPI, listUrl } from "lib/api/room";
import RoomTypeSelect from "components/select/room-type";
import FloorSelect from "components/select/floor";
import { useAppState } from "lib/context/app";

const validationSchema = yup.object().shape({
    RoomNo: yup.string().required("Бөглөнө үү"),
    RoomTypeID: yup.number().required("Бөглөнө үү").typeError("Бөглөнө үү"),
    FloorID: yup.number().required("Бөглөнө үү").typeError("Бөглөнө үү"),
    RoomPhone: yup.string().required("Бөглөнө үү"),
    Description: yup.string().required("Бөглөнө үү"),
    SortOrder: yup.number().required("Бөглөнө үү").typeError("Бөглөнө үү"),
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
            api={RoomAPI}
            listUrl={listUrl}
            additionalValues={{ RoomID: state.editId }}
            reset={reset}
            handleSubmit={handleSubmit}
        >
            <TextField
                size="small"
                fullWidth
                id="RoomNo"
                label="Өрөөний дугаар"
                {...register("RoomNo")}
                margin="dense"
                error={errors.RoomNo?.message}
                helperText={errors.RoomNo?.message}
            />

            <RoomTypeSelect register={register} errors={errors} />

            <FloorSelect register={register} errors={errors} />

            <TextField
                size="small"
                fullWidth
                id="RoomPhone"
                label="Өрөөний утас"
                {...register("RoomPhone")}
                margin="dense"
                error={errors.RoomPhone?.message}
                helperText={errors.RoomPhone?.message}
            />

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

            <TextField
                size="small"
                type="number"
                fullWidth
                id="SortOrder"
                label="Дараалал"
                {...register("SortOrder")}
                margin="dense"
                error={errors.SortOrder?.message}
                helperText={errors.SortOrder?.message}
            />
        </NewEditForm>
    );
};

export default NewEdit;
