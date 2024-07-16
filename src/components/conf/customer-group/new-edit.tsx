import { useForm } from "react-hook-form";
import { TextField } from "@mui/material";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useIntl } from "react-intl";
import NewEditForm from "components/common/new-edit-form";
import { CustomerGroupAPI, listUrl } from "lib/api/customer-group";
import { useAppState } from "lib/context/app";

const validationSchema = yup.object().shape({
    CustomerGroupName: yup.string().required("Бөглөнө үү"),
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
            api={CustomerGroupAPI}
            listUrl={listUrl}
            additionalValues={{
                CustomerGroupID: state.editId,
            }}
            reset={reset}
            handleSubmit={handleSubmit}
        >
            <TextField
                size="small"
                fullWidth
                id="CustomerGroupName"
                label={intl.formatMessage({id:"RowHeaderGroupName"}) }
                {...register("CustomerGroupName")}
                margin="dense"
                error={errors.CustomerGroupName?.message}
                helperText={errors.CustomerGroupName?.message}
            />
        </NewEditForm>
    );
};

export default NewEdit;
