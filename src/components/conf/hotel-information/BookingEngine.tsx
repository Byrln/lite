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
import AmenitySelect from "components/select/amenity";

const validationSchemaHotel = yup.object().shape({
  DescriptionBooking: yup.string().notRequired().nullable(),
  HotelPolicyBooking: yup.string().notRequired().nullable(),
  CancelPolicyBooking: yup.string().notRequired().nullable(),
});

const GeneralForm = () => {
  const intl = useIntl();
  const [hotelAmenities, setHotelAmenities]: any = useState(null);
  const [entity, setEntity]: any = useState(null);
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
      await HotelAPI.beUpdate(values);
      delete values.amenity;

      const amenitiesList: any = await HotelAPI.amenity();
      let amenitiesInsertValue: any = [];

      amenitiesList.forEach((amenityElement: any) => {
        let isBookingTrue = false;

        if (entity && entity.amenity2) {
          entity.amenity2.forEach((element: any, index: any) => {
            if (amenityElement.AmenityID == parseInt(index)) {
              isBookingTrue = element;
            }
          });
        }

        amenitiesInsertValue.push({
          AmenityID: amenityElement.AmenityID,
          IsGeneral: amenityElement.IsGeneral,
          IsBooking: isBookingTrue,
        });
      });

      HotelAPI.amenityInsertWUList({
        Amenities: amenitiesInsertValue,
      });
      toast("Амжилттай.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchDatas = async () => {
      try {
        const arr: any = await HotelAPI.hotelBe();
        const arrAmenity: any = await HotelAPI.amenity();
        setHotelAmenities(arrAmenity);
        let amenitiesBookingValue: any = [];
        if (arrAmenity) {
          arrAmenity.forEach((amenityElement: any) => {
            if (amenityElement.IsBooking == true) {
              amenitiesBookingValue[amenityElement.AmenityID] =
                true;
            }
          });
        }
        let newEntity = { amenity2: {} };
        newEntity.amenity2 = amenitiesBookingValue;

        setEntity(newEntity);
        setData(arr[0]);
        reset(arr[0]);
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
      <Box>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Box sx={{ mb: 2 }}>
                <TextField
                  size="small"
                  fullWidth
                  multiline
                  rows={4}
                  id="DescriptionBooking"
                  label={intl.formatMessage({ id: "TextHotelDescription" })}
                  {...register("DescriptionBooking")}
                  margin="dense"
                  error={!!errors.DescriptionBooking?.message}
                  helperText={errors.DescriptionBooking?.message as string}
                  sx={{ mb: 2 }}
                />
              </Box>

              <Box sx={{ mb: 2 }}>
                <TextField
                  size="small"
                  fullWidth
                  multiline
                  rows={4}
                  id="HotelPolicyBooking"
                  label={intl.formatMessage({ id: "TextHotelPolicy" })}
                  {...register("HotelPolicyBooking")}
                  margin="dense"
                  error={!!errors.HotelPolicyBooking?.message}
                  helperText={errors.HotelPolicyBooking?.message as string}
                  sx={{ mb: 2 }}
                />
              </Box>

              <Box sx={{ mb: 2 }}>
                <TextField
                  size="small"
                  fullWidth
                  multiline
                  rows={4}
                  id="CancelPolicyBooking"
                  label={intl.formatMessage({ id: "TextCancelPolicy" })}
                  {...register("CancelPolicyBooking")}
                  margin="dense"
                  error={!!errors.CancelPolicyBooking?.message}
                  helperText={errors.CancelPolicyBooking?.message as string}
                />
              </Box>
              <Box sx={{ mb: 3 }}>
                <AmenitySelect
                  register={register}
                  errors={errors}
                  customRegisterName="amenity"
                  entity={entity}
                  setEntity={setEntity}
                  isHotelAmenity={true}
                />
              </Box>
            </Grid>

            <Grid item xs={12} md={6}>
              {/* Logo Section */}
              <Box sx={{ p: 2, border: '1px solid #e0e0e0', borderRadius: 2, bgcolor: '#fafafa' }}>
                <Box sx={{ mb: 2 }}>
                  <label style={{ fontWeight: 'bold', fontSize: '14px', color: '#333' }}>{intl.formatMessage({ id: "TextCompanyLogo" })}</label>
                </Box>
                <CustomUpload IsLogo={true} Layout="vertical" id="logoPic" />
                {/* <Box sx={{ mt: 2, textAlign: 'center' }}>
                  {data?.Logo ? (
                    <Box sx={{
                      width: "200px",
                      height: "120px",
                      border: '2px solid #e0e0e0',
                      borderRadius: 2,
                      overflow: 'hidden',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mx: 'auto'
                    }}>
                      <img
                        src={data?.Logo}
                        style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                        alt="Hotel Logo"
                      />
                    </Box>
                  ) : (
                    <Box sx={{
                      width: "200px",
                      height: "120px",
                      border: '2px dashed #ccc',
                      borderRadius: 2,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mx: 'auto',
                      bgcolor: '#f9f9f9'
                    }}>
                      <img
                        src="/images/noimage.png"
                        style={{ maxWidth: '80%', maxHeight: '80%', opacity: 0.5 }}
                        alt="No Logo"
                      />
                    </Box>
                  )}
                </Box> */}
              </Box>
            </Grid>
          </Grid>

          <Box sx={{ mt: 4, display: "flex", justifyContent: "flex-end" }}>
            <SubmitButton loading={loading} />
          </Box>
        </form>
      </Box>
    </>
  );
};

export default GeneralForm;
