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
            id="PackageName"
            label={intl.formatMessage({ id: "RowHeaderPackageName" })}
            {...register("PackageName")}

            margin="dense"
            error={!!errors.PackageName?.message}
            helperText={errors.PackageName?.message as string}
          />
        </Grid>

        <Grid item xs={4}>
          <TextField
            size="small"
            fullWidth
            id="Description"
            label={intl.formatMessage({ id: "RowHeaderDescription" })}
            {...register("Description")}
            margin="dense"
            error={!!errors.Description?.message}
            helperText={errors.Description?.message as string}
          />
        </Grid>

        <Grid item xs={4}>
          <TextField
            size="small"
            type="number"
            fullWidth
            id="Nights"
            label={intl.formatMessage({ id: "ReportNights" })}
            {...register("Nights")}
            margin="dense"
            error={!!errors.Nights?.message}
            helperText={errors.Nights?.message as string}
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
                                        error={!!errors.BeginDate?.message}
                                        helperText={errors.BeginDate?.message as string}
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
                  label={intl.formatMessage({ id: "RowHeaderBeginDate" })}
                  {...register("BeginDate")}

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
                      label={intl.formatMessage({ id: "RowHeaderBeginDate" })}
                      {...register("BeginDate")}
                      margin="dense"
                      fullWidth
                      {...params}
                      error={!!errors.BeginDate?.message}
                      helperText={
                        errors.BeginDate?.message as string
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
                  label={intl.formatMessage({ id: "RowHeaderEndDate" })}
                  {...register("EndDate")}
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
        </LocalizationProvider>
      </Grid>
    </NewEditForm>
  );
};

export default NewEdit;
