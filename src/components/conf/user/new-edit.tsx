import { Controller, useForm } from "react-hook-form";
import { FormControlLabel, TextField, Grid } from "@mui/material";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useState, useEffect } from "react";
import { useIntl } from "react-intl";
import NewEditForm from "components/common/new-edit-form";
import { UserAPI, listUrl } from "lib/api/user";
import { useAppState } from "lib/context/app";
import LanguageSelect from "components/select/language";
import UserRoleSelect from "components/select/user-role";
import UserRolePrivilegeSelect from "components/select/user-role-privilege";
import { GetPrivilegesByUserSWR } from "lib/api/user";

const validationSchema = yup.object().shape({
    UserName: yup.string().required("Бөглөнө үү"),
    LoginName: yup.string().required("Бөглөнө үү"),
    UserRoleID: yup.number().required("Бөглөнө үү").typeError("Бөглөнө үү"),
    Language: yup.string().required("Бөглөнө үү"),
    Email: yup.string().email().required("Бөглөнө үү"),
    // Password: yup.string().required("Бөглөнө үү"),
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
    const [entity, setEntity]: any = useState(null);
    const [editValue, setEditValue]: any = useState(null);

    const [userID, setUserID]: any = useState(
        state.editId ? state.editId : null
    );
    const { data: privilegeData, error: privilegeerror } =
        GetPrivilegesByUserSWR({ UserID: state.editId });

    useEffect(() => {
        if (editValue && editValue.UserRoleID) {
            setEntity({
                ...entity,
                ["UserRoleID"]: Number(editValue.UserRoleID),
            });
        }
    }, [editValue]);

    useEffect(() => {
        if (editValue) {
            if (entity.UserRoleID != editValue.UserRoleID) setUserID(null);
        }
    }, [entity]);

    const customSubmit = async (values: any) => {
        try {
            let privileges: any = [];

            if (privilegeData) {
                privilegeData.forEach((privilege: any, indexprivilege: any) => {
                    privileges.push({
                        ActionID: privilege.ActionID,
                        Status:
                            values.ActionID.filter(
                                (word: any) => word == privilege.ActionID
                            ).length == 0
                                ? false
                                : true,
                    });

                    // if(values.ActionID.filter((word: any) => word == privilege.ActionID).length == 0){

                    // }
                });

                // if (values.ActionID) {
                //     values.ActionID.forEach((detail: any, index: any) => {
                //         privileges.push({ ActionID: detail, Status: true });
                //     });
                // }
            }

            delete values.ActionID;
            let response: any;
            if (state.editId) {
                response = await UserAPI.update(values);
            } else {
                response = await UserAPI.new(values);
            }

            if (
                response &&
                response.data &&
                response.data.JsonData &&
                response.data.JsonData[0] &&
                response.data.JsonData[0].UserID
            ) {
                await UserAPI.savePrivileges({
                    UserID: response.data.JsonData[0].UserID,
                    Privileges: privileges,
                });
            } else if (state.editId) {
                await UserAPI.savePrivileges({
                    UserID: state.editId,
                    Privileges: privileges,
                });
            }
        } finally {
        }
    };

    return (
        <NewEditForm
            api={UserAPI}
            listUrl={listUrl}
            additionalValues={{
                UserID: state.editId,
                UsersType: 1,
            }}
            reset={reset}
            handleSubmit={handleSubmit}
            customSubmit={customSubmit}
            setEntity={setEditValue}
        >
            <Grid container spacing={1}>
                <Grid item xs={6}>
                    <TextField
                        size="small"
                        fullWidth
                        id="RowHeaderUserName"
                        label={intl.formatMessage({id:"RowHeaderUserName"}) }
                        {...register("RowHeaderUserName")}
                        margin="dense"
                        error={errors.UserName?.message}
                        helperText={errors.UserName?.message}
                    />
                </Grid>
                <Grid item xs={6}>
                    <TextField
                        size="small"
                        fullWidth
                        id="TextLoginName"
                        label={intl.formatMessage({id:"TextLoginName"}) }
                        {...register("TextLoginName")}
                        margin="dense"
                        error={errors.LoginName?.message}
                        helperText={errors.LoginName?.message}
                    />
                </Grid>

                <Grid item xs={6}>
                    <LanguageSelect register={register} errors={errors} />
                </Grid>
                <Grid item xs={6}>
                    <TextField
                        size="small"
                        fullWidth
                        id="TextEmail"
                        label={intl.formatMessage({id:"TextEmail"}) }
                        {...register("TextEmail")}
                        margin="dense"
                        error={errors.Email?.message}
                        helperText={errors.Email?.message}
                    />
                </Grid>
                <Grid item xs={6}>
                    <UserRoleSelect
                        register={register}
                        errors={errors}
                        field="UserRoleID"
                        entity={entity}
                        setEntity={setEntity}
                    />
                </Grid>
                {/* <Grid item xs={6}>
                    <TextField
                        size="small"
                        type="password"
                        fullWidth
                        id="Password"
                        label="Нууц үг"
                        {...register("Password")}
                        margin="dense"
                        error={errors.Password?.message}
                        helperText={errors.Password?.message}
                    />
                </Grid> */}
            </Grid>

            {entity && (
                <>
                    <UserRolePrivilegeSelect
                        register={register}
                        errors={errors}
                        type={1}
                        title="Front Office"
                        UserRoleID={
                            entity && entity.UserRoleID && entity.UserRoleID > 0
                                ? entity.UserRoleID
                                : state.editId
                        }
                        UserID={userID}
                    />

                    <UserRolePrivilegeSelect
                        register={register}
                        errors={errors}
                        type={2}
                        title="Configuration"
                        UserRoleID={
                            entity && entity.UserRoleID && entity.UserRoleID > 0
                                ? entity.UserRoleID
                                : state.editId
                        }
                        UserID={userID}
                    />
                    <UserRolePrivilegeSelect
                        register={register}
                        errors={errors}
                        type={3}
                        title="Reports"
                        UserRoleID={
                            entity && entity.UserRoleID && entity.UserRoleID > 0
                                ? entity.UserRoleID
                                : state.editId
                        }
                        UserID={userID}
                    />
                </>
            )}
        </NewEditForm>
    );
};

export default NewEdit;
