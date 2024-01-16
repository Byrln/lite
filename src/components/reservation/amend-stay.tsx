import { TextField, Grid, Checkbox, FormControlLabel } from "@mui/material";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { useState, useContext, useEffect } from "react";
import { mutate } from "swr";
import { toast } from "react-toastify";
import { ReservationAPI } from "lib/api/reservation";
import SubmitButton from "components/common/submit-button";
import { ModalContext } from "lib/context/modal";
import { listUrl } from "lib/api/front-office";

import {
    dateToSimpleFormat,
    fToUniversal,
    fToCustom,
    dateToCustomFormat,
    countNights,
} from "lib/utils/format-time";

const AmendStayForm = ({
    transactionInfo,
    reservation,
    additionalMutateUrl,
}: any) => {
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
        ArrivalDate: yup.date().required("Сонгоно уу"),
        ArrivalTime: yup.string().required("Сонгоно уу"),
        DepartureDate: yup.date().required("Сонгоно уу"),
        DepartureTime: yup.string().required("Сонгоно уу"),
        OverrideRate: yup.bool().notRequired(),
        NewNights: yup.number().required(),
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
        reset({
            TransactionID: transactionInfo.TransactionID,
            ArrivalDate: dateToSimpleFormat(dateStart),
            DepartureDate: dateToSimpleFormat(dateEnd),
            ArrivalTime: fToCustom(dateStart, "kk:mm"),
            DepartureTime: fToCustom(dateEnd, "kk:mm"),
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
        reset({
            TransactionID: transactionInfo.TransactionID,
        });

        var dateStart = new Date(transactionInfo.ArrivalDate);
        var dateEnd = new Date(transactionInfo.DepartureDate);
        setRange(dateStart, dateEnd);
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
            var vals: any = {
                TransactionID: values.TransactionID,
                ArrivalDate: null,
                DepartureDate: null,
                OverrideRate: values.OverrideRate,
                NewNights: values.NewNights,
            };

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

            const res = await ReservationAPI.amendStay(vals);

            await mutate(listUrl);

            if (additionalMutateUrl) {
                await mutate(additionalMutateUrl);
            }

            toast("Амжилттай.");

            setLoading(false);
            handleModal();
        } catch (error) {
            setLoading(false);
            handleModal();
        }
    };

    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)}>
                <input type="hidden" {...register("TransactionID")} />
                <input type="hidden" {...register("NewNights")} />

                <Grid container spacing={2}>
                    <Grid item xs={6}>
                        <TextField
                            type="date"
                            fullWidth
                            id="ArrivalDate"
                            label="Эхлэх огноо"
                            {...register("ArrivalDate")}
                            margin="dense"
                            error={errors.ArrivalDate?.message}
                            helperText={errors.ArrivalDate?.message}
                            InputLabelProps={{ shrink: true }}
                            // value={entity?.ArrivalDate && entity.ArrivalDate}
                            onChange={(evt: any) => {
                                onArrivalDateChange(evt);
                            }}
                        />
                    </Grid>
                    <Grid item xs={3}>
                        <TextField
                            id="ArrivalTime"
                            label="Ирэх цаг"
                            type="time"
                            margin="dense"
                            {...register("ArrivalTime")}
                            InputLabelProps={{
                                shrink: true,
                            }}
                            inputProps={{
                                step: 600, // 5 min
                            }}
                            sx={{ width: 150 }}
                            onChange={onArrivalTimeChange}
                        />
                    </Grid>
                </Grid>

                <Grid container spacing={2}>
                    <Grid item xs={6}>
                        <TextField
                            type="date"
                            fullWidth
                            id="DepartureDate"
                            label="Гарах огноо"
                            {...register("DepartureDate")}
                            margin="dense"
                            error={errors.DepartureDate?.message}
                            helperText={errors.DepartureDate?.message}
                            InputLabelProps={{ shrink: true }}
                            // value={entity?.DepartureDate && entity.DepartureDate}
                            onChange={(evt: any) => {
                                onDepartureDateChange(evt);
                            }}
                        />
                    </Grid>
                    <Grid item xs={3}>
                        <TextField
                            id="DepartureTime"
                            label="Гарах цаг"
                            type="time"
                            margin="dense"
                            {...register("DepartureTime")}
                            InputLabelProps={{
                                shrink: true,
                            }}
                            inputProps={{
                                step: 600, // 5 min
                            }}
                            sx={{ width: 150 }}
                            onChange={(evt: any) => {}}
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
                    label="Override  Rate"
                />

                <SubmitButton loading={loading} />
            </form>
        </>
    );
};

export default AmendStayForm;
