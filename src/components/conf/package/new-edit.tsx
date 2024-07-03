import { Controller, useForm } from "react-hook-form";
import { TextField, Grid } from "@mui/material";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import moment from "moment";

import NewEditForm from "components/common/new-edit-form";
import { PackageAPI, listUrl } from "lib/api/package";
import { useAppState } from "lib/context/app";
import { dateStringToObj } from "lib/utils/helpers";
import { useIntl } from "react-intl";
const validationSchema = yup.object().shape({
    PackageName: yup.string().required("Бөглөнө үү"),
    Description: yup.string().required("Бөглөнө үү"),
    Nights: yup.number().required("Бөглөнө үү").typeError("Бөглөнө үү"),
    BeginDate: yup.date().required("Бөглөнө үү"),
    EndDate: yup.date().required("Бөглөнө үү"),
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
    } = useForm({ resolver: yupResolver(validationSchema) });

    return (
        <NewEditForm
            api={PackageAPI}
            listUrl={listUrl}
            additionalValues={state.editId && {}}
            reset={reset}
            handleSubmit={handleSubmit}
        >
            <Grid container spacing={1}>
                <Grid item xs={4}>
                    <TextField
                        size="small"
                        fullWidth
                        id="RowHeaderPackageName"
                        label={intl.formatMessage({id:"RowHeaderPackageName"}) }
                        {...register("RowHeaderPackageName")}

                        margin="dense"
                        error={errors.PackageName?.message}
                        helperText={errors.PackageName?.message}
                    />
                </Grid>

                <Grid item xs={4}>
                    <TextField
                        size="small"
                        fullWidth
                        id="RowHeaderDescription"
                        label={intl.formatMessage({id:"RowHeaderDescription"}) }
                        {...register("RowHeaderDescription")}
                        margin="dense"
                        error={errors.Description?.message}
                        helperText={errors.Description?.message}
                    />
                </Grid>

                <Grid item xs={4}>
                    <TextField
                        size="small"
                        type="number"
                        fullWidth
                        id="ReportNights"
                        label={intl.formatMessage({id:"ReportNights"}) }
                        {...register("ReportNights")}
                        margin="dense"
                        error={errors.Nights?.message}
                        helperText={errors.Nights?.message}
                    />
                </Grid>

                {/* <Grid item xs={6}>
                    <Controller
                        name="BeginDate"
                        control={control}
                        defaultValue={null}
                        render={({ field: { onChange, value } }) => (
                            <DatePicker
                                label="Эхлэх огноо"
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
                </Grid> */}

                <LocalizationProvider // @ts-ignore
                    dateAdapter={AdapterDateFns}
                >
                    <Grid item xs={6}>
                        <Controller
                            name="BeginDate"
                            control={control}
                            defaultValue={null}
                            render={({ field: { onChange, value } }) => (
                                <DatePicker
                                label={intl.formatMessage({id:"RowHeaderBeginDate"}) }
                                {...register("RowHeaderBeginDate")}
        
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
                                            id="RowHeaderBeginDate"
                        label={intl.formatMessage({id:"RowHeaderBeginDate"}) }
                        {...register("RowHeaderBeginDate")}
                                            margin="dense"
                                            fullWidth
                                            {...params}
                                            error={errors.BeginDate?.message}
                                            helperText={
                                                errors.BeginDate?.message
                                            }
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
                                {...register("RowHeaderEndDate")}
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
                                            error={errors.EndDate?.message}
                                            helperText={errors.EndDate?.message}
                                        />
                                    )}
                                />
                            )}
                        />
                    </Grid>
                </LocalizationProvider>
            </Grid>
        </NewEditForm>
    );
};

export default NewEdit;
