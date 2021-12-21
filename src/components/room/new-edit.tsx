import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { TextField } from "@mui/material";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

import NewEditForm from "components/common/new-edit-form";
import { RoomAPI, listUrl } from "lib/api/room";
import RoomTypeSelect from "components/select/room-type";
import FloorSelect from "components/select/floor";

const NewEdit = ({ rowId }: any) => {
    const [entity, setEntity]: any = useState(null);

    useEffect(() => {
        if (rowId) {
            const fetchDatas = async () => {
                const entity: any = await RoomAPI.get(rowId);

                setEntity(entity);
            };

            fetchDatas();
        }
    }, [rowId]);

    const validationSchema = yup.object().shape({
        RoomNo: yup.string().required("Бөглөнө үү"),
        RoomTypeID: yup.number().required("Бөглөнө үү"),
        FloorID: yup.number().required("Бөглөнө үү"),
        RoomPhone: yup.string().required("Бөглөнө үү"),
        Description: yup.string().required("Бөглөнө үү"),
        SortOrder: yup.number().required("Бөглөнө үү"),
    });
    const formOptions = { resolver: yupResolver(validationSchema) };

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm(formOptions);

    return (
        <NewEditForm
            api={RoomAPI}
            entity={entity}
            listUrl={listUrl}
            handleSubmit={handleSubmit}
        >
            <TextField
                fullWidth
                id="RoomNo"
                label="Өрөөний дугаар"
                {...register("RoomNo")}
                margin="dense"
                error={errors.RoomNo?.message}
                helperText={errors.RoomNo?.message}
                value={entity && entity[0].RoomNo}
            />

            <RoomTypeSelect register={register} errors={errors} />

            <FloorSelect register={register} errors={errors} />

            <TextField
                fullWidth
                id="RoomPhone"
                label="Өрөөний утас"
                {...register("RoomPhone")}
                margin="dense"
                error={errors.RoomPhone?.message}
                helperText={errors.RoomPhone?.message}
            />

            <TextField
                fullWidth
                id="Description"
                label="Тайлбар"
                {...register("Description")}
                margin="dense"
                error={errors.Description?.message}
                helperText={errors.Description?.message}
            />

            <TextField
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
