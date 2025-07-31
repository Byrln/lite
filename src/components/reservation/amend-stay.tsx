import { TextField, Grid, Checkbox, FormControlLabel } from "@mui/material";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { useState, useContext, useEffect } from "react";
import { mutate } from "swr";
import { useIntl } from "react-intl";

import { ReservationAPI } from "lib/api/reservation";
import SubmitButton from "components/common/submit-button";
import { ModalContext } from "lib/context/modal";
import { listUrl } from "lib/api/front-office";
import {
    dateToSimpleFormat,
    fToCustom,
    dateToCustomFormat,
    countNights,
} from "lib/utils/format-time";

const AmendStayForm = ({
    transactionInfo,
    reservation,
    additionalMutateUrl = null,
    customRerender,
}: any) => {
    const intl = useIntl();
    const { handleModal }: any = useContext(ModalContext);
    const [loading, setLoading] = useState(false);
    const [baseStay, setBaseStay]: any = useState({
        TransactionID: 0,
        roomType: null,
        dateStart: null,
        dateEnd: null,
        nights: 0,
    });

    const validationSchema = yup.object().shape({
        ArrivalDate: yup.date().required(intl.formatMessage({ id: "ValidationRequired" })),
        ArrivalTime: yup.string().required(intl.formatMessage({ id: "ValidationRequired" })),
        DepartureDate: yup.date().required(intl.formatMessage({ id: "ValidationRequired" })),
        DepartureTime: yup.string().required(intl.formatMessage({ id: "ValidationRequired" })),
        OverrideRate: yup.bool().notRequired(),
        NewNights: yup.number().typeError(intl.formatMessage({ id: "ValidationRequired" })).required(intl.formatMessage({ id: "ValidationRequired" })),
    });
    const formOptions = { resolver: yupResolver(validationSchema) };

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm(formOptions);

    const setRange = (dateStart: Date, dateEnd: Date) => {
        var nights = countNights(dateStart, dateEnd);
        
        // Extract time in HH:mm format directly to avoid timezone issues
        const arrivalTime = dateStart.toTimeString().substring(0, 5);
        const departureTime = dateEnd.toTimeString().substring(0, 5);
        
        reset({
            TransactionID: transactionInfo.TransactionID,
            ArrivalDate: dateToSimpleFormat(dateStart),
            DepartureDate: dateToSimpleFormat(dateEnd),
            ArrivalTime: arrivalTime,
            DepartureTime: departureTime,
            NewNights: nights,
        });
        setBaseStay({
            ...baseStay,
            dateStart: dateStart,
            dateEnd: dateEnd,
            nights: nights,
        });
    };

    useEffect(() => {
        var dateStart = new Date(transactionInfo.ArrivalDate);
        var dateEnd = new Date(transactionInfo.DepartureDate);
        
        // Extract time components directly from ISO string to avoid timezone issues
        const arrivalTimeMatch = typeof transactionInfo.ArrivalDate === 'string' ? transactionInfo.ArrivalDate.match(/T(\d{2}:\d{2})/) : null;
        const departureTimeMatch = typeof transactionInfo.DepartureDate === 'string' ? transactionInfo.DepartureDate.match(/T(\d{2}:\d{2})/) : null;
        
        const arrivalTime = arrivalTimeMatch ? arrivalTimeMatch[1] : "14:00";
        const departureTime = departureTimeMatch ? departureTimeMatch[1] : "12:00";
        
        // Preserve original times from transactionInfo
        var nights = countNights(dateStart, dateEnd);
        reset({
            TransactionID: transactionInfo.TransactionID,
            ArrivalDate: dateToSimpleFormat(dateStart),
            DepartureDate: dateToSimpleFormat(dateEnd),
            ArrivalTime: arrivalTime,
            DepartureTime: departureTime,
            NewNights: nights,
        });
        setBaseStay({
            ...baseStay,
            dateStart: dateStart,
            dateEnd: dateEnd,
            nights: nights,
        });
    }, []);

    const onArrivalDateChange = (evt: any) => {
        var dateStart = new Date(evt.target.value);
        var dateEnd = new Date(baseStay.dateEnd.getTime());

        if (
            dateToCustomFormat(dateStart, "yyyyMMdd") >
            dateToCustomFormat(dateEnd, "yyyyMMdd")
        ) {
            dateEnd = new Date(dateStart.getTime());
            dateEnd.setDate(dateEnd.getDate() + 1);
        }
        setRange(dateStart, dateEnd);
    };

    const onArrivalTimeChange = (evt: any) => {
        var dateStart = new Date(
            dateToSimpleFormat(baseStay.dateStart) + " " + evt.target.value
        );
        var dateEnd = new Date(baseStay.dateEnd.getTime());
        setRange(dateStart, dateEnd);
    };

    const onDepartureDateChange = (evt: any) => {
        var dateStart = new Date(baseStay.dateStart.getTime());
        var dateEnd = new Date(evt.target.value);

        if (
            dateToCustomFormat(dateStart, "yyyyMMdd") >
            dateToCustomFormat(dateEnd, "yyyyMMdd")
        ) {
            dateStart = new Date(dateEnd.getTime());
            dateStart.setDate(dateStart.getDate() - 1);
        }
        setRange(dateStart, dateEnd);
    };

    const onDepartureTimeChange = (evt: any) => {
        var dateStart = new Date(baseStay.dateStart.getTime());
        var dateEnd = new Date(
            dateToSimpleFormat(baseStay.dateEnd) + " " + evt.target.value
        );
        setRange(dateStart, dateEnd);
    };

    const onSubmit = async (values: any) => {
        setLoading(true);
        try {
            if (
                transactionInfo.TransactionID.length != "undefined" &&
                transactionInfo.TransactionID.length > 0
            ) {
                transactionInfo.TransactionID.forEach(async (room: any) => {
                    if (room.isChecked == true) {
                        let vals: any = {
                            ArrivalDate: null,
                            DepartureDate: null,
                            OverrideRate: values.OverrideRate,
                            NewNights: values.NewNights,
                        };

                        if (transactionInfo.GroupID && values.isGroup == true) {
                            vals.GroupID = transactionInfo.GroomID;
                        } else {
                            vals.TransactionID = room.TransactionID;
                        }

                        vals.ArrivalDate =
                            fToCustom(
                                values.ArrivalDate.getTime(),
                                "yyyy MMM dd"
                            ) +
                            " " +
                            values.ArrivalTime +
                            ":00";
                        vals.DepartureDate =
                            fToCustom(
                                values.DepartureDate.getTime(),
                                "yyyy MMM dd"
                            ) +
                            " " +
                            values.DepartureTime +
                            ":00";
                        if (transactionInfo.GroupID && values.isGroup == true) {
                            const res = await ReservationAPI.groupAmendStay({
                                ArrivalDate:
                                    fToCustom(
                                        values.ArrivalDate.getTime(),
                                        "yyyy MMM dd"
                                    ) +
                                    " " +
                                    values.ArrivalTime +
                                    ":00",
                                DepartureDate:
                                    fToCustom(
                                        values.DepartureDate.getTime(),
                                        "yyyy MMM dd"
                                    ) +
                                    " " +
                                    values.DepartureTime +
                                    ":00",
                                OverrideRate: values.OverrideRate,
                                NewNights: values.NewNights,
                                GroupID: transactionInfo.GroupID,
                            });
                        } else {
                            const res = await ReservationAPI.amendStay({
                                ArrivalDate:
                                    fToCustom(
                                        values.ArrivalDate.getTime(),
                                        "yyyy MMM dd"
                                    ) +
                                    " " +
                                    values.ArrivalTime +
                                    ":00",
                                DepartureDate:
                                    fToCustom(
                                        values.DepartureDate.getTime(),
                                        "yyyy MMM dd"
                                    ) +
                                    " " +
                                    values.DepartureTime +
                                    ":00",
                                OverrideRate: values.OverrideRate,
                                NewNights: values.NewNights,
                                TransactionID: room.TransactionID,
                            });
                        }
                    }
                });
            } else {
                let vals: any = {
                    ArrivalDate: null,
                    DepartureDate: null,
                    OverrideRate: values.OverrideRate,
                    NewNights: values.NewNights,
                };

                if (transactionInfo.GroupID && values.isGroup == true) {
                    vals.GroupID = transactionInfo.GroomID;
                } else {
                    vals.TransactionID = transactionInfo.TransactionID;
                }
                vals.ArrivalDate =
                    fToCustom(values.ArrivalDate.getTime(), "yyyy MMM dd") +
                    " " +
                    values.ArrivalTime +
                    ":00";
                vals.DepartureDate =
                    fToCustom(values.DepartureDate.getTime(), "yyyy MMM dd") +
                    " " +
                    values.DepartureTime +
                    ":00";

                if (transactionInfo.GroupID && values.isGroup == true) {
                    const res = await ReservationAPI.groupAmendStay({
                        ArrivalDate:
                            fToCustom(
                                values.ArrivalDate.getTime(),
                                "yyyy MMM dd"
                            ) +
                            " " +
                            values.ArrivalTime +
                            ":00",
                        DepartureDate:
                            fToCustom(
                                values.DepartureDate.getTime(),
                                "yyyy MMM dd"
                            ) +
                            " " +
                            values.DepartureTime +
                            ":00",
                        OverrideRate: values.OverrideRate,
                        NewNights: values.NewNights,
                        GroupID: transactionInfo.GroupID,
                    });
                } else {
                    const res = await ReservationAPI.amendStay({
                        ArrivalDate:
                            fToCustom(
                                values.ArrivalDate.getTime(),
                                "yyyy MMM dd"
                            ) +
                            " " +
                            values.ArrivalTime +
                            ":00",
                        DepartureDate:
                            fToCustom(
                                values.DepartureDate.getTime(),
                                "yyyy MMM dd"
                            ) +
                            " " +
                            values.DepartureTime +
                            ":00",
                        OverrideRate: values.OverrideRate,
                        NewNights: values.NewNights,
                        TransactionID: transactionInfo.TransactionID,
                    });
                }
            }

            await mutate(listUrl);

            await mutate("/api/FrontOffice/TransactionInfo");
            console.log("22222", customRerender);

            if (additionalMutateUrl) {
                await mutate(additionalMutateUrl);
            }
            if (customRerender) {
                console.log("testtest1", customRerender);
                customRerender();
            }

            setLoading(false);
            handleModal();
        } catch (error) {
            setLoading(false);
            handleModal();
        }
    };

    return (
        <>
            <form id="modal-form" onSubmit={handleSubmit(onSubmit)}>
                <input type="hidden" {...register("TransactionID")} />
                <input type="hidden" {...register("NewNights")} />

                <Grid container spacing={2}>
                    <Grid item xs={8}>
                        <TextField
                            type="date"
                            fullWidth
                            id="ArrivalDate"
                            label={intl.formatMessage({
                                id: "TextArrivalDate",
                            })}
                            size="small"
                            {...register("ArrivalDate")}
                            margin="dense"
                            error={!!errors.ArrivalDate?.message}
                            helperText={errors.ArrivalDate?.message}
                            InputLabelProps={{ shrink: true }}
                            // value={entity?.ArrivalDate && entity.ArrivalDate}
                            onChange={(evt: any) => {
                                onArrivalDateChange(evt);
                            }}
                        />
                    </Grid>
                    <Grid item xs={4}>
                        <TextField
                            fullWidth
                            id="ArrivalTime"
                            label={intl.formatMessage({
                                id: "TextArrivalTime",
                            })}
                            type="time"
                            margin="dense"
                            {...register("ArrivalTime")}
                            InputLabelProps={{
                                shrink: true,
                            }}
                            inputProps={{
                                step: 600, // 5 min
                            }}
                            size="small"
                            onChange={onArrivalTimeChange}
                        />
                    </Grid>
                </Grid>

                <Grid container spacing={2}>
                    <Grid item xs={8}>
                        <TextField
                            type="date"
                            fullWidth
                            id="DepartureDate"
                            label={intl.formatMessage({
                                id: "TextDepartureDate",
                            })}
                            {...register("DepartureDate")}
                            margin="dense"
                            size="small"
                            error={!!errors.DepartureDate?.message}
                            helperText={errors.DepartureDate?.message}
                            InputLabelProps={{ shrink: true }}
                            // value={entity?.DepartureDate && entity.DepartureDate}
                            onChange={(evt: any) => {
                                onDepartureDateChange(evt);
                            }}
                        />
                    </Grid>
                    <Grid item xs={4}>
                        <TextField
                            fullWidth
                            id="DepartureTime"
                            label={intl.formatMessage({
                                id: "TextDepartureTime",
                            })}
                            type="time"
                            margin="dense"
                            {...register("DepartureTime")}
                            InputLabelProps={{
                                shrink: true,
                            }}
                            inputProps={{
                                step: 600, // 5 min
                            }}
                            size="small"
                            onChange={onDepartureTimeChange}
                        />
                    </Grid>
                </Grid>

                <FormControlLabel
                    control={
                        <Checkbox
                            id={"OverrideRate"}
                            {...register("OverrideRate")}
                        />
                    }
                    label={intl.formatMessage({
                        id: "TextOverrideRate",
                    })}
                />

                <FormControlLabel
                    control={
                        <Checkbox id={"isGroup"} {...register("isGroup")} />
                    }
                    label="Группээр сунгах"
                />
                <div style={{ display: "flex", flexDirection: "row-reverse" }}>
                    <SubmitButton loading={loading} fullWidth={false} />
                </div>
            </form>
        </>
    );
};

export default AmendStayForm;
