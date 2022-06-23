import * as React from "react";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

import { Controller, useForm } from "react-hook-form";
import { FormControlLabel, TextField } from "@mui/material";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

import NewEditForm from "components/common/new-edit-form";
import { GuestdatabaseAPI, listUrl } from "lib/api/guest-database";
import { useAppState } from "lib/context/app";

const validationSchema = yup.object().shape({
    GuestName: yup.string().required("Бөглөнө үү"),
    Country: yup.string().required("Бөглөнө үү"),
    GuestPhone: yup.number().required("Бөглөнө үү").typeError("Бөглөнө үү"),
    Mobile: yup.number().required("Бөглөнө үү").typeError("Бөглөнө үү"),
    GuestEmail: yup.string().email("Бөглөнө үү"),
    Vipstatus: yup.string().email("Бөглөнө үү"),
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
            api={GuestdatabaseAPI}
            listUrl={listUrl}
            additionalValues={{
                GuestID: state.editId,
            }}
            reset={reset}
            handleSubmit={handleSubmit}
        >
            <TextField
                size="small"
                fullWidth
                id="GuestName"
                label="GuestName"
                {...register("GuestName")}
                margin="dense"
                error={errors.GuestName?.message}
                helperText={errors.GuestName?.message}
            />

            <TextField
                size="small"
                fullWidth
                id="GuestPhone"
                label="Guest Phone"
                {...register("GuestPhone")}
                margin="dense"
                error={errors.GuestPhone?.message}
                helperText={errors.GuestPhone?.message}
            />
            <TextField
                size="small"
                fullWidth
                id="Mobile"
                label="Mobile"
                {...register("Mobile")}
                margin="dense"
                error={errors.Mobile?.message}
                helperText={errors.Mobile?.message}
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
                id="Status"
                label="Status"
                {...register("Status")}
                margin="dense"
                error={errors.Status?.message}
                helperText={errors.Status?.message}
            />
        </NewEditForm>
    );
};

export default NewEdit;
