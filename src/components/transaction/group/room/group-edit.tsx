import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useState, useEffect } from "react";
import { useIntl } from "react-intl";
import {
    FormControlLabel,
    TextField,
    Grid,
    Checkbox,
    Divider,
    Radio,
    RadioGroup,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import moment from "moment";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { toast } from "react-toastify";
import { mutate } from "swr";

import { dateStringToObj } from "lib/utils/helpers";
import NewEditForm from "components/common/new-edit-form";
import { useAppState } from "lib/context/app";
import RateTypeSelect from "components/select/rate-type";
import GroupRoomCheck from "components/select/group-room-check";
import NumberSelect from "components/select/number-select";
import { FolioAPI, listUrl } from "lib/api/folio";
import { ChargeAPI, RoomChargeSWR } from "lib/api/charge";

const validationSchema = yup.object().shape({
    Balance: yup.string().notRequired(),
    Description: yup.string().notRequired(),
});

const baseStayDefault = {
    TransactionID: 0,
};

const NewEdit = ({
    GroupID = null,
    TransactionID = null,
    additionalMutateUrl,
    RoomID,
    customRerender,
}: any) => {
    const { data, error } = RoomChargeSWR({
        GroupID: GroupID,
        TransactionID: TransactionID,
    });
    const intl = useIntl();
    const [baseStay, setBaseStay]: any = useState(baseStayDefault);
    const [isChangeRate, setIsChangeRate]: any = useState(false);
    const [isChangepox, setIsChangepox]: any = useState(false);
    const [isManualRate, setIsManualRate]: any = useState(false);
    const [rateType, setRateType] = useState<any>(null);
    const [dateType, setDateType] = useState<any>("wholeStay");
    const [minDate, setMinDate] = useState<any>(null);
    const [maxDate, setMaxDate] = useState<any>(null);
    const [maxAdult, setMaxAdult] = useState<any>(null);
    const [maxChild, setMaxChild] = useState<any>(null);
    const [roomsCheck, setRoomsCheck] = useState(false);
    const [initialRooms, setInitialRooms] = useState<any>([String(RoomID)]);

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

    useEffect(() => {
        if (data) {
            const dates = data.map((item: any) => new Date(item.StayDate));
            const adults = data.map((item: any) => item.MaxAdult);
            const childs = data.map((item: any) => item.MaxChild);

            setMinDate(moment(Math.min(...dates)).format("YYYY-MM-DD"));
            setMaxDate(moment(Math.max(...dates)).format("YYYY-MM-DD"));
            setMaxAdult(Math.min(...adults));
            setMaxChild(Math.max(...childs));
        }
    }, [data]);

    const customSubmit = async (values: any) => {
        try {
            const filteredData = data.filter(
                (item: any) =>
                    values.RoomIDs.includes(item.RoomID.toString()) &&
                    (dateType == "wholeStay" ||
                        moment(item.StayDate).format("YYYY-MM-DD") ==
                            moment(values.Date).format("YYYY-MM-DD"))
            );

            for (const entity of filteredData) {
                try {
                    if (isChangeRate) {
                        let tempRateTypeValues = {
                            RoomChargeID: entity.RoomChargeID,
                            StayDate: moment(entity.StayDate).format(
                                "YYYY-MM-DD"
                            ),
                            RateTypeID: values.RateTypeID,
                            Override: isChangeRate ? true : false,
                            ApplytoAll: 1,
                        };

                        await ChargeAPI?.updateRateType(tempRateTypeValues);

                        if (isManualRate) {
                            let tempManual = {
                                Override: true,
                                RoomChargeID: entity.RoomChargeID,
                                Amount: Number(values.amount),
                                ApplytoAll: 1,
                                StayDate: moment(entity.StayDate).format(
                                    "YYYY-MM-DD"
                                ),
                            };

                            await ChargeAPI?.UpdateRate(tempManual);
                        }
                    }

                    if (isChangepox) {
                        let tempPoxValues = {
                            RoomChargeID: entity.RoomChargeID,
                            StayDate: moment(entity.StayDate).format(
                                "YYYY-MM-DD"
                            ),
                            Adult: values.Adult,
                            Child: values.Child,
                            Override: isChangepox ? true : false,
                            ApplytoAll: 1,
                        };

                        await ChargeAPI?.UpdatePax(tempPoxValues);
                    }
                } catch (error) {
                    console.error("Error updating entity:", error);
                }
            }

            toast(
                intl.formatMessage({
                    id: "TextSuccess",
                })
            );
        } finally {
            if (customRerender) {
                customRerender;
            }
            mutate("/api/Reservation/List");
        }
    };

    const onRateTypeChange = async (evt: any) => {
        try {
            setRateType(evt.target.value);
        } finally {
        }
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        let value = (event.target as HTMLInputElement).value;
        setDateType(value);
    };

    return (
        <NewEditForm
            api={FolioAPI}
            listUrl="/api/FrontOffice/ReservationDetailsByDate"
            reset={reset}
            handleSubmit={handleSubmit}
            setEntity={setBaseStay}
            customSubmit={customSubmit}
        >
            <Grid container spacing={1}>
                <Grid item xs={12}>
                    <div
                        style={{ background: "#f5f4f4", borderRadius: "6px" }}
                        className="p-2"
                    >
                        <GroupRoomCheck
                            GroupID={GroupID}
                            register={register}
                            errors={errors}
                            title={intl.formatMessage({
                                id: "ConfigRooms",
                            })}
                            resetField={resetField}
                            setAllCheck={setRoomsCheck}
                            allCheck={roomsCheck}
                            initialChecks={initialRooms}
                            TransactionID={TransactionID}
                        />
                    </div>
                </Grid>
                <Grid item xs={12}>
                    <Divider className="mt-3 mb-3" />
                    <FormControlLabel
                        control={
                            <Controller
                                name="isChangeRate"
                                control={control}
                                render={(props: any) => (
                                    <Checkbox
                                        {...register("isChangeRate")}
                                        checked={
                                            isChangeRate && isChangeRate == true
                                                ? true
                                                : false
                                        }
                                        onChange={(e) => (
                                            props.field.onChange(
                                                e.target.checked
                                            ),
                                            setIsChangeRate(e.target.checked)
                                        )}
                                    />
                                )}
                            />
                        }
                        label={intl.formatMessage({
                            id: "ButtonUpdateRate",
                        })}
                    />
                </Grid>
                {isChangeRate ? (
                    <>
                        <Grid item xs={6}>
                            <RateTypeSelect
                                register={register}
                                errors={errors}
                                onChange={onRateTypeChange}
                                value={rateType}
                            />
                            <FormControlLabel
                                control={
                                    <Controller
                                        name="isManualRate"
                                        control={control}
                                        render={(props: any) => (
                                            <Checkbox
                                                {...register("isManualRate")}
                                                checked={
                                                    isManualRate &&
                                                    isManualRate == true
                                                        ? true
                                                        : false
                                                }
                                                onChange={(e) => (
                                                    props.field.onChange(
                                                        e.target.checked
                                                    ),
                                                    setIsManualRate(
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
                            />
                        </Grid>
                        <Grid item xs={6}>
                            {isManualRate ? (
                                <TextField
                                    size="small"
                                    type="number"
                                    fullWidth
                                    id="amount"
                                    label="Amount"
                                    {...register(`amount`)}
                                    margin="dense"
                                    error={errors.amount?.message}
                                    helperText={errors.amount?.message}
                                />
                            ) : (
                                <></>
                            )}
                        </Grid>
                    </>
                ) : (
                    <></>
                )}

                <Grid item xs={12}>
                    <Divider className="mt-3 mb-3" />

                    <FormControlLabel
                        control={
                            <Controller
                                name="isChangepox"
                                control={control}
                                render={(props: any) => (
                                    <Checkbox
                                        {...register("isChangepox")}
                                        checked={
                                            isChangepox && isChangepox == true
                                                ? true
                                                : false
                                        }
                                        onChange={(e) => (
                                            props.field.onChange(
                                                e.target.checked
                                            ),
                                            setIsChangepox(e.target.checked)
                                        )}
                                    />
                                )}
                            />
                        }
                        label={intl.formatMessage({
                            id: "ButtonEditGuestInfo",
                        })}
                    />
                </Grid>
                {isChangepox ? (
                    <>
                        <Grid item xs={6}>
                            <NumberSelect
                                numberMin={0}
                                numberMax={maxAdult}
                                nameKey={"Adult"}
                                register={register}
                                errors={errors}
                                label={intl.formatMessage({
                                    id: "TextAdult",
                                })}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <NumberSelect
                                numberMin={0}
                                numberMax={maxChild}
                                nameKey={"Child"}
                                register={register}
                                errors={errors}
                                label={intl.formatMessage({
                                    id: "TextChild",
                                })}
                            />
                        </Grid>
                    </>
                ) : (
                    <></>
                )}
                <Grid item xs={12}>
                    <Divider className="mt-3 mb-3" />

                    <RadioGroup
                        row
                        aria-labelledby="demo-row-radio-buttons-group-label"
                        name="row-radio-buttons-group"
                        value={dateType}
                        onChange={handleChange}
                        defaultValue={"30"}
                    >
                        <FormControlLabel
                            value="wholeStay"
                            control={<Radio />}
                            id="wholeStay"
                            label={intl.formatMessage({
                                id: "TextApplytoWholeStay",
                            })}
                            // {...register("TextWeekly")}
                        />
                        <FormControlLabel
                            value="selectedDate"
                            control={<Radio />}
                            id="selectedDate"
                            label={intl.formatMessage({
                                id: "TextApplytoSelectedDate",
                            })}
                            // {...register("TextWeekly")}
                        />
                    </RadioGroup>
                </Grid>
                {dateType == "selectedDate" && minDate && maxDate ? (
                    <Grid item xs={12}>
                        <LocalizationProvider // @ts-ignore
                            dateAdapter={AdapterDateFns}
                        >
                            <Controller
                                name="Date"
                                control={control}
                                defaultValue={new Date(minDate)}
                                render={({ field: { onChange, value } }) => (
                                    <DatePicker
                                        label={intl.formatMessage({
                                            id: "TextDate",
                                        })}
                                        value={value}
                                        minDate={new Date(minDate)}
                                        maxDate={new Date(maxDate)}
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
                                                id="Date"
                                                {...register("Date")}
                                                margin="dense"
                                                fullWidth
                                                {...params}
                                                error={errors.Date?.message}
                                                helperText={
                                                    errors.Date?.message
                                                }
                                            />
                                        )}
                                    />
                                )}
                            />
                        </LocalizationProvider>
                    </Grid>
                ) : (
                    <></>
                )}
            </Grid>
        </NewEditForm>
    );
};

export default NewEdit;
