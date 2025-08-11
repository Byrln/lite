import { Controller, useForm } from "react-hook-form";
import { FormControlLabel, TextField, Grid, Checkbox, Box } from "@mui/material";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useState, useEffect } from "react";
import moment from "moment";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { useIntl } from "react-intl";
import { toast } from "react-toastify";
import { mutate } from "swr";
import NewEditForm from "components/common/new-edit-form";
import { RoomBlockAPI, listUrl } from "lib/api/room-block";
import { useAppState } from "lib/context/app";
import ReasonSelect from "components/select/reason";
import RoomTypeSelect from "components/select/room-type";
import { dateToSimpleFormat } from "lib/utils/format-time";
import { RoomAPI } from "lib/api/room";
import SubmitButton from "components/common/submit-button";

const validationSchema = yup.object().shape({
  BeginDate: yup.date().required("Begin date is required"),
  EndDate: yup.date().required("End date is required"),
  ReasonID: yup.number().required("Reason is required"),
  RoomTypeID: yup.number().nullable().notRequired(),
});

const NewEdit = ({ workingDate }: any) => {
  const intl = useIntl();
  const [loading, setLoading] = useState(false);

  const [data, setData]: any = useState([]);
  const [state]: any = useAppState();

  const defaultStartDate = workingDate ? new Date(workingDate) : new Date();
  const defaultEndDate = workingDate ? new Date(workingDate) : new Date();

  const {
    register,
    reset,
    handleSubmit,
    control,
    formState: { errors },
    setValue,
    watch,
  } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      BeginDate: defaultStartDate,
      EndDate: defaultEndDate,
      ReasonID: null,
      RoomTypeID: null,
    }
  });

  const watchedBeginDate = watch("BeginDate");
  const watchedEndDate = watch("EndDate");

  const [selectedRoomType, setSelectedRoomType] = useState<any>(null);
  const [selectedRooms, setSelectedRooms] = useState<{ [key: number]: boolean }>({});

  const onRoomTypeChange = (roomTypeId: number) => {
    setSelectedRoomType(roomTypeId);
    setValue("RoomTypeID", roomTypeId as any);
    setSelectedRooms({}); // Clear selected rooms when room type changes
  };

  const fetchRooms = async () => {
    if (!selectedRoomType || !watchedBeginDate || !watchedEndDate) {
      setData([]);
      return;
    }

    try {
      const values = {
        TransactionID: 0,
        RoomTypeID: selectedRoomType === "all" ? 0 : selectedRoomType,
        StartDate: dateToSimpleFormat(watchedBeginDate),
        EndDate: dateToSimpleFormat(watchedEndDate),
      };
      const roomData = await RoomAPI.listAvailable(values);
      setData(roomData || []);
    } catch (error) {
      console.error("Error fetching rooms:", error);
      setData([]);
    }
  };

  useEffect(() => {
    fetchRooms();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedRoomType, watchedBeginDate, watchedEndDate]);

  const customSubmit = async (values: any) => {
    setLoading(true);
    try {
      const selectedRoomIds = Object.keys(selectedRooms).filter(roomId => selectedRooms[parseInt(roomId)]);

      if (selectedRoomIds.length === 0) {
        toast.error("Please select at least one room");
        return;
      }

      // Process room blocks sequentially according to Lite API specification
      for (const roomId of selectedRoomIds) {
        const blockData = {
          RoomID: parseInt(roomId),
          BeginDate: dateToSimpleFormat(values.BeginDate),
          EndDate: dateToSimpleFormat(values.EndDate),
          ReasonID: values.ReasonID,
        };

        const response = await RoomBlockAPI.new(blockData);

        if (response.status !== 200 || !response.data.Status) {
          toast.error(`Failed to block room: ${response.data.Message || 'Unknown error'}`);
          return;
        }
      }

      toast.success(`Successfully blocked ${selectedRoomIds.length} room(s)`);

      // Refresh the room block list
      mutate([listUrl, JSON.stringify({
        StartDate: dateToSimpleFormat(values.BeginDate),
        EndDate: dateToSimpleFormat(values.EndDate),
        RoomBlockID: 0,
        RoomID: 0
      })]);

      // Reset form
      reset();
      setSelectedRooms({});
      setData([]);

    } catch (error) {
      console.error("Error creating room blocks:", error);
      toast.error("Failed to create room blocks");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit(customSubmit)}>
      <LocalizationProvider // @ts-ignore
        dateAdapter={AdapterDateFns} // @ts-ignore
      >
        <Grid container spacing={1}>
          {/* <Grid item xs={3}>
                        <RoomSelect
                            register={register}
                            errors={errors}
                            baseStay={baseStay}
                            onRoomChange={onRoomChange}
                            customRegisterName="RoomID"
                        />
                    </Grid> */}
          <Grid item xs={4}>
            <Controller
              name="BeginDate"
              control={control}
              render={({ field: { onChange, value } }) => (
                <DatePicker
                  label={intl.formatMessage({
                    id: "RowHeaderBeginDate",
                  })}
                  value={value}
                  maxDate={watchedEndDate || undefined}
                  onChange={(newValue) => {
                    onChange(newValue);
                  }}
                  renderInput={(params) => (
                    <TextField
                      size="small"
                      margin="dense"
                      fullWidth
                      {...params}
                      error={!!errors.BeginDate}
                      helperText={errors.BeginDate?.message as string}
                    />
                  )}
                />
              )}
            />
          </Grid>
          <Grid item xs={4}>
            <Controller
              name="EndDate"
              control={control}
              render={({ field: { onChange, value } }) => (
                <DatePicker
                  label={intl.formatMessage({
                    id: "RowHeaderEndDate",
                  })}
                  value={value}
                  minDate={watchedBeginDate || undefined}
                  onChange={(newValue) => {
                    onChange(newValue);
                  }}
                  renderInput={(params) => (
                    <TextField
                      size="small"
                      margin="dense"
                      fullWidth
                      {...params}
                      error={!!errors.EndDate}
                      helperText={errors.EndDate?.message as string}
                    />
                  )}
                />
              )}
            />
          </Grid>
          <Grid item xs={4}>
            <ReasonSelect
              register={register}
              errors={errors}
              ReasonTypeID={3}
              nameKey={"ReasonID"}
            />
          </Grid>
          <Grid item xs={12}>
            <RoomTypeSelect
              searchRoomTypeID={selectedRoomType || 0}
              setSearchRoomTypeID={onRoomTypeChange}
            />
          </Grid>
          {data && data.length > 0 && (
            <Grid item xs={12}>
              <Box sx={{ mt: 2, mb: 1 }}>
                <strong>Available Rooms:</strong>
              </Box>
            </Grid>
          )}
          {data &&
            data.map((room: any) => {
              return (
                <Grid item xs={6} sm={4} md={3} key={room.RoomID}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={selectedRooms[room.RoomID] || false}
                        onChange={(e) => {
                          setSelectedRooms(prev => ({
                            ...prev,
                            [room.RoomID]: e.target.checked
                          }));
                        }}
                      />
                    }
                    label={room.RoomFullName || room.RoomNo}
                  />
                </Grid>
              );
            })}
        </Grid>
        <Grid item xs={12}>
          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
            <SubmitButton loading={loading} />
          </Box>
        </Grid>
      </LocalizationProvider>
    </Box>
  );
};

export default NewEdit;
