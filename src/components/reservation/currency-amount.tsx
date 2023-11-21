import { useState, useEffect } from "react";
import { Grid, TextField, FormControlLabel, Checkbox } from "@mui/material";
import CurrencySelect from "../select/currency";
import { RateAPI } from "../../lib/api/rate";
import { dateToCustomFormat } from "../../lib/utils/format-time";

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
}: any) => {
    const [isCurrencyAmountEditable, setIsCurrencyAmountEditable]: any =
        useState(false);

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
            CustomerID: 0,
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
            } else {
                return;
            }

            setCurrencyAmount(amount);

            resetField(`TransactionDetail.${id}.CurrencyAmount`, {
                defaultValue: amount,
            });
        } catch (exp) {}
    };

    useEffect(() => {
        calculateAmount();
    }, [ArrivalDate, RoomTypeID, RateTypeID, TaxIncluded, Nights]);

    return (
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

            <Grid item xs={6} sm={2}>
                <FormControlLabel
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
                    label="Гараар"
                />
            </Grid>

            <Grid item xs={6} sm={2}>
                <TextField
                    id="CurrencyAmount"
                    label="CurrencyAmount"
                    type="number"
                    disabled={isCurrencyAmountEditable ? false : true}
                    {...register(`TransactionDetail.${id}.CurrencyAmount`)}
                    margin="dense"
                    error={errors.CurrencyAmount?.message}
                    helperText={errors.CurrencyAmount?.message}
                    InputLabelProps={{
                        shrink: currencyAmount,
                    }}
                    size="small"
                    style={{ width: "100%" }}
                />
            </Grid>
        </>
    );
};

export default CurrencyAmount;
