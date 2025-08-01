import { Controller, useForm } from "react-hook-form";
import { FormControlLabel, TextField, Grid } from "@mui/material";
import Checkbox from "@mui/material/Checkbox";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useIntl } from "react-intl";
import NewEditForm from "components/common/new-edit-form";
import { VipStatusAPI, listUrl } from "lib/api/vip-status";
import { useAppState } from "lib/context/app";

const validationSchema = yup.object().shape({
    VipStatusName: yup.string().required("Бөглөнө үү"),
    VipStatusDescription: yup.string().required("Бөглөнө үү"),
    ShowWarning: yup.boolean(),
});

const NewEdit = () => {
    const intl = useIntl();
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
            api={VipStatusAPI}
            listUrl={listUrl}
            additionalValues={{
                VipStatusID: state.editId,
            }}
            reset={reset}
            handleSubmit={handleSubmit}
        >
            <Grid container spacing={1}>
                <Grid item xs={6}>
                    <TextField
                        size="small"
                        fullWidth
                        id="VipStatusName"
                        label={intl.formatMessage({id:"TextVipStatusName"}) }
                        {...register("VipStatusName")}
                        margin="dense"
                        error={!!errors.VipStatusName?.message}
                        helperText={errors.VipStatusName?.message as string}
                    />
                </Grid>
                <Grid item xs={6}>
                    <TextField
                        size="small"
                        fullWidth
                        id="VipStatusDescription"
                        label={intl.formatMessage({id:"VipStatusDescription"}) }
                        {...register("VipStatusDescription")}
                        margin="dense"
                        error={!!errors.VipStatusDescription?.message}
                        helperText={errors.VipStatusDescription?.message as string}
                    />
                </Grid>
            </Grid>
            <FormControlLabel
                control={
                    <Controller
                        name="ShowWarning"
                        control={control}
                        render={(props: any) => (
                            <Checkbox
                                {...register("ShowWarning")}
                                checked={props.field.value}
                                onChange={(e) =>
                                    props.field.onChange(e.target.checked)
                                }
                            />
                        )}
                    />
                }
                label={intl.formatMessage({id:"ShowWarning"}) }

            />
        </NewEditForm>
    );
};

export default NewEdit;
