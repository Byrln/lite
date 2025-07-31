import { useState, useEffect, useContext } from "react";
import { useForm } from "react-hook-form";
import { TextField } from "@mui/material";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

import NewEditForm from "components/common/new-edit-form";
import { RoomBlockAPI, listUrl } from "lib/api/room-block";
import RoomTypeSelect from "components/select/room-type";
import RoomSelect from "components/select/room";
// import ReasonSelect from "../../select/reason";
import { dateToSimpleFormat, fToCustom } from "lib/utils/format-time";
import { mutate } from "swr";
import { toast } from "react-toastify";
import { ModalContext } from "lib/context/modal";
import SubmitButton from "../../common/submit-button";

const NewEdit = ({ timelineCoord, defaultEntity }: any) => {
    const { handleModal }: any = useContext(ModalContext);
    const [loading, setLoading] = useState(false);

    const [baseStay, setBaseStay]: any = useState({
        roomType: {
            RoomTypeID: defaultEntity
                ? defaultEntity.RoomTypeID
                : timelineCoord?.RoomTypeID || null,
        },
        room: {
            RoomID: defaultEntity ? defaultEntity.RoomID : timelineCoord?.RoomID || null,
        },
        dateStart: defaultEntity ? defaultEntity.BeginDate : null,
        dateEnd: defaultEntity ? defaultEntity.EndDate : null,
    });

    const [entity, setEntity]: any = useState(
        defaultEntity ? { ...defaultEntity } : null
    );

    // useEffect(() => {
    //     if (rowId) {
    //         const fetchDatas = async () => {
    //             const entity: any = await RoomBlockAPI.get(rowId);
    //
    //             setEntity(entity);
    //         };
    //
    //         fetchDatas();
    //     }
    // }, [rowId]);

    const validationSchema = yup.object().shape({
        RoomTypeID: yup.number().nullable().required("Бөглөнө үү"),
        BeginDate: yup.date().required("Бөглөнө үү"),
        EndDate: yup.date().required("Бөглөнө үү"),
        ReasonID: yup.number().required("Бөглөнө үү"),
    });
    const formOptions = { resolver: yupResolver(validationSchema) };

    const {
        reset,
        register,
        handleSubmit,
        formState: { errors },
    } = useForm(formOptions);

    const onRoomTypeChange = (roomType: any) => {
        setBaseStay({
            ...baseStay,
            roomType: roomType,
        });
    };

    const onRoomChange = (r: any) => {
        setBaseStay({
            ...baseStay,
            room: r,
        });
    };

    const setRange = (dateStart: Date, dateEnd: Date) => {
        setBaseStay({
            ...baseStay,
            dateStart: dateStart,
            dateEnd: dateEnd,
        });

        reset({
            BeginDate: dateToSimpleFormat(dateStart),
            EndDate: dateToSimpleFormat(dateEnd),
        });
    };

    useEffect(() => {
        if (timelineCoord) {
            setRange(timelineCoord.TimeStart, timelineCoord.TimeEnd);
        }

        if (defaultEntity) {
            reset({
                RoomTypeID: defaultEntity.RoomTypeID,
                RoomID: defaultEntity.RoomID,
                BeginDate: fToCustom(defaultEntity.BeginDate, "yyyy-MM-dd"),
                EndDate: fToCustom(defaultEntity.EndDate, "yyyy-MM-dd"),
                ReasonID: defaultEntity.ReasonID,
            });
        }
    }, []);

    const onSubmit = async (values: any) => {
        setLoading(true);

        try {
            let vals = { ...values };
            vals.BeginDate = fToCustom(values.BeginDate, "yyyy MMM dd");
            vals.EndDate = fToCustom(values.EndDate, "yyyy MMM dd");

            if (defaultEntity) {
                vals.RoomBlockID = defaultEntity.RoomBlockID;
                await RoomBlockAPI?.update(vals);
            } else {
                await RoomBlockAPI?.new(vals);
            }

            await mutate(listUrl);

            toast("Амжилттай.");

            setLoading(false);
            handleModal();
        } catch (error) {
            setLoading(false);
            handleModal();
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            {defaultEntity ? (
                <input
                    type={"hidden"}
                    {...register("RoomTypeID")}
                    value={defaultEntity.RoomTypeID}
                />
            ) : (
                <RoomTypeSelect
                    register={register}
                    errors={errors}
                    onRoomTypeChange={onRoomTypeChange}
                    baseStay={baseStay}
                />
            )}

            {defaultEntity ? (
                <input
                    type={"hidden"}
                    {...register("RoomID")}
                    value={defaultEntity.RoomID}
                />
            ) : (
                <RoomSelect
                    register={register}
                    errors={errors}
                    baseStay={baseStay}
                    onRoomChange={onRoomChange}
                />
            )}

            <TextField
                type="date"
                fullWidth
                id="BeginDate"
                label="Эхлэх огноо"
                {...register("BeginDate")}
                margin="dense"
                error={!!errors.BeginDate?.message}
                helperText={errors.BeginDate?.message as string}
                InputLabelProps={{ shrink: true }}
            />

            <TextField
                type="date"
                fullWidth
                id="EndDate"
                label="Эхлэх огноо"
                {...register("EndDate")}
                margin="dense"
                error={!!errors.EndDate?.message}
                helperText={errors.EndDate?.message as string}
                InputLabelProps={{ shrink: true }}
            />

            {/* <ReasonSelect
                register={register}
                errors={errors}
                ReasonTypeID={3}
                nameKey={"ReasonID"}
            /> */}

            <SubmitButton loading={loading} />
        </form>
    );
};

export default NewEdit;
