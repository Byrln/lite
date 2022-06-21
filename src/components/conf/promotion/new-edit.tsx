import { Controller, useForm } from "react-hook-form";
import { FormControlLabel, TextField } from "@mui/material";
import Checkbox from "@mui/material/Checkbox";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

import NewEditForm from "components/common/new-edit-form";
import { PromotionAPI, listUrl } from "lib/api/promotion";
import { useAppState } from "lib/context/app";
import { DatePicker, LocalizationProvider } from "@mui/lab";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import moment from "moment";

const validationSchema = yup.object().shape({
    PromotionCode: yup.string().required("Бөглөнө үү"),
    PromotionType: yup.string().required("Бөглөнө үү"),
    Description: yup.string().required("Бөглөнө үү"),
    BeginDate: yup.date().required("Бөглөнө үү"),
    EndDate: yup.date().required("Бөглөнө үү"),
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
                id="PromotionCode"
                label="Promotion Name"
                {...register("PromotionCode")}
                margin="dense"
                error={errors.PromotionCode?.message}
                helperText={errors.PromotionCode?.message}
            />

            <TextField
                size="small"
                fullWidth
                id="PromotionType"
                label="Promotion Type"
                {...register("PromotionType")}
                margin="dense"
                error={errors.PromotionType?.message}
                helperText={errors.PromotionType?.message}
            />

            <TextField
                size="small"
                fullWidth
                multiline
                id="Description"
                label="Description"
                {...register("Description")}
                margin="dense"
                error={errors.Description?.message}
                helperText={errors.Description?.message}
            />

            <LocalizationProvider dateAdapter={AdapterDateFns}>
                <Controller
                    name="BeginDate"
                    control={control}
                    defaultValue={null}
                    render={({ field: { onChange, value } }) => (
                        <DatePicker
                            label="Begin Date"
                            value={value}
                            onChange={(value) =>
                                onChange(moment(value).format("YYYY-MM-DD"))
                            }
                            renderInput={(params) => (
                                <TextField
                                    size="small"
                                    id="BeginDate"
                                    {...register("BeginDate")}
                                    margin="dense"
                                    fullWidth
                                    {...params}
                                    error={errors.BeginDate?.message}
                                    helperText={errors.BeginDate?.message}
                                />
                            )}
                        />
                    )}
                />

                <Controller
                    name="EndDate"
                    control={control}
                    defaultValue={null}
                    render={({ field: { onChange, value } }) => (
                        <DatePicker
                            label="End Date"
                            value={value}
                            onChange={(value) =>
                                onChange(moment(value).format("YYYY-MM-DD"))
                            }
                            renderInput={(params) => (
                                <TextField
                                    size="small"
                                    id="EndDate"
                                    {...register("EndDate")}
                                    margin="dense"
                                    fullWidth
                                    {...params}
                                    error={errors.EndDate?.message}
                                    helperText={errors.EndDate?.message}
                                />
                            )}
                        />
                    )}
                />
            </LocalizationProvider>
        </NewEditForm>
    );
};

export default NewEdit;
