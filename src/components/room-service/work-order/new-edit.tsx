import { Controller, useForm } from "react-hook-form";
import { Checkbox, FormControlLabel, TextField, Grid } from "@mui/material";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import moment from "moment";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import mn from "date-fns/locale/mn";
import { useState, useEffect } from "react";

import NewEditForm from "components/common/new-edit-form";
import { WorkOrderAPI, listUrl } from "lib/api/work-order";
import { useAppState } from "lib/context/app";
import RoomSelect from "components/select/room";
import ReferenceSelect from "components/select/reference";
import UserSelect from "components/select/user";

const validationSchema = yup.object().shape({
    WorkOrderNo: yup.string().notRequired(),
    RoomID: yup.string().required("Бөглөнө үү!"),
    WorkOrderPriorityID: yup.string().required("Бөглөнө үү!"),
    RoomBlockID: yup.string().notRequired(),
    Description: yup.string().notRequired(),
    Deadline: yup.string().required("Бөглөнө үү!"),
    WorkOrderStatusID: yup.string().required("Бөглөнө үү!"),
    AssignedUserID: yup.string().required("Бөглөнө үү!"),
});

const NewEdit = () => {
    const [entity, setEntity]: any = useState(null);
    const [baseStay, setBaseStay]: any = useState({
        TransactionID: 0,
        roomType: "all",
        dateStart: new Date(),
        dateEnd: new Date(),
        nights: 1,
        room: {
            RoomID: entity && entity.RoomID ? entity.RoomID : null,
        },
    });

    const onRoomChange = (r: any, index: any) => {
        setBaseStay({
            ...baseStay,
            room: r,
        });
    };

    const [state]: any = useAppState();
    const {
        register,
        reset,
        handleSubmit,
        control,
        resetField,
        formState: { errors },
    } = useForm({ resolver: yupResolver(validationSchema) });

    useEffect(() => {
        if (entity) {
            setBaseStay({ ...baseStay, room: { RoomID: entity.RoomID } });
            resetField(`Description`, {
                defaultValue: entity.WODescription,
            });
        }
    }, [entity]);

    return (
        <NewEditForm
            api={WorkOrderAPI}
            listUrl={listUrl}
            additionalValues={{
                WorkOrderRegisterID: state.editId,
            }}
            reset={reset}
            handleSubmit={handleSubmit}
            setEntity={setEntity}
        >
            <Grid container spacing={1}>
                {state.editId && (
                    <Grid item xs={6}>
                        <TextField
                            size="small"
                            fullWidth
                            id="WorkOrderNo"
                            label="Ажлын дугаар"
                            {...register("WorkOrderNo")}
                            margin="dense"
                            error={errors.WorkOrderNo?.message}
                            helperText={errors.WorkOrderNo?.message}
                            disabled={true}
                        />
                    </Grid>
                )}

                <Grid item xs={6}>
                    <ReferenceSelect
                        register={register}
                        errors={errors}
                        type="WorkOrderPriority"
                        label="Чухал байдал"
                        optionValue="WorkOrderPriorityID"
                        optionLabel="Description"
                    />
                </Grid>
                <Grid item xs={6}>
                    <ReferenceSelect
                        register={register}
                        errors={errors}
                        type="WorkOrderStatus"
                        label="Төлөв"
                        optionValue="WorkOrderStatusID"
                        optionLabel="Description"
                    />
                </Grid>

                <Grid item xs={6}>
                    <RoomSelect
                        register={register}
                        errors={errors}
                        baseStay={baseStay}
                        onRoomChange={onRoomChange}
                    />
                </Grid>
                <Grid item xs={6}>
                    <UserSelect
                        register={register}
                        errors={errors}
                        IsHouseKeeper={true}
                        nameKey={"AssignedUserID"}
                    />
                </Grid>
                <Grid item xs={6}>
                    <LocalizationProvider
                        //@ts-ignore
                        dateAdapter={AdapterDateFns}
                        adapterLocale={mn}
                    >
                        <Controller
                            name="Deadline"
                            control={control}
                            defaultValue={null}
                            render={({ field: { onChange, value } }) => (
                                <DatePicker
                                    label="Сүүлийн хугацаа"
                                    value={value}
                                    onChange={(value) =>
                                        onChange(
                                            // moment(value)
                                            //     .utcOffset("+0400", true)
                                            //     .format("YYYY-MM-DD")
                                            // moment(
                                            //     dateStringToObj(
                                            moment(value).format("YYYY-MM-DD")
                                            // ),
                                            // "YYYY-MM-DD"
                                            // )
                                        )
                                    }
                                    renderInput={(params) => (
                                        <TextField
                                            size="small"
                                            id="Deadline"
                                            {...register("Deadline")}
                                            margin="dense"
                                            fullWidth
                                            {...params}
                                            error={errors.Deadline?.message}
                                            helperText={
                                                errors.Deadline?.message
                                            }
                                        />
                                    )}
                                />
                            )}
                        />
                    </LocalizationProvider>
                </Grid>
            </Grid>
            <Grid item xs={6}>
                <TextField
                    size="small"
                    fullWidth
                    multiline
                    rows={3}
                    id="Description"
                    label="Тайлбар"
                    {...register("Description")}
                    margin="dense"
                    error={errors.Description?.message}
                    helperText={errors.Description?.message}
                />
            </Grid>

            <Grid item xs={6}>
                <FormControlLabel
                    control={
                        <Controller
                            name="RoomBlockID"
                            control={control}
                            render={(props: any) => (
                                <Checkbox
                                    {...register("RoomBlockID")}
                                    checked={props.field.value}
                                    onChange={(e) =>
                                        props.field.onChange(e.target.checked)
                                    }
                                />
                            )}
                        />
                    }
                    label="Өрөө блоклох"
                />
            </Grid>
        </NewEditForm>
    );
};

export default NewEdit;
