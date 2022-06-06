import { Controller, useForm } from "react-hook-form";
import {
    FormControl,
    FormHelperText,
    Grid,
    InputLabel,
    NativeSelect,
    OutlinedInput,
    TextField,
} from "@mui/material";
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

const months = monthsByNumber();
const days = monthDays();
const validationSchema = yup.object().shape({
    SeasonCode: yup.string().required("Бөглөнө үү"),
    SeasonName: yup.string().required("Бөглөнө үү"),
    BeginDay: yup.number().required("Бөглөнө үү").typeError("Бөглөнө үү"),
    BeginMonth: yup.number().required("Бөглөнө үү").typeError("Бөглөнө үү"),
    EndDay: yup.number().required("Бөглөнө үү").typeError("Бөглөнө үү"),
    EndMonth: yup.number().required("Бөглөнө үү").typeError("Бөглөнө үү"),
    BeginDate: yup.date().required("Бөглөнө үү"),
    EndDate: yup.date().required("Бөглөнө үү"),
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
                    <FormControl
                        fullWidth
                        variant="outlined"
                        size="small"
                        margin="dense"
                        {...register("BeginDay")}
                        error={errors.BeginDay?.message}
                    >
                        <InputLabel variant="outlined" htmlFor="BeginDay">
                            Эхлэх өдөр
                        </InputLabel>
                        <NativeSelect
                            input={<OutlinedInput label="Эхлэх өдөр" />}
                            inputProps={{
                                name: "BeginDay",
                                id: "BeginDay",
                            }}
                        >
                            <option></option>
                            {days.map((element: any) => (
                                <option key={element.key} value={element.value}>
                                    {element.value}
                                </option>
                            ))}
                        </NativeSelect>
                        {errors.BeginDay?.message && (
                            <FormHelperText error>
                                {errors.BeginDay?.message}
                            </FormHelperText>
                        )}
                    </FormControl>
                </Grid>

                <Grid item xs={6}>
                    <FormControl
                        fullWidth
                        variant="outlined"
                        size="small"
                        margin="dense"
                        {...register("EndDay")}
                        error={errors.EndDay?.message}
                    >
                        <InputLabel variant="outlined" htmlFor="EndDay">
                            Дуусах өдөр
                        </InputLabel>
                        <NativeSelect
                            input={<OutlinedInput label="Дуусах өдөр" />}
                            inputProps={{
                                name: "EndDay",
                                id: "EndDay",
                            }}
                        >
                            <option></option>
                            {days.map((element: any) => (
                                <option key={element.key} value={element.value}>
                                    {element.value}
                                </option>
                            ))}
                        </NativeSelect>
                        {errors.EndDay?.message && (
                            <FormHelperText error>
                                {errors.EndDay?.message}
                            </FormHelperText>
                        )}
                    </FormControl>
                </Grid>

                <Grid item xs={6}>
                    <FormControl
                        fullWidth
                        variant="outlined"
                        size="small"
                        {...register("BeginMonth")}
                        error={errors.BeginMonth?.message}
                    >
                        <InputLabel variant="outlined" htmlFor="BeginMonth">
                            Эхлэх сар
                        </InputLabel>
                        <NativeSelect
                            input={<OutlinedInput label="Эхлэх сар" />}
                            inputProps={{
                                name: "BeginMonth",
                                id: "BeginMonth",
                            }}
                        >
                            <option></option>
                            {months.map((element: any) => (
                                <option key={element.key} value={element.value}>
                                    {element.name}
                                </option>
                            ))}
                        </NativeSelect>
                        {errors.BeginMonth?.message && (
                            <FormHelperText error>
                                {errors.BeginMonth?.message}
                            </FormHelperText>
                        )}
                    </FormControl>
                </Grid>

                <Grid item xs={6}>
                    <FormControl
                        fullWidth
                        variant="outlined"
                        size="small"
                        {...register("EndMonth")}
                        error={errors.EndMonth?.message}
                    >
                        <InputLabel variant="outlined" htmlFor="EndMonth">
                            Дуусах сар
                        </InputLabel>
                        <NativeSelect
                            input={<OutlinedInput label="Дуусах сар" />}
                            inputProps={{
                                name: "EndMonth",
                                id: "EndMonth",
                            }}
                        >
                            <option></option>
                            {months.map((element: any) => (
                                <option key={element.key} value={element.value}>
                                    {element.name}
                                </option>
                            ))}
                        </NativeSelect>
                        {errors.EndMonth?.message && (
                            <FormHelperText error>
                                {errors.EndMonth?.message}
                            </FormHelperText>
                        )}
                    </FormControl>
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
                                    error={errors.BeginDate?.message}
                                    helperText={errors.BeginDate?.message}
                                    id="BeginDate"
                                    {...register("BeginDate")}
                                    margin="dense"
                                    fullWidth
                                    sx={{ mt: 2 }}
                                    {...params}
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
                                    error={errors.EndDate?.message}
                                    helperText={errors.EndDate?.message}
                                    id="EndDate"
                                    {...register("EndDate")}
                                    margin="dense"
                                    fullWidth
                                    {...params}
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
