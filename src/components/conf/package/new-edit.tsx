import { Controller, useForm } from "react-hook-form";
import { TextField } from "@mui/material";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import moment from "moment";

import NewEditForm from "components/common/new-edit-form";
import { PackageAPI, listUrl } from "lib/api/package";
import { useAppState } from "lib/context/app";

const validationSchema = yup.object().shape({
    PackageName: yup.string().required("Бөглөнө үү"),
    Description: yup.string().required("Бөглөнө үү"),
    Nights: yup.number().required("Бөглөнө үү").typeError("Бөглөнө үү"),
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
            api={PackageAPI}
            listUrl={listUrl}
            additionalValues={{
                PackageID: state.editId,
            }}
            reset={reset}
            handleSubmit={handleSubmit}
        >
            <TextField
                size="small"
                fullWidth
                id="PackageName"
                label="Package Name"
                {...register("PackageName")}
                margin="dense"
                error={errors.PackageName?.message}
                helperText={errors.PackageName?.message}
            />

            <TextField
                size="small"
                fullWidth
                id="Description"
                label="Description"
                {...register("Description")}
                margin="dense"
                error={errors.Description?.message}
                helperText={errors.Description?.message}
            />

            <TextField
                size="small"
                type="number"
                fullWidth
                id="Nights"
                label="Nights"
                {...register("Nights")}
                margin="dense"
                error={errors.Nights?.message}
                helperText={errors.Nights?.message}
            />

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
        </NewEditForm>
    );
};

export default NewEdit;
