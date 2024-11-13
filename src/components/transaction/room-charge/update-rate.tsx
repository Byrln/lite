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

const validationSchema = yup.object().shape({
    Amount: yup.string().required("Бөглөнө үү"),
});

const UpdateRate = ({ element, RoomTypeID }: any) => {
    const { handleModal }: any = useContext(ModalContext);
    const [loading, setLoading] = useState(false);

    const {
        register,
        reset,
        resetField,
        handleSubmit,
        control,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(validationSchema),
    });

    const onSubmit = async (values: any) => {
        setLoading(true);
        try {
            values.Override = true;
            values.RoomChargeID = element.RoomChargeID;
            if (values.ApplytoAll == true) {
                values.ApplytoAll = 2;
            } else {
                values.ApplytoAll = 1;
            }

            await ChargeAPI?.UpdateRate(values);

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
            // reset(element);
            resetField(`Amount`, {
                defaultValue: element.RateAmount,
            });
            resetField(`RoomChargeID`, {
                defaultValue: element.RoomChargeID,
            });
            resetField(`StayDate`, {
                defaultValue: element.StayDate,
            });
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
                error={errors.StayDate?.message}
                helperText={errors.StayDate?.message}
            />

            <TextField
                size="small"
                type="number"
                fullWidth
                id="Amount"
                label="Тариф"
                {...register(`Amount`)}
                margin="dense"
                error={errors.Amount?.message}
                helperText={errors.Amount?.message}
                InputLabelProps={{
                    shrink: element,
                }}
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

export default UpdateRate;
