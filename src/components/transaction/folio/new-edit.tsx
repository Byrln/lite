import { useForm } from "react-hook-form";
import { TextField, Grid } from "@mui/material";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";
import Checkbox from "@mui/material/Checkbox";

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

const baseStayDefault = {
    TransactionID: 0,
};

const NewEdit = () => {
    const [baseStay, setBaseStay]: any = useState(baseStayDefault);

    const onRoomTypeChange = (rt: any) => {
        setBaseStay({
            ...baseStay,
            RoomTypeID: rt,
        });
    };

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
            setEntity={setBaseStay}
        >
            <Grid container spacing={1}>
                <Grid item xs={4}></Grid>
                <Grid item xs={4}>
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
                </Grid>
            </Grid>
        </NewEditForm>
    );
};

export default NewEdit;
