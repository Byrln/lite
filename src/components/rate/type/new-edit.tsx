import { useState, useContext, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { useIntl } from "react-intl";
import {
    FormControlLabel,
    TextField,
    Grid,
    CircularProgress,
} from "@mui/material";
import Checkbox from "@mui/material/Checkbox";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-toastify";
import { mutate } from "swr";

import { RateTypeAPI, listUrl } from "lib/api/rate-type";
import { useAppState } from "lib/context/app";
import { ModalContext } from "lib/context/modal";
import ChannelSelect from "components/select/reference";
import CurrencySelect from "components/select/currency";
import SubmitButton from "components/common/submit-button";
import BaseRateList from "./base-rate-list";
import { TaxSWR } from "lib/api/tax";

const validationSchema = yup.object().shape({
    RateTypeCode: yup.string().required("Бөглөнө үү"),
    RateTypeName: yup.string().required("Бөглөнө үү"),
    ChannelID: yup.number().required("Бөглөнө үү").typeError("Бөглөнө үү"),
    BreakfastIncluded: yup.boolean(),
    TaxIncluded: yup.boolean(),
});

const NewEdit = () => {
    const intl = useIntl();
    const { data, error } = TaxSWR();

    const { handleModal }: any = useContext(ModalContext);
    const [loading, setLoading] = useState(false);
    const [loadingData, setLoadingData] = useState(false);
    const [entity, setEntity] = useState<any>({});
    const [state]: any = useAppState();
    const {
        register,
        reset,
        handleSubmit,
        control,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(validationSchema),
    });

    useEffect(() => {
        const fetchDatas = async () => {
            if (state.editId) {
                setLoadingData(true);
                try {
                    const arr: any = await RateTypeAPI?.get(state.editId);
                    const arr2: any = await RateTypeAPI?.baseRateList(
                        state.editId
                    );
                    let curRoomTypesCheck: any = [];

                    arr2.forEach((element: any) => {
                        curRoomTypesCheck[element.RoomTypeID] = element.Status;
                    });

                    setEntity({
                        CurrencyID: arr2[0].CurrencyID,
                        RoomTypes: curRoomTypesCheck,
                    });
                    arr[0].RoomTypes = arr2;

                    reset(arr[0]);
                } finally {
                    setLoadingData(false);
                }
            }
        };

        fetchDatas();
    }, [state.editId]);

    const onSubmit = async (values: any) => {
        setLoading(true);
        try {
            let tempBaseRates: any = {};
            tempBaseRates.BaseRateList = values.RoomTypes;

            let rateTypeId: any;
            if (state.editId) {
                values.RateTypeID = state.editId;
                rateTypeId = state.editId;
                await RateTypeAPI.update(values);
            } else {
                const response = await RateTypeAPI.new(values);
                rateTypeId = response.data.JsonData[0].RateTypeID;
            }
            tempBaseRates.BaseRateList.forEach((element: any, index: any) => {
                element.RateTypeID = rateTypeId;
                element.TaxIncluded = values.TaxIncluded;

                if (entity && entity.length > 0 && entity.RoomTypes) {
                    tempBaseRates.BaseRateList[index].Status =
                        entity.RoomTypes[element.RoomTypeID];
                }

                if (element.Status == true) {
                    element.CurrencyID = entity.CurrencyID;
                }
            });

            RateTypeAPI.BaseRateInsertWUList(tempBaseRates);

            await mutate(listUrl);
            toast("Амжилттай.");
            setLoading(false);
            handleModal();
        } catch (error) {
            setLoading(false);
            handleModal();
        }
    };

    return loadingData ? (
        <Grid
            container
            spacing={0}
            direction="column"
            alignItems="center"
            justifyContent="center"
        >
            <CircularProgress color="info" />
        </Grid>
    ) : (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={1}>
                <Grid item xs={3}>
                    <TextField
                        size="small"
                        fullWidth
                        id="RateTypeCode"
                        label={intl.formatMessage({ id: "RowHeaderShortCode" })}
                        {...register("RateTypeCode")}
                        margin="dense"
                        error={errors.RateTypeCode?.message}
                        helperText={errors.RateTypeCode?.message}
                    />
                </Grid>
                <Grid item xs={3}>
                    <TextField
                        size="small"
                        fullWidth
                        id="RateTypeName"
                        label={intl.formatMessage({ id: "TextFirstName" })}
                        {...register("RateTypeName")}
                        margin="dense"
                        error={errors.RateTypeName?.message}
                        helperText={errors.RateTypeName?.message}
                    />
                </Grid>
                <Grid item xs={3}>
                    <ChannelSelect
                        register={register}
                        errors={errors}
                        type="ReservationChannel"
                        label={intl.formatMessage({ id: "RowHeaderChannel" })}
                        optionValue="ChannelID"
                        optionLabel="ChannelName"
                    />
                </Grid>
                <Grid item xs={3}>
                    <CurrencySelect
                        register={register}
                        errors={errors}
                        entity={entity}
                        setEntity={setEntity}
                        nameKey="CurrencyID"
                    />
                </Grid>
            </Grid>

            <FormControlLabel
                control={
                    <Controller
                        name="BreakfastIncluded"
                        control={control}
                        render={(props: any) => (
                            <Checkbox
                                {...register("BreakfastIncluded")}
                                checked={props.field.value}
                                onChange={(e) =>
                                    props.field.onChange(e.target.checked)
                                }
                            />
                        )}
                    />
                }
                label="Өглөөний цайтай эсэх"
            />

            <FormControlLabel
                control={
                    <Controller
                        name="TaxIncluded"
                        control={control}
                        render={(props: any) => (
                            <Checkbox
                                {...register("TaxIncluded")}
                                checked={props.field.value}
                                onChange={(e) =>
                                    props.field.onChange(e.target.checked)
                                }
                            />
                        )}
                    />
                }
                label={
                    "Өрөөний тариф нь" +
                    " " +
                    (data &&
                        data.map((item: any) => {
                            return `${item.TaxID != 1 ? "+" : ""}${
                                item.TaxAmount
                            }%`;
                        })) +
                    " " +
                    "татвар агуулсан болно."
                }
            />

            <BaseRateList
                id={state.editId ? state.editId : -1}
                register={register}
                errors={errors}
                control={control}
                entity={entity}
                setEntity={setEntity}
            />

            {!state.isShow && <SubmitButton loading={loading} />}
        </form>
    );
};

export default NewEdit;
