import { Controller, useForm } from "react-hook-form";
import { Grid, TextField } from "@mui/material";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import moment from "moment";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { useEffect, useState } from "react";
import NumberSelect from "components/select/number-select";

import NewEditForm from "components/common/new-edit-form";
import { ReservationAPI, listUrl } from "lib/api/reservation";
import { useAppState } from "lib/context/app";
import { dateStringToObj } from "lib/utils/helpers";
import RoomTypeSelect from "components/select/room-type";
import RoomSelect from "components/select/room-select";

const validationSchema = yup.object().shape({
    DeparturedListName: yup.string().required("Бөглөнө үү"),
});

const NewEdit = ({ id, register, control, errors, getValues }: any) => {
    const [state]: any = useAppState();
    const [TransactionID, setTransactionID]: any = useState("");
    const [RoomTypeID, setRoomTypeID]: any = useState("");
    const [Room, setRoom]: any = useState("");
    const [ArrivalDate, setArrivalDate]: any = useState("");
    const [DepartureDate, setDepartureDate]: any = useState("");
    console.log(id + "-RoomTypeID-", RoomTypeID);
    console.log(id + "-Room-", Room);
    console.log(id + "-ArrivalDate-", ArrivalDate);
    console.log(id + "-DepartureDate-", DepartureDate);

    useEffect(() => {
        if (getValues(`TransactionDetail[${id}]`)) {
            console.log("id", id);
            console.log("values", RoomTypeID);
            if (getValues(`TransactionDetail[${id}].RoomTypeID`)) {
                setRoomTypeID(getValues(`TransactionDetail[${id}].RoomTypeID`));
            }
            if (getValues(`TransactionDetail[${id}].Room`)) {
                setRoom(getValues(`TransactionDetail[${id}].Room`));
            }
            if (getValues(`TransactionDetail[${id}].ArrivalDate`)) {
                setArrivalDate(
                    getValues(`TransactionDetail[${id}].ArrivalDate`)
                );
            }
            if (getValues(`TransactionDetail[${id}].DepartureDate`)) {
                setDepartureDate(
                    getValues(`TransactionDetail[${id}].DepartureDate`)
                );
            }
        }
    }, [id]);

    console.log("key", id);
    const onRoomTypeChange = (rt: any, index: number) => {
        setRoomTypeID(rt);
        // if (index == null) {
        //     setBaseStay({
        //         ...baseStay,
        //         roomType: rt,
        //     });
        // } else {
        //     const newArray = { ...baseGroupStay };
        //     newArray[index] = { ...baseStay };
        //     newArray[index].roomType = rt;
        //     newArray[index].room = null;
        //     newArray[index].rate = null;

        //     setBaseGroupStay(newArray);
        // }
    };

    const onRoomChange = (r: any, index: any) => {
        setRoom(r);
        // if (index == null) {
        //     setBaseStay({
        //         ...baseStay,
        //         room: r,
        //     });
        // } else {
        //     const newArray = { ...baseGroupStay };
        //     newArray[index].room = r;
        //     newArray[index].rate = null;
        //     setBaseGroupStay(newArray);
        // }
    };

    // const {
    //     reset,
    //     handleSubmit,
    //     control,
    //     formState: { errors },
    // } = useForm({ resolver: yupResolver(validationSchema) });

    return (
        <Grid key={id} container spacing={1}>
            <Grid item xs={6} sm={2}>
                <Controller
                    name={`TransactionDetail.${id}.ArrivalDate`}
                    control={control}
                    defaultValue={null}
                    render={({ field: { onChange, value } }) => (
                        <DatePicker
                            label="Эхлэх огноо"
                            value={value}
                            onChange={(value) => (
                                onChange(
                                    moment(
                                        dateStringToObj(
                                            moment(value).format("YYYY-MM-DD")
                                        ),
                                        "YYYY-MM-DD"
                                    )
                                ),
                                setArrivalDate(
                                    moment(
                                        dateStringToObj(
                                            moment(value).format("YYYY-MM-DD")
                                        ),
                                        "YYYY-MM-DD"
                                    ).format("YYYY-MM-DD")
                                )
                            )}
                            renderInput={(params) => (
                                <TextField
                                    size="small"
                                    id={`TransactionDetail.${id}.ArrivalDate`}
                                    name={`TransactionDetail.${id}.ArrivalDate`}
                                    {...register(
                                        `TransactionDetail.${id}.ArrivalDate`
                                    )}
                                    margin="dense"
                                    fullWidth
                                    {...params}
                                    error={errors.ArrivalDate?.message}
                                    helperText={errors.ArrivalDate?.message}
                                />
                            )}
                        />
                    )}
                />
            </Grid>
            <Grid item xs={6} sm={2}>
                <Controller
                    name={`TransactionDetail.${id}.DepartureDate`}
                    control={control}
                    defaultValue={null}
                    render={({ field: { onChange, value } }) => (
                        <DatePicker
                            label="Гарах огноо"
                            value={value}
                            onChange={(value) => (
                                onChange(
                                    moment(
                                        dateStringToObj(
                                            moment(value).format("YYYY-MM-DD")
                                        ),
                                        "YYYY-MM-DD"
                                    )
                                ),
                                setDepartureDate(
                                    moment(
                                        dateStringToObj(
                                            moment(value).format("YYYY-MM-DD")
                                        ),
                                        "YYYY-MM-DD"
                                    ).format("YYYY-MM-DD")
                                )
                            )}
                            renderInput={(params) => (
                                <TextField
                                    size="small"
                                    id={`TransactionDetail.${id}.DepartureDate`}
                                    name={`TransactionDetail.${id}.DepartureDate`}
                                    {...register(
                                        `TransactionDetail.${id}.DepartureDate`
                                    )}
                                    margin="dense"
                                    fullWidth
                                    {...params}
                                    error={errors.DepartureDate?.message}
                                    helperText={errors.DepartureDate?.message}
                                />
                            )}
                        />
                    )}
                />
            </Grid>
            <Grid item xs={4} sm={4}>
                <RoomTypeSelect
                    register={register}
                    errors={errors}
                    onRoomTypeChange={onRoomTypeChange}
                    customRegisterName={`TransactionDetail.${id}.RoomTypeID`}
                    baseStay={{ RoomTypeID: RoomTypeID }}
                />
            </Grid>
            {RoomTypeID && (
                <>
                    <Grid item xs={4} sm={2}>
                        <RoomSelect
                            register={register}
                            errors={errors}
                            DepartureDate={DepartureDate}
                            RoomTypeID={RoomTypeID.RoomTypeID}
                            // baseStay={baseStay}
                            onRoomChange={onRoomChange}
                            customRegisterName={`TransactionDetail.${id}.RoomID`}
                            TransactionID={""}
                            ArrivalDate={ArrivalDate}
                        />
                    </Grid>
                    <Grid item xs={2} sm={1}>
                        <NumberSelect
                            numberMin={1}
                            numberMax={
                                RoomTypeID?.MaxAdult ? RoomTypeID?.MaxAdult : 0
                            }
                            nameKey={`TransactionDetail.${id}.Adult`}
                            register={register}
                            errors={errors}
                            label={"Том хүн"}
                        />
                    </Grid>
                    <Grid item xs={2} sm={1}>
                        <NumberSelect
                            numberMin={0}
                            numberMax={
                                RoomTypeID?.BaseChild?.MaxChild
                                    ? RoomTypeID?.BaseChild?.MaxChild
                                    : 0
                            }
                            nameKey={`TransactionDetail.${id}.Child`}
                            register={register}
                            errors={errors}
                            label={"Хүүхэд"}
                        />
                    </Grid>
                </>
            )}
        </Grid>
    );
};

export default NewEdit;
