import { useForm } from "react-hook-form";
import { Card, CardContent, Typography, Grid, Box } from "@mui/material";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";
import { mutate } from "swr";
import { toast } from "react-toastify";
import { useIntl } from "react-intl";

import { ReservationAPI } from "lib/api/reservation";
import RoomTypeSelect from "components/select/room-type";
import RoomSelect from "components/select/room-select";
import SubmitButton from "components/common/submit-button";

const validationSchema = yup.object().shape({
    NewRoomTypeID: yup.string().required("Бөглөнө үү"),
    NewRoomID: yup.string().required("Бөглөнө үү"),
    OverrideRate: yup.boolean(),
    NewRate: yup.number(),
});

const NewEdit = ({ handleModal, entity, listUrl }: any) => {
    const intl = useIntl();
    const [loading, setLoading] = useState(false);
    const [RoomTypeID, setRoomTypeID]: any = useState(
        entity && entity.RoomTypeID ? entity.RoomTypeID : ""
    );
    const [RoomID, setRoomID]: any = useState(
        entity && entity.RoomID ? entity.RoomID : ""
    );

    const {
        register,
        reset,
        handleSubmit,
        control,
        formState: { errors },
    } = useForm({ resolver: yupResolver(validationSchema) });

    const onSubmit = async (values: any) => {
        setLoading(true);
        try {
            values.TransactionID = entity.TransactionID;

            await ReservationAPI.roomMove(values);
            await mutate(listUrl);
            toast(
                intl.formatMessage({
                    id: "TextSuccess",
                })
            );
            setLoading(false);
            handleModal();
        } catch (error) {
            setLoading(false);
            handleModal();
        }
    };

    const onRoomTypeChange = (rt: any, index?: number) => {
        setRoomTypeID(rt.RoomTypeID);
    };

    const onRoomChange = (r: any, index: any) => {
        setRoomID(r.RoomID);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={1}>
                <Grid item xs={6}>
                    <Card>
                        <CardContent>
                            {intl.formatMessage({
                                id: "TextCurrentRoomInformation",
                            })}
                            <Typography
                                variant="subtitle2"
                                component="div"
                                className="mb-3"
                            >
                                <Grid container spacing={1} className="mt-2">
                                    <Grid item xs={6}>
                                        <b>
                                            {intl.formatMessage({
                                                id: "TextRoomNoRoomType",
                                            })}
                                        </b>
                                    </Grid>
                                    <Grid item xs={6}>
                                        {entity.RoomFullName}
                                    </Grid>
                                    <Grid item xs={6}>
                                        <b>
                                            {intl.formatMessage({
                                                id: "TextCurrentRate",
                                            })}
                                        </b>
                                    </Grid>
                                    <Grid item xs={6}>
                                        {entity.CurrentBalance}
                                    </Grid>
                                    <Grid item xs={6}>
                                        <b>
                                            {intl.formatMessage({
                                                id: "TextTotalandPaid",
                                            })}
                                        </b>
                                    </Grid>
                                    <Grid item xs={6}>
                                        {entity.TotalAmount}/{entity.Deposit}
                                    </Grid>
                                    <Grid item xs={6}>
                                        <b>
                                            {intl.formatMessage({
                                                id: "TextGuest",
                                            })}
                                        </b>
                                    </Grid>
                                    <Grid item xs={6}>
                                        {entity.GuestName}
                                        {/* {entity.adult}/{entity.child}) */}
                                    </Grid>
                                    <Grid item xs={6}>
                                        <b>
                                            {intl.formatMessage({
                                                id: "TextArrival",
                                            })}
                                        </b>
                                    </Grid>
                                    <Grid item xs={6}>
                                        {entity.ArrivalDate}
                                    </Grid>
                                    <Grid item xs={6}>
                                        <b>
                                            {intl.formatMessage({
                                                id: "TextDeparture",
                                            })}
                                        </b>
                                    </Grid>
                                    <Grid item xs={6}>
                                        {entity.DepartureDate}
                                    </Grid>
                                </Grid>
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={6}>
                    <Card>
                        <CardContent>
                            <div className="mb-2">
                                {" "}
                                {intl.formatMessage({
                                    id: "TextNewRoom",
                                })}
                            </div>
                            <RoomTypeSelect
                                register={register}
                                errors={errors}
                                onRoomTypeChange={onRoomTypeChange}
                                customRegisterName={`NewRoomTypeID`}
                                baseStay={{ RoomTypeID: RoomTypeID }}
                                RoomTypeID={RoomTypeID}
                            />

                            {RoomTypeID && (
                                <RoomSelect
                                    register={register}
                                    errors={errors}
                                    DepartureDate={entity.DepartureDate}
                                    RoomTypeID={RoomTypeID}
                                    onRoomChange={onRoomChange}
                                    customRegisterName={`NewRoomID`}
                                    TransactionID={""}
                                    ArrivalDate={entity.ArrivalDate}
                                    RoomID={RoomID}
                                />
                            )}
                        </CardContent>
                    </Card>
                </Grid>

                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        width: "100%",
                        flexWrap: "wrap",
                        flexDirection: "row-reverse",
                    }}
                    className="mb-1"
                >
                    <SubmitButton
                        fullWidth={false}
                        title={intl.formatMessage({
                            id: "ButtonSave",
                        })}
                    >
                        {intl.formatMessage({
                            id: "ButtonSave",
                        })}
                    </SubmitButton>
                </Box>
            </Grid>
        </form>
    );
};

export default NewEdit;
