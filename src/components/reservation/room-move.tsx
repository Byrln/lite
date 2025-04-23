import { TextField, Grid, Checkbox, FormControlLabel } from "@mui/material";
import { useIntl } from "react-intl";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { useState, useContext, useEffect } from "react";
import { mutate } from "swr";
import { toast } from "react-toastify";
import { LoadingButton } from "@mui/lab";
import RadioGroup from "@mui/material/RadioGroup";
import Radio from "@mui/material/Radio";
import FormControl from "@mui/material/FormControl";

import { ReservationAPI } from "lib/api/reservation";
import { ModalContext } from "lib/context/modal";
import { listUrl } from "lib/api/front-office";
import RoomTypeSelect from "../select/room-type";
import RoomSelect from "../select/room";
import { dateToCustomFormat } from "lib/utils/format-time";
import { RateAPI } from "../../lib/api/rate";

const RoomMoveForm = ({
    transactionInfo,
    reservation,
    additionalMutateUrl,
    customRerender,
}: any) => {
    const intl = useIntl();
    const { handleModal }: any = useContext(ModalContext);
    const [loading, setLoading] = useState(false);
    const [baseStay, setBaseStay]: any = useState({
        roomType: {
            RoomTypeID: transactionInfo.RoomTypeID
                ? transactionInfo.RoomTypeID
                : null,
        },
        room: {
            RoomID: transactionInfo.RoomID ? transactionInfo.RoomID : null,
        },
        rate: null,
        dateStart: new Date(transactionInfo.ArrivalDate),
        dateEnd: new Date(transactionInfo.DepartureDate),
        NewRate: 0,
        // Nights: 1,
    });
    const [roomType, setRoomType]: any = useState(null);

    const [rateCondition, setRateCondition] = useState({
        overrideRate: false,
        newRateMode: "normal",
    });

    const isManualRate = () => {
        return (rateCondition.overrideRate =
            "on" && rateCondition.newRateMode === "manual");
    };

    const onRoomChange = (r: any) => {
        setBaseStay({
            ...baseStay,
            room: r,
        });
        // if (!isManualRate()) {
        //     calculateAmount();
        // }
    };

    const validationSchema = yup.object().shape({
        TransactionID: yup.number().required("Сонгоно уу"),
        RoomTypeID: yup.number().required("Сонгоно уу"),
        RoomID: yup.number().notRequired(),
        OverrideRate: yup.boolean().notRequired(),
        NewRate: yup.number().notRequired(),
    });
    const formOptions = { resolver: yupResolver(validationSchema) };

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        resetField,
    } = useForm(formOptions);

    const onSubmit = async (values: any) => {
        setLoading(true);
        try {
            values.NewRoomTypeID = roomType.RoomTypeID
                ? roomType.RoomTypeID
                : values.RoomTypeID;
            values.NewRoomID = values.RoomID;
            delete values.RoomTypeID;
            delete values.RoomID;

            const res = await ReservationAPI.roomMove(values);

            await mutate(listUrl);
            if (additionalMutateUrl) {
                await mutate(additionalMutateUrl);
            }
            toast(
                intl.formatMessage({
                    id: "TextSuccess",
                })
            );

            if (customRerender) {
                customRerender();
            }
            setLoading(false);
            handleModal();
        } catch (error) {
            setLoading(false);
            handleModal();
        }
    };
    const onOverrideRateChange = (evt: any) => {
        setRateCondition({
            ...rateCondition,
            overrideRate: evt.target.checked,
        });
    };

    const onNewRateModeChange = (evt: any) => {
        setRateCondition({
            ...rateCondition,
            newRateMode: evt.target.value,
        });
    };

    const calculateAmount = async (rt: any) => {
        var values = {
            CurrDate: dateToCustomFormat(baseStay.dateStart, "yyyy-MM-dd"),
            RoomTypeID: rt.RoomTypeID,
            RateTypeID: transactionInfo.RateTypeID,
            ChannelID: 0,
            SourceID: 0,
            CustomerID: 0,
            // TaxIncluded: reservationModel.TaxIncluded,
            TaxIncluded: true,
            RoomChargeDuration: 1,
            ContractRate: false,
            EmptyRow: false,
        };

        try {
            var rates = await RateAPI.listByDate(values);

            var amount;

            if (rates.length > 0) {
                amount = rates[0].BaseRate;
            } else {
                return;
            }
            resetField(`NewRate`, {
                defaultValue: amount,
            });

            setBaseStay({
                ...baseStay,
                NewRate: amount,
            });
        } catch (exp) {}
    };

    const onRoomTypeChange = (rt: any) => {
        setBaseStay({
            ...baseStay,
            roomType: rt,
        });
        setRoomType(rt);

        if (!isManualRate()) {
            calculateAmount(rt);
        }
    };

    useEffect(() => {
        if (transactionInfo && transactionInfo.RoomTypeID) {
            setRoomType({ RoomTypeID: transactionInfo.RoomTypeID });
        }
    }, [transactionInfo]);

    return (
        <>
            tews
            <form onSubmit={handleSubmit(onSubmit)}>
                <input
                    type="hidden"
                    {...register("TransactionID")}
                    value={transactionInfo.TransactionID}
                />

                <Grid container spacing={2}>
                    {roomType && (
                        <Grid item xs={12}>
                            <RoomTypeSelect
                                register={register}
                                errors={errors}
                                onRoomTypeChange={onRoomTypeChange}
                                baseStay={roomType}
                            />
                        </Grid>
                    )}
                    {roomType && (
                        <Grid item xs={12}>
                            <RoomSelect
                                register={register}
                                errors={errors}
                                baseStay={baseStay}
                                onRoomChange={onRoomChange}
                                roomType={roomType}
                                resetField={resetField}
                            />
                        </Grid>
                    )}
                </Grid>

                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        {rateCondition && (
                            <div>
                                <FormControlLabel
                                    sx={{ my: 2 }}
                                    control={
                                        <Checkbox
                                            id={"OverrideRate"}
                                            {...register("OverrideRate")}
                                            onChange={onOverrideRateChange}
                                            // checked={rateCondition.overrideRate}
                                        />
                                    }
                                    label={intl.formatMessage({
                                        id: "TextOverrideRoomRate",
                                    })}
                                />
                            </div>
                        )}

                        <div>
                            <FormControl component="fieldset">
                                <RadioGroup
                                    row
                                    id="GenderID"
                                    onChange={onNewRateModeChange}
                                >
                                    <FormControlLabel
                                        value={"normal"}
                                        control={<Radio />}
                                        label={intl.formatMessage({
                                            id: "ReportNormalRate",
                                        })}
                                        checked={
                                            rateCondition.newRateMode ===
                                            "normal"
                                        }
                                    />

                                    <FormControlLabel
                                        value={"manual"}
                                        control={<Radio />}
                                        label={intl.formatMessage({
                                            id: "TextManualRate",
                                        })}
                                        checked={
                                            rateCondition.newRateMode ===
                                            "manual"
                                        }
                                    />
                                </RadioGroup>
                            </FormControl>
                        </div>

                        {/* {isManualRate() ? ( */}
                        <TextField
                            fullWidth
                            id="NewRate"
                            label={intl.formatMessage({
                                id: "TextAmount",
                            })}
                            {...register("NewRate")}
                            margin="dense"
                            error={errors.NewRate?.message}
                            helperText={errors.NewRate?.message}
                            disabled={!isManualRate()}
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                        {/* ) : (
                            <></>
                        )} */}
                    </Grid>
                </Grid>

                <div style={{ display: "flex", flexDirection: "row-reverse" }}>
                    <LoadingButton
                        size="small"
                        type="submit"
                        variant="contained"
                        loading={loading}
                        className="mt-3"
                    >
                        {intl.formatMessage({
                            id: "ButtonRoomMove",
                        })}
                    </LoadingButton>
                </div>
            </form>
        </>
    );
};

export default RoomMoveForm;
