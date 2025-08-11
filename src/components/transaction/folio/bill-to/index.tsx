import { Controller, useForm } from "react-hook-form";
import { Grid, FormControlLabel, Checkbox } from "@mui/material";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";

import NewEditForm from "components/common/new-edit-form";
import { FolioAPI, listUrl } from "lib/api/folio";
import GuestDefaultSelect from "components/select/guest-default";
import CustomerSelect from "components/select/customer";
import { useIntl } from "react-intl";

const validationSchema = yup.object().shape({
  CheckRC: yup.string().notRequired(),
  CheckEC: yup.string().notRequired(),
});

const NewEdit = ({ TransactionID, FolioID, handleModal }: any) => {
  const [entity, setEntity]: any = useState(true);
  const [entity2, setEntity2]: any = useState(false);
  const [guest, setGuest]: any = useState();

  const {
    register,
    reset,
    handleSubmit,
    control,
    formState: { errors },
    resetField,
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const customSubmit = async (values: any) => {
    try {
      if (entity == true) {
        values.BillToGuest = true;
      } else {
        values.BillToGuest = false;
      }
      delete values.BillToGuest1;
      delete values.BillToGuest2;

      FolioAPI.billTo(values);
      handleModal();
    } finally {
      handleModal();
    }
  };

  const handleBillToGuest = (e: any) => {
    setEntity(e.target.checked);
    setEntity2(e.target.checked === true ? false : true);
    resetField(`BillToGuest1`, {
      defaultValue: e.target.checked,
    });
    resetField(`BillToGuest2`, {
      defaultValue: e.target.checked === true ? false : true,
    });
    if (e.target.checked == false) {
      resetField(`GuestID`, {
        defaultValue: null,
      });
    }
  };

  const handleBillToGuest2 = (e: any) => {
    setEntity2(e.target.checked);
    setEntity(e.target.checked === true ? false : true);
    resetField(`BillToGuest2`, {
      defaultValue: e.target.checked,
    });
    resetField(`BillToGuest1`, {
      defaultValue: e.target.checked === true ? false : true,
    });
    if (e.target.checked == false) {
      resetField(`CustomerID`, {
        defaultValue: null,
      });
    }
  };
  const intl = useIntl()

  return (
    <NewEditForm
      api={FolioAPI}
      listUrl={listUrl}
      additionalValues={{ FolioID: FolioID }}
      reset={reset}
      handleSubmit={handleSubmit}
      customSubmit={customSubmit}
    >
      <Grid container spacing={1}>
        <Grid item xs={6}>
          <FormControlLabel
            control={
              <Controller
                name="BillToGuest1"
                control={control}
                render={(props: any) => (
                  <Checkbox
                    key={`BillToGuest1`}
                    {...register(`BillToGuest1`)}
                    onChange={handleBillToGuest}
                    checked={entity}
                  />
                )}
              />
            }
            label={intl.formatMessage({ id: 'TextGuestDetailEdit' })}
          />
        </Grid>
        <Grid item xs={6}>
          <FormControlLabel
            control={
              <Controller
                name="BillToGuest2"
                control={control}
                render={(props: any) => (
                  <Checkbox
                    key={`BillToGuest2`}
                    {...register(`BillToGuest2`)}
                    onChange={handleBillToGuest2}
                    checked={entity2}
                  />
                )}
              />
            }
            label="Bill to Customer"
          />
        </Grid>
        {entity && (
          <Grid item xs={12} sm={12}>
            <GuestDefaultSelect
              register={register}
              errors={errors}
              entity={guest}
              setEntity={setGuest}
              search={{ TransactionID: TransactionID }}
            />
          </Grid>
        )}
        {entity2 && (
          <Grid item xs={12} sm={12}>
            <CustomerSelect
              register={register}
              errors={errors}
              isCustomSelect={true}
            />
          </Grid>
        )}
      </Grid>
    </NewEditForm>
  );
};

export default NewEdit;
