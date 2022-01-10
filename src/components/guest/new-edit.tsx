import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { TextField } from "@mui/material";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import MenuItem from "@mui/material/MenuItem";
import NewEditForm from "components/common/new-edit-form";
import { RoomAPI, listUrl } from "lib/api/room";
import GenderSelect from "components/select/gender";
import Grid from "@mui/material/Grid";

const NewEdit = ({ rowId }: any) => {
    const [entity, setEntity]: any = useState(null);
    const [identityType, setIdentityType] = useState("passport");

    useEffect(() => {
        if (rowId) {
            const fetchDatas = async () => {
                const entity: any = await RoomAPI.get(rowId);
                setEntity(entity);
            };

            fetchDatas();
        }
    }, [rowId]);

    const onIdentityTypeChange = (evt: any) => {
        setIdentityType(evt.target.value);
    };

    const validationSchema = yup.object().shape({
        GuestTitleID: yup.string().required("Бөглөнө үү"),
        Name: yup.number().required("Бөглөнө үү"),
        Surname: yup.number().required("Бөглөнө үү"),
        IdentityTypeID: yup.string().required("Бөглөнө үү"),
        RegistryNo: yup.string().required("Бөглөнө үү"),
        DriverLicenseNo: yup.number().required("Бөглөнө үү"),
        GenderID: yup.number().required("Бөглөнө үү"),
    });
    const formOptions = { resolver: yupResolver(validationSchema) };

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm(formOptions);

    return (
        <NewEditForm
            api={RoomAPI}
            entity={entity}
            listUrl={listUrl}
            handleSubmit={handleSubmit}
        >
            <TextField
                fullWidth
                id="Name"
                label="Нэр"
                {...register("Name")}
                margin="dense"
                error={errors.Name?.message}
                helperText={errors.Name?.message}
                value={entity && entity.Name}
            />

            <TextField
                fullWidth
                id="Surname"
                label="Овог"
                {...register("Surname")}
                margin="dense"
                error={errors.Surname?.message}
                helperText={errors.Surname?.message}
                value={entity && entity.Surname}
            />

            <Grid container spacing={2}>
                <Grid item xs={6}>
                    <TextField
                        fullWidth
                        id="IdentityTypeID"
                        label="IdentityType"
                        {...register("IdentityTypeID")}
                        select
                        margin="dense"
                        error={errors.IdentityTypeID?.message}
                        helperText={errors.IdentityTypeID?.message}
                        onChange={onIdentityTypeChange}
                    >
                        <MenuItem value={"passport"}>{"Пасспорт"}</MenuItem>
                        <MenuItem value={"driver_license"}>
                            {"Жолооны үнэмлэх"}
                        </MenuItem>
                    </TextField>
                </Grid>
                <Grid item xs={6}>
                    {identityType == "passport" && (
                        <TextField
                            fullWidth
                            id="RegistryNo"
                            label="Регистерийн дугаар"
                            {...register("RegistryNo")}
                            margin="dense"
                            error={errors.RegistryNo?.message}
                            helperText={errors.RegistryNo?.message}
                            value={entity && entity.RegistryNo}
                        />
                    )}

                    {identityType == "driver_license" && (
                        <TextField
                            fullWidth
                            id="DriverLicenseNo"
                            label="Жолооны үнэмлэхний дугаар"
                            {...register("RegistryNo")}
                            margin="dense"
                            error={errors.DriverLicenseNo?.message}
                            helperText={errors.DriverLicenseNo?.message}
                            value={entity && entity.DriverLicenseNo}
                        />
                    )}
                </Grid>
            </Grid>
            <GenderSelect
                register={register}
                errors={errors}
                entity={entity}
                setEntity={setEntity}
            />

            <Grid container spacing={2}>
                <Grid item xs={6}>
                    <TextField
                        fullWidth
                        id="Email"
                        label="Емэйл"
                        {...register("Email")}
                        margin="dense"
                        error={errors.Email?.message}
                        helperText={errors.Email?.message}
                        value={entity && entity.Email}
                    />
                </Grid>
                <Grid item xs={6}>
                    <TextField
                        fullWidth
                        id="Mobile"
                        label="Гар утас"
                        {...register("Mobile")}
                        margin="dense"
                        error={errors.Mobile?.message}
                        helperText={errors.Mobile?.message}
                        value={entity && entity.Mobile}
                    />
                </Grid>
            </Grid>

            <TextField
                fullWidth
                id="Address"
                label="Хаягийн мэдээлэл"
                {...register("Address")}
                margin="dense"
                error={errors.Address?.message}
                helperText={errors.Address?.message}
                value={entity && entity.Address}
            />
        </NewEditForm>
    );
};

export default NewEdit;
