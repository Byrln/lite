import { useState } from "react";
import { useForm } from "react-hook-form";
import { TextField, Grid } from "@mui/material";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useIntl } from "react-intl";
import NewEditForm from "components/common/new-edit-form";
import { UserRoleAPI, listUrl } from "lib/api/user-role";
import { useAppState } from "lib/context/app";
import UserRoleSelect from "components/select/user-role";
import UserRolePrivilegeSelect from "components/select/user-role-privilege";

const validationSchema = yup.object().shape({
    UserRoleShortName: yup.string().required("Бөглөнө үү"),
    UserRoleName: yup.string().required("Бөглөнө үү"),
    Description: yup.string().required("Бөглөнө үү"),
    ParentID: yup.lazy((value) =>
        value === "" ? yup.string() : yup.number().typeError("Бөглөнө үү")
    ),
});

const NewEdit = () => {
    const intl = useIntl();
    const [entity, setEntity]: any = useState(null);
    const [state]: any = useAppState();
    const {
        register,
        reset,
        handleSubmit,
        formState: { errors },
    } = useForm({ resolver: yupResolver(validationSchema) });
    return (
        <NewEditForm
            api={UserRoleAPI}
            listUrl={listUrl}
            additionalValues={{
                UserRoleID: state.editId,
            }}
            reset={reset}
            handleSubmit={handleSubmit}
            setEntity={setEntity}
        >
            <Grid container spacing={1}>
                <Grid item xs={6}>
                    <TextField
                        size="small"
                        fullWidth
                        id="UserRoleShortName"
                        label={intl.formatMessage({id:"RowHeaderShortCode"}) }
                        {...register("UserRoleShortName")}
                        margin="dense"
                        error={!!errors.UserRoleShortName?.message}
                        helperText={errors.UserRoleShortName?.message as string}
                    />
                </Grid>
                <Grid item xs={6}>
                    <TextField
                        size="small"
                        fullWidth
                        id="UserRoleName"
                        label={intl.formatMessage({id:"ConfigUserRole"}) }
                        {...register("UserRoleName")}
                        margin="dense"
                        error={!!errors.UserRoleName?.message}
                        helperText={errors.UserRoleName?.message as string}
                    />
                </Grid>
                <Grid item xs={6}>
                    <TextField
                        size="small"
                        fullWidth
                        multiline
                        rows={3}
                        id="Description"
                        label={intl.formatMessage({id:"RowHeaderDescription"}) }
                        {...register("Description")}
                        margin="dense"
                        error={!!errors.Description?.message}
                        helperText={errors.Description?.message as string}
                    />
                </Grid>
                <Grid item xs={6}>
                    <UserRoleSelect
                        register={register}
                        errors={errors}
                        field="ParentID"
                        entity={entity}
                        setEntity={setEntity}
                    />
                </Grid>
            </Grid>

            {entity && (
                <>
                    <UserRolePrivilegeSelect
                        register={register}
                        errors={errors}
                        type={1}
                        title="Front Office"
                        UserRoleID={
                            entity && entity.ParentID && entity.ParentID > 0
                                ? entity.ParentID
                                : state.editId
                        }
                    />

                    <UserRolePrivilegeSelect
                        register={register}
                        errors={errors}
                        type={2}
                        title="Configuration"
                        UserRoleID={
                            entity && entity.ParentID && entity.ParentID > 0
                                ? entity.ParentID
                                : state.editId
                        }
                    />
                    <UserRolePrivilegeSelect
                        register={register}
                        errors={errors}
                        type={3}
                        title="Reports"
                        UserRoleID={
                            entity && entity.ParentID && entity.ParentID > 0
                                ? entity.ParentID
                                : state.editId
                        }
                    />
                </>
            )}
        </NewEditForm>
    );
};

export default NewEdit;
