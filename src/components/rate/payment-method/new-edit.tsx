import { useForm } from "react-hook-form";
import { TextField } from "@mui/material";
import DesktopDatePicker from "@mui/lab/DesktopDatePicker";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

import NewEditForm from "components/common/new-edit-form";
import { PaymentMethodAPI, listUrl } from "lib/api/payment-method";
import PaymentMethodGroupSelect from "components/select/payment-method-group";
import { useAppState } from "lib/context/app";

const validationSchema = yup.object().shape({
    PaymentMethodGroupID: yup
        .number()
        .required("Бөглөнө үү")
        .typeError("Бөглөнө үү"),
    PaymentMethodName: yup.string().required("Бөглөнө үү"),
    SortOrder: yup.number().required("Бөглөнө үү").typeError("Бөглөнө үү"),
});

const NewEdit = ({ entity }: any) => {
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
            api={PaymentMethodAPI}
            listUrl={listUrl}
            additionalValues={{ PaymentMethodID: state.editId }}
            reset={reset}
            handleSubmit={handleSubmit}
        >
            <PaymentMethodGroupSelect register={register} errors={errors} />

            <TextField
                size="small"
                fullWidth
                id="PaymentMethodName"
                label="Нэр"
                {...register("PaymentMethodName")}
                margin="dense"
                error={errors.PaymentMethodName?.message}
                helperText={errors.PaymentMethodName?.message}
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
