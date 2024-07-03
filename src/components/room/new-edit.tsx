import { useForm } from "react-hook-form";
import { TextField, Grid } from "@mui/material";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";
import { useIntl } from "react-intl";
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

    const intl = useIntl();
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
                <Grid item xs={4}>
                    <TextField
                        size="small"
                        fullWidth
                        id="TextRoomNo"
                        label={intl.formatMessage({id:"TextRoomNo"}) }
                        {...register("TextRoomNo")}
                        margin="dense"
                        error={errors.RoomNo?.message}
                        helperText={errors.RoomNo?.message}
                    />
                </Grid>
                <Grid item xs={4}>
                    <RoomTypeSelect
                        register={register}
                        errors={errors}
                        baseStay={baseStay}
                        onRoomTypeChange={onRoomTypeChange}
                    />
                </Grid>
                <Grid item xs={4}>
                    <FloorSelect register={register} errors={errors} />
                </Grid>
                <Grid item xs={4}>
                    <TextField
                        size="small"
                        fullWidth
                        id="TextRoomPhone"
                        label={intl.formatMessage({id:"TextRoomPhone"}) }
                        {...register("TextRoomPhone")}
                        margin="dense"
                        error={errors.RoomPhone?.message}
                        helperText={errors.RoomPhone?.message}
                    />
                </Grid>
                <Grid item xs={4}>
                    <TextField
                        size="small"
                        fullWidth
                        id="RowHeaderDescription"
                        label={intl.formatMessage({id:"RowHeaderDescription"}) }
                        {...register("RowHeaderDescription")}
                        margin="dense"
                        error={errors.Description?.message}
                        helperText={errors.Description?.message}
                    />
                </Grid>
                <Grid item xs={4}>
                    <TextField
                        size="small"
                        type="number"
                        fullWidth
                        id="SortOrder"
                        label={intl.formatMessage({id:"SortOrder"}) }
                        {...register("SortOrder")}
                        margin="dense"
                        error={errors.SortOrder?.message}
                        helperText={errors.SortOrder?.message}
                    />
                </Grid>
            </Grid>
        </NewEditForm>
    );
};

export default NewEdit;
