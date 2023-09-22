import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { FormControlLabel, TextField, Grid } from "@mui/material";
import Checkbox from "@mui/material/Checkbox";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

import NewEditForm from "components/common/new-edit-form";
import { NotificationAPI, listUrl } from "lib/api/notification";
import { useAppState } from "lib/context/app";
import NotificationTypeSelect from "components/select/notification-type";
import NotificationUserItemSelect from "components/select/notification-user-item";
import CustomSelect from "components/common/custom-select";
import { notificationType } from "lib/utils/helpers";

const validationSchema = yup.object().shape({
    NotificationTypeID: yup.string().required("Бөглөнө үү"),
    UserTypeID: yup.string().required("Бөглөнө үү"),
    ItemID: yup.string().required("Бөглөнө үү"),
});

const notifType = notificationType();

const NewEdit = () => {
    const [entity, setEntity]: any = useState(null);
    const [notificationTypeID, setNotificationTypeID]: any = useState(0);
    const [userTypeID, setUserTypeID]: any = useState(null);

    console.log("notificationTypeID", notificationTypeID);
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
            api={NotificationAPI}
            listUrl={listUrl}
            // additionalValues={{
            //     NotificationID: state.editId,
            // }}
            reset={reset}
            handleSubmit={handleSubmit}
        >
            <Grid container spacing={1}>
                <Grid item xs={6}>
                    <NotificationTypeSelect
                        register={register}
                        errors={errors}
                        entity={entity}
                        setEntity={setEntity}
                        setNotificationTypeID={setNotificationTypeID}
                    />
                </Grid>

                <Grid item xs={6}>
                    <CustomSelect
                        register={register}
                        errors={errors}
                        field="UserTypeID"
                        label="Type"
                        options={notifType}
                        optionValue="value"
                        optionLabel="name"
                        onChange={setUserTypeID}
                    />
                </Grid>

                {userTypeID ? (
                    <Grid item xs={6}>
                        <NotificationUserItemSelect
                            register={register}
                            errors={errors}
                            field="ItemID"
                            UserTypeID={userTypeID}
                        />
                    </Grid>
                ) : (
                    ""
                )}
            </Grid>
        </NewEditForm>
    );
};

export default NewEdit;
