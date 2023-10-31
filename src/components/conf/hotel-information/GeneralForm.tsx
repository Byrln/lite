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
import CustomUpload from "components/common/custom-upload";

const validationSchemaHotel = yup.object().shape({
    HotelCode: yup.string().required("Бөглөнө үү"),
    HotelName: yup.string().required("Бөглөнө үү"),
    CompanyName: yup.string(),
    RegistryNo: yup
        .string()
        .matches(/^[0-9]+$/, "Та регистерээ тоо байхаар оруулна уу"),
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

const GeneralForm = () => {
    const [loadingData, setLoadingData] = useState(true);
    const [data, setData] = useState({ Logo: null });
    const [loading, setLoading] = useState(false);
    const {
        register,
        reset,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(validationSchemaHotel),
    });

    const onSubmit = async (values: any) => {
        setLoading(true);

        try {
            await HotelAPI.update(values);

            toast("Амжилттай.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const fetchDatas = async () => {
            try {
                const arr: any = await HotelAPI.get();
                setData(arr[0]);
                reset(arr[0]);
            } finally {
                setLoadingData(false);
            }
        };

        fetchDatas();
    }, []);

    // @ts-ignore
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
        <>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Grid container spacing={1}>
                    <Grid item xs={4}>
                        <TextField
                            size="small"
                            disabled
                            fullWidth
                            id="HotelCode"
                            label="Зочид буудлын код"
                            {...register("HotelCode")}
                            margin="dense"
                            error={errors.HotelCode?.message}
                            helperText={errors.HotelCode?.message}
                        />
                        <TextField
                            size="small"
                            fullWidth
                            id="HotelName"
                            label="Зочид буудлын нэр"
                            {...register("HotelName")}
                            margin="dense"
                            error={errors.HotelName?.message}
                            helperText={errors.HotelName?.message}
                        />
                        <TextField
                            size="small"
                            fullWidth
                            id="CompanyName"
                            label="Компанийн нэр"
                            {...register("CompanyName")}
                            margin="dense"
                            error={errors.CompanyName?.message}
                            helperText={errors.CompanyName?.message}
                        />
                        <TextField
                            size="small"
                            fullWidth
                            id="RegistryNo"
                            label="Регистерийн дугаар"
                            {...register("RegistryNo")}
                            margin="dense"
                            error={errors.RegistryNo?.message}
                            helperText={errors.RegistryNo?.message}
                        />
                        <TextField
                            size="small"
                            fullWidth
                            id="ReceptionPhone"
                            label="Ресепшн утасны дугаар"
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
                            label="Хаяг 1"
                            {...register("Address1")}
                            margin="dense"
                            error={errors.Address1?.message}
                            helperText={errors.Address1?.message}
                        />
                        <TextField
                            size="small"
                            fullWidth
                            id="Address2"
                            label="Хаяг 2"
                            {...register("Address2")}
                            margin="dense"
                            error={errors.Address2?.message}
                            helperText={errors.Address2?.message}
                        />
                        <TextField
                            size="small"
                            fullWidth
                            id="City"
                            label="Хот"
                            {...register("City")}
                            margin="dense"
                            error={errors.City?.message}
                            helperText={errors.City?.message}
                        />
                        <TextField
                            size="small"
                            fullWidth
                            id="State"
                            label="Дүүрэг/Аймаг"
                            {...register("State")}
                            margin="dense"
                            error={errors.State?.message}
                            helperText={errors.State?.message}
                        />
                        <ReferenceSelect
                            register={register}
                            errors={errors}
                            type="Country"
                            label="Улс"
                            optionValue="CountryID"
                            optionLabel="CountryName"
                        />
                    </Grid>
                    <Grid item xs={4}>
                        <TextField
                            size="small"
                            fullWidth
                            id="ReservePhone"
                            label="Захиалгын утас"
                            {...register("ReservePhone")}
                            margin="dense"
                            error={errors.ReservePhone?.message}
                            helperText={errors.ReservePhone?.message}
                        />
                        <TextField
                            size="small"
                            fullWidth
                            id="ReserveEmail"
                            label="И-майл"
                            {...register("ReserveEmail")}
                            margin="dense"
                            error={errors.ReserveEmail?.message}
                            helperText={errors.ReserveEmail?.message}
                        />
                        <TextField
                            size="small"
                            fullWidth
                            id="HotelType"
                            label="Зочид буудлын төрөл"
                            {...register("HotelType")}
                            margin="dense"
                            error={errors.HotelType?.message}
                            helperText={errors.HotelType?.message}
                        />
                        <TextField
                            size="small"
                            fullWidth
                            id="Website"
                            label="Вэбсайт"
                            {...register("Website")}
                            margin="dense"
                            error={errors.Website?.message}
                            helperText={errors.Website?.message}
                        />
                        <TextField
                            size="small"
                            fullWidth
                            id="HotelRating"
                            label="Түвшин"
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
                            label="Зочид буудлын үйлчилгээний нөхцөл"
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
                            label="Зочид буудлын захиалга цуцлах нөхцөл"
                            {...register("CancelPolicy")}
                            margin="dense"
                            error={errors.CancelPolicy?.message}
                            helperText={errors.CancelPolicy?.message}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        {/* <CustomUpload
                                    IsLogo={true}
                                    Layout="vertical"
                                    id="logoPic"
                                /> */}
                    </Grid>
                </Grid>
                <Box>
                    <SubmitButton loading={loading} />
                </Box>
            </form>
            <br />
            <Box sx={{ width: "100%" }}>
                <label>Компаний лого</label>
                <CustomUpload IsLogo={true} Layout="vertical" id="logoPic" />
                {data?.Logo ? (
                    <Box sx={{ width: "80%" }}>
                        <img //@ts-ignore
                            src={data?.Logo} //@ts-ignore
                        />
                    </Box>
                ) : (
                    <Box sx={{ width: "80%" }}>
                        <img src={"/images/noimage.png"} />
                    </Box>
                )}
            </Box>
        </>
    );
};

export default GeneralForm;
