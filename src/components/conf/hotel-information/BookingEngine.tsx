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
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={1}>
          <Grid item xs={6}>
            <TextField
              size="small"
              fullWidth
              multiline
              rows={3}
              id="DescriptionBooking"
              label={intl.formatMessage({ id: "TextHotelDescription" })}
              {...register("DescriptionBooking")}
              margin="dense"
              error={errors.DescriptionBooking?.message}
              helperText={errors.DescriptionBooking?.message}
            />

            <TextField
              size="small"
              fullWidth
              multiline
              rows={3}
              id="HotelPolicyBooking"
              label={intl.formatMessage({ id: "TextHotelPolicy" })}
              {...register("HotelPolicyBooking")}
              margin="dense"
              error={errors.HotelPolicyBooking?.message}
              helperText={errors.HotelPolicyBooking?.message}
            />
            <TextField
              size="small"
              fullWidth
              multiline
              rows={3}
              id="CancelPolicyBooking"
              label={intl.formatMessage({ id: "TextCancelPolicy" })}
              {...register("CancelPolicyBooking")}
              margin="dense"
              error={errors.CancelPolicyBooking?.message}
              helperText={errors.CancelPolicyBooking?.message}
            />
          </Grid>
          <Grid item xs={6}>
            <AmenitySelect
              register={register}
              errors={errors}
              customRegisterName="amenity"
              entity={entity}
              setEntity={setEntity}
              isHotelAmenity={true}
            />
          </Grid>
        </Grid>
        <Box>
          <SubmitButton loading={loading} />
        </Box>
      </form>
    </>
  );
};

export default GeneralForm;
