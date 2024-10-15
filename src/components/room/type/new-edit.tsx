import { createRef, useContext, useEffect, useState } from "react";
import {
    Checkbox,
    Box,
    Grid,
    FormControlLabel,
    FormGroup,
    Button,
    Card,
    CardContent,
    Typography,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { TextField } from "@mui/material";
import * as yup from "yup";

import { useIntl } from "react-intl";
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
import { AmenityAPI } from "lib/api/amenity";

const validationSchema = yup.object().shape({
    RoomTypeShortName: yup.string().required("Бөглөнө үү"),
    RoomTypeName: yup.string().required("Бөглөнө үү"),
    BaseAdult: yup.string().required("Бөглөнө үү").typeError("Бөглөнө үү"),
    BaseChild: yup.string().nullable(),
    MaxAdult: yup.string().required("Бөглөнө үү").typeError("Бөглөнө үү"),
    MaxChild: yup.string().required("Бөглөнө үү").typeError("Бөглөнө үү"),
    SortOrder: yup.number().required("Бөглөнө үү").typeError("Бөглөнө үү"),
    BookingDescription: yup.string(),
    Booking: yup.boolean().nullable(),
});

const NewEdit = () => {
    const intl = useIntl();
    const [entity, setEntity]: any = useState(null);

    const formRef = createRef<HTMLButtonElement>();
    const [state]: any = useAppState();
    const { handleModal }: any = useContext(ModalContext);

    const {
        register,
        reset,
        handleSubmit,
        control,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(validationSchema),
    });

    useEffect(() => {
        if (state.editId) {
            const fetchDatas = async () => {
                const response: any = await RoomTypeAPI.get(state.editId);
                const amenityResponse: any = await RoomTypeAPI.amenity(
                    state.editId
                );
                let amenitiesGeneralValue: any = [];
                let amenitiesBookingValue: any = [];

                if (amenityResponse) {
                    amenityResponse.forEach((amenityElement: any) => {
                        if (amenityElement.IsGeneral == true) {
                            amenitiesGeneralValue[amenityElement.AmenityID] =
                                true;
                        }
                        if (amenityElement.IsBooking == true) {
                            amenitiesBookingValue[amenityElement.AmenityID] =
                                true;
                        }
                    });
                }

                if (response.length === 1) {
                    let newEntity = response[0];
                    newEntity._id = newEntity.GuestID;
                    newEntity.amenity = amenitiesGeneralValue;
                    newEntity.amenity2 = amenitiesBookingValue;
                    console.log("entity", newEntity);
                    console.log("entityBooking", newEntity.Booking);

                    setEntity(newEntity);
                    reset(newEntity);
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
        console.log(values);
        values.RoomTypeID = state.editId;

        let amenities = entity.amenity;
        delete values.amenity;
        let amenitiesBooking = entity.amenity2;
        delete values.amenity2;
        let RoomTypeID: any;
        const amenitiesList = await AmenityAPI.list(values);

        if (state.editId) {
            const response = await RoomTypeAPI.update(values);
            RoomTypeID = state.editId;
        } else {
            const response = await RoomTypeAPI.new(values);
            RoomTypeID = response.data.JsonData[0].RoomTypeID;
        }

        let amenitiesInsertValue: any = [];

        if (amenities) {
            amenitiesList.forEach((amenityElement: any) => {
                let isGeneralTrue = false;
                let isBookingTrue = false;

                if (amenities) {
                    amenities.forEach((element: any, index: any) => {
                        if (amenityElement.AmenityID == parseInt(index)) {
                            isGeneralTrue = element;
                        }
                    });
                }

                if (amenitiesBooking) {
                    amenitiesBooking.forEach((element: any, index: any) => {
                        if (amenityElement.AmenityID == parseInt(index)) {
                            isBookingTrue = element;
                        }
                    });
                }

                amenitiesInsertValue.push({
                    RoomTypeID: RoomTypeID,
                    AmenityID: amenityElement.AmenityID,
                    IsGeneral: isGeneralTrue,
                    IsBooking: isBookingTrue,
                });
            });

            RoomTypeAPI.amenityInsertWUList({
                Amenities: amenitiesInsertValue,
            });
        }

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
                                label={intl.formatMessage({
                                    id: "RowHeaderShortName",
                                })}
                                {...register("RoomTypeShortName")}
                                margin="dense"
                                value={entity && entity.RoomTypeShortName}
                                onChange={(evt: any) => {
                                    setEntity({
                                        ...entity,
                                        RoomTypeShortName: evt.target.value,
                                    });
                                }}
                                InputLabelProps={{
                                    shrink:
                                        entity &&
                                        (entity.RoomTypeShortName ||
                                            entity.RoomTypeShortName == 0),
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
                                label={intl.formatMessage({
                                    id: "RoomTypeName",
                                })}
                                {...register("RoomTypeName")}
                                margin="dense"
                                value={entity && entity.RoomTypeName}
                                onChange={(evt: any) => {
                                    setEntity({
                                        ...entity,
                                        RoomTypeName: evt.target.value,
                                    });
                                }}
                                InputLabelProps={{
                                    shrink:
                                        entity &&
                                        (entity.RoomTypeName ||
                                            entity.RoomTypeName == 0),
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
                                label={intl.formatMessage({
                                    id: "TextBasicAdult",
                                })}
                                {...register("BaseAdult")}
                                margin="dense"
                                value={
                                    entity &&
                                    entity.BaseAdult > 0 &&
                                    entity.BaseAdult
                                }
                                onChange={(evt: any) => {
                                    setEntity({
                                        ...entity,
                                        BaseAdult: evt.target.value,
                                    });
                                }}
                                InputLabelProps={{
                                    shrink:
                                        entity &&
                                        (entity.BaseAdult ||
                                            entity.BaseAdult == 0),
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
                                label={intl.formatMessage({
                                    id: "TextMaxAdult",
                                })}
                                {...register("MaxAdult")}
                                margin="dense"
                                value={
                                    entity &&
                                    entity.MaxAdult > 0 &&
                                    entity.MaxAdult
                                }
                                onChange={(evt: any) => {
                                    setEntity({
                                        ...entity,
                                        MaxAdult: evt.target.value,
                                    });
                                }}
                                InputLabelProps={{
                                    shrink:
                                        entity &&
                                        (entity.MaxAdult ||
                                            entity.MaxAdult == 0),
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
                                label={intl.formatMessage({
                                    id: "TextBaseChild",
                                })}
                                {...register("BaseChild")}
                                value={
                                    entity &&
                                    (entity.BaseChild == 0
                                        ? ""
                                        : entity.BaseChild)
                                }
                                onChange={(evt: any) => {
                                    setEntity({
                                        ...entity,
                                        BaseChild: evt.target.value,
                                    });
                                }}
                                InputLabelProps={{
                                    shrink:
                                        entity &&
                                        (entity.BaseChild ||
                                            entity.BaseChild == 0),
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
                                label={intl.formatMessage({
                                    id: "TextMaxChild",
                                })}
                                {...register("MaxChild")}
                                value={
                                    entity &&
                                    entity.MaxChild > 0 &&
                                    entity.MaxChild
                                }
                                onChange={(evt: any) => {
                                    setEntity({
                                        ...entity,
                                        MaxChild: evt.target.value,
                                    });
                                }}
                                InputLabelProps={{
                                    shrink:
                                        entity &&
                                        (entity.MaxChild ||
                                            entity.MaxChild == 0),
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
                                label={intl.formatMessage({ id: "SortOrder" })}
                                {...register("SortOrder")}
                                defaultValue={1}
                                margin="dense"
                                value={
                                    entity &&
                                    entity.SortOrder > 0 &&
                                    entity.SortOrder
                                }
                                onChange={(evt: any) => {
                                    setEntity({
                                        ...entity,
                                        SortOrder: evt.target.value,
                                    });
                                }}
                                InputLabelProps={{
                                    shrink:
                                        entity &&
                                        (entity.SortOrder ||
                                            entity.SortOrder == 0),
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
                        entity={entity && entity.amenity}
                    />
                </>
            ),
        },
        {
            label: "Booking Engine",
            component: (
                <>
                    <Grid container spacing={1}>
                        <Grid item xs={12}>
                            <TextField
                                size="small"
                                fullWidth
                                id="BookingDescription"
                                label={intl.formatMessage({
                                    id: "BriefDescription(OnlineOrder)",
                                })}
                                multiline
                                {...register("BookingDescription")}
                                margin="dense"
                                value={entity && entity.BookingDescription}
                                onChange={(evt: any) => {
                                    setEntity({
                                        ...entity,
                                        BookingDescription: evt.target.value,
                                    });
                                }}
                                InputLabelProps={{
                                    shrink:
                                        entity &&
                                        (entity.BookingDescription ||
                                            entity.BookingDescription == 0),
                                }}
                                error={errors.BookingDescription?.message}
                                helperText={errors.BookingDescription?.message}
                            />
                        </Grid>
                        {/* <Grid item xs={6}>
                            <TextField
                                size="small"
                                type="number"
                                fullWidth
                                id="SortOrder"
                                label="Эрэмбэлэх утга"
                                {...register("SortOrder")}
                                margin="dense"
                                value={entity && entity.SortOrder}
                                onChange={(evt: any) => {
                                    setEntity({
                                        ...entity,
                                        SortOrder: evt.target.value,
                                    });
                                }}
                                InputLabelProps={{
                                    shrink: entity && entity.SortOrder,
                                }}
                                error={errors.SortOrder?.message}
                                helperText={errors.SortOrder?.message}
                            />
                        </Grid> */}
                    </Grid>

                    <FormControlLabel
                        control={
                            <Controller
                                name="Booking"
                                control={control}
                                render={(props: any) => (
                                    <Checkbox
                                        {...register("Booking")}
                                        checked={
                                            entity && entity.Booking == true
                                                ? true
                                                : false
                                        }
                                        onChange={(e) =>
                                            props.field.onChange(
                                                e.target.checked
                                            )
                                        }
                                    />
                                )}
                            />
                        }
                        label={intl.formatMessage({
                            id: "WhetherToDisplayOnLineOrders",
                        })}
                    />
                    {/* <FormGroup>
                        <FormControlLabel
                            control={
                                <Checkbox checked={entity && entity.Booking} />
                            }
                            label="Онлайн захиалга дээр харуулах эсэх"
                            {...register("Booking")}
                            value={entity && entity.Booking}
                            onChange={(evt: any) => {
                                setEntity({
                                    ...entity,
                                    Booking: evt.target.value,
                                });
                            }}
                        />
                    </FormGroup> */}

                    <AmenitySelect
                        register={register}
                        errors={errors}
                        customRegisterName="amenity2"
                        entity={entity && entity.amenity2}
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
                {/* <CustomTab tabs={tabs} /> */}
                <Grid container spacing={1}>
                    <Grid item xs={12}>
                        <Card className="mt-3">
                            <CardContent>
                                <Typography
                                    variant="subtitle1"
                                    component="div"
                                    className="mb-3"
                                >
                                    Ерөнхий
                                </Typography>
                                <Grid container spacing={1}>
                                    <Grid item xs={6}>
                                        <TextField
                                            size="small"
                                            fullWidth
                                            id="RoomTypeShortName"
                                            label={intl.formatMessage({
                                                id: "RowHeaderShortName",
                                            })}
                                            {...register("RoomTypeShortName")}
                                            margin="dense"
                                            value={
                                                entity &&
                                                entity.RoomTypeShortName
                                            }
                                            onChange={(evt: any) => {
                                                setEntity({
                                                    ...entity,
                                                    RoomTypeShortName:
                                                        evt.target.value,
                                                });
                                            }}
                                            InputLabelProps={{
                                                shrink:
                                                    entity &&
                                                    (entity.RoomTypeShortName ||
                                                        entity.RoomTypeShortName ==
                                                            0),
                                            }}
                                            error={
                                                errors.RoomTypeShortName
                                                    ?.message
                                            }
                                            helperText={
                                                errors.RoomTypeShortName
                                                    ?.message
                                            }
                                        />
                                    </Grid>
                                    <Grid item xs={6}>
                                        <TextField
                                            size="small"
                                            fullWidth
                                            id="RoomTypeName"
                                            label={intl.formatMessage({
                                                id: "RoomTypeName",
                                            })}
                                            {...register("RoomTypeName")}
                                            margin="dense"
                                            value={
                                                entity && entity.RoomTypeName
                                            }
                                            onChange={(evt: any) => {
                                                setEntity({
                                                    ...entity,
                                                    RoomTypeName:
                                                        evt.target.value,
                                                });
                                            }}
                                            InputLabelProps={{
                                                shrink:
                                                    entity &&
                                                    (entity.RoomTypeName ||
                                                        entity.RoomTypeName ==
                                                            0),
                                            }}
                                            error={errors.RoomTypeName?.message}
                                            helperText={
                                                errors.RoomTypeName?.message
                                            }
                                        />
                                    </Grid>
                                    <Grid item xs={6}>
                                        <TextField
                                            size="small"
                                            type="number"
                                            fullWidth
                                            id="BaseAdult"
                                            label={intl.formatMessage({
                                                id: "TextBaseAdult",
                                            })}
                                            {...register("BaseAdult")}
                                            margin="dense"
                                            value={
                                                entity &&
                                                entity.BaseAdult > 0 &&
                                                entity.BaseAdult
                                            }
                                            onChange={(evt: any) => {
                                                setEntity({
                                                    ...entity,
                                                    BaseAdult: evt.target.value,
                                                });
                                            }}
                                            InputLabelProps={{
                                                shrink:
                                                    entity &&
                                                    (entity.BaseAdult ||
                                                        entity.BaseAdult == 0),
                                            }}
                                            error={errors.BaseAdult?.message}
                                            helperText={
                                                errors.BaseAdult?.message
                                            }
                                        />
                                    </Grid>
                                    <Grid item xs={6}>
                                        <TextField
                                            size="small"
                                            type="number"
                                            fullWidth
                                            id="MaxAdult"
                                            label={intl.formatMessage({
                                                id: "TextMaxAdult",
                                            })}
                                            {...register("MaxAdult")}
                                            margin="dense"
                                            value={
                                                entity &&
                                                entity.MaxAdult > 0 &&
                                                entity.MaxAdult
                                            }
                                            onChange={(evt: any) => {
                                                setEntity({
                                                    ...entity,
                                                    MaxAdult: evt.target.value,
                                                });
                                            }}
                                            InputLabelProps={{
                                                shrink:
                                                    entity &&
                                                    (entity.MaxAdult ||
                                                        entity.MaxAdult == 0),
                                            }}
                                            error={errors.MaxAdult?.message}
                                            helperText={
                                                errors.MaxAdult?.message
                                            }
                                        />
                                    </Grid>
                                    <Grid item xs={6}>
                                        <TextField
                                            size="small"
                                            type="number"
                                            fullWidth
                                            id="BaseChild"
                                            label={intl.formatMessage({
                                                id: "TextBaseChild",
                                            })}
                                            {...register("BaseChild")}
                                            value={entity && entity.BaseChild}
                                            onChange={(evt: any) => {
                                                setEntity({
                                                    ...entity,
                                                    BaseChild: evt.target.value,
                                                });
                                            }}
                                            InputLabelProps={{
                                                shrink:
                                                    entity &&
                                                    (entity.BaseChild ||
                                                        entity.BaseChild == 0),
                                            }}
                                            error={errors.BaseChild?.message}
                                            helperText={
                                                errors.BaseChild?.message
                                            }
                                        />
                                    </Grid>
                                    <Grid item xs={6}>
                                        <TextField
                                            size="small"
                                            type="number"
                                            fullWidth
                                            id="MaxChild"
                                            label={intl.formatMessage({
                                                id: "TextMaxChild",
                                            })}
                                            {...register("MaxChild")}
                                            value={
                                                entity &&
                                                entity.MaxChild > 0 &&
                                                entity.MaxChild
                                            }
                                            onChange={(evt: any) => {
                                                setEntity({
                                                    ...entity,
                                                    MaxChild: evt.target.value,
                                                });
                                            }}
                                            InputLabelProps={{
                                                shrink:
                                                    entity &&
                                                    (entity.MaxChild ||
                                                        entity.MaxChild == 0),
                                            }}
                                            error={errors.MaxChild?.message}
                                            helperText={
                                                errors.MaxChild?.message
                                            }
                                        />
                                    </Grid>
                                    <Grid item xs={6}>
                                        <TextField
                                            size="small"
                                            type="number"
                                            fullWidth
                                            id="SortOrder"
                                            label={intl.formatMessage({
                                                id: "SortOrder",
                                            })}
                                            {...register("SortOrder")}
                                            defaultValue={1}
                                            margin="dense"
                                            value={
                                                entity && entity.SortOrder > 0
                                                    ? entity.SortOrder
                                                    : 1
                                            }
                                            onChange={(evt: any) => {
                                                setEntity({
                                                    ...entity,
                                                    SortOrder: evt.target.value,
                                                });
                                            }}
                                            InputLabelProps={{
                                                shrink: true,
                                            }}
                                            error={errors.SortOrder?.message}
                                            helperText={
                                                errors.SortOrder?.message
                                            }
                                            sx={{ mt: 2 }}
                                        />
                                    </Grid>
                                </Grid>
                                <RoomAmenitySelect
                                    register={register}
                                    errors={errors}
                                    customRegisterName="amenity"
                                    entity={entity && entity}
                                    setEntity={setEntity}
                                />
                            </CardContent>
                        </Card>
                    </Grid>{" "}
                    <Grid item xs={12}>
                        <Card className="mt-3">
                            <CardContent>
                                <Typography
                                    variant="subtitle1"
                                    component="div"
                                    className="mb-3"
                                >
                                    Booking
                                </Typography>

                                <Grid container spacing={1}>
                                    <Grid item xs={12}>
                                        <TextField
                                            size="small"
                                            fullWidth
                                            id="BookingDescription"
                                            label={intl.formatMessage({
                                                id: "BriefDescription(OnlineOrder",
                                            })}
                                            multiline
                                            {...register("BookingDescription")}
                                            margin="dense"
                                            value={
                                                entity &&
                                                entity.BookingDescription
                                            }
                                            onChange={(evt: any) => {
                                                setEntity({
                                                    ...entity,
                                                    BookingDescription:
                                                        evt.target.value,
                                                });
                                            }}
                                            InputLabelProps={{
                                                shrink:
                                                    entity &&
                                                    (entity.BookingDescription ||
                                                        entity.BookingDescription ==
                                                            0),
                                            }}
                                            error={
                                                errors.BookingDescription
                                                    ?.message
                                            }
                                            helperText={
                                                errors.BookingDescription
                                                    ?.message
                                            }
                                        />
                                    </Grid>
                                    {/* <Grid item xs={6}>
                                        <TextField
                                            size="small"
                                            type="number"
                                            fullWidth
                                            id="SortOrder"
                                            label="Эрэмбэлэх утга"
                                            {...register("SortOrder")}
                                            margin="dense"
                                            value={entity && entity.SortOrder}
                                            onChange={(evt: any) => {
                                                setEntity({
                                                    ...entity,
                                                    SortOrder: evt.target.value,
                                                });
                                            }}
                                            InputLabelProps={{
                                                shrink:
                                                    entity && entity.SortOrder,
                                            }}
                                            error={errors.SortOrder?.message}
                                            helperText={
                                                errors.SortOrder?.message
                                            }
                                        />
                                    </Grid> */}
                                </Grid>
                                <FormControlLabel
                                    control={
                                        <Controller
                                            name="Booking"
                                            control={control}
                                            render={(props: any) => (
                                                <Checkbox
                                                    {...register("Booking")}
                                                    checked={
                                                        entity && entity.Booking
                                                    }
                                                    onChange={(evt: any) => {
                                                        setEntity({
                                                            ...entity,
                                                            Booking:
                                                                evt.target
                                                                    .checked,
                                                        });
                                                    }}
                                                />
                                            )}
                                        />
                                    }
                                    label={intl.formatMessage({
                                        id: "WhetherToDisplayOnLineOrders",
                                    })}
                                />
                                {/* <FormGroup>
                                    <FormControlLabel
                                        control={<Checkbox />}
                                        label="Онлайн захиалга дээр харуулах эсэх"
                                        {...register("Booking")}
                                        value={entity && entity.Booking}
                                        onChange={(evt: any) => {
                                            setEntity({
                                                ...entity,
                                                Booking: evt.target.checked,
                                            });
                                        }}
                                    />
                                </FormGroup> */}

                                <AmenitySelect
                                    register={register}
                                    errors={errors}
                                    customRegisterName="amenity2"
                                    entity={entity && entity}
                                    customTitle="Өрөөний онцлогууд (Онлайн захиалга)"
                                    setEntity={setEntity}
                                />
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>

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
