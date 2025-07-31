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
import { useIntl } from "react-intl";
import NewEditForm from "components/common/new-edit-form";
import { WorkOrderAPI, listUrl } from "lib/api/work-order";
import { useAppState } from "lib/context/app";
import RoomSelect from "components/select/room";
import ReferenceSelect from "components/select/reference";
import UserSelect from "components/select/user";
import ReasonSelect from "components/select/reason";
import { RoomBlockAPI } from "lib/api/room-block";

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
    const intl = useIntl();
    const [entity, setEntity]: any = useState(null);
    const [roomBlock, setRoomBlock]: any = useState(false);
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
            if (entity.RoomBlockID) {
                setRoomBlock(true);
            }
        }
    }, [entity]);

    const customSubmit = async (values: any) => {
        try {
            let workOrderValues = {
                WorkOrderNo: values.WorkOrderNo ? values.WorkOrderNo : null,
                RoomID: values.RoomID ? values.RoomID : null,
                WorkOrderPriorityID: values.WorkOrderPriorityID
                    ? values.WorkOrderPriorityID
                    : null,
                RoomBlockID: values.RoomBlockID ? values.RoomBlockID : null,
                Description: values.Description ? values.Description : null,
                Deadline: values.Deadline ? values.Deadline : null,
                WorkOrderStatusID: values.WorkOrderStatusID
                    ? values.WorkOrderStatusID
                    : null,
                AssignedUserID: values.AssignedUserID
                    ? values.AssignedUserID
                    : null,
                WorkOrderRegisterID: values.WorkOrderRegisterID
                    ? values.WorkOrderRegisterID
                    : null,
            };
            let roomBlockValues = {
                RoomID: values.RoomID ? values.RoomID : null,
                BeginDate: values.BeginDate ? values.BeginDate : null,
                EndDate: values.EndDate ? values.EndDate : null,
                ReasonID: values.ReasonID ? values.ReasonID : null,
                RoomBlockID:
                    entity && entity.RoomBlockID ? entity.RoomBlockID : null,
            };

            if (roomBlock == true) {
                let roomBlockResponse = await RoomBlockAPI.new(roomBlockValues);

                if (roomBlockValues.RoomBlockID) {
                    roomBlockResponse = await RoomBlockAPI.update(
                        roomBlockValues
                    );
                } else {
                    roomBlockResponse = await RoomBlockAPI.new(roomBlockValues);
                }

                if (
                    roomBlockResponse &&
                    roomBlockResponse.data &&
                    roomBlockResponse.data.JsonData &&
                    roomBlockResponse.data.JsonData[0] &&
                    roomBlockResponse.data.JsonData[0].RoomBlockID &&
                    roomBlockResponse.data.JsonData[0].RoomBlockID != "-1"
                ) {
                    workOrderValues.RoomBlockID =
                        roomBlockResponse.data.JsonData[0].RoomBlockID;
                    if (state.editId) {
                        await WorkOrderAPI.update(workOrderValues);
                    } else {
                        await WorkOrderAPI.new(workOrderValues);
                    }
                }
            } else {
                if (state.editId) {
                    await WorkOrderAPI.update(workOrderValues);
                } else {
                    await WorkOrderAPI.new(workOrderValues);
                }
            }
        } finally {
        }
    };

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
            customSubmit={customSubmit}
        >
            <LocalizationProvider
                //@ts-ignore
                dateAdapter={AdapterDateFns}
                adapterLocale={mn}
            >
                <Grid container spacing={1}>
                    {state.editId && (
                        <Grid item xs={6}>
                            <TextField
                                size="small"
                                fullWidth
                                id="WorkOrderNo"
                        label={intl.formatMessage({id:"TextWorkOrderNo"}) }
                        {...register("WorkOrderNo")}
                                margin="dense"
                                error={!!errors.WorkOrderNo?.message}
                                helperText={errors.WorkOrderNo?.message as string}
                                disabled={true}
                            />
                        </Grid>
                    )}

                    <Grid item xs={6}>
                        <ReferenceSelect
                            register={register}
                            errors={errors}
                            type="WorkOrderPriority"
                            id="RowHeaderPriority"
                        label={intl.formatMessage({id:"RowHeaderPriority"}) }
                        {...register("RowHeaderPriority")}
                            optionValue="WorkOrderPriorityID"
                            optionLabel="Description"
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <ReferenceSelect
                            register={register}
                            errors={errors}
                            type="WorkOrderStatus"
                            id="Left_SortByStatus"
                            label={intl.formatMessage({id:"Left_SortByStatus"}) }
                            {...register("Left_SortByStatus")}
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
                        <Controller
                            name="Deadline"
                            control={control}
                            defaultValue={null}
                            render={({ field: { onChange, value } }) => (
                                <DatePicker
                                label={intl.formatMessage({id:"TextDeadline"}) }
                                {...register("Deadline")}
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
                                            id="TextDeadline"
                                            label={intl.formatMessage({id:"TextDeadline"}) }
                                            {...register("TextDeadline")}
                                            margin="dense"
                                            fullWidth
                                            {...params}
                                            error={!!errors.Deadline?.message}
                                            helperText={
                                                errors.Deadline?.message as string}
                                        />
                                    )}
                                />
                            )}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            size="small"
                            fullWidth
                            multiline
                            rows={3}
                            id="Description"
                                            label={intl.formatMessage({id:"RowHeaderDescription"}) }
                                            {...register("Description")}
                            margin="dense"
                            error={!!errors.Description?.message}
                            helperText={errors.Description?.message as string}
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
                                            onChange={(e) => (
                                                props.field.onChange(
                                                    e.target.checked
                                                ),
                                                setRoomBlock(e.target.checked)
                                            )}
                                        />
                                    )}
                                />
                            }
                            label={intl.formatMessage({id:"ButtonBlockRoom"}) }
                        />
                    </Grid>
                    <Grid item xs={12} />

                    {roomBlock && (
                        <>
                            <Grid item xs={4}>
                                <Controller
                                    name="BeginDate"
                                    control={control}
                                    defaultValue={null}
                                    render={({
                                        field: { onChange, value },
                                    }) => (
                                        <DatePicker
                                        label={intl.formatMessage({id:"RowHeaderBeginDate"}) }
                                            value={value}
                                            onChange={(value) =>
                                                onChange(
                                                    moment(value).format(
                                                        "YYYY-MM-DD"
                                                    )
                                                )
                                            }
                                            renderInput={(params) => (
                                                <TextField
                                                    size="small"
                                                    id="BeginDate"
                                                    label={intl.formatMessage({id:"RowHeaderBeginDate"}) }
                                                    {...register("BeginDate")}
                            
                                                    margin="dense"
                                                    fullWidth
                                                    {...params}
                                                    error={
                                                        errors.BeginDate
                                                            ?.message
                                                    }
                                                    helperText={
                                                        errors.BeginDate
                                                            ?.message as string}
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
                                    render={({
                                        field: { onChange, value },
                                    }) => (
                                        <DatePicker
                                        label={intl.formatMessage({id:"RowHeaderEndDate"}) }
                                        {...register("EndDate")}                
                                            value={value}
                                            onChange={(value) =>
                                                onChange(
                                                    moment(value).format(
                                                        "YYYY-MM-DD"
                                                    )
                                                )
                                            }
                                            renderInput={(params) => (
                                                <TextField
                                                    size="small"
                                                    id="EndDate"
                                                    label={intl.formatMessage({id:"RowHeaderEndDate"}) }
                                                    {...register("EndDate")}                            
                                                    margin="dense"
                                                    fullWidth
                                                    {...params}
                                                    error={
                                                        errors.EndDate?.message
                                                    }
                                                    helperText={
                                                        errors.EndDate?.message as string}
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
                        </>
                    )}
                </Grid>
            </LocalizationProvider>
        </NewEditForm>
    );
};

export default NewEdit;
