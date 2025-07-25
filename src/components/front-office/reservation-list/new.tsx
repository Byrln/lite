import React from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { useIntl } from "react-intl";
import {
  Card,
  CardContent,
  Button,
  Grid,
  TextField,
  Typography,
  Divider,
  Checkbox,
  FormControlLabel,
  Box,
} from "@mui/material";
import { Switch } from "@/components/ui/switch";
import CheckroomIcon from "@mui/icons-material/Checkroom";
import InfoIcon from "@mui/icons-material/Info";
import moment from "moment";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { useState, useEffect } from "react";
import ReceiptIcon from "@mui/icons-material/Receipt";

// ColorPicker import removed as it's now used in new-form.tsx
import ReservationSourceSelect from "components/select/reservation-source";
import { ReservationTypeSelect } from "components/select";
import NewEditForm from "components/common/new-edit-form";
import { ReservationAPI } from "lib/api/reservation";
import { listUrl } from "lib/api/front-office";
import { dateStringToObj } from "lib/utils/helpers";
import PaymentMethodSelect from "components/select/payment-method";
import CurrencySelect from "components/select/currency";
import RoomTypeSelect from "components/select/room-type";
import { formatPrice } from "lib/utils/helpers";
import { countNights } from "lib/utils/format-time";
import ReferenceSelect from "components/select/reference";
import NewForm from "./new-form";
import CustomerSelect from "components/select/customer";
import AvailableRoomTypes from "./available-room-types";
import { RateTypeSWR } from "lib/api/rate-type";
import DraggableDialog from "components/mui/MuiDraggableDialog";

const validationSchema = yup.object().shape({
  ArrivalDate: yup.string().required("Ирэх огноо сонгоно уу!"),
  ArrivalTime: yup.string().required("Ирэх цаг сонгоно уу!"),
  DepartureDate: yup.string().required("Гарах огноо сонгоно уу!"),
  DepartureTime: yup.string().required("Гарах цаг сонгоно уу!"),
  TransactionDetail: yup
    .array()
    .nullable()
    .of(
      yup.object().shape({
        RoomTypeID: yup.string().required("Өрөөний төрөл сонгоно уу!"),
        Adult: yup.string().required("Том хүний тоо оруулна уу!"),
        Name: yup.string().required("Зочны нэр оруулна уу!"),
      })
    ),
});

const NewEdit = ({
  dateStart,
  dateEnd,
  roomType,
  room,
  BaseAdult,
  BaseChild,
  MaxAdult,
  MaxChild,
  workingDate,
  groupID,
  customRerender,
}: any) => {
  const intl = useIntl();
  const [CustomerID, setCustomerID]: any = useState(0);
  const [ArrivalDate, setArrivalDate]: any = useState(
    dateStart ? dateStart : workingDate
  );
  const [ArrivalTime, setArrivalTime]: any = useState("14:00");
  const [DepartureTime, setDepartureTime]: any = useState(
    dateStart &&
      dateEnd &&
      dateStart.getFullYear() === dateEnd.getFullYear() &&
      dateStart.getMonth() === dateEnd.getMonth() &&
      dateStart.getDate() === dateEnd.getDate()
      ? "18:00"
      : "12:00"
  );
  const { data: rateTypeData, error: rateTypeError } = RateTypeSWR({});
  const [DepartureDate, setDepartureDate]: any = useState(
    dateEnd
      ? dateEnd
      : moment(dateStringToObj(workingDate)).add(1, "days").startOf("day")
  );
  const [BreakfastIncluded, setBreakfastIncluded]: any = useState("");
  const [TaxIncluded, setTaxIncluded]: any = useState("");
  const [ReservationSourceChecked, setReservationSourceChecked]: any =
    useState(false);
  const [ReservationTypeID, setReservationTypeID]: any = useState(1);
  const [newGroupCount, setNewGroupCount]: any = useState(1);
  const [newRoomTypeID, setNewRoomTypeID]: any = useState<any>(null);
  const [nights, setNights]: any = useState<any>(1);
  const [totalAmount, setTotalAmount]: any = useState<any>(0);
  const [billingInfo, setBillingInfo]: any = useState<any>(null);
  const [isBooker, setIsBooker]: any = useState<any>(false);
  const [isGuide, setIsGuide]: any = useState<any>(false);
  const [groupColor, setGroupColor]: any = useState("#0033ff");
  const [Currency, setCurrency]: any = useState("");
  const [helpDialogOpen, setHelpDialogOpen]: any = useState(false);
  const [dialogPosition, setDialogPosition] = useState<{ x: number | null, y: number | null }>({ x: null, y: null });
  const [useDefaultValues, setUseDefaultValues]: any = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('useDefaultValues');
      return saved !== null ? JSON.parse(saved) : true;
    }
    return true;
  });

  const setRange = (dateStart: Date, dateEnd: Date) => {
    var nights: number;
    nights = countNights(dateStart, dateEnd);
    setNights(nights);
  };

  useEffect(() => {
    if (ArrivalDate && DepartureDate) {
      setRange(ArrivalDate, DepartureDate);
    }
  }, [ArrivalDate, DepartureDate]);

  // Save useDefaultValues to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('useDefaultValues', JSON.stringify(useDefaultValues));
    }
  }, [useDefaultValues]);

  // Add event listener for COLOR_CHANGE message from new-form.tsx
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data && event.data.type === 'COLOR_CHANGE') {
        setGroupColor(event.data.color);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  const [PaymentMethodID, setPaymentMethodID]: any = useState(null);
  const {
    register,
    reset,
    resetField,
    handleSubmit,
    control,
    getValues,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      ArrivalTime: "14:00",
      DepartureTime: "  :00",
      Remarks: null,
      BookerName: null,
      BookerPhone: null,
      GuideName: null,
      GuidePhone: null,
      IsBooker: null,
      IsGuide: null,
      ReservationSourceChecked: null,
      TaxIncluded: null,
      BreakfastIncluded: null,
      PayAmount: null,
      ArrivalDate: dateStart
        ? moment(
          dateStringToObj(moment(dateStart).format("YYYY-MM-DD")),
          "YYYY-MM-DD"
        ).format("YYYY-MM-DD")
        : moment(
          dateStringToObj(moment(workingDate).format("YYYY-MM-DD")),
          "YYYY-MM-DD"
        ).format("YYYY-MM-DD"),
      DepartureDate: dateEnd
        ? moment(
          dateStringToObj(moment(dateEnd).format("YYYY-MM-DD")),
          "YYYY-MM-DD"
        ).format("YYYY-MM-DD")
        : moment(
          dateStringToObj(moment(workingDate).format("YYYY-MM-DD")),
          "YYYY-MM-DD"
        )
          .add(1, "days")
          .format("YYYY-MM-DD"),
      TransactionDetail: [
        {
          ArrivalDate: dateStart ? dateStart : workingDate,
          DepartureDate: dateEnd
            ? dateEnd
            : moment(
              dateStringToObj(
                moment(workingDate).format("YYYY-MM-DD")
              ),
              "YYYY-MM-DD"
            )
              .add(1, "days")
              .format("YYYY-MM-DD"),
          RoomTypeID: roomType || "",
          RoomID: room || "",
          ReservationTypeID: 1,
          GuestDetail: {
            Name: null,
            Email: null,
            Mobile: null,
            CountryID: "",
            VipStatusID: ""
          },
          Adult: 1,
          Child: 0
        }
      ],
    },
    resolver: yupResolver(validationSchema),
  });

  const { fields, append, prepend, remove, insert } = useFieldArray({
    control,
    name: "TransactionDetail",
  });

  // Initialize fields if empty
  useEffect(() => {
    if (fields.length === 0 && roomType) {
      append({
        ArrivalDate: dateStart ? dateStart : workingDate,
        DepartureDate: dateEnd
          ? dateEnd
          : moment(
            dateStringToObj(
              moment(workingDate).format("YYYY-MM-DD")
            ),
            "YYYY-MM-DD"
          )
            .add(1, "days")
            .format("YYYY-MM-DD"),
        RoomTypeID: roomType,
        RoomID: room,
        ReservationTypeID: 1,
        GuestDetail: {
          Name: null,
          Email: null,
          Mobile: null,
          CountryID: "",
          VipStatusID: ""
        },
      });
    }
  }, [fields.length, append, dateStart, dateEnd, workingDate, roomType, room]);

  useEffect(() => {
    if (getValues() && getValues().TransactionDetail) {
      setTotalAmount(
        getValues().TransactionDetail.reduce(
          (acc: any, obj: any) =>
            Number(acc) +
            (obj.CurrencyAmount ? Number(obj.CurrencyAmount) : 0),
          0
        )
      );
    }
  }, [getValues()]);

  const customResetEvent = (data: any) => {
    reset({
      TransactionDetail: [data],
    });
  };

  const customSubmit = async (values: any) => {
    try {
      let tempValues = { ...values };
      tempValues.TransactionDetail[0].PayAmount = values.PayAmount;
      tempValues.TransactionDetail[0].PayCurrencyID =
        values.PayCurrencyID;
      tempValues.TransactionDetail[0].PaymentMethodID =
        values.PaymentMethodID;
      tempValues.TransactionDetail[0].ReservationSourceID =
        values.ReservationSourceID;
      tempValues.TransactionDetail[0].CustomerID = values.CustomerID;
      tempValues.TransactionDetail[0].GroupColor = groupColor;
      tempValues.TransactionDetail[0].Remarks = values.Remarks;
      tempValues.ArrivalDate = values.ArrivalDate + " " + ArrivalTime;
      tempValues.DepartureDate =
        values.DepartureDate + " " + DepartureTime;
      tempValues.GroupColor = groupColor;

      if (groupID) {
        tempValues.IsGroup = true;
        tempValues.IsGroup = groupID;
        tempValues.TransactionDetail[0].IsGroup = true;
        tempValues.TransactionDetail[0].GroupID = groupID;
      }
      if (isBooker == true) {
        tempValues.TransactionDetail[0].BookerName = values.BookerName;
        tempValues.TransactionDetail[0].BookerPhone =
          values.BookerPhone;
      } else {
        delete tempValues.BookerName;
        delete tempValues.BookerPhone;
      }

      if (isGuide == true) {
        tempValues.TransactionDetail[0].GuideName = values.GuideName;
        tempValues.TransactionDetail[0].GuidePhone = values.GuidePhone;
      } else {
        delete tempValues.GuideName;
        delete tempValues.GuidePhone;
      }

      values.TransactionDetail.forEach((detail: any, index: any) => {
        tempValues.TransactionDetail[index].Amount =
          detail.CurrencyAmount / nights;
        tempValues.TransactionDetail[index].TaxIncluded = TaxIncluded;
        tempValues.TransactionDetail[index].BreakfastIncluded =
          BreakfastIncluded;
        tempValues.TransactionDetail[index].ReservationTypeID =
          values.ReservationTypeID;
        tempValues.TransactionDetail[index].ReservationSourceID =
          values.ReservationSourceID;
        tempValues.TransactionDetail[index].ArrivalDate =
          values.ArrivalDate + " " + ArrivalTime;
        tempValues.TransactionDetail[index].DepartureDate =
          values.DepartureDate + " " + DepartureTime;
        tempValues.TransactionDetail[index].CustomerID =
          values.CustomerID;
        tempValues.TransactionDetail[index].GuestDetail.Name =
          values.TransactionDetail[index].Name;
        tempValues.TransactionDetail[index].CurrencyID =
          Currency && Currency.CurrencyID ? Currency.CurrencyID : "";

        if (isBooker == true) {
          tempValues.TransactionDetail[index].BookerName =
            values.BookerName;
          tempValues.TransactionDetail[index].BookerPhone =
            values.BookerPhone;
        }

        if (isGuide == true) {
          tempValues.TransactionDetail[index].GuideName =
            values.GuideName;
          tempValues.TransactionDetail[index].GuidePhone =
            values.GuidePhone;
        }

        if (groupID) {
          tempValues.TransactionDetail[index].IsGroup = true;
          tempValues.TransactionDetail[index].GroupID = groupID;
        }

        tempValues.TransactionDetail[index].GroupColor = groupColor;
        tempValues.TransactionDetail[index].Remarks = values.Remarks;
      });
      await ReservationAPI.new(tempValues);
      if (customRerender) {
        customRerender();
      }
    } finally {
    }
  };

  // onColorChange function removed as ColorPicker is now in new-form.tsx
  // The groupColor state is still used for storing the color value

  const handleHelpDialogToggle = (event?: React.MouseEvent) => {
    if (event) {
      const buttonRect = event.currentTarget.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      const dialogWidth = 600; // Width of the dialog
      const dialogHeight = 400; // Approximate height of the dialog
      let xPos = buttonRect.left;
      let yPos = buttonRect.bottom + 10;
      if (xPos + dialogWidth > viewportWidth) {
        xPos = Math.max(0, viewportWidth - dialogWidth - 20);
      }
      if (yPos + dialogHeight > viewportHeight) {
        yPos = Math.max(0, buttonRect.top - dialogHeight - 10);
      }

      setDialogPosition({
        x: xPos,
        y: yPos
      });
    }
    setHelpDialogOpen(!helpDialogOpen);
  };

  const handleHelpDialogClose = () => {
    setHelpDialogOpen(false);
  };


  const appBarComponent = (
    <div className="bg-purple-600 shadow-md flex items-center justify-between px-4">
      <div className="flex items-center">
        {ArrivalDate && DepartureDate && (
          <AvailableRoomTypes
            ArrivalDate={ArrivalDate}
            DepartureDate={DepartureDate}
          />
        )}
      </div>
    </div>
  );

  return (
    <NewEditForm
      api={ReservationAPI}
      listUrl={listUrl}
      reset={reset}
      handleSubmit={handleSubmit}
      customResetEvent={customResetEvent}
      customSubmitTitle={intl.formatMessage({
        id: "TextReservation",
      })}
      customSubmit={customSubmit}
      appBar={appBarComponent}
    >

      <LocalizationProvider // @ts-ignore
        dateAdapter={AdapterDateFns}
      >
        <Card className="mb-4" elevation={0} sx={{
          background: 'linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)',
          borderRadius: "24px",
          border: '1px solid rgba(148, 163, 184, 0.1)',
          boxShadow: "0px 20px 40px rgba(0, 0, 0, 0.08), 0px 8px 16px rgba(0, 0, 0, 0.04)",
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            boxShadow: "0px 24px 48px rgba(0, 0, 0, 0.12), 0px 12px 24px rgba(0, 0, 0, 0.06)",
            transform: 'translateY(-2px)'
          }
        }}
        >
          <CardContent sx={{ padding: { xs: "16px", sm: "24px", md: "32px" } }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
                marginBottom: "20px",
                flexDirection: { xs: "column", sm: "row" },
                gap: { xs: 2, sm: 0 }
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <div
                  style={{
                    width: "36px",
                    height: "36px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    background: "#804fe6",
                    borderRadius: "18px",
                    color: "#ffffff",
                    boxShadow: "0px 8px 24px rgba(102, 126, 234, 0.25), 0px 4px 12px rgba(118, 75, 162, 0.15)"
                  }}
                >
                  <InfoIcon
                    sx={{ fontSize: "28px" }}
                  />
                </div>
                <Typography
                  variant="h5"
                  sx={{
                    marginLeft: { xs: "0px", sm: "20px" },
                    marginTop: { xs: "8px", sm: "0px" },
                    fontWeight: 700,
                    color: "#1e293b",
                    fontSize: { xs: "1.25rem", sm: "1.5rem" },
                    letterSpacing: "-0.025em",
                    textAlign: { xs: "center", sm: "left" }
                  }}
                >
                  {intl.formatMessage({ id: "TextGeneral" })}
                </Typography>
              </div>
            </Box>
            <Grid container spacing={0}>
              <Grid
                item
                xs={12}
                style={{
                  transition: "all 0.3s ease",
                }}
              >
                <Grid key="dates" container spacing={{ xs: 2, sm: 3 }}>
                  <Grid item xs={12} sm={6} md={3}>
                    <Controller
                      name={`ArrivalDate`}
                      control={control}
                      render={({
                        field: { onChange, value },
                      }) => (
                        <DatePicker
                          label={intl.formatMessage({
                            id: "TextArrivalDate",
                          })}
                          value={value}
                          onChange={(value) => {
                            onChange(
                              moment(
                                value
                              ).format(
                                "YYYY-MM-DD"
                              )
                            );
                            setArrivalDate(
                              moment(
                                value
                              ).format(
                                "YYYY-MM-DD"
                              )
                            );
                            if (
                              new Date(
                                moment(
                                  value
                                ).format(
                                  "YYYY-MM-DD"
                                )
                              ) >
                              new Date(
                                DepartureDate
                              )
                            ) {
                              setDepartureDate(
                                moment(value)
                                  .add(
                                    1,
                                    "days"
                                  )
                                  .format(
                                    "YYYY-MM-DD"
                                  )
                              );
                              setValue(
                                "DepartureDate",
                                moment(value)
                                  .add(
                                    1,
                                    "days"
                                  )
                                  .format(
                                    "YYYY-MM-DD"
                                  )
                              );
                            }
                          }}
                          renderInput={(params) => (
                            <TextField
                              size="small"
                              id={`ArrivalDate`}
                              {...register(
                                `ArrivalDate`
                              )}
                              margin="dense"
                              fullWidth
                              {...params}
                              error={
                                !!errors
                                  .ArrivalDate
                                  ?.message
                              }
                              helperText={
                                errors
                                  .ArrivalDate
                                  ?.message
                              }
                              sx={{
                                '& .MuiOutlinedInput-root': {
                                  borderRadius: '12px',
                                  transition: 'all 0.2s ease-in-out',
                                  '&:hover': {
                                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                                  },
                                  '&.Mui-focused': {
                                    boxShadow: '0 4px 20px rgba(102, 126, 234, 0.2)'
                                  }
                                }
                              }}
                            />
                          )}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    {" "}
                    <TextField
                      id="ArrivalTime"
                      label={intl.formatMessage({
                        id: "TextArrivalTime",
                      })}
                      type="time"
                      margin="dense"
                      {...register("ArrivalTime")}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      sx={{
                        width: "100%",
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '12px',
                          transition: 'all 0.2s ease-in-out',
                          '&:hover': {
                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                          },
                          '&.Mui-focused': {
                            boxShadow: '0 4px 20px rgba(102, 126, 234, 0.2)'
                          }
                        }
                      }}
                      size="small"
                      value={ArrivalTime}
                      onChange={(value) =>
                        setArrivalTime(
                          value.target.value
                        )
                      }
                      onKeyDown={(e) => {
                        // Prevent the Delete key from clearing the time picker
                        if (e.key === "Delete") {
                          e.preventDefault();
                        }
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    {" "}
                    <Controller
                      name={`DepartureDate`}
                      control={control}
                      render={({
                        field: { onChange, value },
                      }) => (
                        <DatePicker
                          label={intl.formatMessage({
                            id: "TextDepartureDate",
                          })}
                          value={value}
                          minDate={
                            new Date(ArrivalDate)
                          }
                          onChange={(value) => (
                            moment(ArrivalDate).set(
                              {
                                hour: 0,
                                minute: 0,
                                second: 0,
                              }
                            ) >
                              moment(value).set({
                                hour: 0,
                                minute: 0,
                                second: 0,
                              })
                              ? null
                              : onChange(
                                moment(
                                  value
                                ).format(
                                  "YYYY-MM-DD"
                                )
                                // moment(
                                //     dateStringToObj(
                                //         moment(
                                //             value
                                //         ).format(
                                //             "YYYY-MM-DD"
                                //         )
                                //     ),
                                //     "YYYY-MM-DD"
                                // )
                                // moment(value, "YYYY-MM-DD")
                              ),
                            moment(ArrivalDate).set(
                              {
                                hour: 0,
                                minute: 0,
                                second: 0,
                              }
                            ) >
                              moment(value).set({
                                hour: 0,
                                minute: 0,
                                second: 0,
                              })
                              ? null
                              : setDepartureDate(
                                moment(
                                  value
                                ).format(
                                  "YYYY-MM-DD"
                                )
                              ),
                            moment(
                              ArrivalDate
                            ).format(
                              "yyyy-MM-DD"
                            ) ==
                            moment(
                              value
                            ).format(
                              "yyyy-MM-DD"
                            ) &&
                            setDepartureTime(
                              ArrivalTime
                            )
                          )}
                          renderInput={(params) => (
                            <TextField
                              size="small"
                              id={`DepartureDate`}
                              {...register(
                                `DepartureDate`
                              )}
                              margin="dense"
                              fullWidth
                              {...params}
                              error={
                                !!errors
                                  .DepartureDate
                                  ?.message
                              }
                              sx={{
                                width: "100%",
                                '& .MuiOutlinedInput-root': {
                                  borderRadius: '12px',
                                  transition: 'all 0.2s ease-in-out',
                                  '&:hover': {
                                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                                  },
                                  '&.Mui-focused': {
                                    boxShadow: '0 4px 20px rgba(102, 126, 234, 0.2)'
                                  }
                                }
                              }}
                              helperText={
                                errors
                                  .DepartureDate
                                  ?.message
                              }
                            />
                          )}
                        />
                      )}
                    />
                  </Grid>
                  {DepartureTime && (
                    <Grid item xs={12} sm={6} md={3}>
                      {" "}
                      <TextField
                        id="DepartureTime"
                        label={intl.formatMessage({
                          id: "TextDepartureTime",
                        })}
                        inputProps={{
                          min:
                            moment(ArrivalDate).set(
                              {
                                hour: 0,
                                minute: 0,
                                second: 0,
                              }
                            ) ==
                              moment(
                                DepartureDate
                              ).set({
                                hour: 0,
                                minute: 0,
                                second: 0,
                              })
                              ? ArrivalTime
                              : "9:00",
                        }}
                        type="time"
                        margin="dense"
                        {...register("DepartureTime")}
                        InputLabelProps={{
                          shrink: true,
                        }}
                        size="small"
                        value={DepartureTime}
                        onChange={(value) =>
                          moment(ArrivalDate).format(
                            "yyyy-MM-DD"
                          ) ==
                            moment(
                              DepartureDate
                            ).format("yyyy-MM-DD")
                            ? value.target.value <
                              ArrivalTime
                              ? ""
                              : setDepartureTime(
                                value.target
                                  .value
                              )
                            : setDepartureTime(
                              value.target.value
                            )
                        }
                        sx={{
                          width: "100%",
                          '& .MuiOutlinedInput-root': {
                            borderRadius: '12px',
                            transition: 'all 0.2s ease-in-out',
                            '&:hover': {
                              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                            },
                            '&.Mui-focused': {
                              boxShadow: '0 4px 20px rgba(102, 126, 234, 0.2)'
                            }
                          }
                        }}
                        onKeyDown={(e) => {
                          // Prevent the Delete key from clearing the time picker
                          if (e.key === "Delete") {
                            e.preventDefault();
                          }
                        }}
                      />
                    </Grid>
                  )}
                </Grid>
              </Grid>

              <Grid
                item
                xs={12}
                style={{
                  height: "100%",
                  transition: "all 0.3s ease"
                }}
              >
                <Grid key="otherSettings" container spacing={{ xs: 1, sm: 2 }}>
                  <Grid item xs={12}>
                    <CustomerSelect
                      register={register}
                      errors={errors}
                      setEntity={setCustomerID}
                      isCustomSelect={true}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <FormControlLabel
                      control={
                        <Controller
                          name={`IsBooker`}
                          control={control}
                          render={(props: any) => (
                            <Checkbox
                              checked={
                                isBooker == true
                                  ? true
                                  : false
                              }
                              onChange={(e) =>
                                setIsBooker(
                                  e.target
                                    .checked
                                )
                              }
                              sx={{
                                color: '#667eea',
                                '&.Mui-checked': {
                                  color: '#667eea',
                                },
                                '&:hover': {
                                  backgroundColor: 'rgba(102, 126, 234, 0.04)',
                                },
                                borderRadius: '8px',
                              }}
                            />
                          )}
                        />
                      }
                      label={intl.formatMessage({
                        id: "TextBookerInformation",
                      })}
                      sx={{
                        '& .MuiFormControlLabel-label': {
                          fontWeight: 500,
                          color: '#374151',
                        }
                      }}
                    />
                  </Grid>
                  {isBooker ? (
                    <>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          size="small"
                          fullWidth
                          id="BookerName"
                          label={intl.formatMessage({
                            id: "TextName",
                          })}
                          {...register(`BookerName`)}
                          margin="dense"
                          autoFocus
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: '12px',
                              transition: 'all 0.2s ease-in-out',
                              '&:hover': {
                                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                              },
                              '&.Mui-focused': {
                                boxShadow: '0 4px 20px rgba(102, 126, 234, 0.2)'
                              }
                            }
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          size="small"
                          fullWidth
                          id="BookerPhone"
                          label={intl.formatMessage({
                            id: "TextPhone",
                          })}
                          {...register(`BookerPhone`)}
                          margin="dense"
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: '12px',
                              transition: 'all 0.2s ease-in-out',
                              '&:hover': {
                                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                              },
                              '&.Mui-focused': {
                                boxShadow: '0 4px 20px rgba(102, 126, 234, 0.2)'
                              }
                            }
                          }}
                        />
                      </Grid>
                    </>
                  ) : null}
                  <Grid item xs={12}>
                    <FormControlLabel
                      control={
                        <Controller
                          name={`IsGuide`}
                          control={control}
                          render={(props: any) => (
                            <Checkbox
                              checked={
                                isGuide == true
                                  ? true
                                  : false
                              }
                              onChange={(e) =>
                                setIsGuide(
                                  e.target
                                    .checked
                                )
                              }
                              sx={{
                                color: '#667eea',
                                '&.Mui-checked': {
                                  color: '#667eea',
                                },
                                '&:hover': {
                                  backgroundColor: 'rgba(102, 126, 234, 0.04)',
                                },
                                borderRadius: '8px',
                              }}
                            />
                          )}
                        />
                      }
                      label={intl.formatMessage({
                        id: "TextGuideInformation",
                      })}
                      sx={{
                        '& .MuiFormControlLabel-label': {
                          fontWeight: 500,
                          color: '#374151',
                        }
                      }}
                    />
                  </Grid>

                  {isGuide ? (
                    <>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          size="small"
                          fullWidth
                          id="GuideName"
                          label={intl.formatMessage({
                            id: "TextName",
                          })}
                          {...register(`GuideName`)}
                          margin="dense"
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: '12px',
                              transition: 'all 0.2s ease-in-out',
                              '&:hover': {
                                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                              },
                              '&.Mui-focused': {
                                boxShadow: '0 4px 20px rgba(102, 126, 234, 0.2)'
                              }
                            }
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          size="small"
                          fullWidth
                          id="GuidePhone"
                          label={intl.formatMessage({
                            id: "TextPhone",
                          })}
                          {...register(`GuidePhone`)}
                          margin="dense"
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: '12px',
                              transition: 'all 0.2s ease-in-out',
                              '&:hover': {
                                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                              },
                              '&.Mui-focused': {
                                boxShadow: '0 4px 20px rgba(102, 126, 234, 0.2)'
                              }
                            }
                          }}
                        />
                      </Grid>
                    </>
                  ) : null}
                </Grid>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </LocalizationProvider>
      <Grid container spacing={{ xs: 2, sm: 3 }}>
        <Grid item xs={12}>
          <Card className="mb-4" elevation={0} sx={{
            background: 'linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)',
            borderRadius: "24px",
            border: '1px solid rgba(148, 163, 184, 0.1)',
            boxShadow: "0px 20px 40px rgba(0, 0, 0, 0.08), 0px 8px 16px rgba(0, 0, 0, 0.04)",
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
              boxShadow: "0px 24px 48px rgba(0, 0, 0, 0.12), 0px 12px 24px rgba(0, 0, 0, 0.06)",
              transform: 'translateY(-2px)'
            }
          }}>
            <CardContent sx={{ padding: { xs: "16px", sm: "24px", md: "32px" } }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                  marginBottom: "20px",
                  flexDirection: { xs: "column", sm: "row" },
                  gap: { xs: 2, sm: 0 }
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <div
                    style={{
                      width: "36px",
                      height: "36px",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      background: "#804fe6",
                      borderRadius: "18px",
                      color: "#ffffff",
                      boxShadow: "0px 8px 24px rgba(240, 147, 251, 0.25), 0px 4px 12px rgba(245, 87, 108, 0.15)"
                    }}
                  >
                    <CheckroomIcon
                      sx={{ fontSize: "28px" }}
                    />
                  </div>
                  <Typography
                    variant="h5"
                    sx={{
                      marginLeft: { xs: "0px", sm: "20px" },
                      marginTop: { xs: "8px", sm: "0px" },
                      fontWeight: 700,
                      color: "#1e293b",
                      fontSize: { xs: "1.25rem", sm: "1.5rem" },
                      letterSpacing: "-0.025em",
                      textAlign: { xs: "center", sm: "left" }
                    }}
                  >
                    {intl.formatMessage({
                      id: "TextRoomInformation",
                    })}
                  </Typography>
                </div>
                {/* Default Values Switcher */}
                <div className="flex items-center gap-2">
                  <p className="text-sm text-slate-600">
                    Auto Fill
                  </p>
                  <Switch
                    id="default-values-switch"
                    checked={useDefaultValues}
                    onCheckedChange={setUseDefaultValues}
                    className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:#804fe6 data-[state=checked]:#804fe6 data-[state=unchecked]:bg-slate-200 h-7 w-12"
                  />
                </div>
              </Box>
              {/* 
            <div
              style={{
                display: "flex",
                alignItems: "flex-end",
                flexWrap: "wrap",
                gap: "10px",
                marginBottom: "20px"
              }}
            >
              <div style={{ minWidth: "150px" }}>
                <RoomTypeSelect
                  register={register}
                  errors={errors}
                  onRoomTypeChange={setNewRoomTypeID}
                  RoomTypeID={
                    newRoomTypeID &&
                      newRoomTypeID.RoomTypeID
                      ? newRoomTypeID.RoomTypeID
                      : null
                  }
                />
              </div>
              <TextField
                label={intl.formatMessage({
                  id: "TextQuantity",
                })}
                type="number"
                margin="dense"
                size="small"
                style={{ width: "100px" }}
                value={newGroupCount}
                onChange={(e: any) => {
                  setNewGroupCount(e.target.value);
                }}
              />
              {/* ColorPicker moved to new-form.tsx */}
              {/*<Button
                variant="contained"
                onClick={() =>
                //@ts-ignore
                {
                  let tempValue = {
                    ...getValues(
                      //@ts-ignore
                      `TransactionDetail[0]`
                    ),
                  };
                  if (newRoomTypeID) {
                    tempValue.RoomTypeID =
                      newRoomTypeID.RoomTypeID;
                    tempValue.Adult =
                      newRoomTypeID.BaseAdult;
                    tempValue.Child =
                      newRoomTypeID.BaseChild;
                  }
                  tempValue.RoomID = null;
                  for (
                    let i = 0;
                    i < newGroupCount;
                    i++
                  ) {
                    append(tempValue);
                  }
                  setNewGroupCount(1);
                }
                }
                size="medium"
                sx={{
                  height: "44px",
                  minWidth: "160px",
                  boxShadow: "0px 4px 8px rgba(120, 86, 222, 0.2)",
                  backgroundColor: "#7856DE",
                  '&:hover': {
                    backgroundColor: "#6745c5"
                  },
                  borderRadius: "10px",
                  textTransform: "none",
                  fontWeight: 600
                }}
              >
                {intl.formatMessage({
                  id: "ButtonAddRoom",
                })}
              </Button>
            </div> */}

              {fields.map((field, index) => {
                // console.log('In new.tsx - resetField type:', typeof resetField);
                // console.log('In new.tsx - resetField value:', resetField);
                // console.log('In new.tsx - resetField properties:', Object.keys(resetField || {}));
                // console.log('In new.tsx - useForm methods:', { register, reset, handleSubmit, control, getValues, setValue, resetField });
                return (
                  <div key={index}>
                    <Divider sx={{ my: 2 }} />
                    <NewForm
                      id={index}
                      register={register}
                      control={control}
                      errors={errors}
                      getValues={getValues}
                      resetField={resetField}
                      setValue={setValue}
                      reset={reset}
                      field={field}
                      BaseAdult={BaseAdult}
                      BaseChild={BaseChild}
                      MaxAdult={MaxAdult}
                      MaxChild={MaxChild}
                      workingDate={workingDate}
                      remove={remove}
                      append={append}
                      BreakfastIncluded={BreakfastIncluded}
                      TaxIncluded={TaxIncluded}
                      setBreakfastIncluded={setBreakfastIncluded}
                      setTaxIncluded={setTaxIncluded}
                      ArrivalDate={ArrivalDate}
                      setArrivalDate={setArrivalDate}
                      DepartureDate={DepartureDate}
                      setDepartureDate={setDepartureDate}
                      CustomerID={CustomerID}
                      rateTypeData={rateTypeData}
                      setCurrency={setCurrency}
                      Currency={Currency}
                      useDefaultValues={useDefaultValues}
                    />
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card className="mb-4" elevation={0} sx={{
            borderRadius: "24px",
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            boxShadow: "0px 20px 40px rgba(102, 126, 234, 0.15), 0px 8px 16px rgba(118, 75, 162, 0.1)",
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
              boxShadow: "0px 24px 48px rgba(102, 126, 234, 0.2), 0px 12px 24px rgba(118, 75, 162, 0.15)",
              transform: 'translateY(-2px)'
            }
          }}>
            {/* <Card className="fixed right-4 top-6 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"> */}
            <CardContent sx={{ padding: { xs: "16px", sm: "24px", md: "32px" } }}>
              <Grid container spacing={{ xs: 2, sm: 3 }}>
                <Grid item xs={12} sm={4} md={4}>
                  <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", p: 1 }}>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: "rgba(255, 255, 255, 0.9)", mb: 1, fontSize: "0.875rem", letterSpacing: "0.05em" }}>
                      {intl.formatMessage({
                        id: "TextNights",
                      })}
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 800, color: "#ffffff", fontSize: "2rem" }}>
                      {nights}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={4} md={4}>
                  <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", p: 1, borderLeft: { md: "1px solid rgba(255, 255, 255, 0.2)" }, borderRight: { md: "1px solid rgba(255, 255, 255, 0.2)" } }}>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: "rgba(255, 255, 255, 0.9)", mb: 1, fontSize: "0.875rem", letterSpacing: "0.05em" }}>
                      {intl.formatMessage({
                        id: "ReportTotalRooms",
                      })}
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 800, color: "#ffffff", fontSize: "2rem" }}>
                      {fields.length}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={4} md={4}>
                  <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", p: 1 }}>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: "rgba(255, 255, 255, 0.9)", mb: 1, fontSize: "0.875rem", letterSpacing: "0.05em" }}>
                      {intl.formatMessage({
                        id: "ReportTotalCharge",
                      })}
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 800, color: "#ffffff", fontSize: "2rem" }}>
                      {formatPrice(totalAmount)}₮
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card
            className="mb-4"
            key={"Payment"}
            elevation={0}
            sx={{
              display: "none",
              borderRadius: "24px",
              background: 'linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)',
              border: '1px solid rgba(148, 163, 184, 0.1)',
              boxShadow: "0px 20px 40px rgba(0, 0, 0, 0.08), 0px 8px 16px rgba(0, 0, 0, 0.04)",
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              '&:hover': {
                boxShadow: "0px 24px 48px rgba(0, 0, 0, 0.12), 0px 12px 24px rgba(0, 0, 0, 0.06)",
                transform: 'translateY(-2px)'
              }
            }}
          >
            <CardContent sx={{ padding: "32px" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <div
                    style={{
                      width: "56px",
                      height: "56px",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      background: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
                      borderRadius: "18px",
                      color: "#ffffff",
                      boxShadow: "0px 8px 24px rgba(79, 172, 254, 0.25), 0px 4px 12px rgba(0, 242, 254, 0.15)"
                    }}
                  >
                    <ReceiptIcon
                      sx={{ fontSize: "28px" }}
                    />
                  </div>
                  <Typography
                    variant="h5"
                    sx={{
                      marginLeft: { xs: "0px", sm: "20px" },
                      marginTop: { xs: "8px", sm: "0px" },
                      fontWeight: 700,
                      color: "#1e293b",
                      fontSize: { xs: "1.25rem", sm: "1.5rem" },
                      letterSpacing: "-0.025em",
                      textAlign: { xs: "center", sm: "left" }
                    }}
                  >
                    {intl.formatMessage({
                      id: "TextPayment",
                    })}
                  </Typography>
                </div>
              </div>
              <br />
              <Grid key="Payment" container spacing={{ xs: 1, sm: 2 }}>
                <Grid item xs={12} sm={6}>
                  <div
                    style={{
                      padding: "32px",
                      borderRadius: "20px",
                      gap: "50px",
                      border: "1px solid rgba(148, 163, 184, 0.15)",
                      boxShadow: "0px 12px 24px rgba(0, 0, 0, 0.08), 0px 4px 8px rgba(0, 0, 0, 0.04)",
                      height: "100%",
                      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                      background: "linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)"
                    }}
                  >
                    <Grid container spacing={{ xs: 1, sm: 2 }}>
                      <Grid item xs={12}>
                        <ReservationTypeSelect
                          register={register}
                          errors={errors}
                          reset={reset}
                          customRegisterName={`ReservationTypeID`}
                          ReservationTypeID={
                            ReservationTypeID
                          }
                          setReservationTypeID={
                            setReservationTypeID
                          }
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <FormControlLabel
                          control={
                            <Controller
                              name={`BreakfastIncluded`}
                              control={control}
                              render={(
                                props: any
                              ) => (
                                <Checkbox
                                  {...register(
                                    `BreakfastIncluded`
                                  )}
                                  checked={
                                    BreakfastIncluded ==
                                      true
                                      ? true
                                      : false
                                  }
                                  onChange={(e) =>
                                    setBreakfastIncluded(
                                      e.target
                                        .checked
                                    )
                                  }
                                  sx={{
                                    color: '#667eea',
                                    '&.Mui-checked': {
                                      color: '#667eea',
                                    },
                                    '&:hover': {
                                      backgroundColor: 'rgba(102, 126, 234, 0.04)',
                                    },
                                    borderRadius: '8px',
                                  }}
                                />
                              )}
                            />
                          }
                          label={intl.formatMessage({
                            id: "RowHeaderBreakfastIncluded",
                          })}
                          sx={{
                            '& .MuiFormControlLabel-label': {
                              fontWeight: 500,
                              color: '#374151',
                            }
                          }}
                        />
                        <FormControlLabel
                          control={
                            <Controller
                              name={`TaxIncluded`}
                              control={control}
                              render={(
                                props: any
                              ) => (
                                <Checkbox
                                  {...register(
                                    `TaxIncluded`
                                  )}
                                  checked={
                                    TaxIncluded ==
                                      true
                                      ? true
                                      : false
                                  }
                                  onChange={(e) =>
                                    setTaxIncluded(
                                      e.target
                                        .checked
                                    )
                                  }
                                  sx={{
                                    color: '#667eea',
                                    '&.Mui-checked': {
                                      color: '#667eea',
                                    },
                                    '&:hover': {
                                      backgroundColor: 'rgba(102, 126, 234, 0.04)',
                                    },
                                    borderRadius: '8px',
                                  }}
                                />
                              )}
                            />
                          }
                          label={intl.formatMessage({
                            id: "TextTaxIncluded",
                          })}
                          sx={{
                            '& .MuiFormControlLabel-label': {
                              fontWeight: 500,
                              color: '#374151',
                            }
                          }}
                        />
                      </Grid>

                      <Grid item xs={12}>
                        <FormControlLabel
                          control={
                            <Controller
                              name={`ReservationSourceChecked`}
                              control={control}
                              render={(
                                props: any
                              ) => (
                                <Checkbox
                                  checked={
                                    ReservationSourceChecked ==
                                      true
                                      ? true
                                      : false
                                  }
                                  onChange={(e) =>
                                    setReservationSourceChecked(
                                      e.target
                                        .checked
                                    )
                                  }
                                />
                              )}
                            />
                          }
                          label={intl.formatMessage({
                            id: "TextReservationSource",
                          })}
                        />
                      </Grid>

                      {ReservationSourceChecked ? (
                        <Grid item xs={12}>
                          <ReservationSourceSelect
                            register={register}
                            errors={errors}
                            ChannelID={2}
                          />
                        </Grid>
                      ) : (
                        <></>
                      )}

                      <Grid item xs={12} sm={4} md={4}>
                        <Typography
                          variant="caption"
                          gutterBottom
                        >
                          {intl.formatMessage({
                            id: "TextNights",
                          })}
                          : {nights}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={4} md={4}>
                        <Typography
                          variant="caption"
                          gutterBottom
                        >
                          {intl.formatMessage({
                            id: "ReportTotalRooms",
                          })}
                          : {fields.length}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={4} md={4}>
                        <Typography
                          variant="caption"
                          gutterBottom
                        >
                          {intl.formatMessage({
                            id: "ReportTotalCharge",
                          })}
                          : {formatPrice(totalAmount)}
                        </Typography>
                      </Grid>
                    </Grid>
                  </div>
                </Grid>
                <Grid item xs={12}>
                  <Grid container spacing={{ xs: 1, sm: 2 }}>
                    <Grid item xs={12} sm={6}>
                      <PaymentMethodSelect
                        register={register}
                        errors={errors}
                        customRegisterName={`PaymentMethodID`}
                        PaymentMethodID={
                          PaymentMethodID
                        }
                        setPaymentMethodID={
                          setPaymentMethodID
                        }
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <CurrencySelect
                        register={register}
                        errors={errors}
                        nameKey={`PayCurrencyID`}
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <TextField
                        id={`PayAmount`}
                        label={intl.formatMessage({
                          id: "TextAmount",
                        })}
                        type="number"
                        {...register(`PayAmount`)}
                        margin="dense"
                        size="small"
                        style={{
                          width: "100%",
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <ReferenceSelect
                        register={register}
                        errors={errors}
                        type="BillingInfo"
                        label={intl.formatMessage({
                          id: "TextBillingInformation",
                        })}
                        optionValue="BillingID"
                        optionLabel="BillingName"
                        customField="GroupBillTo"
                        entity={billingInfo}
                        setEntity={setBillingInfo}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        size="small"
                        fullWidth
                        id="Remarks"
                        label={intl.formatMessage({
                          id: "TextSetMessage",
                        })}
                        {...register(`Remarks`)}
                        margin="dense"
                        multiline
                        maxRows={3}
                      />
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </NewEditForm>
  );
};

export default NewEdit;
