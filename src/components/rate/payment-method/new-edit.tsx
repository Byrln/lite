import { useForm } from "react-hook-form";
import { TextField, Grid } from "@mui/material";
import DesktopDatePicker from "@mui/lab/DesktopDatePicker";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useIntl } from "react-intl";
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
    const intl = useIntl();
    const [state]: any = useAppState();
    const {
        register,
        reset,
        handleSubmit,
        formState: { errors },
    } = useForm<any>({
        defaultValues: { PaymentMethodGroupID: 1 },
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
            <Grid container spacing={1}>
                <Grid item xs={12}>
                    <PaymentMethodGroupSelect
                        register={register}
                        errors={errors}
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        size="small"
                        fullWidth
                        id="PaymentMethodName"
                        label={intl.formatMessage({ id: "RowHeaderFirstName" })}
                        {...register("PaymentMethodName")}
                        margin="dense"
                        error={errors.PaymentMethodName?.message}
                        helperText={errors.PaymentMethodName?.message}
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        size="small"
                        type="number"
                        fullWidth
                        id="SortOrder"
                        label={intl.formatMessage({ id: "SortOrder" })}
                        {...register("SortOrder")}
                        defaultValue={1}
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
