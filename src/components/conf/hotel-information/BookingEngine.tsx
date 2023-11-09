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
        // setLoading(true);
        console.log("values", values);
        // try {
        //     await HotelAPI.update(values);

        //     toast("Амжилттай.");
        // } finally {
        //     setLoading(false);
        // }
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
                </Grid>
                <Box>
                    <SubmitButton loading={loading} />
                </Box>
            </form>
        </>
    );
};

export default GeneralForm;
