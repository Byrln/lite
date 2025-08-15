import { Controller, useForm } from "react-hook-form";
import { Grid, FormControlLabel, Checkbox } from "@mui/material";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";
import { mutate } from "swr";

import NewEditForm from "components/common/new-edit-form";
import { FolioAPI, listUrl } from "lib/api/folio";
import GuestDefaultSelect from "components/select/guest-default";
import CustomerSelect from "components/select/customer";
import { useIntl } from "react-intl";

const validationSchema = yup.object().shape({
  CheckRC: yup.string().notRequired(),
  CheckEC: yup.string().notRequired(),
  GuestID: yup.string().when('BillToGuest', {
    is: true,
    then: (schema) => schema.required('Guest selection is required'),
    otherwise: (schema) => schema.notRequired(),
  }),
  CustomerID: yup.string().when('BillToGuest', {
    is: false,
    then: (schema) => schema.required('Customer selection is required'),
    otherwise: (schema) => schema.notRequired(),
  }),
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
    context: { BillToGuest: entity },
  });

  const customSubmit = async (values: any) => {
    try {
      values.BillToGuest = entity;
      values.FolioID = FolioID;
      delete values.BillToGuest1;
      delete values.BillToGuest2;

      // Validate required fields based on BillToGuest value
      if (entity && !values.GuestID) {
        throw new Error('Guest selection is required');
      }
      if (!entity && !values.CustomerID) {
        throw new Error('Customer selection is required');
      }

      await FolioAPI.billTo(values);
      await mutate(`/api/Folio/Items`);
      handleModal();
    } catch (error) {
      console.error('Bill To operation failed:', error);
      // Don't close modal on error so user can fix the issue
      if (error instanceof Error && (error.message.includes('Guest selection') || error.message.includes('Customer selection'))) {
        // Let the form validation handle these errors
        return;
      }
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
      <input type="hidden" {...register("BillToGuest")} value={entity} />
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
