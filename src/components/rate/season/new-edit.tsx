import { useForm } from "react-hook-form";
import { Grid, MenuItem, TextField } from "@mui/material";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

import NewEditForm from "components/common/new-edit-form";
import { SeasonAPI, listUrl } from "lib/api/season";
import { monthsByNumber, monthDays } from "lib/utils/helpers";

const NewEdit = ({ entity }: any) => {
    const months = monthsByNumber();
    const days = monthDays();

    const validationSchema = yup.object().shape({
        SeasonCode: yup.string().required("Бөглөнө үү"),
        SeasonName: yup.string().required("Бөглөнө үү"),
        BeginDay: yup.number().required("Бөглөнө үү"),
        BeginMonth: yup.number().required("Бөглөнө үү"),
        EndDay: yup.number().required("Бөглөнө үү"),
        EndMonth: yup.number().required("Бөглөнө үү"),
        BeginDate: yup.date().required("Бөглөнө үү"),
        EndDate: yup.date().required("Бөглөнө үү"),
        Priority: yup.number().required("Бөглөнө үү"),
    });
    const formOptions = { resolver: yupResolver(validationSchema) };

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm(formOptions);

    return (
        <NewEditForm
            api={SeasonAPI}
            entity={entity}
            listUrl={listUrl}
            handleSubmit={handleSubmit}
        >
            <TextField
                fullWidth
                id="SeasonCode"
                label="Код"
                {...register("SeasonCode")}
                margin="dense"
                error={errors.SeasonCode?.message}
                helperText={errors.SeasonCode?.message}
            />

            <TextField
                fullWidth
                id="SeasonName"
                label="Нэр"
                {...register("SeasonName")}
                margin="dense"
                error={errors.SeasonName?.message}
                helperText={errors.SeasonName?.message}
            />
            <Grid container spacing={2}>
                <Grid item xs={6}>
                    <TextField
                        fullWidth
                        id="BeginDay"
                        label="Улирал эхлэх өдөр"
                        {...register("BeginDay")}
                        select
                        margin="dense"
                        error={errors.BeginDay?.message}
                        helperText={errors.BeginDay?.message}
                    >
                        {days.map((element: any) => (
                            <MenuItem key={element.key} value={element.value}>
                                {element.value}
                            </MenuItem>
                        ))}
                    </TextField>
                </Grid>

                <Grid item xs={6}>
                    <TextField
                        fullWidth
                        id="BeginMonth"
                        label="Улирал эхлэх сар"
                        {...register("BeginMonth")}
                        select
                        margin="dense"
                        error={errors.BeginMonth?.message}
                        helperText={errors.BeginMonth?.message}
                    >
                        {months.map((element: any) => (
                            <MenuItem key={element.value} value={element.value}>
                                {element.name}
                            </MenuItem>
                        ))}
                    </TextField>
                </Grid>

                <Grid item xs={6}>
                    <TextField
                        fullWidth
                        id="EndDay"
                        label="Улирал дуусах өдөр"
                        {...register("EndDay")}
                        select
                        margin="dense"
                        error={errors.EndDay?.message}
                        helperText={errors.EndDay?.message}
                    >
                        {days.map((element: any) => (
                            <MenuItem key={element.key} value={element.value}>
                                {element.value}
                            </MenuItem>
                        ))}
                    </TextField>
                </Grid>

                <Grid item xs={6}>
                    <TextField
                        fullWidth
                        id="EndMonth"
                        label="Улирал дуусах сар"
                        {...register("EndMonth")}
                        select
                        margin="dense"
                        error={errors.EndMonth?.message}
                        helperText={errors.EndMonth?.message}
                    >
                        {months.map((element: any) => (
                            <MenuItem key={element.value} value={element.value}>
                                {element.name}
                            </MenuItem>
                        ))}
                    </TextField>
                </Grid>
            </Grid>

            <TextField
                type="date"
                fullWidth
                id="BeginDate"
                label="Эхлэх огноо"
                {...register("BeginDate")}
                margin="dense"
                error={errors.BeginDate?.message}
                helperText={errors.BeginDate?.message}
            />

            <TextField
                type="date"
                fullWidth
                id="EndDate"
                label="Дуусах огноо"
                {...register("EndDate")}
                margin="dense"
                error={errors.EndDate?.message}
                helperText={errors.EndDate?.message}
            />

            <TextField
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
