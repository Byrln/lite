import { Controller, useForm } from "react-hook-form";
import { TextField, Grid } from "@mui/material";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useState, useEffect } from "react";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import moment from "moment";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import mn from "date-fns/locale/mn";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { mutate } from "swr";
import { useIntl } from "react-intl";

import NewEditForm from "components/common/new-edit-form";
import { FolioAPI } from "lib/api/folio";
import { useAppState } from "lib/context/app";
import { dateStringToObj } from "lib/utils/helpers";
import PaymentMethodGroupSelect from "components/select/payment-method-group";
import PaymentMethodSelect from "components/select/payment-method";
import { listUrl as paymentMethodUrl } from "lib/api/payment-method";
import CurrencySelect from "components/select/currency";

const validationSchema = yup.object().shape({
    CurrencyID: yup.string().required("Бөглөнө үү"),
    Balance: yup.string().required("Бөглөнө үү"),
    Description: yup.string().required("Бөглөнө үү"),
});

const baseStayDefault = {
    TransactionID: 0,
};

const NewEdit = ({
    TransactionID,
    FolioID,
    CurrID,
    workingDate,
    Balance,
}: any) => {
    const intl = useIntl();
    const [baseStay, setBaseStay]: any = useState(baseStayDefault);
    const [entity, setEntity]: any = useState({});
    const [paymentMethodGroupID, setPaymentMethodGroupID]: any = useState(0);
    const [paymentMethodID, setPaymentMethodID]: any = useState(0);

    const [state]: any = useAppState();
    const {
        register,
        reset,
        resetField,
        handleSubmit,
        control,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(validationSchema),
    });

    const handleOnChange = (value: any) => {
        setPaymentMethodGroupID(value);
        mutate(paymentMethodUrl);
    };

    const customResetEvent = (data: any) => {
        setEntity(data[0]);

        setBaseStay({
            ...baseStay,
            CurrencyID: data[0].CurrencyID,
        });
    };

    useEffect(() => {
        if (workingDate) {
            resetField(`CurrDate`, {
                defaultValue: workingDate,
            });
        }

        if (Balance) {
            resetField(`Balance`, {
                defaultValue: Balance,
            });
        }
    }, [workingDate]);

    const customSubmit = async (values: any) => {
        try {
            let tempValues = {
                TransactionID: TransactionID,
                FolioID: FolioID,
                TypeID: entity.TypeID,
                ItemID: entity.ItemID,
                CurrDate: workingDate,
                PayCurrencyID: values.CurrencyID,
                Amount: values.Balance,
                Quantity: values.Quantity ? values.Quantity : entity.Quantity,
                Description: values.Description,
                RateModeID: entity.RateModeID,
                TaxIncluded: entity.TaxIncluded,
                PaymentMethodGroupID: values.PaymentMethodGroupID,
                PaymentMethodID: values.PaymentMethodID,
            };
            await FolioAPI.new(tempValues);
            
            // Invalidate cache to refresh UI
            await mutate("/api/Folio/Items");
            await mutate("/api/Folio/Group/Summary");
        } finally {
        }
    };

    return (
        <NewEditForm
            api={FolioAPI}
            listUrl="/api/Folio/Group/Summary"
            additionalValues={{
                FolioID: FolioID,
                TransactiaonID: TransactionID,
                ItemID: state.editId,
            }}
            reset={reset}
            handleSubmit={handleSubmit}
            setEntity={setBaseStay}
            customResetEvent={customResetEvent}
            customSubmit={customSubmit}
        >
            <LocalizationProvider
                //@ts-ignore
                dateAdapter={AdapterDateFns}
                adapterLocale={mn}
            >
                <Grid container spacing={1}>
                    <Grid item xs={12}>
                        <Controller
                            name="CurrDate"
                            control={control}
                            defaultValue={null}
                            render={({ field: { onChange, value } }) => (
                                <DatePicker
                                    label={intl.formatMessage({
                                        id: "TextDate",
                                    })}
                                    value={value}
                                    disabled={true}
                                    onChange={(value) =>
                                        onChange(
                                            moment(
                                                dateStringToObj(
                                                    moment(value).format(
                                                        "YYYY-MM-DD"
                                                    )
                                                ),
                                                "YYYY-MM-DD"
                                            )
                                        )
                                    }
                                    renderInput={(params) => (
                                        <TextField
                                            size="small"
                                            id="CurrDate"
                                            {...register("CurrDate")}
                                            margin="dense"
                                            fullWidth
                                            {...params}
                                            error={!!errors.CurrDate?.message}
                                            helperText={
                                                errors.CurrDate?.message as string}
                                        />
                                    )}
                                />
                            )}
                        />
                    </Grid>

                    <Grid item xs={6}>
                        <PaymentMethodGroupSelect
                            register={register}
                            errors={errors}
                            onChange={handleOnChange}
                        />
                    </Grid>

                    {paymentMethodGroupID ? (
                        <Grid item xs={6}>
                            <PaymentMethodSelect
                                register={register}
                                errors={errors}
                                PaymentMethodGroupID={paymentMethodGroupID}
                                setPaymentMethodID={setPaymentMethodID}
                                PaymentMethodID={paymentMethodID}
                            />
                        </Grid>
                    ) : (
                        <></>
                    )}

                    <Grid item xs={4}>
                        <CurrencySelect
                            register={register}
                            errors={errors}
                            nameKey={`CurrencyID`}
                            entity={baseStay}
                            setEntity={setBaseStay}
                        />
                    </Grid>

                    <Grid item xs={8}>
                        <TextField
                            type="number"
                            fullWidth
                            id="Balance"
                            label="Дүн"
                            InputProps={{ inputProps: { min: 0 } }}
                            {...register("Balance")}
                            margin="dense"
                            size="small"
                            error={!!errors.Balance?.message}
                            helperText={errors.Balance?.message as string}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <TextField
                            size="small"
                            fullWidth
                            id="Description"
                            label="Description"
                            {...register("Description")}
                            margin="dense"
                            error={!!errors.Description?.message}
                            helperText={errors.Description?.message as string}
                        />
                    </Grid>
                </Grid>
            </LocalizationProvider>
        </NewEditForm>
    );
};

export default NewEdit;
