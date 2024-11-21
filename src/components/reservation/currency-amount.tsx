import { useState, useEffect } from "react";
import {
    Grid,
    TextField,
    FormControlLabel,
    Checkbox,
    InputAdornment,
} from "@mui/material";
import { useIntl } from "react-intl";

import CurrencySelect from "../select/currency";
import { RateAPI } from "../../lib/api/rate";
import { CurrenctAPI } from "../../lib/api/currency";

const CurrencyAmount = ({
    id,
    register,
    errors,
    groupIndex,
    customRegisterName,
    ArrivalDate,
    RoomTypeID,
    RateTypeID,
    TaxIncluded,
    Nights,
    setCurrencyAmount,
    currencyAmount,
    resetField,
    Currency,
    setCurrency,
    control,
    Controller,
    selectedAdult,
    selectedChild,
    rateCurrencyID,
    getValues,
    isRoomList = false,
    CustomerID = 0,
    ContractRate,
}: any) => {
    const intl = useIntl();
    const [isCurrencyAmountEditable, setIsCurrencyAmountEditable]: any =
        useState(true);

    const [defaultCurrencyAmount, setDefaultCurrencyAmount]: any = useState();

    const calculateAmount = async () => {
        if (!(RoomTypeID && RateTypeID && ArrivalDate)) {
            return;
        }
        var values = {
            CurrDate: ArrivalDate,
            RoomTypeID: RoomTypeID,
            RateTypeID: RateTypeID,
            ChannelID: 0,
            SourceID: 0,
            CustomerID: ContractRate == true ? CustomerID : 0,
            TaxIncluded: TaxIncluded,
            RoomChargeDuration: 1,
            ContractRate: false,
            EmptyRow: false,
        };
        try {
            var rates = await RateAPI.listByDate(values);
            var amount;
            if (rates.length > 0) {
                resetField(`TransactionDetail.${id}.Amount`, {
                    defaultValue: rates[0].BaseRate,
                });
                amount = rates[0].BaseRate * Nights;
                if (rates[0].BaseAdult < selectedAdult) {
                    amount =
                        (selectedAdult - rates[0].BaseAdult) *
                            rates[0].ExtraAdult *
                            Nights +
                        amount;
                }
                if (rates[0].BaseChild < selectedChild) {
                    amount =
                        (selectedChild - rates[0].BaseChild) *
                            rates[0].ExtraChild *
                            Nights +
                        amount;
                }
            } else {
                return;
            }
            setDefaultCurrencyAmount(amount);
            setCurrencyAmount(amount);

            resetField(`TransactionDetail.${id}.CurrencyID`, {
                defaultValue: rates[0].CurrencyID,
            });
            setCurrency({ CurrencyID: rates[0].CurrencyID });

            resetField(`TransactionDetail.${id}.CurrencyAmount`, {
                defaultValue: amount,
            });
        } catch (exp) {}
    };

    useEffect(() => {
        calculateAmount();
    }, [
        ArrivalDate,
        RoomTypeID,
        RateTypeID,
        TaxIncluded,
        Nights,
        selectedAdult,
        selectedChild,
        CustomerID,
        ContractRate,
        id,
    ]);

    const newCurrencyAmount = async () => {
        if (Currency.CurrencyID) {
            var values = {
                CurrencyID: Currency.CurrencyID,
            };

            try {
                var exchangeRate = await CurrenctAPI.exchangeRate(values);

                resetField(`TransactionDetail.${id}.TestCurrencyAmount`, {
                    defaultValue:
                        defaultCurrencyAmount /
                        exchangeRate[0].TargetCurrencyRate1,
                });

                setCurrencyAmount(
                    defaultCurrencyAmount / exchangeRate[0].TargetCurrencyRate1
                );
            } catch (exp) {}
        }
    };

    useEffect(() => {
        newCurrencyAmount();
    }, [Currency]);

    return (
        <>
            {!isRoomList ? (
                <>
                    {groupIndex == null && (
                        <Grid item xs={6} sm={2}>
                            <CurrencySelect
                                register={register}
                                errors={errors}
                                nameKey={`TransactionDetail.${id}.CurrencyID`}
                                entity={Currency}
                                setEntity={setCurrency}
                            />
                        </Grid>
                    )}
                    {Currency.CurrencyID != rateCurrencyID && (
                        <Grid item xs={6} sm={2}>
                            <TextField
                                id="TestCurrencyAmount"
                                label={intl.formatMessage({
                                    id: "TextAmount",
                                })}
                                type="number"
                                disabled={true}
                                {...register(
                                    `TransactionDetail.${id}.TestCurrencyAmount`
                                )}
                                margin="dense"
                                error={errors.TestCurrencyAmount?.message}
                                helperText={errors.TestCurrencyAmount?.message}
                                InputLabelProps={{
                                    shrink: currencyAmount,
                                }}
                                size="small"
                                style={{ width: "100%" }}
                            />
                        </Grid>
                    )}
                </>
            ) : (
                <>
                    {" "}
                    <input
                        type="hidden"
                        {...register(`TransactionDetail.${id}.CurrencyID`)}
                        name={`TransactionDetail.${id}.CurrencyID`}
                    />
                    <input
                        type="hidden"
                        {...register(
                            `TransactionDetail.${id}.TestCurrencyAmount`
                        )}
                        name={`TransactionDetail.${id}.TestCurrencyAmount`}
                    />
                </>
            )}

            <Grid item xs={isRoomList ? 12 : 6} sm={isRoomList ? 12 : 2}>
                <TextField
                    id="CurrencyAmount"
                    label={intl.formatMessage({
                        id: "TextAmount",
                    })}
                    type="number"
                    disabled={isCurrencyAmountEditable ? false : true}
                    {...register(`TransactionDetail.${id}.CurrencyAmount`)}
                    margin="dense"
                    error={errors.CurrencyAmount?.message}
                    helperText={errors.CurrencyAmount?.message}
                    InputLabelProps={{
                        shrink: currencyAmount,
                    }}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">₮</InputAdornment>
                        ),
                    }}
                    size="small"
                    style={{ width: "100%" }}
                    onChange={(e) =>
                        resetField(`TransactionDetail.${id}.CurrencyAmount`, {
                            defaultValue: e.target.value,
                        })
                    }
                />
                {/* <FormControlLabel
                    control={
                        <Controller
                            name={`TransactionDetail.${id}.isCurrencyAmountEditable`}
                            control={control}
                            render={(props: any) => (
                                <Checkbox
                                    checked={
                                        isCurrencyAmountEditable == true
                                            ? true
                                            : false
                                    }
                                    onChange={(e) => (
                                        props.field.onChange(e.target.checked),
                                        setIsCurrencyAmountEditable(
                                            e.target.checked
                                        )
                                    )}
                                />
                            )}
                        />
                    }
                    label={intl.formatMessage({
                        id: "TextManualRate",
                    })}
                /> */}
            </Grid>
        </>
    );
};

export default CurrencyAmount;
