import { createRef, useContext, useEffect, useState } from "react";
import {
    Checkbox,
    Box,
    Grid,
    FormControlLabel,
    FormGroup,
    Button,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { TextField } from "@mui/material";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-toastify";
import { mutate } from "swr";
import SaveIcon from "@mui/icons-material/Save";

import RoomAmenitySelect from "components/select/room-amenity";
import AmenitySelect from "components/select/amenity";
import { RoomTypeAPI, listUrl } from "lib/api/room-type";
import { useAppState } from "lib/context/app";
import CustomTab from "components/common/custom-tab";
import { ModalContext } from "lib/context/modal";

const validationSchema = yup.object().shape({
    RoomTypeShortName: yup.string().required("Бөглөнө үү"),
    RoomTypeName: yup.string().required("Бөглөнө үү"),
    BaseAdult: yup.number().required("Бөглөнө үү").typeError("Бөглөнө үү"),
    BaseChild: yup.number().required("Бөглөнө үү").typeError("Бөглөнө үү"),
    MaxAdult: yup.number().required("Бөглөнө үү").typeError("Бөглөнө үү"),
    MaxChild: yup.number().required("Бөглөнө үү").typeError("Бөглөнө үү"),
    SortOrder: yup.number().required("Бөглөнө үү").typeError("Бөглөнө үү"),
    BookingDescription: yup.string(),
});

const NewEdit = () => {
    const [entity, setEntity]: any = useState(null);

    const formRef = createRef<HTMLButtonElement>();
    const [state]: any = useAppState();
    const { handleModal }: any = useContext(ModalContext);

    const {
        register,
        reset,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(validationSchema),
    });

    useEffect(() => {
        if (state.editId) {
            const fetchDatas = async () => {
                const response: any = await RoomTypeAPI.get(state.editId);

                if (response.length === 1) {
                    let newEntity = response[0];
                    newEntity._id = newEntity.GuestID;
                    setEntity(newEntity);
                } else {
                    setEntity(null);
                }
            };
            fetchDatas();
        } else {
            setEntity(null);
        }
    }, [state.editId]);

    const onSubmit = async (values: any) => {
        values.RoomTypeID = state.editId;

        let amenities = values.amenity;
        delete values.amenity;
        let amenitiesBooking = values.amenity2;
        delete values.amenity2;
        let RoomTypeID: any;
        if (state.editId) {
            const response = await RoomTypeAPI.update(values);
            RoomTypeID = state.editId;
        } else {
            const response = await RoomTypeAPI.new(values);
            RoomTypeID = response.data.JsonData[0].RoomTypeID;
        }

        let amenitiesInsertValue: any = [];
        let amenitiesBookingInsertValue: any = [];

        if (amenities) {
            amenities.forEach((element: any) => {
                amenitiesInsertValue.push({
                    RoomTypeID: RoomTypeID,
                    AmenityID: parseInt(element),
                    IsGeneral: true,
                    IsBooking: false,
                });

                RoomTypeAPI.amenityInsertWU({
                    RoomTypeID: RoomTypeID,
                    AmenityID: parseInt(element),
                    IsGeneral: true,
                    IsBooking: false,
                });
            });
        }

        if (amenitiesBooking) {
            amenitiesBooking.forEach((element: any) => {
                amenitiesBookingInsertValue.push({
                    RoomTypeID: RoomTypeID,
                    AmenityID: parseInt(element),
                    IsGeneral: false,
                    IsBooking: true,
                });
            });
        }

        console.log("values", values);
        console.log("amenities", amenities);
        console.log("amenitiesBooking", amenitiesBooking);
        console.log("amenitiesInsertValue", amenitiesInsertValue);

        await mutate(listUrl);

        handleModal();
        toast("Амжилттай.");
    };

    const tabs = [
        {
            label: "Ерөнхий",
            component: (
                <>
                    <Grid container spacing={1}>
                        <Grid item xs={6}>
                            <TextField
                                size="small"
                                fullWidth
                                id="RoomTypeShortName"
                                label="Товч нэр"
                                {...register("RoomTypeShortName")}
                                margin="dense"
                                value={entity && entity.RoomTypeShortName}
                                InputLabelProps={{
                                    shrink: entity && entity.RoomTypeShortName,
                                }}
                                error={errors.RoomTypeShortName?.message}
                                helperText={errors.RoomTypeShortName?.message}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                size="small"
                                fullWidth
                                id="RoomTypeName"
                                label="Нэр"
                                {...register("RoomTypeName")}
                                margin="dense"
                                value={entity && entity.RoomTypeName}
                                InputLabelProps={{
                                    shrink: entity && entity.RoomTypeName,
                                }}
                                error={errors.RoomTypeName?.message}
                                helperText={errors.RoomTypeName?.message}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                size="small"
                                type="number"
                                fullWidth
                                id="BaseAdult"
                                label="Том хүн - үндсэн"
                                {...register("BaseAdult")}
                                margin="dense"
                                value={entity && entity.BaseAdult}
                                InputLabelProps={{
                                    shrink: entity && entity.BaseAdult,
                                }}
                                error={errors.BaseAdult?.message}
                                helperText={errors.BaseAdult?.message}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                size="small"
                                type="number"
                                fullWidth
                                id="MaxAdult"
                                label="Том хүний тоо - дээд хязгаар"
                                {...register("MaxAdult")}
                                margin="dense"
                                value={entity && entity.MaxAdult}
                                InputLabelProps={{
                                    shrink: entity && entity.MaxAdult,
                                }}
                                error={errors.MaxAdult?.message}
                                helperText={errors.MaxAdult?.message}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                size="small"
                                type="number"
                                fullWidth
                                id="BaseChild"
                                label="Хүүхэд - үндсэн"
                                {...register("BaseChild")}
                                value={entity && entity.BaseChild}
                                InputLabelProps={{
                                    shrink: entity && entity.BaseChild,
                                }}
                                error={errors.BaseChild?.message}
                                helperText={errors.BaseChild?.message}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                size="small"
                                type="number"
                                fullWidth
                                id="MaxChild"
                                label="Хүүхдийн тоо - дээд хязгаар"
                                {...register("MaxChild")}
                                value={entity && entity.MaxChild}
                                InputLabelProps={{
                                    shrink: entity && entity.MaxChild,
                                }}
                                error={errors.MaxChild?.message}
                                helperText={errors.MaxChild?.message}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                size="small"
                                type="number"
                                fullWidth
                                id="SortOrder"
                                label="Дараалал"
                                {...register("SortOrder")}
                                margin="dense"
                                value={entity && entity.SortOrder}
                                InputLabelProps={{
                                    shrink: entity && entity.SortOrder,
                                }}
                                error={errors.SortOrder?.message}
                                helperText={errors.SortOrder?.message}
                                sx={{ mt: 2 }}
                            />
                        </Grid>
                    </Grid>

                    <RoomAmenitySelect
                        register={register}
                        errors={errors}
                        customRegisterName="amenity"
                        entity={entity}
                    />
                </>
            ),
        },
        {
            label: "Booking Engine",
            component: (
                <>
                    <Grid container spacing={1}>
                        <Grid item xs={6}>
                            <TextField
                                size="small"
                                fullWidth
                                id="BookingDescription"
                                label="Товч тайлбар (Онлайн захиалга)"
                                {...register("BookingDescription")}
                                margin="dense"
                                value={entity && entity.BookingDescription}
                                InputLabelProps={{
                                    shrink: entity && entity.BookingDescription,
                                }}
                                error={errors.BookingDescription?.message}
                                helperText={errors.BookingDescription?.message}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                size="small"
                                type="number"
                                fullWidth
                                id="SortOrder"
                                label="Эрэмбэлэх утга"
                                {...register("SortOrder")}
                                margin="dense"
                                value={entity && entity.SortOrder}
                                InputLabelProps={{
                                    shrink: entity && entity.SortOrder,
                                }}
                                error={errors.SortOrder?.message}
                                helperText={errors.SortOrder?.message}
                            />
                        </Grid>
                    </Grid>
                    <FormGroup>
                        <FormControlLabel
                            control={<Checkbox />}
                            label="Онлайн захиалга дээр харуулах эсэх"
                            {...register("Booking")}
                            value={entity && entity.Booking}
                        />
                    </FormGroup>

                    <AmenitySelect
                        register={register}
                        errors={errors}
                        customRegisterName="amenity2"
                        entity={entity}
                    />
                </>
            ),
        },
    ];

    return (
        //         <NewEditForm
        //             api={RoomTypeAPI}
        //             listUrl={listUrl}
        //             additionalValues={{ RoomTypeID: state.editId }}
        //             reset={reset}
        //             handleSubmit={handleSubmit}
        //         >
        <form onSubmit={handleSubmit(onSubmit)}>
            <Box sx={{ width: "100%" }}>
                <CustomTab tabs={tabs} />
                <Button
                    type="submit"
                    variant="contained"
                    ref={formRef}
                    className="mt-3"
                    fullWidth
                >
                    <SaveIcon className="mr-1" />
                    Хадгалах
                </Button>
            </Box>
        </form>
        // </NewEditForm>
    );
};

export default NewEdit;
