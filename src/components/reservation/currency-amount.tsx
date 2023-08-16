import { useState, useEffect } from "react";
import { Grid, TextField } from "@mui/material";
import CurrencySelect from "../select/currency";
import { RateAPI } from "../../lib/api/rate";
import { dateToCustomFormat } from "../../lib/utils/format-time";

const CurrencyAmount = ({
    register,
    errors,
    reservationModel,
    setReservationModel,
    baseGroupStay,
    reset,
    groupIndex,
    customRegisterName,
    setValue,
}: any) => {
    const calculateAmount = async () => {
        console.log("reservavtionModalCalculateAmount", reservationModel);
        if (
            !(
                reservationModel.roomType &&
                reservationModel.rate &&
                reservationModel.dateStart
            )
        ) {
            return;
        }

        var values = {
            CurrDate: dateToCustomFormat(
                reservationModel.dateStart,
                "yyyy MMM dd"
            ),
            RoomTypeID: reservationModel.roomType.RoomTypeID,
            RateTypeID: reservationModel.rate.RateTypeID,
            ChannelID: 0,
            SourceID: 0,
            CustomerID: 0,
            TaxIncluded: reservationModel.TaxIncluded,
            RoomChargeDuration: 1,
            ContractRate: false,
            EmptyRow: false,
        };
        try {
            var rates = await RateAPI.listByDate(values);
            console.log("reservation.Nights", reservationModel.Nights);
            var amount;
            if (rates.length > 0) {
                amount = rates[0].BaseRate * reservationModel.Nights;
            } else {
                return;
            }
            if (groupIndex == null) {
                reset({
                    CurrencyAmount: amount,
                });
            } else {
                setValue(customRegisterName, amount);
            }

            if (groupIndex == null) {
                setReservationModel({
                    ...reservationModel,
                    CurrencyAmount: amount,
                });
            } else {
                let tempReservation = { ...baseGroupStay };
                tempReservation[groupIndex].CurrencyAmount = amount;
                setReservationModel(tempReservation);
                console.log("tempReservation", tempReservation);
            }
        } catch (exp) {}
    };

    useEffect(() => {
        calculateAmount();
    }, [
        reservationModel.roomType,
        reservationModel.rate,
        reservationModel.dateStart,
        reservationModel.Nights,
        reservationModel.TaxIncluded,
    ]);

    return (
        <>
            <Grid container spacing={2}>
                {groupIndex == null && (
                    <Grid item xs={12} sm={4}>
                        <CurrencySelect
                            register={register}
                            errors={errors}
                            nameKey={
                                customRegisterName
                                    ? customRegisterName
                                    : "CurrencyID"
                            }
                        />
                    </Grid>
                )}

                <Grid item xs={12} sm={groupIndex == null ? 8 : 12}>
                    <Grid container spacing={1}>
                        {/* <Grid item xs={6} sx={{ display: "none" }}></Grid>
                        <Grid item xs={6}> */}
                        <TextField
                            id="CurrencyAmount"
                            label="CurrencyAmount"
                            type="number"
                            disabled={true}
                            {...register(
                                customRegisterName
                                    ? customRegisterName
                                    : "CurrencyAmount"
                            )}
                            margin="dense"
                            error={errors.CurrencyAmount?.message}
                            helperText={errors.CurrencyAmount?.message}
                            InputLabelProps={{
                                shrink: reservationModel.CurrencyAmount,
                            }}
                            size="small"
                            style={{ width: "100%" }}
                            className="mt-3"
                        />
                        {/* </Grid> */}
                    </Grid>
                </Grid>
            </Grid>
        </>
    );
};

export default CurrencyAmount;
