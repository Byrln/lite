import { Controller, useForm } from "react-hook-form";
import { Grid, TextField } from "@mui/material";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import moment from "moment";

import NewEditForm from "components/common/new-edit-form";
import { SeasonAPI, listUrl } from "lib/api/season";
import { monthsByNumber, monthDays } from "lib/utils/helpers";
import { useAppState } from "lib/context/app";
import CustomSelect from "components/common/custom-select";

const months = monthsByNumber();
const days = monthDays();
const validationSchema = yup.object().shape({
    SeasonCode: yup.string().required("Бөглөнө үү"),
    SeasonName: yup.string().required("Бөглөнө үү"),
    BeginDay: yup.number().required("Бөглөнө үү").typeError("Бөглөнө үү"),
    BeginMonth: yup.number().required("Бөглөнө үү").typeError("Бөглөнө үү"),
    EndDay: yup.number().required("Бөглөнө үү").typeError("Бөглөнө үү"),
    EndMonth: yup.number().required("Бөглөнө үү").typeError("Бөглөнө үү"),
    BeginDate: yup.date().required("Бөглөнө үү").typeError("Бөглөнө үү"),
    EndDate: yup.date().required("Бөглөнө үү").typeError("Бөглөнө үү"),
    Priority: yup.number().required("Бөглөнө үү").typeError("Бөглөнө үү"),
});

const NewEdit = () => {
    const [state]: any = useAppState();
    const {
        register,
        reset,
        handleSubmit,
        control,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(validationSchema),
    });

    return (
        <NewEditForm
            api={SeasonAPI}
            listUrl={listUrl}
            additionalValues={{ SeasonID: state.editId }}
            reset={reset}
            handleSubmit={handleSubmit}
        >
            <TextField
                size="small"
                fullWidth
                id="SeasonCode"
                label="Код"
                {...register("SeasonCode")}
                margin="dense"
                error={errors.SeasonCode?.message}
                helperText={errors.SeasonCode?.message}
            />

            <TextField
                size="small"
                fullWidth
                id="SeasonName"
                label="Нэр"
                {...register("SeasonName")}
                margin="dense"
                error={errors.SeasonName?.message}
                helperText={errors.SeasonName?.message}
            />

            <Grid container spacing={1}>
                <Grid item xs={6}>
                    <CustomSelect
                        register={register}
                        errors={errors}
                        field="BeginDay"
                        label="Эхлэх өдөр"
                        options={days}
                        optionValue="value"
                        optionLabel="value"
                    />
                </Grid>

                <Grid item xs={6}>
                    <CustomSelect
                        register={register}
                        errors={errors}
                        field="EndDay"
                        label="Дуусах өдөр"
                        options={days}
                        optionValue="value"
                        optionLabel="value"
                    />
                </Grid>

                <Grid item xs={6}>
                    <CustomSelect
                        register={register}
                        errors={errors}
                        field="BeginMonth"
                        label="Эхлэх сар"
                        options={months}
                        optionValue="value"
                        optionLabel="name"
                        dense={false}
                    />
                </Grid>

                <Grid item xs={6}>
                    <CustomSelect
                        register={register}
                        errors={errors}
                        field="EndMonth"
                        label="Дуусах сар"
                        options={months}
                        optionValue="value"
                        optionLabel="name"
                        dense={false}
                    />
                </Grid>
            </Grid>

            <LocalizationProvider dateAdapter={AdapterDateFns}>
                <Controller
                    name="BeginDate"
                    control={control}
                    defaultValue={null}
                    render={({ field: { onChange, value } }) => (
                        <DatePicker
                            label="Эхлэх огноо"
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
                                    sx={{ mt: 2 }}
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
                            label="Дуусах огноо"
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

            <TextField
                size="small"
                type="number"
                fullWidth
                id="Priority"
                label="Priority"
                {...register("Priority")}
                margin="dense"
                error={errors.Priority?.message}
                helperText={errors.Priority?.message}
            />
        </NewEditForm>
    );
};

export default NewEdit;
