import {useState, useEffect} from "react";
import {useForm} from "react-hook-form";
import {TextField} from "@mui/material";
import * as yup from "yup";
import {yupResolver} from "@hookform/resolvers/yup";

import NewEditForm from "components/common/new-edit-form";
import {RoomBlockAPI, listUrl} from "lib/api/room-block";
import RoomTypeSelect from "components/select/room-type";
import RoomSelect from "components/select/room";
import ReasonSelect from "../../select/reason";
import {countNights, dateToCustomFormat, dateToSimpleFormat} from "../../../lib/utils/format-time";

const NewEdit = ({timelineCoord, rowId}: any) => {
    const [baseStay, setBaseStay]: any = useState({
        roomType: {
            RoomTypeID: timelineCoord.RoomTypeID,
        },
        room: {
            RoomID: timelineCoord.RoomID,
        },
        dateStart: null,
        dateEnd: null,
    });

    const [entity, setEntity]: any = useState(null);

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
        RoomTypeID: yup.number().required("Бөглөнө үү"),
        BeginDate: yup.date().required("Бөглөнө үү"),
        EndDate: yup.date().required("Бөглөнө үү"),
        ReasonID: yup.number().required("Бөглөнө үү"),
    });
    const formOptions = {resolver: yupResolver(validationSchema)};

    const {
        reset,
        register,
        handleSubmit,
        formState: {errors},
    } = useForm(formOptions);


    const onRoomTypeChange = (roomType: any) => {
        console.log(roomType);
        setBaseStay({
            ...baseStay,
            roomType: roomType
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
        setRange(timelineCoord.TimeStart, timelineCoord.TimeEnd);
    }, []);

    return (
        <NewEditForm
            api={RoomBlockAPI}
            entity={entity}
            listUrl={listUrl}
            handleSubmit={handleSubmit}
        >

            <RoomTypeSelect
                register={register}
                errors={errors}
                onRoomTypeChange={onRoomTypeChange}
                baseStay={baseStay}
            />

            <RoomSelect
                register={register}
                errors={errors}
                baseStay={baseStay}
                onRoomChange={onRoomChange}
            />

            <TextField
                type="date"
                fullWidth
                id="BeginDate"
                label="Эхлэх огноо"
                {...register("BeginDate")}
                margin="dense"
                error={errors.BeginDate?.message}
                helperText={errors.BeginDate?.message}
                InputLabelProps={{shrink: true}}
            />

            <TextField
                type="date"
                fullWidth
                id="EndDate"
                label="Эхлэх огноо"
                {...register("EndDate")}
                margin="dense"
                error={errors.EndDate?.message}
                helperText={errors.EndDate?.message}
                InputLabelProps={{shrink: true}}
            />

            <ReasonSelect
                register={register}
                errors={errors}
                ReasonTypeID={3}
                nameKey={"ReasonID"}
            />

        </NewEditForm>
    );
};

export default NewEdit;
