import { Controller, useForm } from "react-hook-form";
import { FormControlLabel, TextField } from "@mui/material";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

import NewEditForm from "components/common/new-edit-form";
import { CompanyDatabaseAPI, listUrl } from "lib/api/company-database";
import { useAppState } from "lib/context/app";

const validationSchema = yup.object().shape({
    CompanyName: yup.string().required("Бөглөнө үү"),
    City: yup.string().required("Бөглөнө үү"),
    Country: yup.string().required("Бөглөнө үү"),
    RegistrationID: yup.number().required("Бөглөнө үү").typeError("Бөглөнө үү"),
    PhoneNumber: yup.number().required("Бөглөнө үү").typeError("Бөглөнө үү"),
    Email: yup.string().email("Бөглөнө үү").typeError("Бөглөнө үү"),
    GroupName: yup.string().required("Бөглөнө үү"),
    CustomerType: yup.string().required("Бөглөнө үү"),
    Address: yup.string().required("Бөглөнө үү"),
});

const NewEdit = () => {
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
            api={CompanyDatabaseAPI}
            listUrl={listUrl}
            additionalValues={{
                CompanyDatabaseID: state.editId,
            }}
            reset={reset}
            handleSubmit={handleSubmit}
        >
            <TextField
                size="small"
                fullWidth
                id="Company Name"
                label="CompanyName"
                {...register("CompanyName")}
                margin="dense"
                error={errors.CompanyName?.message}
                helperText={errors.CompanyName?.message}
            />
            <TextField
                size="small"
                fullWidth
                id="City"
                label="City"
                {...register("City")}
                margin="dense"
                error={errors.City?.message}
                helperText={errors.City?.message}
            />
            <TextField
                size="small"
                fullWidth
                id="Country"
                label="Country"
                {...register("Country")}
                margin="dense"
                error={errors.Country?.message}
                helperText={errors.Country?.message}
            />
            <TextField
                size="small"
                fullWidth
                id="RegistrationID"
                label="Registration No"
                {...register("RegistrationID")}
                margin="dense"
                error={errors.RegistrationID?.message}
                helperText={errors.RegistrationID?.message}
            />
            <TextField
                size="small"
                fullWidth
                id="PhoneNumber"
                label="PhoneNumber"
                {...register("PhoneNumber")}
                margin="dense"
                error={errors.PhoneNumber?.message}
                helperText={errors.PhoneNumber?.message}
            />
            <TextField
                size="small"
                fullWidth
                id="Email"
                label="Email"
                {...register("Email")}
                margin="dense"
                error={errors.Email?.message}
                helperText={errors.Email?.message}
            />
            <TextField
                size="small"
                fullWidth
                id="GroupName"
                label="Group Name"
                {...register("GroupName")}
                margin="dense"
                error={errors.GroupName?.message}
                helperText={errors.GroupName?.message}
            />
            <TextField
                size="small"
                fullWidth
                id="CustomerType"
                label="CustomerType"
                {...register("CustomerType")}
                margin="dense"
                error={errors.CustomerType?.message}
                helperText={errors.CustomerType?.message}
            />
            <TextField
                size="small"
                fullWidth
                multiline
                rows={3}
                id="Address"
                label="Address"
                {...register("Address")}
                margin="dense"
                error={errors.Address?.message}
                helperText={errors.Address?.message}
            />
        </NewEditForm>
    );
};

export default NewEdit;
