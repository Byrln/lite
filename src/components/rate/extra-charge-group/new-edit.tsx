import { useForm } from "react-hook-form";
import { TextField } from "@mui/material";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

import NewEditForm from "components/common/new-edit-form";
import { ChargeTypeGroupAPI, listUrl } from "lib/api/charge-type-group";

const NewEdit = ({ entity }: any) => {
    const validationSchema = yup.object().shape({
        RoomChargeTypeGroupName: yup.string().required("Бөглөнө үү"),
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
            api={ChargeTypeGroupAPI}
            entity={entity}
            listUrl={listUrl}
            handleSubmit={handleSubmit}
            additionalValues={{
                IsRoomCharge: false,
                IsExtraCharge: true,
                IsMiniBar: false,
                IsDiscount: false,
            }}
        >
            <TextField
                fullWidth
                id="RoomChargeTypeGroupName"
                label="Бүлгийн нэр"
                {...register("RoomChargeTypeGroupName")}
                margin="dense"
                error={errors.RoomChargeTypeGroupName?.message}
                helperText={errors.RoomChargeTypeGroupName?.message}
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
