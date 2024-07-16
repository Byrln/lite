import { useForm } from "react-hook-form";
import { TextField } from "@mui/material";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Grid } from "@mui/material";
import { useIntl } from "react-intl";
import NewEditForm from "components/common/new-edit-form";
import { ReasonAPI, listUrl } from "lib/api/reason";
import { useAppState } from "lib/context/app";
import ReasonTypeSelect from "components/select/reason-type";

const validationSchema = yup.object().shape({
    ReasonTypeID: yup.number().required("Бөглөнө үү").typeError("Бөглөнө үү"),
    Description: yup.string().required("Бөглөнө үү"),
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
            api={ReasonAPI}
            listUrl={listUrl}
            additionalValues={{
                ReasonID: state.editId,
            }}
            reset={reset}
            handleSubmit={handleSubmit}
        >
            <Grid container spacing={1}>
                <Grid item xs={6}>
                    <ReasonTypeSelect
                        register={register}
                        errors={errors}
                        id="TextType"
                        label={intl.formatMessage({id:"TextType"}) }
                        {...register("TextType")}
                        ReasonTypeID={1}
                    />
                </Grid>
                <Grid item xs={6}>
                    <TextField
                        size="small"
                        fullWidth
                        id="Description"
                        label={intl.formatMessage({id:"RowHeaderReason"}) }
                        {...register("Description")}
                        margin="dense"
                        error={errors.Description?.message}
                        helperText={errors.Description?.message}
                    />
                </Grid>
            </Grid>
        </NewEditForm>
    );
};
export default NewEdit;
