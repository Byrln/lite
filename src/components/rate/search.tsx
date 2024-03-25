import { Grid } from "@mui/material";
import { useState } from "react";

import ReservationChannelSelect from "components/select/reservation-channel";
import RoomTypeSelect from "components/select/room-type";
import RateTypeSelect from "components/select/rate-type";
import SeasonSelect from "components/select/season";
import ReservationSourceSelect from "components/select/reservation-source";
import RoomChargeDurationSelect from "components/select/duration";
import CustomerSelect from "components/select/customer";
import { RateTypeSWR } from "lib/api/rate-type";

const Search = ({ register, errors, control, reset }: any) => {
    const { data, error } = RateTypeSWR({});

    const [customerVisibility, setCustomerVisibility] = useState(false);

    const onRateTypeChange = (evt: any) => {
        let contractRates = data.filter(
            (entity: any) => entity.ContractRate === true
        );
        if (
            contractRates &&
            contractRates[0] &&
            contractRates[0].RateTypeID == evt.target.value
        ) {
            setCustomerVisibility(true);
        } else {
            setCustomerVisibility(false);
            reset({ CustomerID: null });
        }
    };

    return (
        <Grid container spacing={1}>
            <Grid item xs={3}>
                <ReservationChannelSelect
                    register={register}
                    errors={errors}
                    customRegisterName="ChannelID"
                />
            </Grid>
            <Grid item xs={3}>
                <RoomTypeSelect register={register} errors={errors} />
            </Grid>
            <Grid item xs={3}>
                <RateTypeSelect
                    register={register}
                    errors={errors}
                    onChange={onRateTypeChange}
                />
            </Grid>

            {customerVisibility && (
                <Grid item xs={3}>
                    <CustomerSelect
                        register={register}
                        errors={errors}
                        isCustomSelect={true}
                    />
                </Grid>
            )}

            <Grid item xs={3}>
                <SeasonSelect register={register} errors={errors} />
            </Grid>
            <Grid item xs={3}>
                <ReservationSourceSelect
                    register={register}
                    errors={errors}
                    label="Зах.эх сурвалж"
                    ChannelID={2}
                    field="SourceID"
                />
            </Grid>

            <Grid item xs={3}>
                <RoomChargeDurationSelect register={register} errors={errors} />
            </Grid>
        </Grid>
    );
};

export default Search;
