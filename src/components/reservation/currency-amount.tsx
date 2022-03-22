import {useState, useEffect} from "react";
import {Grid, TextField} from "@mui/material";
import CurrencySelect from "../select/currency";
import {RateAPI} from "../../lib/api/rate";
import {dateToCustomFormat} from "../../lib/utils/format-time";

const CurrencyAmount = ({register, errors, reservationModel, setReservationModel, reset}: any) => {

    const calculateAmount = async () => {

        if (!(reservationModel.roomType && reservationModel.rate && reservationModel.dateStart)) {
            return;
        }
        var values = {
            CurrDate: dateToCustomFormat(reservationModel.dateStart, "yyyy MMM dd"),
            RoomTypeID: reservationModel.roomType.RoomTypeID,
            RateTypeID: reservationModel.rate.RateTypeID,
            ChannelID: 0,
            SourceID: 0,
            CustomerID: 0,
            TaxIncluded: reservationModel.TaxIncluded,
            RoomChargeDuration: 1,
            ContractRate: false,
            EmptyRow: false
        };

        try {

            var rates = await RateAPI.listByDate(values);

            var amount;
            if (rates.length > 0) {
                amount = rates[0].BaseRate * reservationModel.Nights;
            } else {
                return;
            }


            reset({
                CurrencyAmount: amount,
            });

            setReservationModel({
                ...reservationModel,
                CurrencyAmount: amount,
            });

        } catch (exp) {

        }

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

    return <>
        <Grid container spacing={2}>
            <Grid item md={3}>
                <CurrencySelect
                    register={register}
                    errors={errors}
                    nameKey={"CurrencyID"}
                />
            </Grid>
            <Grid item md={9}>
                <Grid container spacing={1}>
                    <Grid item xs={6} sx={{display: "none"}}>

                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            id="CurrencyAmount"
                            label="CurrencyAmount"
                            type="number"
                            disabled
                            {...register("CurrencyAmount")}
                            margin="dense"
                            error={errors.CurrencyAmount?.message}
                            helperText={errors.CurrencyAmount?.message}
                            InputLabelProps={{
                                shrink: reservationModel.CurrencyAmount
                            }}
                        />
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    </>
};

export default CurrencyAmount;
