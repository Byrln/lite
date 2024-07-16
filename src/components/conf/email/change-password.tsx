import { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { TextField, Grid, Box } from "@mui/material";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-toastify";
import { useIntl } from "react-intl";
import { EmailAPI } from "lib/api/email-conf";
import SubmitButton from "components/common/submit-button";
import { ModalContext } from "lib/context/modal";

const validationSchema = yup.object().shape({
    OldPassword: yup.string().required("Бөглөнө үү"),
    NewPassword: yup.string().required("Бөглөнө үү"),
    NewPasswordConfirmation: yup
        .string()
        .required("Бөглөнө үү")
        .oneOf([yup.ref("NewPassword"), null], "Passwords must match"),
});

const ChangePassword = ({ id }: any) => {
    const intl = useIntl();
    const { handleModal }: any = useContext(ModalContext);
    const [loading, setLoading] = useState(false);
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({ resolver: yupResolver(validationSchema) });

    const onSubmit = async (values: any) => {
        setLoading(true);

        try {
            values = Object.assign(values, { EmailID: id });

            await EmailAPI.changePassword(values);

            handleModal();
            toast("Амжилттай.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={1}>
                <Grid item xs={6}>
                    <TextField
                        size="small"
                        type="password"
                        fullWidth
                        id="OldPassword"
                        label={intl.formatMessage({id:"TextOldPassword"}) }
                        {...register("OldPassword")}
                        margin="dense"
                        error={errors.OldPassword?.message}
                        helperText={errors.OldPassword?.message}
                    />
                </Grid>
                <Grid item xs={6}>
                    <TextField
                        size="small"
                        type="password"
                        fullWidth
                        id="NewPassword"
                        label={intl.formatMessage({id:"TextNewPassword"}) }
                        {...register("NewPassword")}
                        margin="dense"
                        error={errors.NewPassword?.message}
                        helperText={errors.NewPassword?.message}
                    />
                </Grid>
                <Grid item xs={6}>
                    <TextField
                        size="small"
                        type="password"
                        fullWidth
                        id="NewPasswordConfirmation"
                        label={intl.formatMessage({id:"TextConfirmNewPassword"}) }
                        {...register("NewPasswordConfirmation")}
                        margin="dense"
                        error={errors.NewPasswordConfirmation?.message}
                        helperText={errors.NewPasswordConfirmation?.message}
                    />
                </Grid>
            </Grid>
            <Box sx={{ width: "15%" }}>
                <SubmitButton loading={loading} />
            </Box>
        </form>
    );
};

export default ChangePassword;
