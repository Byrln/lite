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
    CurrencyName: yup.string().required("Бөглөнө үү"),
    CurrencyCode: yup.string().required("Бөглөнө үү"),
    CurrencySymbol: yup.string().required("Бөглөнө үү"),
    CountryID: yup.string().required("Бөглөнө үү"),
});

const NewEdit = () => {
    const intl = useIntl();
    const [entity, setEntity]: any = useState(null);
    const [values, setValues]: any = useState(null);
    const [currentCurrency, setCurrentCurrecy]: any = useState(null);

    const [state]: any = useAppState();
    const {
        register,
        reset,
        handleSubmit,
        control,
        formState: { errors },
    } = useForm<any>({
        defaultValues: {
            CurrencyRate1: 1,
            CurrencyRate2: 1,
            TargetCurrencyRate1: 1,
            TargetCurrencyRate2: 1,
        },
        resolver: yupResolver(validationSchema),
    });
    console.log("errors", errors);
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
                    if (entity) {
                        console.log("1111", arr);

                        if (arr[0].CountryID != entity.CountryID) {
                        } else {
                            setCurrentCurrecy(arr[0]);
                            reset({
                                CurrencyID: arr[0].CurrencyID,
                                CountryID: arr[0].CountryID,
                                CurrencyName: arr[0].CurrencyName,
                                CurrencyCode: arr[0].CurrencyCode,
                                CurrencySymbol: arr[0].CurrencySymbol,
                                IsCurrent: false,
                                CurrencyRate1: arr[0].CurrencyRate1,
                                TargetCurrencyRate1: arr[0].TargetCurrencyRate1,
                                CurrencyRate2: arr[0].CurrencyRate2,
                                TargetCurrencyRate2: arr[0].TargetCurrencyRate2,
                            });
                        }
                    } else {
                        console.log("333", arr[0]);
                        setCurrentCurrecy(arr[0]);

                        reset({
                            CurrencyID: Number(arr[0].CurrencyID),
                            CountryID: arr[0].CountryID,
                            CurrencyName: arr[0].CurrencyName,
                            CurrencyCode: arr[0].CurrencyCode,
                            CurrencySymbol: arr[0].CurrencySymbol,
                            IsCurrent: false,
                            CurrencyRate1: arr[0].CurrencyRate1,
                            TargetCurrencyRate1: arr[0].TargetCurrencyRate1,
                            CurrencyRate2: arr[0].CurrencyRate2,
                            TargetCurrencyRate2: arr[0].TargetCurrencyRate2,
                        });
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
            // additionalValues={{
            //     CurrencyID: state.editId,
            // }}
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
                        id="CurrencyName"
                        label={intl.formatMessage({ id: "TextCurrencyName" })}
                        {...register("CurrencyName")}
                        margin="dense"
                        error={errors.CurrencyName?.message}
                        helperText={errors.CurrencyName?.message}
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                </Grid>
                <Grid item xs={12} sm={3}>
                    <TextField
                        size="small"
                        fullWidth
                        id="CurrencyCode"
                        label={intl.formatMessage({ id: "TextCurrencyCode" })}
                        {...register("CurrencyCode")}
                        margin="dense"
                        error={errors.CurrencyCode?.message}
                        helperText={errors.CurrencyCode?.message}
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                </Grid>
                <Grid item xs={12} sm={3}>
                    <TextField
                        size="small"
                        fullWidth
                        id="CurrencySymbol"
                        label={intl.formatMessage({
                            id: "RowHeaderCurrencySymbol",
                        })}
                        {...register("CurrencySymbol")}
                        margin="dense"
                        error={errors.CurrencySymbol?.message}
                        helperText={errors.CurrencySymbol?.message}
                        InputLabelProps={{
                            shrink: true,
                        }}
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
                        <Grid item xs={4} sm={4} md={5}>
                            <TextField
                                size="small"
                                type="number"
                                fullWidth
                                id="CurrencyRate1"
                                label={intl.formatMessage({
                                    id: "Худалдан авах",
                                })}
                                {...register("CurrencyRate1")}
                                margin="dense"
                                error={errors.CurrencyRate1?.message}
                                helperText={errors.CurrencyRate1?.message}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />
                        </Grid>
                        <Grid
                            item
                            xs={2}
                            sm={2}
                            md={1}
                            style={{ fontSize: "12px", paddingTop: "20px" }}
                        >
                            {currentCurrency && currentCurrency.CurrencyCode} =
                        </Grid>
                        <Grid item xs={4} sm={4} md={5}>
                            <TextField
                                size="small"
                                type="number"
                                fullWidth
                                id="TargetCurrencyRate1"
                                label={intl.formatMessage({
                                    id: "TargetCurrencyRate1",
                                })}
                                {...register("TargetCurrencyRate1")}
                                margin="dense"
                                error={errors.TargetCurrencyRate1?.message}
                                helperText={errors.TargetCurrencyRate1?.message}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />
                        </Grid>
                        <Grid
                            item
                            xs={2}
                            sm={2}
                            md={1}
                            style={{ fontSize: "12px", paddingTop: "20px" }}
                        >
                            {currentCurrency && currentCurrency.CurrencySymbol2}
                        </Grid>
                        <Grid item xs={4} sm={4} md={5}>
                            <TextField
                                size="small"
                                type="number"
                                fullWidth
                                id="TargetCurrencyRate2"
                                label={intl.formatMessage({
                                    id: "TargetCurrencyRate2",
                                })}
                                {...register("TargetCurrencyRate2")}
                                margin="dense"
                                error={errors.TargetCurrencyRate2?.message}
                                helperText={errors.TargetCurrencyRate2?.message}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />
                        </Grid>
                        <Grid
                            item
                            xs={2}
                            sm={2}
                            md={1}
                            style={{ fontSize: "12px", paddingTop: "20px" }}
                        >
                            {currentCurrency && currentCurrency.CurrencySymbol2}
                            =
                        </Grid>
                        <Grid item xs={4} sm={4} md={5}>
                            <TextField
                                size="small"
                                type="number"
                                fullWidth
                                id="CurrencyRate2"
                                label={intl.formatMessage({
                                    id: "Зарах",
                                })}
                                {...register("CurrencyRate2")}
                                margin="dense"
                                error={errors.CurrencyRate2?.message}
                                helperText={errors.CurrencyRate2?.message}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />
                        </Grid>
                        <Grid
                            item
                            xs={2}
                            sm={2}
                            md={1}
                            style={{ fontSize: "12px", paddingTop: "20px" }}
                        >
                            {currentCurrency && currentCurrency.CurrencyCode}
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
        </NewEditForm>
    );
};

export default NewEdit;
