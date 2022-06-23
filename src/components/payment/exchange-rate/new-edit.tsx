import { Controller, useForm } from "react-hook-form";
import { FormControlLabel, TextField } from "@mui/material";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

import NewEditForm from "components/common/new-edit-form";
import { ExchangeRateAPI, listUrl } from "lib/api/exchange-rate";
import { useAppState } from "lib/context/app";
import ExchangeRateSelect from "components/select/exchange-rate";

const validationSchema = yup.object().shape({
    ExchangeRateName: yup.string().required("Бөглөнө үү"),
    Currency: yup.string().required("Бөглөнө үү"),
    Code: yup.number().required("Бөглөнө үү").typeError("Бөглөнө үү"),
    Symbol: yup.string().required("Бөглөнө үү"),
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
                id="Country"
                label="Country"
                {...register("Country")}
                margin="dense"
                error={errors.Country?.message}
                helperText={errors.Country?.message}
            />
            {/* <ExchangeRateSelect
                register={register}
                errors={errors}
                field="ParentID"
            /> */}
            <TextField
                size="small"
                fullWidth
                id="Currency"
                label="Currency"
                {...register("Currency")}
                margin="dense"
                error={errors.Currency?.message}
                helperText={errors.Currency?.message}
            />
            <TextField
                size="small"
                fullWidth
                id="Code"
                label="Code"
                {...register("Code")}
                margin="dense"
                error={errors.Code?.message}
                helperText={errors.Code?.message}
            />
            <TextField
                size="small"
                fullWidth
                id="Symbol"
                label="Symbol"
                {...register("Symbol")}
                margin="dense"
                error={errors.Symbol?.message}
                helperText={errors.Symbol?.message}
            />
            Exchance Rate
        </NewEditForm>
    );
};

export default NewEdit;
