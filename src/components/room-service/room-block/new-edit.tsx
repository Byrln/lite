import { Controller, useForm } from "react-hook-form";
import { FormControlLabel, TextField, Grid, Checkbox } from "@mui/material";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useState, useEffect } from "react";
import moment from "moment";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { useIntl } from "react-intl";
import NewEditForm from "components/common/new-edit-form";
import { RoomBlockAPI, listUrl } from "lib/api/room-block";
import { useAppState } from "lib/context/app";
import RoomSelect from "components/select/room";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import ReasonSelect from "components/select/reason";
import RoomTypeSelect from "components/select/room-type";
import { dateToSimpleFormat } from "lib/utils/format-time";
import { RoomAPI } from "lib/api/room";
import SubmitButton from "components/common/submit-button";

const validationSchema = yup.object().shape({
  // RoomID: yup.string().required("Бөглөнө үү"),
  BeginDate: yup.string().required("Бөглөнө үү"),
  EndDate: yup.string().required("Бөглөнө үү"),
  ReasonID: yup.string().required("Бөглөнө үү"),
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
    resetField,
  } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      BeginDate: moment(defaultStartDate).format("YYYY-MM-DD"),
      EndDate: moment(defaultEndDate).format("YYYY-MM-DD")
    }
  });

  const [baseStay, setBaseStay]: any = useState({
    TransactionID: 0,
    roomType: {
      RoomTypeID: 0
    },
    dateStart: defaultStartDate,
    dateEnd: defaultEndDate,
    nights: 1,
    room: {
      RoomID: null,
    },
  });

  const onRoomChange = (r: any, index?: any) => {
    setBaseStay({
      ...baseStay,
      room: r,
    });
  };

  const onRoomTypeChange = (rt: any, index?: number) => {
    setBaseStay({
      ...baseStay,
      roomType: rt,
    });
  };

  const fetchRooms = async () => {
    if (
      !(
        baseStay &&
        baseStay.roomType &&
        baseStay.dateStart &&
        baseStay.dateEnd
      )
    ) {
      return;
    }
    var values = {
      TransactionID: baseStay.TransactionID,
      RoomTypeID:
        baseStay.roomType?.RoomTypeID === 0 || baseStay.roomType?.RoomTypeID === "all"
          ? 0
          : baseStay.roomType?.RoomTypeID || 0,
      StartDate: dateToSimpleFormat(baseStay.dateStart),
      EndDate: dateToSimpleFormat(baseStay.dateEnd),
    };
    var d = await RoomAPI.listAvailable(values);
    setData(d);
  };

  useEffect(() => {
    fetchRooms();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [baseStay.roomType, baseStay.dateStart, baseStay.dateEnd]);

  const customSubmit = async (values: any) => {
    try {
      // Process room blocks sequentially to avoid database deadlocks
      if (data && data.length > 0) {
        for (const room of data) {
          const isChecked = values.RoomID && values.RoomID[room.RoomID];
          if (isChecked) {
            const tempValues = {
              RoomID: room.RoomID,
              BeginDate: values.BeginDate,
              EndDate: values.EndDate,
              ReasonID: values.ReasonID,
            };
            await RoomBlockAPI.new(tempValues);
          }
        }
      }
    } finally {
    }
  };

  return (
    <NewEditForm
      api={RoomBlockAPI}
      listUrl={listUrl}
      additionalValues={{
        RoomBlockID: state.editId,
      }}
      reset={reset}
      handleSubmit={handleSubmit}
      customSubmit={customSubmit}
    >
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
              defaultValue={moment(defaultStartDate).format("YYYY-MM-DD")}
              render={({ field: { onChange, value } }) => (
                <DatePicker
                  label={intl.formatMessage({
                    id: "RowHeaderBeginDate",
                  })}
                  value={value}
                  maxDate={baseStay.dateEnd || undefined}
                  onChange={(value) => {
                    const formattedDate = moment(value).format("YYYY-MM-DD");
                    onChange(formattedDate);
                    setBaseStay({
                      ...baseStay,
                      dateStart: value
                    });
                  }}
                  renderInput={(params) => (
                    <TextField
                      size="small"
                      id="RowHeaderBeginDate"
                      label={intl.formatMessage({
                        id: "RowHeaderBeginDate",
                      })}
                      {...register("BeginDate")}
                      margin="dense"
                      fullWidth
                      {...params}
                      error={!!errors.BeginDate?.message}
                      helperText={
                        errors.BeginDate?.message as string}
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
              defaultValue={moment(defaultEndDate).format("YYYY-MM-DD")}
              render={({ field: { onChange, value } }) => (
                <DatePicker
                  label={intl.formatMessage({
                    id: "RowHeaderEndDate",
                  })}
                  {...register("EndDate")}
                  value={value}
                  minDate={baseStay.dateStart || undefined}
                  onChange={(value) => {
                    const formattedDate = moment(value).format("YYYY-MM-DD");
                    onChange(formattedDate);
                    setBaseStay({
                      ...baseStay,
                      dateEnd: value
                    });
                  }}
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
            searchRoomTypeID={baseStay?.roomType?.RoomTypeID || 0}
            setSearchRoomTypeID={(id) => {
              const roomType = { RoomTypeID: id };
              setBaseStay((prev: any) => ({
                ...prev,
                roomType
              }));
              onRoomTypeChange && onRoomTypeChange(roomType);
            }}
          />
        </Grid>
        {data &&
          data.map((room: any, index: any) => {
            return (
              <Grid item xs={6} sm={3} key={room.RoomID}>
                <FormControlLabel
                  control={
                    <Controller
                      name={`RoomID.${room.RoomID}` as any}
                      control={control}
                      render={({ field: { onChange, value } }) => (
                        <Checkbox
                          key={`RoomID.${room.RoomID}`}
                          checked={value || false}
                          onChange={onChange}
                        />
                      )}
                    />
                  }
                  label={room.RoomFullName}
                />
              </Grid>
            );
          })}
        </Grid>
      </LocalizationProvider>
    </NewEditForm>
  );
};

export default NewEdit;
