import {
    TextField,
    Grid,
    Checkbox,
    FormControlLabel,
    Box,
} from "@mui/material";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { useState, useContext, useEffect } from "react";
import { mutate } from "swr";
import { toast } from "react-toastify";
// import { ReservationApi } from "lib/api/reservation";
import { ModalContext } from "lib/context/modal";
import { listUrl } from "lib/api/front-office";
import { LoadingButton } from "@mui/lab";
// import ReasonSelect from "../select/reason";
import RoomTypeSelect from "../select/room-type";
import RoomSelect from "../select/room";
import { dateToCustomFormat, fToCustom } from "lib/utils/format-time";
import RadioGroup from "@mui/material/RadioGroup";
import Radio from "@mui/material/Radio";
import FormControl from "@mui/material/FormControl";
import { RateAPI } from "../../lib/api/rate";

const RoomMoveForm = ({ transactionInfo, reservation }: any) => {
    const { handleModal }: any = useContext(ModalContext);
    const [loading, setLoading] = useState(false);
    const [baseStay, setBaseStay]: any = useState({
        roomType: {
            RoomTypeID: transactionInfo.RoomTypeID,
        },
        room: {
            RoomID: transactionInfo.RoomID,
        },
        // rate: null,
        dateStart: new Date(transactionInfo.ArrivalDate),
        dateEnd: new Date(transactionInfo.DepartureDate),
        NewRate: 0,
        // Nights: 1,
    });

    const [rateCondition, setRateCondition] = useState({
        overrideRate: false,
        newRateMode: "normal",
    });

    const isManualRate = () => {
        return (
            rateCondition.overrideRate && rateCondition.newRateMode === "manual"
        );
    };

    const onRoomTypeChange = (rt: any) => {
        setBaseStay({
            ...baseStay,
            roomType: rt,
        });

        if (!isManualRate()) {
            calculateAmount();
        }
    };

    const onRoomChange = (r: any) => {
        setBaseStay({
            ...baseStay,
            room: r,
        });
    };

    const validationSchema = yup.object().shape({
        TransactionID: yup.number().required("Сонгоно уу"),
        RoomTypeID: yup.number().required("Сонгоно уу"),
        RoomID: yup.number().notRequired(),
        OverrideRate: yup.boolean().notRequired(),
        NewRate: yup.number().required(""),
    });
    const formOptions = { resolver: yupResolver(validationSchema) };

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm(formOptions);

    const onSubmit = async (values: any) => {
        setLoading(true);
        try {
            // const res = await ReservationApi.roomMove(values);

            await mutate(listUrl);

            toast("Амжилттай.");

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
            overrideRate: evt.target.value,
        });
    };

    const onNewRateModeChange = (evt: any) => {
        setRateCondition({
            ...rateCondition,
            newRateMode: evt.target.value,
        });
    };

    const calculateAmount = async () => {
        var values = {
            CurrDate: dateToCustomFormat(baseStay.dateStart, "yyyy MMM dd"),
            RoomTypeID: baseStay.roomType.RoomTypeID,
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

            reset({
                NewRate: amount,
            });

            setBaseStay({
                ...baseStay,
                NewRate: amount,
            });
        } catch (exp) {}
    };

    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)}>
                <input
                    type="text"
                    {...register("TransactionID")}
                    value={transactionInfo.TransactionID}
                />

                <Grid container spacing={2}>
                    <Grid item xs={8}>
                        <RoomTypeSelect
                            register={register}
                            errors={errors}
                            onRoomTypeChange={onRoomTypeChange}
                            baseStay={baseStay}
                        />
                    </Grid>
                    <Grid item xs={4}>
                        <RoomSelect
                            register={register}
                            errors={errors}
                            baseStay={baseStay}
                            onRoomChange={onRoomChange}
                        />
                    </Grid>
                </Grid>

                <Grid container spacing={2}>
                    <Grid item xs={6}>
                        <div>
                            <FormControlLabel
                                sx={{ my: 2 }}
                                control={
                                    <Checkbox
                                        id={"OverrideRate"}
                                        {...register("OverrideRate")}
                                        onChange={onOverrideRateChange}
                                        checked={rateCondition.overrideRate}
                                    />
                                }
                                label="OverrideRate"
                            />
                        </div>

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
                                        label={"Normal"}
                                        checked={
                                            rateCondition.newRateMode ===
                                            "normal"
                                        }
                                    />

                                    <FormControlLabel
                                        value={"manual"}
                                        control={<Radio />}
                                        label={"manual"}
                                        checked={
                                            rateCondition.newRateMode ===
                                            "manual"
                                        }
                                    />
                                </RadioGroup>
                            </FormControl>
                        </div>

                        <TextField
                            fullWidth
                            id="NewRate"
                            label="NewRate"
                            {...register("NewRate")}
                            margin="dense"
                            error={errors.NewRate?.message}
                            helperText={errors.NewRate?.message}
                            disabled={!isManualRate()}
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                    </Grid>
                </Grid>

                <LoadingButton
                    size="large"
                    type="submit"
                    variant="contained"
                    loading={loading}
                    className="mt-3"
                >
                    Room move
                </LoadingButton>
            </form>
        </>
    );
};

export default RoomMoveForm;
