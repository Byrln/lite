import { useForm } from "react-hook-form";
import { TextField, Grid } from "@mui/material";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useState, useEffect } from "react";
import { useIntl } from "react-intl";

import NewEditForm from "components/common/new-edit-form";
import { PackageAPI, listUrl } from "lib/api/package";
import { useAppState } from "lib/context/app";
import RoomTypeSelect from "components/select/room-type";
import NumberSelect from "components/select/number-select";
import RateTypeSelect from "components/select/rate-type";
import { RateTypeSWR } from "lib/api/rate-type";
import { RateTypeAPI } from "lib/api/rate-type";

const validationSchema = yup.object().shape({
    RoomTypeID: yup.number().required("Бөглөнө үү").typeError("Бөглөнө үү"),
    RateTypeID: yup.number().required("Бөглөнө үү").typeError("Бөглөнө үү"),
    Adult: yup.number().required("Бөглөнө үү").typeError("Бөглөнө үү"),
    Child: yup.number().required("Бөглөнө үү").typeError("Бөглөнө үү"),
    RoomRate: yup.number().required("Бөглөнө үү").typeError("Бөглөнө үү"),
    RoomTypeName: yup.string().notRequired(),
    RateTypeName: yup.string().notRequired(),
    RoomRateExtraAdult: yup
        .number()
        .required("Бөглөнө үү")
        .typeError("Бөглөнө үү"),
    RoomRateExtraChild: yup
        .number()
        .required("Бөглөнө үү")
        .typeError("Бөглөнө үү"),
    MaxAdult: yup.number().required("Бөглөнө үү").typeError("Бөглөнө үү"),
    MaxChild: yup.number().required("Бөглөнө үү").typeError("Бөглөнө үү"),
});

const NewEdit = ({ entity, setEntity, currentData, handleModal }: any) => {
    const intl = useIntl();
    const [roomType, setRoomType] = useState<any>(null);
    const [rateType, setRateType] = useState<any>(null);
    const [maxAdult, setMaxAdult] = useState<any>(null);
    const [maxChild, setMaxChild] = useState<any>(null);

    const { data, error } = RateTypeSWR({});
    const [state]: any = useAppState();
    const {
        register,
        reset,
        handleSubmit,
        control,
        formState: { errors },
        resetField,
        getValues,
    } = useForm({ resolver: yupResolver(validationSchema) });

    useEffect(() => {
        if (currentData) {
            reset(currentData);
            setRoomType({ RoomTypeID: currentData.RoomTypeID });
            setRateType(currentData.RateTypeID);
            setMaxChild(currentData.MaxChild);
            setMaxAdult(currentData.MaxAdult);
        }
    }, [currentData]);

    const onRoomTypeChange = async (evt: any) => {
        try {
            setRoomType(evt);
            console.log("evt", evt);
            let contractRates: any = null;
            if (rateType) {
                const arr2: any = await RateTypeAPI?.baseRateList(rateType);

                contractRates = arr2.filter(
                    (entity: any) =>
                        Number(entity.RoomTypeID) === Number(evt.RoomTypeID)
                );
            }

            if (contractRates && contractRates[0]) {
                resetField(`RoomRate`, {
                    defaultValue: contractRates[0].BaseRate,
                });
                resetField(`RoomRateExtraAdult`, {
                    defaultValue: contractRates[0].ExtraAdult,
                });
                resetField(`RoomRateExtraChild`, {
                    defaultValue: contractRates[0].ExtraChild,
                });
            }

            resetField(`RoomTypeName`, {
                defaultValue: evt.RoomTypeName,
            });
            resetField(`MaxAdult`, {
                defaultValue: evt.MaxAdult,
            });
            resetField(`MaxChild`, {
                defaultValue: evt.MaxChild,
            });
        } finally {
        }
    };

    const onRateTypeChange = async (evt: any) => {
        try {
            let rateData = data.filter(
                (entity: any) =>
                    Number(entity.RateTypeID) === Number(evt.target.value)
            );

            setRateType(evt.target.value);

            const arr2: any = await RateTypeAPI?.baseRateList(evt.target.value);
            let contractRates: any = null;

            if (arr2 && roomType) {
                contractRates = arr2.filter(
                    (entity: any) =>
                        Number(entity.RoomTypeID) ===
                        Number(roomType.RoomTypeID)
                );
            }
            if (contractRates && contractRates[0]) {
                resetField(`RoomRate`, {
                    defaultValue: contractRates[0].BaseRate,
                });
                resetField(`RoomRateExtraAdult`, {
                    defaultValue: contractRates[0].ExtraAdult,
                });
                resetField(`RoomRateExtraChild`, {
                    defaultValue: contractRates[0].ExtraChild,
                });
                resetField(`RateTypeName`, {
                    defaultValue: rateData[0].RateTypeName,
                });
            }
        } finally {
        }
    };

    const customSubmit = async (values: any) => {
        try {
            values.Rate = values.RoomRate;
            let newEntity = [...entity];
            newEntity.push(values);
            setEntity(newEntity);
            handleModal();
        } finally {
        }
    };

    return (
        <NewEditForm
            api={PackageAPI}
            listUrl={listUrl}
            additionalValues={state.editId && {}}
            reset={reset}
            handleSubmit={handleSubmit}
            customSubmit={customSubmit}
        >
            <Grid container spacing={1}>
                <Grid item xs={8}>
                    <RoomTypeSelect
                        register={register}
                        errors={errors}
                        onRoomTypeChange={onRoomTypeChange}
                        baseStay={roomType}
                    />
                </Grid>

                <Grid item xs={2}>
                    <NumberSelect
                        numberMin={0}
                        numberMax={
                            maxAdult
                                ? maxAdult
                                : roomType?.MaxAdult
                                ? roomType?.MaxAdult
                                : 0
                        }
                        nameKey={`Adult`}
                        register={register}
                        errors={errors}
                        customError={errors && errors?.Adult}
                        customHelperText={errors && errors?.Child}
                        label={intl.formatMessage({
                            id: "TextAdult",
                        })}
                        defaultValue={currentData ? currentData.Adult : 0}
                    />
                </Grid>

                <Grid item xs={2}>
                    <NumberSelect
                        numberMin={0}
                        numberMax={
                            maxChild
                                ? maxChild
                                : roomType?.MaxChild
                                ? roomType?.MaxChild
                                : 0
                        }
                        nameKey={`Child`}
                        register={register}
                        errors={errors}
                        label={intl.formatMessage({
                            id: "TextChild",
                        })}
                        defaultValue={currentData ? currentData.Child : 0}
                    />
                </Grid>

                <Grid item xs={12}>
                    <RateTypeSelect
                        register={register}
                        errors={errors}
                        onChange={onRateTypeChange}
                        value={rateType}
                    />
                </Grid>

                <Grid item xs={4}>
                    <TextField
                        size="small"
                        type="number"
                        fullWidth
                        id="RoomRate"
                        label="Room Rate"
                        {...register(`RoomRate`)}
                        margin="dense"
                        error={errors.RoomRate?.message}
                        helperText={errors.RoomRate?.message}
                        InputLabelProps={{
                            shrink: getValues(`RoomRate`),
                        }}
                    />
                </Grid>

                <Grid item xs={4}>
                    <TextField
                        size="small"
                        type="number"
                        fullWidth
                        id="RoomRateExtraAdult"
                        label="Extra Adult"
                        {...register(`RoomRateExtraAdult`)}
                        margin="dense"
                        error={errors.RoomRateExtraAdult?.message}
                        helperText={errors.RoomRateExtraAdult?.message}
                        InputLabelProps={{
                            shrink: getValues(`RoomRateExtraAdult`),
                        }}
                    />
                </Grid>

                <Grid item xs={4}>
                    <TextField
                        size="small"
                        type="number"
                        fullWidth
                        id="RoomRateExtraChild"
                        label="Extra Child"
                        {...register(`RoomRateExtraChild`)}
                        margin="dense"
                        error={errors.RoomRateExtraChild?.message}
                        helperText={errors.RoomRateExtraChild?.message}
                        InputLabelProps={{
                            shrink: getValues(`RoomRateExtraChild`),
                        }}
                    />
                </Grid>

                <Grid item xs={12}>
                    <TextField
                        size="small"
                        type="number"
                        fullWidth
                        id="Quantity"
                        label="Quantity"
                        {...register(`Quantity`)}
                        margin="dense"
                    />
                </Grid>

                <Grid item xs={12}>
                    <TextField
                        size="small"
                        fullWidth
                        id="RoomTypeName"
                        label="RoomTypeName"
                        {...register(`RoomTypeName`)}
                        margin="dense"
                        style={{ display: "none" }}
                    />
                </Grid>

                <Grid item xs={12}>
                    <TextField
                        size="small"
                        fullWidth
                        id="RateTypeName"
                        label="RateTypeName"
                        {...register(`RateTypeName`)}
                        margin="dense"
                        style={{ display: "none" }}
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        size="small"
                        fullWidth
                        id="MaxAdult"
                        label="MaxAdult"
                        {...register(`MaxAdult`)}
                        margin="dense"
                        style={{ display: "none" }}
                    />
                </Grid>

                <Grid item xs={12}>
                    <TextField
                        size="small"
                        fullWidth
                        id="MaxChild"
                        label="MaxChild"
                        {...register(`MaxChild`)}
                        margin="dense"
                        style={{ display: "none" }}
                    />
                </Grid>
            </Grid>
        </NewEditForm>
    );
};

export default NewEdit;
