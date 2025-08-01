import { Controller, useForm } from "react-hook-form";
import { Grid, TextField } from "@mui/material";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import moment from "moment";
import mn from "date-fns/locale/mn";
import { useIntl } from "react-intl";

import NewEditForm from "components/common/new-edit-form";
import { SeasonAPI, listUrl } from "lib/api/season";
import { monthsByNumber, monthDays } from "lib/utils/helpers";
import { useAppState } from "lib/context/app";
import CustomSelect from "components/common/custom-select";
import { dateStringToObj } from "lib/utils/helpers";

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
    const intl = useIntl();

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

    const locale = mn;

    return (
        <NewEditForm
            api={SeasonAPI}
            listUrl={listUrl}
            additionalValues={{ SeasonID: state.editId }}
            reset={reset}
            handleSubmit={handleSubmit}
        >
            <LocalizationProvider
                //@ts-ignore
                dateAdapter={AdapterDateFns}
                adapterLocale={locale}
            >
                <Grid container spacing={1}>
                    <Grid item xs={6}>
                        <TextField
                            size="small"
                            fullWidth
                            id="SeasonCode"
                            label={intl.formatMessage({id:"TextSeasonCode"}) }
                            {...register("SeasonCode")}
                            margin="dense"
                            error={!!errors.SeasonCode?.message}
                            helperText={errors.SeasonCode?.message as string}
                        />
                    </Grid>

                    <Grid item xs={6}>
                        <TextField
                            size="small"
                            fullWidth
                            id="SeasonName"
                            label={intl.formatMessage({id:"TextSeasonName"}) }
                            {...register("SeasonName")}
                            margin="dense"
                            error={!!errors.SeasonName?.message}
                            helperText={errors.SeasonName?.message as string}
                        />
                    </Grid>

                    <Grid item xs={3}>
                        <CustomSelect
                            register={register}
                            errors={errors}
                            field="BeginMonth"
                            
                            label={intl.formatMessage({id:"TextFromMonth"}) }
                            options={months}
                            optionValue="value"
                            optionLabel="name"
                            dense={false}
                        />
                    </Grid>

                    <Grid item xs={3}>
                        <CustomSelect
                            register={register}
                            errors={errors}
                            field="BeginDay"
                            label={intl.formatMessage({id:"TextDateFrom"}) }
                            options={days}
                            optionValue="value"
                            optionLabel="value"
                            dense={false}
                        />
                    </Grid>

                    <Grid item xs={3}>
                        <CustomSelect
                            register={register}
                            errors={errors}
                            field="EndMonth"
                            label={intl.formatMessage({id:"TextDateTo"}) }
                            options={months}
                            optionValue="value"
                            optionLabel="name"
                            dense={false}
                        />
                    </Grid>
                    <Grid item xs={3}>
                        <CustomSelect
                            register={register}
                            errors={errors}
                            field="EndDay"
                            label={intl.formatMessage({id:"TextDateTo"}) }
                            options={days}
                            optionValue="value"
                            optionLabel="value"
                            dense={false}
                        />
                    </Grid>

                    <Grid item xs={6}>
                        <Controller
                            name="BeginDate"
                            control={control}
                            defaultValue={null}
                            render={({ field: { onChange, value } }) => (
                                <DatePicker
                                    label={intl.formatMessage({id:"TextBeginDate"}) }
                                    value={value}
                                    onChange={(value) =>
                                        onChange(
                                            // moment(value)
                                            //     .utcOffset("+0400", true)
                                            //     .format("YYYY-MM-DD")
                                            moment(
                                                dateStringToObj(
                                                    moment(value).format(
                                                        "YYYY-MM-DD"
                                                    )
                                                ),
                                                "YYYY-MM-DD"
                                            )
                                        )
                                    }
                                    renderInput={(params) => (
                                        <TextField
                                            size="small"
                                            id="BeginDate"
                                            {...register("BeginDate")}
                                            margin="dense"
                                            fullWidth
                                            {...params}
                                            error={!!errors.BeginDate?.message}
                                            helperText={
                                                errors.BeginDate?.message as string}
                                        />
                                    )}
                                />
                            )}
                        />
                    </Grid>

                    <Grid item xs={6}>
                        <Controller
                            name="EndDate"
                            control={control}
                            defaultValue={null}
                            render={({ field: { onChange, value } }) => (
                                <DatePicker
                                label={intl.formatMessage({id:"RowHeaderEndDate"}) }
                                    value={value}
                                    onChange={(value) =>
                                        onChange(
                                            moment(
                                                dateStringToObj(
                                                    moment(value).format(
                                                        "YYYY-MM-DD"
                                                    )
                                                ),
                                                "YYYY-MM-DD"
                                            )
                                        )
                                    }
                                    renderInput={(params) => (
                                        <TextField
                                            size="small"
                                            id="EndDate"
                                            {...register("EndDate")}
                                            margin="dense"
                                            fullWidth
                                            {...params}
                                            error={!!errors.EndDate?.message}
                                            helperText={errors.EndDate?.message as string}
                                        />
                                    )}
                                />
                            )}
                        />
                    </Grid>

                    <Grid item xs={6}>
                        <TextField
                            size="small"
                            type="number"
                            fullWidth
                            id="Priority"
                            label={intl.formatMessage({id:"TextPriority"}) }
                            {...register("Priority")}
                            margin="dense"
                            error={!!errors.Priority?.message}
                            helperText={errors.Priority?.message as string}
                        />
                    </Grid>
                </Grid>
            </LocalizationProvider>
        </NewEditForm>
    );
};

export default NewEdit;
