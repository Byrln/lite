import { useForm } from "react-hook-form";
import { FormControlLabel, FormGroup, TextField } from "@mui/material";
import Checkbox from "@mui/material/Checkbox";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

import NewEditForm from "components/common/new-edit-form";
import { ChargeTypeAPI, listUrl } from "lib/api/charge-type";
import ChargeTypeGroupSelect from "components/select/charge-type-group";
import { useAppState } from "lib/context/app";

const validationSchema = yup.object().shape({
    RoomChargeTypeGroupID: yup
        .number()
        .required("Бөглөнө үү")
        .typeError("Бөглөнө үү"),
    RoomChargeTypeName: yup.string().required("Бөглөнө үү"),
    RoomChargeTypeNameCustom: yup.string().required("Бөглөнө үү"),
    RoomChargeTypeRate: yup
        .number()
        .required("Бөглөнө үү")
        .typeError("Бөглөнө үү"),
    SortOrder: yup.number().required("Бөглөнө үү").typeError("Бөглөнө үү"),
    PosApiServiceCode: yup.string().required("Бөглөнө үү"),
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
            api={ChargeTypeAPI}
            listUrl={listUrl}
            additionalValues={{
                RoomChargeTypeID: state.editId,
                IsInclusion: false,
            }}
            reset={reset}
            handleSubmit={handleSubmit}
        >
            <ChargeTypeGroupSelect
                register={register}
                errors={errors}
                listType="extraCharge"
            />

            <TextField
                size="small"
                fullWidth
                id="RoomChargeTypeName"
                label="Нэр"
                {...register("RoomChargeTypeName")}
                margin="dense"
                error={errors.RoomChargeTypeName?.message}
                helperText={errors.RoomChargeTypeName?.message}
            />

            <TextField
                size="small"
                fullWidth
                id="RoomChargeTypeNameCustom"
                label="Кустом нэр"
                {...register("RoomChargeTypeNameCustom")}
                margin="dense"
                error={errors.RoomChargeTypeNameCustom?.message}
                helperText={errors.RoomChargeTypeNameCustom?.message}
            />

            <TextField
                size="small"
                type="number"
                fullWidth
                id="RoomChargeTypeRate"
                label="Үнийн дүн"
                {...register("RoomChargeTypeRate")}
                margin="dense"
                error={errors.RoomChargeTypeRate?.message}
                helperText={errors.RoomChargeTypeRate?.message}
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

            <FormGroup>
                <FormControlLabel
                    control={<Checkbox {...register("IsEditable")} />}
                    label="Үнийн дүнг засах боломжтой эсэх"
                    {...register("Booking")}
                />
            </FormGroup>

            <TextField
                size="small"
                fullWidth
                id="PosApiServiceCode"
                label="PosApiServiceCode"
                {...register("PosApiServiceCode")}
                margin="dense"
                error={errors.PosApiServiceCode?.message}
                helperText={errors.PosApiServiceCode?.message}
            />
        </NewEditForm>
    );
};

export default NewEdit;
