import { Controller, useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { useIntl } from "react-intl";
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
import { fetchData } from "next-auth/client/_utils";

const validationSchema = yup.object().shape({
    ExchangeRateName: yup.string().required("Бөглөнө үү"),
    CurrencyName: yup.string().required("Бөглөнө үү"),
    CurrencyCode: yup.number().required("Бөглөнө үү").typeError("Бөглөнө үү"),
    CurrencySymbol: yup.string().required("Бөглөнө үү"),
    CountryID: yup.string().required("Бөглөнө үү"),
});

const NewEdit = () => {
    const intl = useIntl();
    const [entity, setEntity]: any = useState(null);
    const [values, setValues]: any = useState(null);

    const [state]: any = useAppState();
    const {
        register,
        reset,
        handleSubmit,
        control,
        formState: { errors },
    } = useForm({ resolver: yupResolver(validationSchema) });

    useEffect(() => {
        if (values) {
            setEntity({ CountryID: values.CountryID });
        }
    }, [values]);

    useEffect(() => {
        if (entity) {
            const fetchDatas = async () => {
                try {
                    const arr: any = await ExchangeRateAPI.get(
                        null,
                        entity.CountryID
                    );
                    if (values) {
                        if (arr[0].CountryID != entity.CountryID) {
                            reset(arr[0]);
                        }
                    }
                    {
                        reset(arr[0]);
                    }
                } finally {
                }
            };
            fetchDatas();
        }
    }, [entity]);

    return (
        <NewEditForm
            api={ExchangeRateAPI}
            listUrl={listUrl}
            additionalValues={{
                CurrencyID: state.editId,
            }}
            reset={reset}
            handleSubmit={handleSubmit}
            setEntity={setValues}
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
                        id="TextCurrencyName"
                        label={intl.formatMessage({id:"TextCurrencyName"}) }
                        {...register("TextCurrencyName")}
                        margin="dense"
                        error={errors.CurrencyName?.message}
                        helperText={errors.CurrencyName?.message}
                    />
                </Grid>
                <Grid item xs={12} sm={3}>
                    <TextField
                        size="small"
                        fullWidth
                        id="TextCurrencyCode"
                        label={intl.formatMessage({id:"TextCurrencyCode"}) }
                        {...register("TextCurrencyCode")}
                        margin="dense"
                        error={errors.CurrencyCode?.message}
                        helperText={errors.CurrencyCode?.message}
                    />
                </Grid>
                <Grid item xs={12} sm={3}>
                    <TextField
                        size="small"
                        fullWidth
                        id="RowHeaderCurrencySymbol"
                        label={intl.formatMessage({id:"RowHeaderCurrencySymbol"}) }
                        {...register("RowHeaderCurrencySymbol")}
                        margin="dense"
                        error={errors.CurrencySymbol?.message}
                        helperText={errors.CurrencySymbol?.message}
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
                                id="TitleCurrencyRate1"
                                label={intl.formatMessage({id:"TitleCurrencyRate1"}) }
                                {...register("TitleCurrencyRate1")}
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
                                id="TitleCurrencyRate2"
                                label={intl.formatMessage({id:"TitleCurrencyRate2"}) }
                                {...register("TitleCurrencyRate2")}
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
                                id="TitleTargetCurrencyRate2"
                                label={intl.formatMessage({id:"TitleTargetCurrencyRate2"}) }
                                {...register("TitleTargetCurrencyRate2")}
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
                                id="TitleCurrencyRate2"
                                label={intl.formatMessage({id:"TitleTargetCurrencyRate1"}) }
                                {...register("TitleTargetCurrencyRate1")}
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
