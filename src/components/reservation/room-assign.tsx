import { useContext, useState, useEffect } from "react";
import { Checkbox, FormControlLabel, Grid, TextField } from "@mui/material";
import RoomTypeSelect from "../select/room-type";
import RoomSelect from "../select/room";
import FormControl from "@mui/material/FormControl";
import RadioGroup from "@mui/material/RadioGroup";
import Radio from "@mui/material/Radio";
import { LoadingButton } from "@mui/lab";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { ReservationApi } from "../../lib/api/reservation";
import { mutate } from "swr";
import { listUrl } from "../../lib/api/front-office";
import { toast } from "react-toastify";
import { ModalContext } from "../../lib/context/modal";

const RoomAssign = ({ transactionInfo, reservation }: any) => {
    const { handleModal }: any = useContext(ModalContext);
    const [loading, setLoading] = useState(false);
    const [roomAutoAssign, setRoomAutoAssign]: any = useState(false);
    const [baseStay, setBaseStay]: any = useState({
        roomType: {
            RoomTypeID: transactionInfo.RoomTypeID,
        },
        room: {
            RoomID: transactionInfo.RoomID,
        },
        dateStart: new Date(transactionInfo.ArrivalDate),
        dateEnd: new Date(transactionInfo.DepartureDate),
        NewRate: 0,
    });

    const validationSchema = yup.object().shape({
        TransactionID: yup.number().required("Сонгоно уу"),
        RoomID: yup.number().notRequired(),
    });
    const formOptions = { resolver: yupResolver(validationSchema) };

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm(formOptions);

    const onRoomChange = (room: any) => {
        setBaseStay({
            ...baseStay,
            room: room,
        });
    };

    const onSubmit = async (values: any) => {
        setLoading(true);
        try {
            console.log(values);

            const res = await ReservationApi.roomAssign(values);

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
        <>
            <form onSubmit={handleSubmit(onSubmit)}>
                <input
                    type="hidden"
                    {...register("TransactionID")}
                    value={transactionInfo.TransactionID}
                />

                <Grid container spacing={2}>
                    <Grid item xs={4}>
                        <RoomSelect
                            register={register}
                            errors={errors}
                            baseStay={baseStay}
                            onRoomChange={onRoomChange}
                            roomAutoAssign={roomAutoAssign}
                        />
                    </Grid>
                </Grid>

                <LoadingButton
                    size="large"
                    variant="contained"
                    loading={loading}
                    className="mt-3"
                    onClick={(evt: any) => {
                        setRoomAutoAssign(true);
                    }}
                >
                    Auto Assign
                </LoadingButton>

                <LoadingButton
                    size="large"
                    type="submit"
                    variant="contained"
                    loading={loading}
                    className="mt-3"
                >
                    Assign
                </LoadingButton>
            </form>
        </>
    );
};

export default RoomAssign;
