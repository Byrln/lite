import { Controller, useForm } from "react-hook-form";
import { TextField } from "@mui/material";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import moment from "moment";

import NewEditForm from "components/common/new-edit-form";
import { TaxAPI, listUrl } from "lib/api/tax";
import { useAppState } from "lib/context/app";
import { dateStringToObj } from "lib/utils/helpers";

const validationSchema = yup.object().shape({
    TaxCode: yup.string().required("Бөглөнө үү"),
    TaxName: yup.string().required("Бөглөнө үү"),
    TaxAmount: yup.number().required("Бөглөнө үү").typeError("Бөглөнө үү"),
    BeginDate: yup.date().required("Бөглөнө үү").typeError("Бөглөнө үү"),
    EndDate: yup.date().required("Бөглөнө үү").typeError("Бөглөнө үү"),
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
            api={TaxAPI}
            listUrl={listUrl}
            additionalValues={{ TaxID: state.editId }}
            reset={reset}
            handleSubmit={handleSubmit}
        >
            <TextField
                size="small"
                fullWidth
                id="TaxCode"
                label="Код"
                {...register("TaxCode")}
                margin="dense"
                error={errors.TaxCode?.message}
                helperText={errors.TaxCode?.message}
            />

            <TextField
                size="small"
                fullWidth
                id="TaxName"
                label="Нэр"
                {...register("TaxName")}
                margin="dense"
                error={errors.TaxName?.message}
                helperText={errors.TaxName?.message}
            />

            <TextField
                size="small"
                type="number"
                fullWidth
                id="TaxAmount"
                label="Дүн"
                InputProps={{ inputProps: { min: 0, max: 99 } }}
                {...register("TaxAmount")}
                margin="dense"
                error={errors.TaxAmount?.message}
                helperText={errors.TaxAmount?.message}
            />

            {/* <LocalizationProvider dateAdapter={AdapterDateFns}> */}
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
                                        moment(value).format("YYYY-MM-DD")
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

            <Controller
                name="EndDate"
                control={control}
                defaultValue={null}
                render={({ field: { onChange, value } }) => (
                    <DatePicker
                        label="Дуусах огноо"
                        value={value}
                        onChange={(value) =>
                            onChange(
                                moment(
                                    dateStringToObj(
                                        moment(value).format("YYYY-MM-DD")
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
            {/* </LocalizationProvider> */}
        </NewEditForm>
    );
};

export default NewEdit;
