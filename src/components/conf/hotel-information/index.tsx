/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { Box, Grid, TextField, CircularProgress } from "@mui/material";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-toastify";

import { HotelAPI } from "lib/api/hotel";
import SubmitButton from "components/common/submit-button";
import ReferenceSelect from "components/select/reference";
import CustomTab from "components/common/custom-tab";

const validationSchema = yup.object().shape({
    HotelCode: yup.string().required("Бөглөнө үү"),
    HotelName: yup.string().required("Бөглөнө үү"),
    CompanyName: yup.string(),
    RegistryNo: yup.string(),
    ReceptionPhone: yup.string(),
    Address1: yup.string().required("Бөглөнө үү"),
    Address2: yup.string(),
    City: yup.string(),
    State: yup.string(),
    CountryID: yup.number().required("Бөглөнө үү").typeError("Бөглөнө үү"),
    ReservePhone: yup.string(),
    ReserveEmail: yup.string().email(),
    HotelType: yup.string(),
    Website: yup.string(),
    HotelRatingID: yup.number().required("Бөглөнө үү").typeError("Бөглөнө үү"),
});

const HotelInformation = () => {
    const [loadingData, setLoadingData] = useState(true);
    const [loading, setLoading] = useState(false);
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
                <Grid container spacing={1}>
                    <Grid item xs={4}>
                        <TextField
                            size="small"
                            disabled
                            fullWidth
                            id="HotelCode"
                            label="Hotel Code"
                            {...register("HotelCode")}
                            margin="dense"
                            error={errors.HotelCode?.message}
                            helperText={errors.HotelCode?.message}
                        />
                        <TextField
                            size="small"
                            fullWidth
                            id="HotelName"
                            label="Hotel Name"
                            {...register("HotelName")}
                            margin="dense"
                            error={errors.HotelName?.message}
                            helperText={errors.HotelName?.message}
                        />
                        <TextField
                            size="small"
                            fullWidth
                            id="CompanyName"
                            label="Company Name"
                            {...register("CompanyName")}
                            margin="dense"
                            error={errors.CompanyName?.message}
                            helperText={errors.CompanyName?.message}
                        />
                        <TextField
                            size="small"
                            fullWidth
                            id="RegistryNo"
                            label="Registry No"
                            {...register("RegistryNo")}
                            margin="dense"
                            error={errors.RegistryNo?.message}
                            helperText={errors.RegistryNo?.message}
                        />
                        <TextField
                            size="small"
                            fullWidth
                            id="ReceptionPhone"
                            label="Reception Phone"
                            {...register("ReceptionPhone")}
                            margin="dense"
                            error={errors.ReceptionPhone?.message}
                            helperText={errors.ReceptionPhone?.message}
                        />
                    </Grid>
                    <Grid item xs={4}>
                        <TextField
                            size="small"
                            fullWidth
                            id="Address1"
                            label="Address 1"
                            {...register("Address1")}
                            margin="dense"
                            error={errors.Address1?.message}
                            helperText={errors.Address1?.message}
                        />
                        <TextField
                            size="small"
                            fullWidth
                            id="Address2"
                            label="Address 2"
                            {...register("Address2")}
                            margin="dense"
                            error={errors.Address2?.message}
                            helperText={errors.Address2?.message}
                        />
                        <TextField
                            size="small"
                            fullWidth
                            id="City"
                            label="City"
                            {...register("City")}
                            margin="dense"
                            error={errors.City?.message}
                            helperText={errors.City?.message}
                        />
                        <TextField
                            size="small"
                            fullWidth
                            id="State"
                            label="State"
                            {...register("State")}
                            margin="dense"
                            error={errors.State?.message}
                            helperText={errors.State?.message}
                        />
                        <ReferenceSelect
                            register={register}
                            errors={errors}
                            type="Country"
                            label="Country"
                            optionValue="CountryID"
                            optionLabel="CountryName"
                        />
                    </Grid>
                    <Grid item xs={4}>
                        <TextField
                            size="small"
                            fullWidth
                            id="ReservePhone"
                            label="Reservation Phone"
                            {...register("ReservePhone")}
                            margin="dense"
                            error={errors.ReservePhone?.message}
                            helperText={errors.ReservePhone?.message}
                        />
                        <TextField
                            size="small"
                            fullWidth
                            id="ReserveEmail"
                            label="Email"
                            {...register("ReserveEmail")}
                            margin="dense"
                            error={errors.ReserveEmail?.message}
                            helperText={errors.ReserveEmail?.message}
                        />
                        <TextField
                            size="small"
                            fullWidth
                            id="HotelType"
                            label="Hotel Type"
                            {...register("HotelType")}
                            margin="dense"
                            error={errors.HotelType?.message}
                            helperText={errors.HotelType?.message}
                        />
                        <TextField
                            size="small"
                            fullWidth
                            id="Website"
                            label="Website"
                            {...register("Website")}
                            margin="dense"
                            error={errors.Website?.message}
                            helperText={errors.Website?.message}
                        />
                        <TextField
                            size="small"
                            fullWidth
                            id="HotelRating"
                            label="Rating"
                            {...register("HotelRating")}
                            margin="dense"
                            error={errors.HotelRating?.message}
                            helperText={errors.HotelRating?.message}
                        />
                        {/* HotelRatingID */}
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            size="small"
                            fullWidth
                            multiline
                            rows={3}
                            id="HotelPolicy"
                            label="Hotel Policy"
                            {...register("HotelPolicy")}
                            margin="dense"
                            error={errors.HotelPolicy?.message}
                            helperText={errors.HotelPolicy?.message}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            size="small"
                            fullWidth
                            multiline
                            rows={3}
                            id="CancelPolicy"
                            label="Cancel Policy"
                            {...register("CancelPolicy")}
                            margin="dense"
                            error={errors.CancelPolicy?.message}
                            helperText={errors.CancelPolicy?.message}
                        />
                    </Grid>
                </Grid>
            ),
        },
        { label: "Booking Engine", component: <>Booking Engine</> },
    ];

    useEffect(() => {
        const fetchDatas = async () => {
            try {
                const arr: any = await HotelAPI.get();

                reset(arr[0]);
            } finally {
                setLoadingData(false);
            }
        };

        fetchDatas();
    }, []);

    const onSubmit = async (values: any) => {
        setLoading(true);

        try {
            await HotelAPI.update(values);

            toast("Амжилттай.");
        } finally {
            setLoading(false);
        }
    };

    return loadingData ? (
        <Grid
            container
            spacing={0}
            direction="column"
            alignItems="center"
            justifyContent="center"
        >
            <CircularProgress color="info" />
        </Grid>
    ) : (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Box sx={{ width: "100%" }}>
                <CustomTab tabs={tabs} />
            </Box>

            <SubmitButton loading={loading} />
        </form>
    );
};

export default HotelInformation;
