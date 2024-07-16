import { useForm } from "react-hook-form";
import { TextField, Grid } from "@mui/material";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useIntl } from "react-intl";
import NewEditForm from "components/common/new-edit-form";
import { EmailAPI, listUrl } from "lib/api/email-conf";
import { useAppState } from "lib/context/app";

const validationSchema = yup.object().shape({
    Email: yup.string().email("Зөв имэйл оруулна уу").required("Бөглөнө үү"),
    EmailHost: yup.string().required("Бөглөнө үү"),
    Port: yup.number().required("Бөглөнө үү").typeError("Бөглөнө үү"),
    UserName: yup.string().required("Бөглөнө үү"),
    Password: yup.string().required("Бөглөнө үү"),
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
            api={EmailAPI}
            listUrl={listUrl}
            additionalValues={{
                EmailID: state.editId,
            }}
            reset={reset}
            handleSubmit={handleSubmit}
        >
            <Grid container spacing={1}>
                <Grid item xs={6}>
                    <TextField
                        size="small"
                        fullWidth
                        id="Email"
                        label={intl.formatMessage({id:"ReportEmail"}) }
                        {...register("Email")}
                        margin="dense"
                        error={errors.Email?.message}
                        helperText={errors.Email?.message}
                    />
                </Grid>
                <Grid item xs={6}>
                    <TextField
                        size="small"
                        fullWidth
                        id="EmailHost"
                        label={intl.formatMessage({id:"RowHeaderEmailServer"}) }
                        {...register("EmailHost")}
                        margin="dense"
                        error={errors.EmailHost?.message}
                        helperText={errors.EmailHost?.message}
                    />
                </Grid>
                <Grid item xs={6}>
                    <TextField
                        size="small"
                        type="number"
                        fullWidth
                        id="Port"
                        label={intl.formatMessage({id:"RowHeaderPort"}) }
                        {...register("Port")}
                        margin="dense"
                        error={errors.Port?.message}
                        helperText={errors.Port?.message}
                    />
                </Grid>
                <Grid item xs={6}>
                    <TextField
                        size="small"
                        fullWidth
                        id="UserName"
                        label={intl.formatMessage({id:"RowHeaderUserName"}) }
                        {...register("UserName")}
                        margin="dense"
                        error={errors.UserName?.message}
                        helperText={errors.UserName?.message}
                    />
                </Grid>
                <Grid item xs={6}>
                    {!state.editId && (
                        <TextField
                            size="small"
                            fullWidth
                            id="Password"
                            label={intl.formatMessage({id:"TextPassword"}) }
                            {...register("Password")}
                            type="password"
                            margin="dense"
                            error={errors.Password?.message}
                            helperText={errors.Password?.message}
                        />
                    )}
                </Grid>
            </Grid>
        </NewEditForm>
    );
};

export default NewEdit;
