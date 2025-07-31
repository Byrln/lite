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
import NumberSelect from "components/select/number-select";

const validationSchema = yup.object().shape({
    Adult: yup.number().required("Бөглөнө үү").min(0, "Хамгийн багадаа 0"),
    Child: yup.number().required("Бөглөнө үү").min(0, "Хамгийн багадаа 0"),
});

const UpdatePox = ({ element, RoomTypeID }: any) => {
    const { handleModal }: any = useContext(ModalContext);
    const [loading, setLoading] = useState(false);
    // No need for Rate state in this component

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
                Adult: values.Adult,
                Child: values.Child,
                Override: values.Override,
                ApplytoAll: values.ApplytoAll === true ? 2 : 1,
            };
            if (values.ApplytoAll === true) {
                delete tempValues.StayDate;
            }
            await ChargeAPI?.UpdatePax(tempValues);

            reset();
        } catch (error) {
            setLoading(false);
            handleModal();
        } finally {
            setLoading(false);
            handleModal();
            mutate("/api/Charge/RoomCharge", undefined, { revalidate: true });
        }
    };

    useEffect(() => {
        if (element) {
            reset(element);
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
                helperText={errors.StayDate?.message as string}
            />

            <NumberSelect
                numberMin={0}
                numberMax={element?.MaxAdult ? element?.MaxAdult : 0}
                defaultValue={element?.Adult ? element?.Adult : 0}
                nameKey={`Adult`}
                register={register}
                errors={errors}
                label={"Том хүн"}
            />
            <NumberSelect
                numberMin={0}
                numberMax={element?.MaxChild ? element?.MaxChild : 0}
                defaultValue={element?.Child ? element?.Child : 0}
                nameKey={`Child`}
                register={register}
                errors={errors}
                label={"Хүүхэд"}
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

export default UpdatePox;
