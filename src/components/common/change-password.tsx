import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import {
    Link as MaterialLink,
    Stack,
    TextField,
    IconButton,
    InputAdornment,
    Snackbar,
    Alert,
} from "@mui/material";
import { useState, useEffect } from "react";
import { mutate } from "swr";
import { useIntl } from "react-intl";
import { Icon } from "@iconify/react";
import eyeFill from "@iconify/icons-eva/eye-fill";
import eyeOffFill from "@iconify/icons-eva/eye-off-fill";

import NewEditForm from "components/common/new-edit-form";
import { UserAPI } from "lib/api/user";
import { useAppState } from "lib/context/app";

const NewEdit = ({ handleModal }: any) => {
    const intl = useIntl();
    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);

    const validationSchema = yup.object().shape({
        Password: yup.string().required("Бөглөнө үү").typeError("Бөглөнө үү"),
        OldPassword: yup
            .string()
            .required("Бөглөнө үү")
            .typeError("Бөглөнө үү"),
    });

    const [state]: any = useAppState();
    const {
        register,
        reset,
        handleSubmit,
        formState: { errors },
    } = useForm({ resolver: yupResolver(validationSchema) });

    const handleShowOldPassword = () => {
        setShowOldPassword((show) => !show);
    };

    const handleShowCurrentPassword = () => {
        setShowCurrentPassword((show) => !show);
    };

    const customSubmit = async (values: any) => {
        try {
            console.log("values", values);

            const response = await UserAPI.changePassword(values);
            handleModal();
        } finally {
        }
    };

    return (
        <>
            <NewEditForm
                // api={ReasonAPI}
                // listUrl={detailExtUrl}
                reset={reset}
                handleSubmit={handleSubmit}
                customSubmit={customSubmit}
            >
                <TextField
                    fullWidth
                    autoComplete="OldPassword"
                    type={showOldPassword ? "text" : "password"}
                    label={intl.formatMessage({
                        id: "TextOldPassword",
                    })}
                    {...register("OldPassword")}
                    margin="dense"
                    size="small"
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton
                                    onClick={handleShowOldPassword}
                                    edge="end"
                                >
                                    <Icon
                                        icon={
                                            showOldPassword
                                                ? eyeFill
                                                : eyeOffFill
                                        }
                                    />
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                    error={errors?.OldPassword?.message}
                    helperText={errors?.OldPassword?.message}
                />
                <TextField
                    fullWidth
                    autoComplete="OldPassword"
                    type={showCurrentPassword ? "text" : "password"}
                    label={intl.formatMessage({
                        id: "TextNewPassword",
                    })}
                    {...register("Password")}
                    margin="dense"
                    size="small"
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton
                                    onClick={handleShowCurrentPassword}
                                    edge="end"
                                >
                                    <Icon
                                        icon={
                                            showCurrentPassword
                                                ? eyeFill
                                                : eyeOffFill
                                        }
                                    />
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                    error={errors?.Password?.message}
                    helperText={errors?.Password?.message}
                />
            </NewEditForm>
        </>
    );
};
export default NewEdit;
