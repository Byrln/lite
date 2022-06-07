import { Controller, useForm } from "react-hook-form";
import { FormControlLabel, TextField } from "@mui/material";
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
    RoomChargeTypeRate: yup
        .number()
        .required("Бөглөнө үү")
        .typeError("Бөглөнө үү"),
    SortOrder: yup.number().required("Бөглөнө үү").typeError("Бөглөнө үү"),
    IsEditable: yup.boolean(),
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
                IsRoomCharge={null}
                IsExtraCharge={true}
                IsMiniBar={false}
                IsDiscount={null}
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

            <FormControlLabel
                control={
                    <Controller
                        name="IsEditable"
                        control={control}
                        render={(props: any) => (
                            <Checkbox
                                {...register("IsEditable")}
                                checked={props.field.value}
                                onChange={(e) =>
                                    props.field.onChange(e.target.checked)
                                }
                            />
                        )}
                    />
                }
                label="Үнийн дүнг засах боломжтой эсэх"
            />
        </NewEditForm>
    );
};

export default NewEdit;
