import { Controller, useForm } from "react-hook-form";
import { FormControlLabel, TextField } from "@mui/material";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

import NewEditForm from "components/common/new-edit-form";
import { ExchangeRateAPI, listUrl } from "lib/api/exchange-rate";
import { useAppState } from "lib/context/app";

const validationSchema = yup.object().shape({
    ExchangeRateName: yup.string().required("Бөглөнө үү"),
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
            api={ExchangeRateAPI}
            listUrl={listUrl}
            additionalValues={{
                ExchangeRateID: state.editId,
            }}
            reset={reset}
            handleSubmit={handleSubmit}
        >
            <TextField
                size="small"
                fullWidth
                id="ExchangeRateName"
                label="ExchangeRateName"
                {...register("ExchangeRateName")}
                margin="dense"
                error={errors.ExchangeRateName?.message}
                helperText={errors.ExchangeRateName?.message}
            />
        </NewEditForm>
    );
};

export default NewEdit;
