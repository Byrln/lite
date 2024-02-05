import { Controller, useForm } from "react-hook-form";
import { FormControlLabel, TextField, Grid } from "@mui/material";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";
import moment from "moment";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";

import NewEditForm from "components/common/new-edit-form";
import { RoomBlockAPI, listUrl } from "lib/api/room-block";
import { useAppState } from "lib/context/app";
import RoomSelect from "components/select/room";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import ReasonSelect from "components/select/reason";

const validationSchema = yup.object().shape({
    RoomID: yup.string().required("Бөглөнө үү"),
    StartDate: yup.string().required("Бөглөнө үү"),
    EndDate: yup.string().required("Бөглөнө үү"),
    ReasonID: yup.string().notRequired(),
});

const NewEdit = () => {
    const [state]: any = useAppState();
    const {
        register,
        reset,
        handleSubmit,
        control,
        formState: { errors },
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

    return (
        <NewEditForm
            api={RoomBlockAPI}
            listUrl={listUrl}
            additionalValues={{
                RoomBlockID: state.editId,
            }}
            reset={reset}
            handleSubmit={handleSubmit}
        >
            <LocalizationProvider // @ts-ignore
                dateAdapter={AdapterDateFns} // @ts-ignore
            >
                <Grid container spacing={1}>
                    <Grid item xs={3}>
                        <RoomSelect
                            register={register}
                            errors={errors}
                            baseStay={baseStay}
                            onRoomChange={onRoomChange}
                            customRegisterName="RoomID"
                        />
                    </Grid>
                    <Grid item xs={3}>
                        <Controller
                            name="StartDate"
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
                                            id="StartDate"
                                            {...register("StartDate")}
                                            margin="dense"
                                            fullWidth
                                            {...params}
                                            error={errors.StartDate?.message}
                                            helperText={
                                                errors.StartDate?.message
                                            }
                                        />
                                    )}
                                />
                            )}
                        />
                    </Grid>
                    <Grid item xs={3}>
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
                    <Grid item xs={3}>
                        <ReasonSelect
                            register={register}
                            errors={errors}
                            ReasonTypeID={3}
                            nameKey={"ReasonID"}
                        />
                    </Grid>
                </Grid>
            </LocalizationProvider>
        </NewEditForm>
    );
};

export default NewEdit;
