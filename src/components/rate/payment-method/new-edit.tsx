import { useForm } from "react-hook-form";
import { TextField } from "@mui/material";
import DesktopDatePicker from "@mui/lab/DesktopDatePicker";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

import NewEditForm from "components/common/new-edit-form";
import { PaymentMethodAPI, listUrl } from "lib/api/payment-method";
import PaymentMethodGroupSelect from "components/select/payment-method-group";

const NewEdit = ({ entity }: any) => {
    const validationSchema = yup.object().shape({
        PaymentMethodGroupID: yup.number().required("Бөглөнө үү"),
        PaymentMethodName: yup.string().required("Бөглөнө үү"),
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
            api={PaymentMethodAPI}
            entity={entity}
            listUrl={listUrl}
            handleSubmit={handleSubmit}
        >
            <PaymentMethodGroupSelect register={register} errors={errors} />

            <TextField
                fullWidth
                id="PaymentMethodName"
                label="Нэр"
                {...register("PaymentMethodName")}
                margin="dense"
                error={errors.PaymentMethodName?.message}
                helperText={errors.PaymentMethodName?.message}
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
