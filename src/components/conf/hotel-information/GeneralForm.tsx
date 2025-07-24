/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { Box, Grid, TextField, CircularProgress } from "@mui/material";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-toastify";
import { useIntl } from "react-intl";
import { HotelAPI } from "lib/api/hotel";
import SubmitButton from "components/common/submit-button";
import ReferenceSelect from "components/select/reference";
import CustomTab from "components/common/custom-tab";
import CustomUpload from "components/common/custom-upload";

const validationSchemaHotel = yup.object().shape({
  HotelCode: yup.string().required("Бөглөнө үү"),
  HotelName: yup.string().required("Бөглөнө үү"),
  CompanyName: yup.string(),
  RegistryNo: yup
    .string()
    .matches(/^[0-9]+$/, "Та регистерээ тоо байхаар оруулна уу"),
  ReceptionPhone: yup.string(),
  Address1: yup.string().required("Бөглөнө үү"),
  Address2: yup.string(),
  City: yup.string(),
  State: yup.string(),
  CountryID: yup.number().required("Бөглөнө үү").typeError("Бөглөнө үү"),
  ReservePhone: yup.string(),
  ReserveEmail: yup.string().email(),
  HotelType: yup.string(),
  Website: yup.string(),
  HotelRatingID: yup.number().required("Бөглөнө үү").typeError("Бөглөнө үү"),
});

const GeneralForm = ({ setHasData = null }: any) => {
  const intl = useIntl();
  const [loadingData, setLoadingData] = useState(true);
  const [data, setData] = useState({ Logo: null });
  const [loading, setLoading] = useState(false);
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchemaHotel),
  });

  const onSubmit = async (values: any) => {
    setLoading(true);

    try {
      await HotelAPI.update(values);

      toast("Амжилттай.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchDatas = async () => {
      try {
        const arr: any = await HotelAPI.get();
        setData(arr[0]);
        reset(arr[0]);
        if (setHasData && arr[0]) {
          setHasData(true);
        }
      } finally {
        setLoadingData(false);
      }
    };

    fetchDatas();
  }, []);

  // @ts-ignore
  return loadingData ? (
    <Grid
      container
      spacing={0}
      direction="column"
      alignItems="center"
      justifyContent="center"
    >
      <CircularProgress color="info" />
    </Grid>
  ) : (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={1}>
          <Grid item xs={4}>
            <TextField
              size="small"
              disabled
              fullWidth
              id="HotelCode"
              label={intl.formatMessage({ id: "HotelCode" })}
              {...register("HotelCode")}
              margin="dense"
              error={!!errors.HotelCode?.message}
              helperText={errors.HotelCode?.message as string}
            />
            <TextField
              size="small"
              fullWidth
              id="HotelName"
              label={intl.formatMessage({ id: "MsgHotelName" })}
              {...register("HotelName")}
              margin="dense"
              error={!!errors.HotelName?.message}
              helperText={errors.HotelName?.message as string}
            />
            <TextField
              size="small"
              fullWidth
              id="CompanyName"
              label={intl.formatMessage({
                id: "TextCompanyName",
              })}
              {...register("CompanyName")}
              margin="dense"
              error={!!errors.CompanyName?.message}
              helperText={errors.CompanyName?.message as string}
            />
            <TextField
              size="small"
              fullWidth
              id="RegistryNo"
              label={intl.formatMessage({ id: "TextRegisterNo" })}
              {...register("RegistryNo")}
              margin="dense"
              error={!!errors.RegistryNo?.message}
              helperText={errors.RegistryNo?.message as string}
            />
            <TextField
              size="small"
              fullWidth
              id="ReceptionPhone"
              label={intl.formatMessage({
                id: "RowHeaderReceptionPhone",
              })}
              {...register("ReceptionPhone")}
              margin="dense"
              error={!!errors.ReceptionPhone?.message}
              helperText={errors.ReceptionPhone?.message as string}
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              size="small"
              fullWidth
              id="Address1"
              label={intl.formatMessage({ id: "TextAddress1" })}
              {...register("Address1")}
              margin="dense"
              error={!!errors.Address1?.message}
              helperText={errors.Address1?.message as string}
            />
            <TextField
              size="small"
              fullWidth
              id="Address2"
              label={intl.formatMessage({ id: "TextAddress2" })}
              {...register("Address2")}
              margin="dense"
              error={!!errors.Address2?.message}
              helperText={errors.Address2?.message as string}
            />
            <TextField
              size="small"
              fullWidth
              id="City"
              label={intl.formatMessage({ id: "TextCity" })}
              {...register("City")}
              margin="dense"
              error={!!errors.City?.message}
              helperText={errors.City?.message as string}
            />
            <TextField
              size="small"
              fullWidth
              id="State"
              label={intl.formatMessage({
                id: "TextState",
              })}
              {...register("State")}
              margin="dense"
              error={!!errors.State?.message}
              helperText={errors.State?.message as string}
            />
            <ReferenceSelect
              register={register}
              errors={errors}
              type="Country"
              label={intl.formatMessage({ id: "ReportCountry" })}
              {...register("ReportCountry")}
              optionValue="CountryID"
              optionLabel="CountryName"
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              size="small"
              fullWidth
              id="ReservePhone"
              label={intl.formatMessage({ id: "ReservePhone" })}
              {...register("ReservePhone")}
              margin="dense"
              error={!!errors.ReservePhone?.message}
              helperText={errors.ReservePhone?.message as string}
            />
            <TextField
              size="small"
              fullWidth
              id="ReserveEmail"
              label={intl.formatMessage({ id: "ReportEmail" })}
              {...register("ReserveEmail")}
              margin="dense"
              error={!!errors.ReserveEmail?.message}
              helperText={errors.ReserveEmail?.message as string}
            />
            <TextField
              size="small"
              fullWidth
              id="HotelType"
              label={intl.formatMessage({ id: "HotelType" })}
              {...register("HotelType")}
              margin="dense"
              error={!!errors.HotelType?.message}
              helperText={errors.HotelType?.message as string}
            />
            <TextField
              size="small"
              fullWidth
              id="Website"
              label={intl.formatMessage({ id: "Website" })}
              {...register("Website")}
              margin="dense"
              error={!!errors.Website?.message}
              helperText={errors.Website?.message as string}
            />
            <TextField
              size="small"
              fullWidth
              id="HotelRating"
              label={intl.formatMessage({ id: "HotelRating" })}
              {...register("HotelRating")}
              margin="dense"
              error={!!errors.HotelRating?.message}
              helperText={errors.HotelRating?.message as string}
            />
            {/* HotelRatingID */}
          </Grid>
          <Grid item xs={6}>
            <TextField
              size="small"
              fullWidth
              multiline
              rows={10}
              id="HotelPolicy"
              label={intl.formatMessage({ id: "HotelPolicy" })}
              {...register("HotelPolicy")}
              margin="dense"
              error={!!errors.HotelPolicy?.message}
              helperText={errors.HotelPolicy?.message as string}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              size="small"
              fullWidth
              multiline
              rows={10}
              id="CancelPolicy"
              label={intl.formatMessage({ id: "CancelPolicy" })}
              {...register("CancelPolicy")}
              margin="dense"
              error={!!errors.CancelPolicy?.message}
              helperText={errors.CancelPolicy?.message as string}
            />
          </Grid>
          <Grid item xs={6}>
            {/* <CustomUpload
                                    IsLogo={true}
                                    Layout="vertical"
                                    id="logoPic"
                                /> */}
          </Grid>
        </Grid>
        <div style={{ display: "flex", flexDirection: "row-reverse" }}>
          <SubmitButton loading={loading} fullWidth={false} />
        </div>
      </form>
      <br />
      <Box sx={{ width: "100%" }}>
        <label>Компаний лого</label>
        <CustomUpload IsLogo={true} Layout="vertical" id="logoPic" />
        {data?.Logo ? (
          <Box sx={{ width: "80%" }}>
            <img //@ts-ignore
              src={data?.Logo} //@ts-ignore
            />
          </Box>
        ) : (
          <Box sx={{ width: "80%" }}>
            <img src={"/images/noimage.png"} />
          </Box>
        )}
      </Box>
    </>
  );
};

export default GeneralForm;
