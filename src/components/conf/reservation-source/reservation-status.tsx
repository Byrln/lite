import { useState, useContext, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import {
    FormControlLabel,
    TextField,
    Grid,
    CircularProgress,
} from "@mui/material";
import Checkbox from "@mui/material/Checkbox";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

import { ReservationStatusSWR } from "lib/api/reservation-source";
import { ModalContext } from "lib/context/modal";
import ReferenceSelect from "components/select/reference";
import SubmitButton from "components/common/submit-button";

const validationSchema = yup.object().shape({
    RateTypeCode: yup.string().required("Бөглөнө үү"),
    RateTypeName: yup.string().required("Бөглөнө үү"),
    ChannelID: yup.number().required("Бөглөнө үү").typeError("Бөглөнө үү"),
    BreakfastIncluded: yup.boolean(),
    TaxIncluded: yup.boolean(),
});

const ReservationStatus = ({ ChannelSourceID }: any) => {
    const { handleModal }: any = useContext(ModalContext);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState({
        ChannelSourceID: ChannelSourceID,
    });

    const { data, error } = ReservationStatusSWR(search);

    const {
        register,
        reset,
        handleSubmit,
        control,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(validationSchema),
    });

    const onSubmit = async (values: any) => {
        setLoading(true);
        try {
        } catch (error) {
            setLoading(false);
            handleModal();
        }
    };

    useEffect(() => {
        if (data && data[0]) {
            console.log("data[0]", data[0]);
            reset(data[0]);
        }
    }, [data]);

    return data && data[0] ? (
        <form onSubmit={handleSubmit(onSubmit)}>
            <ReferenceSelect
                register={register}
                errors={errors}
                type="ReservationType"
                label="Үндсэн төлөв"
                optionValue="ReservationTypeID"
                optionLabel="ReservationTypeName"
                customField="DefaultStatusID"
            />
            <ReferenceSelect
                register={register}
                errors={errors}
                type="ReservationType"
                label="Төлбөр төлсөн төлөв"
                optionValue="ReservationTypeID"
                optionLabel="ReservationTypeName"
                customField="PaidStatusID"
            />
            <SubmitButton loading={loading} />
        </form>
    ) : (
        <Grid
            container
            spacing={0}
            direction="column"
            alignItems="center"
            justifyContent="center"
        >
            <CircularProgress color="info" />
        </Grid>
    );
};

export default ReservationStatus;
