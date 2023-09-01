import { Controller, useForm } from "react-hook-form";
import { FormControlLabel, TextField, Grid } from "@mui/material";
import Checkbox from "@mui/material/Checkbox";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

import NewEditForm from "components/common/new-edit-form";
import { HotelSettingAPI, listUrl } from "lib/api/hotel-setting";
import { useAppState } from "lib/context/app";

const validationSchema = yup.object().shape({
    HotelSettingName: yup.string().required("Бөглөнө үү"),
    HotelSettingDescription: yup.string().required("Бөглөнө үү"),
    ShowWarning: yup.boolean(),
});

const NewEdit = () => {
    const [state]: any = useAppState();
    const {
        register,
        reset,
        handleSubmit,
        control,
        formState: { errors },
    } = useForm({ resolver: yupResolver(validationSchema) });

    return (
        <NewEditForm
            api={HotelSettingAPI}
            listUrl={listUrl}
            additionalValues={{
                HotelSettingID: state.editId,
            }}
            reset={reset}
            handleSubmit={handleSubmit}
        >
            <Grid container spacing={1}>
                <Grid item xs={6}>
                    <TextField
                        size="small"
                        fullWidth
                        id="HotelSettingName"
                        label="HotelSettingName"
                        {...register("HotelSettingName")}
                        margin="dense"
                        error={errors.HotelSettingName?.message}
                        helperText={errors.HotelSettingName?.message}
                    />
                </Grid>
                <Grid item xs={6}>
                    <TextField
                        size="small"
                        fullWidth
                        id="HotelSettingDescription"
                        label="HotelSettingDescription"
                        {...register("HotelSettingDescription")}
                        margin="dense"
                        error={errors.HotelSettingDescription?.message}
                        helperText={errors.HotelSettingDescription?.message}
                    />
                </Grid>
            </Grid>
            <FormControlLabel
                control={
                    <Controller
                        name="ShowWarning"
                        control={control}
                        render={(props: any) => (
                            <Checkbox
                                {...register("ShowWarning")}
                                checked={props.field.value}
                                onChange={(e) =>
                                    props.field.onChange(e.target.checked)
                                }
                            />
                        )}
                    />
                }
                label="ShowWarning"
            />
        </NewEditForm>
    );
};

export default NewEdit;
