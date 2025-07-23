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
import { mutate } from "swr";

import { ChargeAPI } from "lib/api/charge";
import { ModalContext } from "lib/context/modal";
import SubmitButton from "components/common/submit-button";
import RoomRateTypeSelect from "components/select/room-rate-type";

const validationSchema = yup.object().shape({
    RateTypeID: yup.string().required("Бөглөнө үү"),
});

const UpdateRateType = ({ element, RoomTypeID }: any) => {
    const { handleModal }: any = useContext(ModalContext);
    const [loading, setLoading] = useState(false);
    const [Rate, setRate] = useState<any>({
        RateTypeID: element ? element.RateTypeID : null,
    });

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
            let tempValues = {
                RoomChargeID: values.RoomChargeID,
                StayDate: values.StayDate,
                RateTypeID: values.RateTypeID,
                Override: values.Override,
                ApplytoAll: values.ApplytoAll == true ? 2 : 1,
            };

            await ChargeAPI?.updateRateType(tempValues);
            reset();
        } catch (error) {
            setLoading(false);
            handleModal();
        } finally {
            setLoading(false);
            handleModal();
            mutate("/api/Charge/RoomCharge");
        }
    };

    useEffect(() => {
        if (element) {
            reset(element);
            setRate({ RateTypeID: element.RateTypeID });
        }
    }, [element]);

    return element ? (
        <form onSubmit={handleSubmit(onSubmit)}>
            <TextField
                size="small"
                disabled={true}
                fullWidth
                id="StayDate"
                label="Өдөр"
                {...register("StayDate")}
                margin="dense"
                error={!!errors.StayDate?.message}
                helperText={errors.StayDate?.message}
            />

            <RoomRateTypeSelect
                register={register}
                errors={errors}
                reset={reset}
                RoomTypeID={RoomTypeID}
                setRate={setRate}
                Rate={Rate}
            />

            <FormControlLabel
                control={
                    <Controller
                        name="Override"
                        control={control}
                        render={(props: any) => (
                            <Checkbox
                                {...register("Override")}
                                checked={props.field.value}
                                onChange={(e) =>
                                    props.field.onChange(e.target.checked)
                                }
                            />
                        )}
                    />
                }
                label="Үнэ өөрчлөх"
            />
            <FormControlLabel
                control={
                    <Controller
                        name="ApplytoAll"
                        control={control}
                        render={(props: any) => (
                            <Checkbox
                                {...register("ApplytoAll")}
                                checked={props.field.value}
                                onChange={(e) =>
                                    props.field.onChange(e.target.checked)
                                }
                            />
                        )}
                    />
                }
                label="Бүх өдрийг өөрчлөх"
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

export default UpdateRateType;
