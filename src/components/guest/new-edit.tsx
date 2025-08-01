import { useState, useEffect, useContext } from "react";
import { useForm } from "react-hook-form";
import { TextField, Box } from "@mui/material";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import MenuItem from "@mui/material/MenuItem";
import NewEditForm from "components/common/new-edit-form";
import { GuestAPI, listUrl } from "lib/api/guest";
import GenderSelect from "components/select/gender";
import CountrySelect from "components/select/country";
import GuestTitleSelect from "components/select/guest-title";
import Grid from "@mui/material/Grid";
import { ApiResponseModel } from "models/response/ApiResponseModel";
import Button from "@mui/material/Button";
import { mutate } from "swr";
import { toast } from "react-toastify";
import { ModalContext } from "../../lib/context/modal";
import { LoadingButton } from "@mui/lab";
import SaveIcon from "@mui/icons-material/Save";
import SelectList from "components/guest/select-list";

const NewEdit = ({
    idEditing,
    onFilterValueChange,
    onInputChange,
    register,
    handleSubmit,
    errors,
    reset,
    getValues,
    filterValues,
    control,
    setGuest,
}: any) => {
    const [entity, setEntity]: any = useState(null);
    const [identityType, setIdentityType] = useState(1);
    const [loading, setLoading] = useState(false);
    const { handleModal }: any = useContext(ModalContext);

    useEffect(() => {
        if (idEditing) {
            const fetchDatas = async () => {
                const response: ApiResponseModel = await GuestAPI.get(
                    idEditing
                );
                if (response.status === 200 && response.data.length === 1) {
                    let newEntity = response.data[0];
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
    }, [idEditing]);

    const onIdentityTypeChange = (evt: any) => {
        setEntity({
            ...entity,
            IdentityTypeID: evt.target.value,
        });
        setIdentityType(evt.target.value);
    };

    // const validationSchema = yup.object().shape(
    //     {
    //         // GuestTitleID: yup.string().required("Бөглөнө үү"),
    //         Name: yup.string().required("Бөглөнө үү"),
    //         Surname: yup.string().notRequired(),
    //         GenderID: yup.number().required("Бөглөнө үү"),
    //         RegistryNo: yup.string().when("IdentityTypeID", {
    //             is: (IdentityTypeID: number) => {
    //                 return IdentityTypeID === 1;
    //             },
    //             then: yup.string().required("Бөглөнө үү"),
    //             otherwise: yup.string().notRequired(),
    //         }),
    //         DriverLicenseNo: yup.string().when("IdentityTypeID", {
    //             is: (IdentityTypeID: number) => {
    //                 return IdentityTypeID === 2;
    //             },
    //             then: yup.string().required("Бөглөнө үү"),
    //             otherwise: yup.string().notRequired(),
    //         }),
    //         // RegistryNo: yup.string().when("DriverLicenseNo", {
    //         //     is: (DriverLicenseNo: any) => {
    //         //         console.log("DriverLicenseNo", DriverLicenseNo);
    //         //         return !DriverLicenseNo || DriverLicenseNo.length === 0;
    //         //     },
    //         //     then: yup.string().required("Бөглөнө үү"),
    //         //     otherwise: yup.string().notRequired(),
    //         // }),
    //         // DriverLicenseNo: yup.string().when("RegistryNo", {
    //         //     is: (RegistryNo: any) => {
    //         //         console.log("RegistryNo", RegistryNo);
    //         //         return !RegistryNo || RegistryNo.length === 0;
    //         //     },
    //         //     then: yup.string().required("Бөглөнө үү"),
    //         //     otherwise: yup.string().notRequired(),
    //         // }),
    //     },
    //     [["RegistryNo", "DriverLicenseNo"]]
    // );
    // const formOptions = { resolver: yupResolver(validationSchema) };

    // const {
    //     register,
    //     handleSubmit,
    //     formState: { errors },
    //     reset,
    //     getValues,
    // } = useForm(formOptions);

    const onSubmit = async (values: any) => {
        setLoading(true);

        try {
            if (entity && entity._id) {
                await GuestAPI?.update(entity._id, values);
            } else {
                await GuestAPI?.new(values);
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
        <>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Grid container spacing={2}>
                    <Grid item xs={6}>
                        <GuestTitleSelect
                            register={register}
                            errors={errors}
                            entity={entity}
                            setEntity={setEntity}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            size="small"
                            fullWidth
                            id="Surname"
                            label="Овог"
                            {...register("Surname")}
                            margin="dense"
                            error={!!errors.Surname?.message}
                            helperText={errors.Surname?.message as string}
                            value={entity && entity.Surname}
                            InputLabelProps={{
                                shrink: entity && entity.Surname,
                            }}
                            onChange={(evt: any) => {
                                setEntity({
                                    ...entity,
                                    Surname: evt.target.value,
                                });
                            }}
                        />
                    </Grid>
                </Grid>

                <Grid container spacing={2}>
                    <Grid item xs={6}>
                        <TextField
                            size="small"
                            fullWidth
                            id="Name"
                            label="Нэр"
                            {...register("Name")}
                            margin="dense"
                            error={!!errors.Name?.message}
                            helperText={errors.Name?.message as string}
                            value={entity && entity.Name}
                            InputLabelProps={{
                                shrink: entity && entity.Name,
                            }}
                            onChange={(evt: any) => {
                                setEntity({
                                    ...entity,
                                    Name: evt.target.value,
                                });
                                if (onFilterValueChange) {
                                    onFilterValueChange({
                                        key: "GuestName",
                                        value: evt.target.value,
                                    });
                                }
                            }}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            size="small"
                            fullWidth
                            id="IdentityTypeID"
                            label="IdentityType"
                            select
                            margin="dense"
                            error={!!errors.IdentityTypeID?.message}
                            helperText={errors.IdentityTypeID?.message as string}
                            onChange={onIdentityTypeChange}
                            value={
                                entity && entity.IdentityTypeID
                                    ? entity.IdentityTypeID
                                    : ""
                            }
                        >
                            <MenuItem value={1}>{"Пасспорт"}</MenuItem>
                            <MenuItem value={2}>{"Жолооны үнэмлэх"}</MenuItem>
                        </TextField>
                    </Grid>
                    {(identityType === 1 || true) && (
                        <Grid item xs={6}>
                            <TextField
                                size="small"
                                fullWidth
                                id="RegistryNo"
                                label="Регистерийн дугаар"
                                {...register("RegistryNo")}
                                margin="dense"
                                error={!!errors.RegistryNo?.message}
                                helperText={errors.RegistryNo?.message as string}
                                value={
                                    entity &&
                                    entity.IdentityTypeID === 1 &&
                                    entity.IdentityValue
                                        ? entity.IdentityValue
                                        : ""
                                }
                                InputLabelProps={{
                                    shrink: entity && entity.RegistryNo,
                                }}
                                onChange={(evt: any) => {
                                    setEntity({
                                        ...entity,
                                        IdentityTypeID: 1,
                                        IdentityValue: evt.target.value,
                                    });

                                    if (onFilterValueChange) {
                                        onFilterValueChange({
                                            key: "IdentityValue",
                                            value: evt.target.value,
                                        });
                                    }
                                }}
                            />
                        </Grid>
                    )}

                    {(identityType === 2 || true) && (
                        <Grid item xs={6}>
                            <TextField
                                size="small"
                                fullWidth
                                id="DriverLicenseNo"
                                label="Жолооны үнэмлэхний дугаар"
                                {...register("DriverLicenseNo")}
                                margin="dense"
                                error={!!errors.DriverLicenseNo?.message}
                                helperText={errors.DriverLicenseNo?.message as string}
                                value={
                                    entity &&
                                    entity.IdentityTypeID === 2 &&
                                    entity.IdentityValue
                                        ? entity.IdentityValue
                                        : ""
                                }
                                InputLabelProps={{
                                    shrink: entity && entity.DriverLicenseNo,
                                }}
                                onChange={(evt: any) => {
                                    setEntity({
                                        ...entity,
                                        IdentityTypeID: 2,
                                        IdentityValue: evt.target.value,
                                    });
                                    if (onFilterValueChange) {
                                        onFilterValueChange({
                                            key: "IdentityValue",
                                            value: evt.target.value,
                                        });
                                    }
                                }}
                            />
                        </Grid>
                    )}
                </Grid>
                <GenderSelect
                    register={register}
                    errors={errors}
                    entity={entity}
                    setEntity={setEntity}
                    control={control}
                />

                <CountrySelect
                    register={register}
                    errors={errors}
                    entity={entity}
                    setEntity={setEntity}
                />

                <Grid container spacing={2}>
                    <Grid item xs={6}>
                        <TextField
                            size="small"
                            fullWidth
                            id="Email"
                            label="Емэйл"
                            {...register("Email")}
                            margin="dense"
                            error={!!errors.Email?.message}
                            helperText={errors.Email?.message as string}
                            value={entity && entity.Email}
                            InputLabelProps={{
                                shrink: entity && entity.Email,
                            }}
                            onChange={(evt: any) => {
                                setEntity({
                                    ...entity,
                                    Email: evt.target.value,
                                });
                            }}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            size="small"
                            fullWidth
                            id="Mobile"
                            label="Гар утас"
                            {...register("Mobile")}
                            margin="dense"
                            error={!!errors.Mobile?.message}
                            helperText={errors.Mobile?.message as string}
                            value={entity && entity.Mobile}
                            InputLabelProps={{
                                shrink: entity && entity.Mobile,
                            }}
                            onChange={(evt: any) => {
                                setEntity({
                                    ...entity,
                                    Mobile: evt.target.value,
                                });
                                if (onFilterValueChange) {
                                    onFilterValueChange({
                                        key: "Phone",
                                        value: evt.target.value,
                                    });
                                }
                            }}
                        />
                    </Grid>
                </Grid>

                <TextField
                    size="small"
                    fullWidth
                    id="Address"
                    label="Хаягийн мэдээлэл"
                    {...register("Address")}
                    margin="dense"
                    error={!!errors.Address?.message}
                    helperText={errors.Address?.message as string}
                    value={entity && entity.Address}
                    InputLabelProps={{
                        shrink: entity && entity.Address,
                    }}
                    onChange={(evt: any) => {
                        setEntity({
                            ...entity,
                            Address: evt.target.value,
                        });
                    }}
                />

                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "end",
                        mt: 2,
                    }}
                >
                    {onFilterValueChange && (
                        <Button
                            variant="text"
                            onClick={(evt: any) => {
                                setEntity({});
                                reset({
                                    Surname: null,
                                    Name: null,
                                    GenderID: null,
                                    Mobile: null,
                                    Address: null,
                                });
                            }}
                        >
                            RESET
                        </Button>
                    )}

                    {/* <LoadingButton
                        type="submit"
                        variant="outlined"
                        loading={loading}
                    >
                        <SaveIcon />
                    </LoadingButton> */}
                </Box>
                <SelectList filterValues={filterValues} setGuest={setGuest} />
            </form>
        </>
    );
};

export default NewEdit;
