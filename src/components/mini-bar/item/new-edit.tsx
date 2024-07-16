import { useForm } from "react-hook-form";
import { TextField } from "@mui/material";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useIntl } from "react-intl";
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
});

const NewEdit = () => {
    const intl = useIntl();
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
            api={ChargeTypeAPI}
            listUrl={listUrl}
            additionalValues={{
                RoomChargeTypeID: state.editId,
                IsInclusion: false,
                IsEditable: true,
            }}
            getAdditionalValues={{
                IsInclusion: false,
                IsEditable: true,
            }}
            reset={reset}
            handleSubmit={handleSubmit}
        >
            <ChargeTypeGroupSelect
                register={register}
                errors={errors}
                IsRoomCharge={false}
                IsExtraCharge={true}
                IsMiniBar={true}
                IsDiscount={false}
            />

            <TextField
                size="small"
                fullWidth
                id="RoomChargeTypeName"
                        label={intl.formatMessage({id:"RowHeaderFirstName"}) }
                        {...register("RoomChargeTypeName")}
                margin="dense"
                error={errors.RoomChargeTypeName?.message}
                helperText={errors.RoomChargeTypeName?.message}
            />

            <TextField
                size="small"
                fullWidth
                id="RoomChargeTypeNameCustom"
                        label={intl.formatMessage({id:"RoomChargeTypeNameCustom"}) }
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
                label={intl.formatMessage({id:"RoomChargeTypeRate"}) }
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
                label={intl.formatMessage({id:"SortOrder"}) }
                {...register("SortOrder")}
                margin="dense"
                error={errors.SortOrder?.message}
                helperText={errors.SortOrder?.message}
            />
        </NewEditForm>
    );
};

export default NewEdit;
