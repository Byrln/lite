import { useForm } from "react-hook-form";
import { TextField } from "@mui/material";
import InputLabel from "@mui/material/InputLabel";
import Checkbox from "@mui/material/Checkbox";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

import NewEditForm from "components/common/new-edit-form";
import { ChargeTypeAPI, listUrl } from "lib/api/charge-type";
import ChargeTypeGroupSelect from "components/select/charge-type-group";

const NewEdit = ({ entity }: any) => {
    const validationSchema = yup.object().shape({
        RoomChargeTypeGroupID: yup.number().required("Бөглөнө үү"),
        RoomChargeTypeName: yup.string().required("Бөглөнө үү"),
        RoomChargeTypeNameCustom: yup.string().required("Бөглөнө үү"),
        RoomChargeTypeRate: yup.number().required("Бөглөнө үү"),
        SortOrder: yup.number().required("Бөглөнө үү"),
        PosApiServiceCode: yup.string().required("Бөглөнө үү"),
    });
    const formOptions = { resolver: yupResolver(validationSchema) };

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm(formOptions);

    return (
        <NewEditForm
            api={ChargeTypeAPI}
            entity={entity}
            listUrl={listUrl}
            handleSubmit={handleSubmit}
            additionalValues={{ IsInclusion: false }}
        >
            <ChargeTypeGroupSelect
                register={register}
                errors={errors}
                listType="extraCharge"
            />

            <TextField
                fullWidth
                id="RoomChargeTypeName"
                label="Нэр"
                {...register("RoomChargeTypeName")}
                margin="dense"
                error={errors.RoomChargeTypeName?.message}
                helperText={errors.RoomChargeTypeName?.message}
            />

            <TextField
                fullWidth
                id="RoomChargeTypeNameCustom"
                label="Кустом нэр"
                {...register("RoomChargeTypeNameCustom")}
                margin="dense"
                error={errors.RoomChargeTypeNameCustom?.message}
                helperText={errors.RoomChargeTypeNameCustom?.message}
            />

            <TextField
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
                type="number"
                fullWidth
                id="SortOrder"
                label="Дараалал"
                {...register("SortOrder")}
                margin="dense"
                error={errors.SortOrder?.message}
                helperText={errors.SortOrder?.message}
            />

            <InputLabel htmlFor="my-input" className="mt-3">
                Үнийн дүнг засах боломжтой эсэх
            </InputLabel>
            <Checkbox {...register("IsEditable")} />

            <TextField
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
