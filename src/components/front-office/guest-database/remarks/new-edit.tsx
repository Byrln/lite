import * as React from "react";
import { useState, useEffect } from "react";

import { useForm } from "react-hook-form";
import { TextField } from "@mui/material";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

import NewEditForm from "components/common/new-edit-form";
import { RemarkAPI, listUrl } from "lib/api/remarks";
import { useAppState } from "lib/context/app";

const validationSchema = yup.object().shape({
    Remarks: yup.string().required("Бөглөнө үү"),
});

const NewEdit = () => {
    const [entity, setEntity]: any = useState(null);
    const [state]: any = useAppState();
    const {
        register,
        reset,
        handleSubmit,
        control,
        formState: { errors },
    } = useForm({ resolver: yupResolver(validationSchema) });

    return (
        <>
            <NewEditForm
                api={RemarkAPI}
                listUrl={listUrl}
                additionalValues={{
                    GuestID: state.editId,
                }}
                reset={reset}
                handleSubmit={handleSubmit}
                setEntity={setEntity}
            >
                <TextField
                    size="small"
                    fullWidth
                    id="Remarks"
                    label="Remarks"
                    {...register("Remarks")}
                    margin="dense"
                    error={errors.Remarks?.message}
                    helperText={errors.Remarks?.message}
                />
            </NewEditForm>
        </>
    );
};

export default NewEdit;
