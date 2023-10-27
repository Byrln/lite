import { Controller, useForm } from "react-hook-form";
import { useState, useEffect } from "react";

import {
    FormControlLabel,
    TextField,
    Grid,
    Typography,
    Card,
    CardContent,
} from "@mui/material";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

import NewEditForm from "components/common/new-edit-form";
import { ExchangeRateAPI, listUrl } from "lib/api/exchange-rate";
import { useAppState } from "lib/context/app";
import CountrySelect from "components/select/country";

const validationSchema = yup.object().shape({
    ExchangeRateName: yup.string().required("Бөглөнө үү"),
    Currency: yup.string().required("Бөглөнө үү"),
    Code: yup.number().required("Бөглөнө үү").typeError("Бөглөнө үү"),
    Symbol: yup.string().required("Бөглөнө үү"),
    CountryID: yup.string().required("Бөглөнө үү"),
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
        <NewEditForm
            api={ExchangeRateAPI}
            listUrl={listUrl}
            additionalValues={{
                ExchangeRateID: state.editId,
            }}
            reset={reset}
            handleSubmit={handleSubmit}
        >
            <Grid container spacing={1}>
                <Grid item xs={12} sm={3}>
                    <CountrySelect
                        register={register}
                        errors={errors}
                        entity={entity}
                        setEntity={setEntity}
                    />
                </Grid>
                <Grid item xs={12} sm={3}>
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
                </Grid>
                <Grid item xs={12} sm={3}>
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
                </Grid>
                <Grid item xs={12} sm={3}>
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
                </Grid>
            </Grid>
            {/* <ExchangeRateSelect
                register={register}
                errors={errors}
                field="ParentID"
            /> */}
            <Card className="mt-3">
                <CardContent>
                    <Typography
                        variant="subtitle1"
                        component="div"
                        className="mb-3"
                    >
                        Exchance Rate
                    </Typography>

                    <Grid container spacing={1}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                size="small"
                                type="number"
                                fullWidth
                                id="CurrencyRate1"
                                label="CurrencyRate1"
                                {...register("CurrencyRate1")}
                                margin="dense"
                                error={errors.CurrencyRate1?.message}
                                helperText={errors.CurrencyRate1?.message}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                size="small"
                                type="number"
                                fullWidth
                                id="TargetCurrencyRate1"
                                label="TargetCurrencyRate1"
                                {...register("TargetCurrencyRate1")}
                                margin="dense"
                                error={errors.TargetCurrencyRate1?.message}
                                helperText={errors.TargetCurrencyRate1?.message}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                size="small"
                                type="number"
                                fullWidth
                                id="CurrencyRate2"
                                label="CurrencyRate2"
                                {...register("CurrencyRate2")}
                                margin="dense"
                                error={errors.CurrencyRate2?.message}
                                helperText={errors.CurrencyRate2?.message}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                size="small"
                                type="number"
                                fullWidth
                                id="TargetCurrencyRate2"
                                label="TargetCurrencyRate2"
                                {...register("TargetCurrencyRate2")}
                                margin="dense"
                                error={errors.TargetCurrencyRate2?.message}
                                helperText={errors.TargetCurrencyRate2?.message}
                            />
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
        </NewEditForm>
    );
};

export default NewEdit;
