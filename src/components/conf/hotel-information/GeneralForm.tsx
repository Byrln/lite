/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState, useContext } from "react";
import { Box, Grid, TextField, CircularProgress, Typography, Paper, Divider, Button } from "@mui/material";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-toastify";
import { useIntl } from "react-intl";
import { HotelAPI } from "lib/api/hotel";
import SubmitButton from "components/common/submit-button";
import ReferenceSelect from "components/select/reference";
import HotelRatingSelect from "components/select/hotel-rating";
import CustomTab from "components/common/custom-tab";
import CustomUpload from "components/common/custom-upload";
import { ModalContext } from "lib/context/modal";
import EmailList from "../email/list";
import NewEdit from "../email/new-edit";
import ChangePassword from "../email/change-password";
import { Email, Settings, Lock, Add } from "@mui/icons-material";

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
  const { handleModal }: any = useContext(ModalContext);
  const [loadingData, setLoadingData] = useState(true);
  const [data, setData] = useState({ Logo: null });
  const [loading, setLoading] = useState(false);

  const textFieldSx = {
    mb: 2,
    '& .MuiOutlinedInput-root': {
      borderRadius: 2,
      '&:hover fieldset': {
        borderColor: '#1976d2',
      },
      '&.Mui-focused fieldset': {
        borderColor: '#1976d2',
      },
    },
    '& .MuiInputLabel-root.Mui-focused': {
      color: '#1976d2',
    },
  };

  const textAreaSx = {
    '& .MuiOutlinedInput-root': {
      borderRadius: 2,
      '&:hover fieldset': {
        borderColor: '#1976d2',
      },
      '&.Mui-focused fieldset': {
        borderColor: '#1976d2',
      },
    },
    '& .MuiInputLabel-root.Mui-focused': {
      color: '#1976d2',
    },
  };

  const selectSx = {
    mb: 2,
    '& .MuiOutlinedInput-root': {
      borderRadius: 2,
      '&:hover fieldset': {
        borderColor: '#1976d2',
      },
      '&.Mui-focused fieldset': {
        borderColor: '#1976d2',
      },
    },
    '& .MuiInputLabel-root.Mui-focused': {
      color: '#1976d2',
    },
  };
  const {
    register,
    control,
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
    <Box sx={{ p: 4, backgroundColor: '#f8f9fa' }}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Paper elevation={2} sx={{ p: 3, height: 'fit-content', borderRadius: 2 }}>
              <Typography variant="h6" sx={{
                mb: 3, fontWeight: 'bold', color: '#804fe6', display: 'flex', alignItems: 'center'
              }}>
                {intl.formatMessage({ id: "TextBasicInformation" })}
              </Typography>
              <Divider sx={{ mb: 3 }} />
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
                sx={textFieldSx}
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
                sx={textFieldSx}
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
                sx={textFieldSx}
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
                sx={textFieldSx}
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
                sx={textFieldSx}
              />
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper elevation={2} sx={{ p: 3, height: 'fit-content', borderRadius: 2 }}>
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold', color: '#804fe6', display: 'flex', alignItems: 'center' }}>
                {intl.formatMessage({ id: "TextAddressInformation" })}
              </Typography>
              <Divider sx={{ mb: 3 }} />
              <TextField
                size="small"
                fullWidth
                id="Address1"
                label={intl.formatMessage({ id: "TextAddress1" })}
                {...register("Address1")}
                margin="dense"
                error={!!errors.Address1?.message}
                helperText={errors.Address1?.message as string}
                sx={textFieldSx}
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
                sx={textFieldSx}
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
                sx={textFieldSx}
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
                sx={textFieldSx}
              />
              <ReferenceSelect
                register={register}
                errors={errors}
                type="Country"
                label={intl.formatMessage({ id: "ReportCountry" })}
                name="CountryID"
                optionValue="CountryID"
                optionLabel="CountryName"
              />
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper elevation={2} sx={{ p: 3, height: 'fit-content', borderRadius: 2 }}>
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold', color: '#804fe6', display: 'flex', alignItems: 'center' }}>
                {intl.formatMessage({ id: "TextContactAndDetails" })}

              </Typography>
              <Divider sx={{ mb: 3 }} />
              <TextField
                size="small"
                fullWidth
                id="ReservePhone"
                label={intl.formatMessage({ id: "ReservePhone" })}
                {...register("ReservePhone")}
                margin="dense"
                error={!!errors.ReservePhone?.message}
                helperText={errors.ReservePhone?.message as string}
                sx={textFieldSx}
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
                sx={textFieldSx}
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
                sx={textFieldSx}
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
                sx={textFieldSx}
              />
              <HotelRatingSelect
                control={control}
                errors={errors}
                sx={selectSx}
              />
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold', color: '#804fe6', display: 'flex', alignItems: 'center' }}>
                {intl.formatMessage({ id: "TextHotelPolicy" })}
              </Typography>
              <Divider sx={{ mb: 3 }} />
              <TextField
                size="small"
                fullWidth
                multiline
                rows={12}
                id="HotelPolicy"
                label={intl.formatMessage({ id: "HotelPolicy" })}
                {...register("HotelPolicy")}
                margin="dense"
                error={!!errors.HotelPolicy?.message}
                helperText={errors.HotelPolicy?.message as string}
                sx={textAreaSx}
              />
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold', color: '#804fe6', display: 'flex', alignItems: 'center' }}>
                {intl.formatMessage({ id: "TextCancellationPolicy" })}
              </Typography>
              <Divider sx={{ mb: 3 }} />
              <TextField
                size="small"
                fullWidth
                multiline
                rows={12}
                id="CancelPolicy"
                label={intl.formatMessage({ id: "CancelPolicy" })}
                {...register("CancelPolicy")}
                margin="dense"
                error={!!errors.CancelPolicy?.message}
                helperText={errors.CancelPolicy?.message as string}
                sx={textAreaSx}
              />
            </Paper>
          </Grid>
          <Grid item xs={20}>

            <Paper className="p-4">
              {/* Email Management Section */}
              <Box>
                <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 'bold', color: '#804fe6' }}>
                  {intl.formatMessage({ id: "TextEmailConfiguration" })}
                </Typography>
                <Grid container spacing={1}>
                  <Grid item xs={12}>
                    <Button
                      fullWidth
                      variant="outlined"
                      startIcon={<Email />}
                      onClick={() => {
                        handleModal(
                          true,
                          intl.formatMessage({ id: "TextEmailConfigurationList" }),
                          <EmailList title={intl.formatMessage({ id: "TextEmailConfiguration" })} />
                        );
                      }}
                      sx={{
                        mb: 1,
                        borderColor: '#804fe6',
                        color: '#804fe6',
                        '&:hover': {
                          borderColor: '#6a3fb8',
                          backgroundColor: 'rgba(128, 79, 230, 0.04)'
                        }
                      }}
                    >
                      {intl.formatMessage({ id: "TextEmailConfigurationList" })}
                    </Button>
                  </Grid>
                  <Grid item xs={6}>
                    <Button
                      fullWidth
                      variant="outlined"
                      startIcon={<Add />}
                      onClick={() => {
                        handleModal(
                          true,
                          intl.formatMessage({ id: "TextAddNewEmailConfiguration" }),
                          <NewEdit />
                        );
                      }}
                      sx={{
                        borderColor: '#28a745',
                        color: '#28a745',
                        '&:hover': {
                          borderColor: '#218838',
                          backgroundColor: 'rgba(40, 167, 69, 0.04)'
                        }
                      }}
                    >
                      {intl.formatMessage({ id: "TextAddNewEmailConfiguration" })}
                    </Button>
                  </Grid>
                  <Grid item xs={6}>
                    <Button
                      fullWidth
                      variant="outlined"
                      startIcon={<Lock />}
                      onClick={() => {
                        handleModal(
                          true,
                          intl.formatMessage({ id: "TextChangeEmailPassword" }),
                          <ChangePassword id={1} />
                        );
                      }}
                      sx={{
                        borderColor: '#dc3545',
                        color: '#dc3545',
                        '&:hover': {
                          borderColor: '#c82333',
                          backgroundColor: 'rgba(220, 53, 69, 0.04)'
                        }
                      }}
                    >
                      {intl.formatMessage({ id: "TextChangeEmailPassword" })}
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            </Paper>
          </Grid>
        </Grid>
        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, height: "70px", mb: 2 }}>
          <SubmitButton loading={loading} fullWidth={false} />
        </Box>
      </form>
    </Box >
  );
};

export default GeneralForm;
