import { Controller, useForm } from "react-hook-form";
import { Typography, Grid, TextField, FormControlLabel } from "@mui/material";
import Checkbox from "@mui/material/Checkbox";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useState, useEffect } from "react";
import { mutate } from "swr";
import { toast } from "react-toastify";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import moment from "moment";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";

import { dateStringToObj } from "lib/utils/helpers";
import { ReservationAPI } from "lib/api/reservation";
import SubmitButton from "components/common/submit-button";
import { countNights } from "lib/utils/format-time";

const validationSchema = yup.object().shape({
    ArrivalDate: yup.date().required("Бөглөнө үү"),
    DepartureDate: yup.date().required("Бөглөнө үү"),
    NewNights: yup.number(),
    OverrideRate: yup.boolean(),
    NewRate: yup.number(),
});

const NewEdit = ({ handleModal, entity, listUrl }: any) => {
    const [loading, setLoading] = useState(false);
    const [Nights, setNights]: any = useState("");
    const [ArrivalDate, setArrivalDate]: any = useState("");
    const [DepartureDate, setDepartureDate]: any = useState("");

    const {
        register,
        reset,
        handleSubmit,
        resetField,
        control,
        getValues,
        formState: { errors },
    } = useForm({ resolver: yupResolver(validationSchema) });

    useEffect(() => {
        if (entity) {
            if (entity.ArrivalDate) {
                resetField(`ArrivalDate`, {
                    defaultValue: entity.ArrivalDate,
                });
                setArrivalDate(entity.ArrivalDate);
            }

            if (entity.DepartureDate) {
                resetField(`DepartureDate`, {
                    defaultValue: entity.DepartureDate,
                });
                setDepartureDate(entity.DepartureDate);
            }

            if (entity.ArrivalDate && entity.DepartureDate) {
                setRange(entity.ArrivalDate, entity.DepartureDate);
            }
        }
    }, [entity]);

    const onSubmit = async (values: any) => {
        setLoading(true);
        try {
            values.TransactionID = entity.TransactionID;
            await ReservationAPI.amendStay(values);
            await mutate(listUrl);
            toast("Амжилттай.");
            setLoading(false);
            handleModal();
        } catch (error) {
            setLoading(false);
            handleModal();
        }
    };

    const setRange = (dateStart: Date, dateEnd: Date) => {
        var nights: number;
        nights = countNights(dateStart, dateEnd);

        setNights(nights);
        resetField(`NewNights`, {
            defaultValue: nights,
        });
    };

    useEffect(() => {
        if (ArrivalDate && DepartureDate) {
            setRange(ArrivalDate, DepartureDate);
        }
    }, [ArrivalDate, DepartureDate]);

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={1}>
                <Grid item xs={12}>
                    <Typography variant="subtitle2" component="div">
                        <Grid container spacing={1} className="mt-2">
                            <Grid item xs={6}>
                                <b> Өрөө.дугаар/Төрөл:</b>
                            </Grid>
                            <Grid item xs={6}>
                                {entity.RoomFullName}
                            </Grid>
                            <Grid item xs={6}>
                                <b>Одоогийн тариф:</b>
                            </Grid>
                            <Grid item xs={6}>
                                {entity.CurrentBalance}
                            </Grid>
                            <Grid item xs={6}>
                                <b>Нийт / Төлсөн:</b>
                            </Grid>
                            <Grid item xs={6}>
                                {entity.TotalAmount}/{entity.Deposit}
                            </Grid>
                            <Grid item xs={6}>
                                <b> Том хүн/Хүүхэд:</b>
                            </Grid>
                            <Grid item xs={6}>
                                {entity.GuestName}
                                {/* ({entity.adult}/{entity.child}) */}
                            </Grid>
                        </Grid>
                    </Typography>

                    <LocalizationProvider // @ts-ignore
                        dateAdapter={AdapterDateFns}
                    >
                        <Grid container spacing={1} className="mt-2">
                            <Grid item xs={6}>
                                <Controller
                                    name={`ArrivalDate`}
                                    control={control}
                                    defaultValue={null}
                                    render={({
                                        field: { onChange, value },
                                    }) => (
                                        <DatePicker
                                            label="Эхлэх огноо"
                                            value={value}
                                            onChange={(value) => (
                                                onChange(
                                                    moment(
                                                        dateStringToObj(
                                                            moment(
                                                                value
                                                            ).format(
                                                                "YYYY-MM-DD"
                                                            )
                                                        ),
                                                        "YYYY-MM-DD"
                                                    )
                                                ),
                                                setArrivalDate(
                                                    moment(
                                                        dateStringToObj(
                                                            moment(
                                                                value
                                                            ).format(
                                                                "YYYY-MM-DD"
                                                            )
                                                        ),
                                                        "YYYY-MM-DD"
                                                    ).format("YYYY-MM-DD")
                                                )
                                            )}
                                            renderInput={(params) => (
                                                <TextField
                                                    size="small"
                                                    id={`ArrivalDate`}
                                                    {...register(`ArrivalDate`)}
                                                    margin="dense"
                                                    fullWidth
                                                    {...params}
                                                    error={
                                                        errors.ArrivalDate
                                                            ?.message
                                                    }
                                                    helperText={
                                                        errors.ArrivalDate
                                                            ?.message
                                                    }
                                                />
                                            )}
                                        />
                                    )}
                                />
                            </Grid>

                            <Grid item xs={6}>
                                <Controller
                                    name={`DepartureDate`}
                                    control={control}
                                    defaultValue={null}
                                    render={({
                                        field: { onChange, value },
                                    }) => (
                                        <DatePicker
                                            label="Гарах огноо"
                                            value={value}
                                            onChange={(value) => (
                                                onChange(
                                                    moment(
                                                        dateStringToObj(
                                                            moment(
                                                                value
                                                            ).format(
                                                                "YYYY-MM-DD"
                                                            )
                                                        ),
                                                        "YYYY-MM-DD"
                                                    )
                                                ),
                                                setDepartureDate(
                                                    moment(
                                                        dateStringToObj(
                                                            moment(
                                                                value
                                                            ).format(
                                                                "YYYY-MM-DD"
                                                            )
                                                        ),
                                                        "YYYY-MM-DD"
                                                    ).format("YYYY-MM-DD")
                                                )
                                            )}
                                            renderInput={(params) => (
                                                <TextField
                                                    size="small"
                                                    id={`DepartureDate`}
                                                    {...register(
                                                        `DepartureDate`
                                                    )}
                                                    margin="dense"
                                                    fullWidth
                                                    {...params}
                                                    error={
                                                        errors.DepartureDate
                                                            ?.message
                                                    }
                                                    helperText={
                                                        errors.DepartureDate
                                                            ?.message
                                                    }
                                                />
                                            )}
                                        />
                                    )}
                                />
                            </Grid>
                        </Grid>
                        <FormControlLabel
                            control={
                                <Controller
                                    name="OverrideRate"
                                    control={control}
                                    render={(props: any) => (
                                        <Checkbox
                                            {...register("OverrideRate")}
                                            checked={props.field.value}
                                            onChange={(e) =>
                                                props.field.onChange(
                                                    e.target.checked
                                                )
                                            }
                                        />
                                    )}
                                />
                            }
                            label="Өрөөний үнийг өөрчлөх"
                        />
                    </LocalizationProvider>

                    <input
                        type="hidden"
                        {...register(`NewNights`)}
                        name={`NewNights`}
                    />

                    <SubmitButton loading={loading} />
                </Grid>
            </Grid>
        </form>
    );
};

export default NewEdit;
