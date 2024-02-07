import { Controller, useForm } from "react-hook-form";
import { FormControlLabel, TextField, Grid, Checkbox } from "@mui/material";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useState, useEffect } from "react";
import moment from "moment";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";

import NewEditForm from "components/common/new-edit-form";
import { RoomBlockAPI, listUrl } from "lib/api/room-block";
import { useAppState } from "lib/context/app";
import RoomSelect from "components/select/room";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import ReasonSelect from "components/select/reason";
import RoomTypeSelect from "components/select/room-type";
import { dateToSimpleFormat } from "lib/utils/format-time";
import { RoomAPI } from "lib/api/room";
import SubmitButton from "components/common/submit-button";

const validationSchema = yup.object().shape({
    // RoomID: yup.string().required("Бөглөнө үү"),
    BeginDate: yup.string().required("Бөглөнө үү"),
    EndDate: yup.string().required("Бөглөнө үү"),
    ReasonID: yup.string().notRequired(),
});

const NewEdit = () => {
    const [loading, setLoading] = useState(false);

    const [data, setData]: any = useState([]);
    const [state]: any = useAppState();
    const {
        register,
        reset,
        handleSubmit,
        control,
        formState: { errors },
        resetField,
    } = useForm({ resolver: yupResolver(validationSchema) });

    const [baseStay, setBaseStay]: any = useState({
        TransactionID: 0,
        roomType: "all",
        dateStart: new Date(),
        dateEnd: new Date(),
        nights: 1,
        room: {
            RoomID: null,
        },
    });

    const onRoomChange = (r: any, index: any) => {
        setBaseStay({
            ...baseStay,
            room: r,
        });
    };

    const onRoomTypeChange = (rt: any, index: number) => {
        setBaseStay({
            ...baseStay,
            roomType: rt,
        });
        resetField(`RoomID`, {
            defaultValue: null,
        });
    };

    const fetchRooms = async () => {
        if (
            !(
                baseStay &&
                baseStay.roomType &&
                baseStay.dateStart &&
                baseStay.dateEnd
            )
        ) {
            return;
        }
        var values = {
            TransactionID: baseStay.TransactionID,
            RoomTypeID:
                baseStay.roomType?.RoomTypeID == "all"
                    ? 0
                    : baseStay.roomType?.RoomTypeID,
            StartDate: dateToSimpleFormat(baseStay.dateStart),
            EndDate: dateToSimpleFormat(baseStay.dateEnd),
        };
        var d = await RoomAPI.listAvailable(values);
        setData(d);
    };

    useEffect(() => {
        fetchRooms();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [baseStay.roomType, baseStay.dateStart, baseStay.dateEnd]);

    const customSubmit = async (values: any) => {
        try {
            values.RoomID.forEach((room: any, index: any) => {
                if (room == true) {
                    const tempValues = {
                        RoomID: index,
                        BeginDate: values.BeginDate,
                        EndDate: values.EndDate,
                        ReasonID: values.ReasonID,
                    };
                    RoomBlockAPI.new(tempValues);
                }
            });

            //
        } finally {
        }
    };

    return (
        <NewEditForm
            api={RoomBlockAPI}
            listUrl={listUrl}
            additionalValues={{
                RoomBlockID: state.editId,
            }}
            reset={reset}
            handleSubmit={handleSubmit}
            customSubmit={customSubmit}
        >
            <LocalizationProvider // @ts-ignore
                dateAdapter={AdapterDateFns} // @ts-ignore
            >
                <Grid container spacing={1}>
                    {/* <Grid item xs={3}>
                        <RoomSelect
                            register={register}
                            errors={errors}
                            baseStay={baseStay}
                            onRoomChange={onRoomChange}
                            customRegisterName="RoomID"
                        />
                    </Grid> */}
                    <Grid item xs={4}>
                        <Controller
                            name="BeginDate"
                            control={control}
                            defaultValue={null}
                            render={({ field: { onChange, value } }) => (
                                <DatePicker
                                    label="Эхлэх огноо"
                                    value={value}
                                    onChange={(value) =>
                                        onChange(
                                            moment(value).format("YYYY-MM-DD")
                                        )
                                    }
                                    renderInput={(params) => (
                                        <TextField
                                            size="small"
                                            id="BeginDate"
                                            {...register("BeginDate")}
                                            margin="dense"
                                            fullWidth
                                            {...params}
                                            error={errors.BeginDate?.message}
                                            helperText={
                                                errors.BeginDate?.message
                                            }
                                        />
                                    )}
                                />
                            )}
                        />
                    </Grid>
                    <Grid item xs={4}>
                        <Controller
                            name="EndDate"
                            control={control}
                            defaultValue={null}
                            render={({ field: { onChange, value } }) => (
                                <DatePicker
                                    label="Дуусах огноо"
                                    value={value}
                                    onChange={(value) =>
                                        onChange(
                                            moment(value).format("YYYY-MM-DD")
                                        )
                                    }
                                    renderInput={(params) => (
                                        <TextField
                                            size="small"
                                            id="EndDate"
                                            {...register("EndDate")}
                                            margin="dense"
                                            fullWidth
                                            {...params}
                                            error={errors.EndDate?.message}
                                            helperText={errors.EndDate?.message}
                                        />
                                    )}
                                />
                            )}
                        />
                    </Grid>
                    <Grid item xs={4}>
                        <ReasonSelect
                            register={register}
                            errors={errors}
                            ReasonTypeID={3}
                            nameKey={"ReasonID"}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <RoomTypeSelect
                            register={register}
                            errors={errors}
                            onRoomTypeChange={onRoomTypeChange}
                        />
                    </Grid>
                    {data &&
                        data.map((room: any, index: any) => {
                            return (
                                <Grid
                                    item
                                    xs={6}
                                    sm={3}
                                    md={2}
                                    lg={1}
                                    key={room.RoomID}
                                >
                                    <FormControlLabel
                                        control={
                                            <Controller
                                                name="RoomID"
                                                control={control}
                                                render={(props: any) => (
                                                    <Checkbox
                                                        key={`RoomID.${room.RoomID}`}
                                                        {...register(
                                                            `RoomID.${room.RoomID}`
                                                        )}
                                                    />
                                                )}
                                            />
                                        }
                                        label={room.RoomFullName}
                                    />
                                </Grid>
                            );
                        })}
                </Grid>
            </LocalizationProvider>
        </NewEditForm>
    );
};

export default NewEdit;
