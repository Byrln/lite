import {
    Checkbox,
    Box,
    Grid,
    FormControlLabel,
    FormGroup,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { TextField } from "@mui/material";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

import NewEditForm from "components/common/new-edit-form";
import RoomAmenitySelect from "components/select/room-amenity";
import AmenitySelect from "components/select/amenity";

import { RoomTypeAPI, listUrl } from "lib/api/room-type";
import { useAppState } from "lib/context/app";
import CustomTab from "components/common/custom-tab";

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
    const [state]: any = useAppState();
    const {
        register,
        reset,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(validationSchema),
    });
    const tabs = [
        {
            label: "General",
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
                                error={errors.MaxChild?.message}
                                helperText={errors.MaxChild?.message}
                            />
                        </Grid>
                    </Grid>

                    <TextField
                        size="small"
                        type="number"
                        fullWidth
                        id="SortOrder"
                        label="Дараалал"
                        {...register("SortOrder")}
                        margin="dense"
                        error={errors.SortOrder?.message}
                        helperText={errors.SortOrder?.message}
                        sx={{ mt: 2 }}
                    />

                    <RoomAmenitySelect register={register} errors={errors} />
                </>
            ),
        },
        {
            label: "Booking Engine",
            component: (
                <>
                    <TextField
                        size="small"
                        fullWidth
                        id="BookingDescription"
                        label="Товч тайлбар (Онлайн захиалга)"
                        {...register("BookingDescription")}
                        margin="dense"
                        error={errors.BookingDescription?.message}
                        helperText={errors.BookingDescription?.message}
                    />

                    <TextField
                        size="small"
                        type="number"
                        fullWidth
                        id="SortOrder"
                        label="Эрэмбэлэх утга"
                        {...register("SortOrder")}
                        margin="dense"
                        error={errors.SortOrder?.message}
                        helperText={errors.SortOrder?.message}
                    />

                    <FormGroup>
                        <FormControlLabel
                            control={<Checkbox />}
                            label="Онлайн захиалга дээр харуулах эсэх"
                            {...register("Booking")}
                        />
                    </FormGroup>

                    <AmenitySelect register={register} errors={errors} />
                </>
            ),
        },
    ];

    return (
        <NewEditForm
            api={RoomTypeAPI}
            listUrl={listUrl}
            additionalValues={{ RoomTypeID: state.editId }}
            reset={reset}
            handleSubmit={handleSubmit}
        >
            <Box sx={{ width: "100%" }}>
                <CustomTab tabs={tabs} />
            </Box>
        </NewEditForm>
    );
};

export default NewEdit;
