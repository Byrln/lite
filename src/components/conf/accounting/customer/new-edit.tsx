import { useForm } from "react-hook-form";
import { TextField } from "@mui/material";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Grid } from "@mui/material";
import { useIntl } from "react-intl";

import NewEditForm from "components/common/new-edit-form";
import { useAppState } from "lib/context/app";
import { AccountingCustomerAPI, listUrl } from "lib/api/accounting-customer";

const validationSchema = yup.object().shape({
  CustomerCode: yup.string().required("Бөглөнө үү"),
});

const NewEdit = () => {
  const intl = useIntl();

  const [state]: any = useAppState();
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(validationSchema) });

  return (
    <NewEditForm
      api={AccountingCustomerAPI}
      listUrl={listUrl}
      additionalValues={{
        CustomerID: state.editId,
      }}
      reset={reset}
      handleSubmit={handleSubmit}
    >
      <Grid container spacing={1}>
        <Grid item xs={6}>
          <TextField
            size="small"
            fullWidth
            id="CustomerName"
            label={intl.formatMessage({ id: "TextCustomerName" })}
            {...register("CustomerName")}
            margin="dense"
            error={!!errors.CustomerName?.message}
            helperText={errors.CustomerName?.message as string}
            disabled
          />
        </Grid>

        <Grid item xs={6}>
          <TextField
            size="small"
            fullWidth
            id="CustomerCode"
            label={intl.formatMessage({ id: "TextCustomerCode" })}
            {...register("CustomerCode")}
            margin="dense"
            error={!!errors.CustomerCode?.message}
            helperText={errors.CustomerCode?.message as string}
          />
        </Grid>
      </Grid>
    </NewEditForm>
  );
};
export default NewEdit;
