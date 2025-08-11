import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { useIntl } from "react-intl";
import {
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

// Create validation schema with proper i18n support
const createValidationSchema = (intl: any) => yup.object().shape({
  CurrencyName: yup.string().required(intl.formatMessage({ id: "validation.required" })),
  CurrencyCode: yup.string().required(intl.formatMessage({ id: "validation.required" })),
  CurrencySymbol: yup.string().required(intl.formatMessage({ id: "validation.required" })),
  CountryID: yup.string().required(intl.formatMessage({ id: "validation.required" })),
});

const NewEdit = () => {
  const intl = useIntl();
  const [entity, setEntity]: any = useState(null);
  const [values, setValues]: any = useState(null);
  const [currentCurrency, setCurrentCurrency]: any = useState(null);

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
    resolver: yupResolver(createValidationSchema(intl)),
  });

  useEffect(() => {
    if (values) {
      setEntity({ CountryID: values.CountryID });
    }
  }, [values]);

  useEffect(() => {
    if (entity?.CountryID) {
      const fetchCurrencyData = async () => {
        try {
          const currencyData: any = await ExchangeRateAPI.get(
            null,
            entity.CountryID
          );

          if (currencyData && currencyData[0]) {
            const currency = currencyData[0];
            setCurrentCurrency(currency);

            reset({
              CurrencyID: currency.CurrencyID,
              CountryID: currency.CountryID,
              CurrencyName: currency.CurrencyName,
              CurrencyCode: currency.CurrencyCode,
              CurrencySymbol: currency.CurrencySymbol,
              IsCurrent: false,
              CurrencyRate1: currency.CurrencyRate1 || 1,
              TargetCurrencyRate1: currency.TargetCurrencyRate1 || 1,
              CurrencyRate2: currency.CurrencyRate2 || 1,
              TargetCurrencyRate2: currency.TargetCurrencyRate2 || 1,
            });
          }
        } catch (error) {
          console.error('Error fetching currency data:', error);
        }
      };

      fetchCurrencyData();
    }
  }, [entity, reset]);

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
            error={!!errors.CurrencyName?.message}
            helperText={errors.CurrencyName?.message as string}
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
            error={!!errors.CurrencyCode?.message}
            helperText={errors.CurrencyCode?.message as string}
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
            error={!!errors.CurrencySymbol?.message}
            helperText={errors.CurrencySymbol?.message as string}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </Grid>
      </Grid>

      <Card className="mt-3">
        <CardContent>
          <Typography
            variant="subtitle1"
            component="div"
            className="mb-3"
          >
            {intl.formatMessage({ id: "TextExchangeRate" })}
          </Typography>

          <Grid container spacing={1}>
            <Grid item xs={4} sm={4} md={5}>
              <TextField
                size="small"
                type="number"
                fullWidth
                id="CurrencyRate1"
                label={intl.formatMessage({
                  id: "TextCurrencyRate1",
                })}
                {...register("CurrencyRate1")}
                margin="dense"
                error={!!errors.CurrencyRate1?.message}
                helperText={errors.CurrencyRate1?.message as string}
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
              {currentCurrency?.CurrencyCode} =
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
                error={!!errors.TargetCurrencyRate1?.message}
                helperText={errors.TargetCurrencyRate1?.message as string}
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
              {currentCurrency?.CurrencySymbol2}
            </Grid>

          </Grid>
        </CardContent>
      </Card>
    </NewEditForm>
  );
};

export default NewEdit;
