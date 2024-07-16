import { useForm } from "react-hook-form";
import { TextField } from "@mui/material";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useIntl } from "react-intl";
import NewEditForm from "components/common/new-edit-form";
import { ChargeTypeGroupAPI, listUrl } from "lib/api/charge-type-group";
import { useAppState } from "lib/context/app";

const validationSchema = yup.object().shape({
    RoomChargeTypeGroupName: yup.string().required("Бөглөнө үү"),
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
    } = useForm({ resolver: yupResolver(validationSchema) });

    return (
        <NewEditForm
            api={ChargeTypeGroupAPI}
            listUrl={listUrl}
            additionalValues={{
                RoomChargeTypeGroupID: state.editId,
                IsRoomCharge: false,
                IsExtraCharge: true,
                IsMiniBar: true,
                IsDiscount: false,
            }}
            getAdditionalValues={{
                IsRoomCharge: false,
                IsExtraCharge: true,
                IsMiniBar: true,
                IsDiscount: false,
            }}
            reset={reset}
            handleSubmit={handleSubmit}
        >
            <TextField
                size="small"
                fullWidth
                id="RoomChargeTypeGroupName"
                        label={intl.formatMessage({id:"RowHeaderGroupName"}) }
                        {...register("RoomChargeTypeGroupName")}
                margin="dense"
                error={errors.RoomChargeTypeGroupName?.message}
                helperText={errors.RoomChargeTypeGroupName?.message}
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
