import { Controller, useForm } from "react-hook-form";
import { FormControlLabel, TextField } from "@mui/material";
import Checkbox from "@mui/material/Checkbox";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

import NewEditForm from "components/common/new-edit-form";
import { PromotionAPI, listUrl } from "lib/api/promotion";
import { useAppState } from "lib/context/app";

const validationSchema = yup.object().shape({
    PromotionName: yup.string().required("Бөглөнө үү"),
    PromotionDescription: yup.string().required("Бөглөнө үү"),
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
            api={PromotionAPI}
            listUrl={listUrl}
            additionalValues={{
                PromotionID: state.editId,
            }}
            reset={reset}
            handleSubmit={handleSubmit}
        >
            <TextField
                size="small"
                fullWidth
                id="PromotionName"
                label="PromotionName"
                {...register("PromotionName")}
                margin="dense"
                error={errors.PromotionName?.message}
                helperText={errors.PromotionName?.message}
            />

            <TextField
                size="small"
                fullWidth
                id="PromotionDescription"
                label="PromotionDescription"
                {...register("PromotionDescription")}
                margin="dense"
                error={errors.PromotionDescription?.message}
                helperText={errors.PromotionDescription?.message}
            />

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
