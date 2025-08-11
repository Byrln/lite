import { Controller } from "react-hook-form";
import {
  Grid,
  TextField,
  Tooltip,
  IconButton,
  Typography,
  Box,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { useIntl } from "react-intl";

import { useEffect, useState } from "react";
import NumberSelect from "components/select/number-select";

import RoomTypeSelect from "components/select/room-type";
import RoomSelect from "components/select/room-select";
import RoomRateTypeSelect from "components/select/room-rate-type";
import CurrencyAmount from "components/reservation/currency-amount";
import GuestSelect from "components/select/guest-select";
import CountrySelect from "components/select/country";
import VipStatusSelect from "components/select/vip-status";

import { countNights } from "lib/utils/format-time";
import ColorPicker from "@/components/select/color";
import { generateIncrementedId } from "../../new-calendar/test2";



const NewEdit = ({
  id,
  register,
  control,
  errors,
  getValues,
  resetField,
  setValue,
  reset,
  field,
  BaseAdult,
  BaseChild,
  MaxAdult,
  MaxChild,
  remove,
  append,
  TaxIncluded,
  BreakfastIncluded,
  setBreakfastIncluded,
  setTaxIncluded,
  ArrivalDate,
  setArrivalDate,
  DepartureDate,
  setDepartureDate,
  CustomerID,
  rateTypeData,
  Currency,
  setCurrency,
  useDefaultValues,
}: any) => {
  const [RoomTypeID, setRoomTypeID]: any = useState("");
  const [RoomType, setRoomType]: any = useState("");
  const [RoomID, setRoomID]: any = useState("");
  const [Rate, setRate]: any = useState("");
  const [Nights, setNights]: any = useState("");
  const [currencyAmount, setCurrencyAmount]: any = useState("");
  // const [Currency, setCurrency]: any = useState("");
  const [selectedGuest, setSelectedGuest]: any = useState(null);
  const [ReservationTypeID, setReservationTypeID]: any = useState(1);
  const [selectedAdult, setSelectedAdult]: any = useState(1);
  const [selectedChild, setSelectedChild]: any = useState(0);
  const [country, setCountry]: any = useState(null);
  const [vip, setVip]: any = useState(null);
  const intl = useIntl();

  const setRange = (dateStart: Date, dateEnd: Date) => {
    var nights: number;
    nights = countNights(dateStart, dateEnd);

    setNights(nights);
    // console.log('In setRange - resetField type:', typeof resetField);
    // console.log('In setRange - reset type:', typeof reset);
    // console.log('In setRange - setValue type:', typeof setValue);
    // console.log('In setRange - id value:', id);

    try {
      // First try resetField if available
      if (typeof resetField === 'function') {
        // console.log(`Attempting to call resetField with TransactionDetail.${id}.Nights`);
        resetField(`TransactionDetail.${id}.Nights`, {
          defaultValue: nights,
        });
        // console.log('resetField call completed successfully');
      }
      else if (typeof setValue === 'function') {
        // console.log(`Falling back to setValue for TransactionDetail[${id}].Nights`);
        setValue(`TransactionDetail[${id}].Nights`, nights);
        // console.log('setValue call completed successfully');
      } else {
        console.error('Neither resetField nor setValue is a function');
      }
    } catch (error) {
      console.error('Error setting field value:', error);
      try {
        if (typeof setValue === 'function') {
          setValue(`TransactionDetail[${id}].Nights`, nights);
        }
      } catch (innerError) {
        console.error('Fallback setValue also failed:', innerError);
      }
    }
  };

  useEffect(() => {
    if (ArrivalDate && DepartureDate) {
      setRange(ArrivalDate, DepartureDate);
    }
  }, [ArrivalDate, DepartureDate]);

  useEffect(() => {
    if (useDefaultValues) {
      const currentValues = getValues();
      const currentDetail = currentValues?.TransactionDetail?.[id];
      const adultValue = RoomType?.BaseAdult || BaseAdult || 1;
      const childValue = RoomType?.BaseChild || BaseChild || 0;

      if (!currentDetail?.Adult || currentDetail.Adult === 0) {
        setSelectedAdult(adultValue);
        if (typeof setValue === 'function') {
          setValue(`TransactionDetail[${id}].Adult`, adultValue);
        }
      }

      if (!currentDetail?.Child || currentDetail.Child === 0) {
        setSelectedChild(childValue);
        if (typeof setValue === 'function') {
          setValue(`TransactionDetail[${id}].Child`, childValue);
        }
      }

      if (typeof setValue === 'function') {
        if (!currentDetail?.Name) {
          const generateUniqueGuestId = () => {
            if (id === 0) {
              try {
                const allValues = getValues();
                if (allValues && allValues.TransactionDetail) {
                  for (let i = 0; i < allValues.TransactionDetail.length; i++) {
                    if (i !== id && allValues.TransactionDetail[i]?.Name === "Зочин") {
                      return generateIncrementedId(2, 0, (proposedId) => {
                        const proposedName = `Зочин ${proposedId}`;
                        for (let j = 0; j < allValues.TransactionDetail.length; j++) {
                          if (j !== id && allValues.TransactionDetail[j]?.Name === proposedName) {
                            return true;
                          }
                        }
                        return false;
                      });
                    }
                  }
                }
              } catch (error) {
                return "";
              }
              return ""; // Return empty string for first guest
            } else {
              return generateIncrementedId(2, 0, (proposedId) => {
                const proposedName = `Зочин ${proposedId}`;
                try {
                  const allValues = getValues();
                  if (allValues && allValues.TransactionDetail) {
                    for (let i = 0; i < allValues.TransactionDetail.length; i++) {
                      if (i !== id && allValues.TransactionDetail[i]?.Name === proposedName) {
                        return true;
                      }
                    }
                  }
                } catch (error) {
                  return false;
                }
                return false;
              });
            }
          };
          const uniqueGuestId = generateUniqueGuestId();
          setValue(`TransactionDetail[${id}].Name`, uniqueGuestId === "" ? "Зочин" : `Зочин ${uniqueGuestId}`);
        }

        if (!currentDetail?.GuestDetail?.Email) {
          setValue(`TransactionDetail[${id}].GuestDetail.Email`, '');
        }
        if (!currentDetail?.GuestDetail?.Mobile) {
          setValue(`TransactionDetail[${id}].GuestDetail.Mobile`, '');
        }
        if (!currentDetail?.GuestDetail?.Name) {
          setValue(`TransactionDetail[${id}].GuestDetail.Name`, 'Guest');
        }
        if (!currentDetail?.GuestDetail?.Surname) {
          setValue(`TransactionDetail[${id}].GuestDetail.Surname`, '');
        }
        if (!currentDetail?.GuestDetail?.CountryID) {
          setValue(`TransactionDetail[${id}].GuestDetail.CountryID`, 0);
        }
        if (!currentDetail?.GuestDetail?.VipStatusID) {
          setValue(`TransactionDetail[${id}].GuestDetail.VipStatusID`, 0);
        }
        if (!currentDetail?.GuestDetail?.GuestTitleID) {
          setValue(`TransactionDetail[${id}].GuestDetail.GuestTitleID`, 0);
        }
        if (!currentDetail?.GuestDetail?.GenderID) {
          setValue(`TransactionDetail[${id}].GuestDetail.GenderID`, 0);
        }
        if (!currentDetail?.GuestDetail?.RegistryNo) {
          setValue(`TransactionDetail[${id}].GuestDetail.RegistryNo`, '');
        }
      }
    }
  }, [useDefaultValues, RoomType, BaseAdult, BaseChild, id, setValue, getValues]);

  useEffect(() => {
    if (getValues(`TransactionDetail[${id}]`)) {
      if (getValues(`TransactionDetail[${id}].RoomTypeID`)) {
        setRoomTypeID(getValues(`TransactionDetail[${id}].RoomTypeID`));
      } else if (field && field.RoomTypeID) {
        setRoomTypeID(field.RoomTypeID);

        try {
          if (typeof resetField === 'function') {
            resetField(`TransactionDetail.${id}.RoomTypeID`, {
              defaultValue: field.RoomTypeID,
            });
          }
          else if (typeof setValue === 'function') {
            setValue(`TransactionDetail[${id}].RoomTypeID`, field.RoomTypeID);
          } else {
            console.error('Neither resetField nor setValue is a function in RoomTypeID useEffect');
          }
        } catch (error) {
          console.error('Error setting RoomTypeID field value:', error);
          try {
            if (typeof setValue === 'function') {
              setValue(`TransactionDetail[${id}].RoomTypeID`, field.RoomTypeID);
            }
          } catch (innerError) {
            console.error('Fallback setValue for RoomTypeID also failed:', innerError);
          }
        }
      }

      if (getValues(`TransactionDetail[${id}].RoomID`)) {
        setRoomID(Number(getValues(`TransactionDetail[${id}].RoomID`)));
      } else if (field && field.RoomID) {
        setRoomID(field.RoomID);

        try {
          if (typeof resetField === 'function') {
            resetField(`TransactionDetail.${id}.RoomID`, {
              defaultValue: field.RoomID,
            });
          }
          else if (typeof setValue === 'function') {
            setValue(`TransactionDetail[${id}].RoomID`, field.RoomID);
          } else {
            console.error('Neither resetField nor setValue is a function in RoomID useEffect');
          }
        } catch (error) {
          console.error('Error setting RoomID field value:', error);
          try {
            if (typeof setValue === 'function') {
              setValue(`TransactionDetail[${id}].RoomID`, field.RoomID);
            }
          } catch (innerError) {
            console.error('Fallback setValue for RoomID also failed:', innerError);
          }
        }
      }

      if (getValues(`TransactionDetail[${id}].RateTypeID`)) {
        var rate = null;
        if (rateTypeData) {
          for (var r of rateTypeData) {
            if (
              r.RateTypeID ===
              getValues(`TransactionDetail[${id}].RateTypeID`)
            ) {
              rate = r;
              break;
            }
          }
          if (rate) {
            setRate(rate);

            try {
              if (typeof resetField === 'function') {
                resetField(`TransactionDetail.${id}.RateTypeID`, {
                  defaultValue: rate.RateTypeID,
                });
              }
              else if (typeof setValue === 'function') {
                setValue(`TransactionDetail[${id}].RateTypeID`, rate.RateTypeID);
              } else {
                console.error('Neither resetField nor setValue is a function in RateTypeID section');
              }
            } catch (error) {
              console.error('Error setting RateTypeID field value:', error);
              try {
                if (typeof setValue === 'function') {
                  setValue(`TransactionDetail[${id}].RateTypeID`, rate.RateTypeID);
                }
              } catch (innerError) {
                console.error('Fallback setValue for RateTypeID also failed:', innerError);
              }
            }

            if (rate.BreakfastIncluded && setBreakfastIncluded) {
              setBreakfastIncluded(rate.BreakfastIncluded);
            }
            if (rate.TaxIncluded && setTaxIncluded) {
              setTaxIncluded(rate.TaxIncluded);
            }
          }
        }
      } else {
        if (rateTypeData) {
          setRate(rateTypeData[0]);

          try {
            if (typeof resetField === 'function') {
              resetField(`TransactionDetail.${id}.RateTypeID`, {
                defaultValue: rateTypeData[0].RateTypeID,
              });
            }
            else if (typeof setValue === 'function') {
              setValue(`TransactionDetail[${id}].RateTypeID`, rateTypeData[0].RateTypeID);
            } else {
              console.error('Neither resetField nor setValue is a function in default RateTypeID section');
            }
          } catch (error) {
            console.error('Error setting default RateTypeID field value:', error);
            try {
              if (typeof setValue === 'function') {
                setValue(`TransactionDetail[${id}].RateTypeID`, rateTypeData[0].RateTypeID);
              }
            } catch (innerError) {
              console.error('Fallback setValue for default RateTypeID also failed:', innerError);
            }
          }

          if (
            rateTypeData[0].BreakfastIncluded &&
            setBreakfastIncluded
          ) {
            setBreakfastIncluded(rateTypeData[0].BreakfastIncluded);
          }
          if (rateTypeData[0].TaxIncluded && setTaxIncluded) {
            setTaxIncluded(rateTypeData[0].TaxIncluded);
          }
        }
      }
      if (getValues(`TransactionDetail[${id}].CurrencyAmount`)) {
        setCurrencyAmount(
          Number(getValues(`TransactionDetail[${id}].CurrencyAmount`))
        );

        try {
          if (typeof resetField === 'function') {
            resetField(`TransactionDetail.${id}.CurrencyAmount`, {
              defaultValue: getValues(
                `TransactionDetail[${id}].CurrencyAmount`
              ),
            });
          }
          else if (typeof setValue === 'function') {
            setValue(`TransactionDetail[${id}].CurrencyAmount`, getValues(
              `TransactionDetail[${id}].CurrencyAmount`
            ));
          } else {
            console.error('Neither resetField nor setValue is a function in CurrencyAmount section');
          }
        } catch (error) {
          console.error('Error setting CurrencyAmount field value:', error);
          try {
            if (typeof setValue === 'function') {
              setValue(`TransactionDetail[${id}].CurrencyAmount`, getValues(
                `TransactionDetail[${id}].CurrencyAmount`
              ));
            }
          } catch (innerError) {
            console.error('Fallback setValue for CurrencyAmount also failed:', innerError);
          }
        }
      }

      if (getValues(`TransactionDetail[${id}].CurrencyID`)) {
        setCurrency({
          CurrencyID: Number(
            getValues(`TransactionDetail[${id}].CurrencyID`)
          ),
        });
      }
      if (getValues(`TransactionDetail[${id}].BreakfastIncluded`)) {
        setBreakfastIncluded(
          getValues(`TransactionDetail[${id}].BreakfastIncluded`)
        );
      }
      if (getValues(`TransactionDetail[${id}].ReservationTypeID`)) {
        setReservationTypeID(
          Number(
            getValues(`TransactionDetail[${id}].ReservationTypeID`)
          )
        );
      }

      if (getValues(`TransactionDetail[${id}].GuestName`)) {
        setSelectedGuest({
          value: Number(
            Number(getValues(`TransactionDetail[${id}].GuestID`))
          ),
          label: getValues(`TransactionDetail[${id}].GuestName`),
        });
      }

      if (getValues(`TransactionDetail.${id}.GuestDetail.CountryID`)) {
        setCountry({
          CountryID: getValues(
            `TransactionDetail.${id}.GuestDetail.CountryID`
          ),
        });
      }

      if (getValues(`TransactionDetail.${id}.GuestDetail.VipStatusID`)) {
        setVip({
          VipStatusID: getValues(
            `TransactionDetail.${id}.GuestDetail.VipStatusID`
          ),
        });
      }

      if (id > 0) {
        let tempRoomType: any = {};
        let baseAdult = 0;
        let baseChild = 0;
        if (getValues(`TransactionDetail[${id}].Adult`)) {
          baseAdult = getValues(`TransactionDetail[${id}].Adult`);
          setSelectedAdult(
            getValues(`TransactionDetail[${id}].Adult`)
          );
        }

        if (getValues(`TransactionDetail[${id}].Child`)) {
          baseChild = getValues(`TransactionDetail[${id}].Child`);
          setSelectedChild(
            getValues(`TransactionDetail[${id}].Child`)
          );
        }
        tempRoomType.BaseAdult = baseAdult;
        tempRoomType.BaseChild = baseChild;

        setRoomType(tempRoomType);
      } else {
        setRoomType({
          BaseAdult: BaseAdult,
          BaseChild: BaseChild,
          MaxAdult: MaxAdult,
          MaxChild: MaxChild,
        });
      }
    } else {
      if (rateTypeData) {
        setRate(rateTypeData[0]);

        try {
          if (typeof resetField === 'function') {
            resetField(`TransactionDetail.${id}.RateTypeID`, {
              defaultValue: rateTypeData[0].RateTypeID,
            });
          }
          else if (typeof setValue === 'function') {
            setValue(`TransactionDetail[${id}].RateTypeID`, rateTypeData[0].RateTypeID);
          } else {
            console.error('Neither resetField nor setValue is a function in else block RateTypeID section');
          }
        } catch (error) {
          console.error('Error setting RateTypeID field value in else block:', error);
          try {
            if (typeof setValue === 'function') {
              setValue(`TransactionDetail[${id}].RateTypeID`, rateTypeData[0].RateTypeID);
            }
          } catch (innerError) {
            console.error('Fallback setValue for RateTypeID in else block also failed:', innerError);
          }
        }

        if (rateTypeData[0].BreakfastIncluded && setBreakfastIncluded) {
          setBreakfastIncluded(rateTypeData[0].BreakfastIncluded);
        }
        if (rateTypeData[0].TaxIncluded && setTaxIncluded) {
          setTaxIncluded(rateTypeData[0].TaxIncluded);
        }
      }
    }
  }, [id, rateTypeData, resetField, setValue]);

  const onRoomTypeChange = (rt: any, index?: number) => {
    setRoomTypeID(rt.RoomTypeID);
    setRoomType(rt);
    // resetField(`TransactionDetail.${id}.Adult`, {
    //     defaultValue: rt.BaseAdult,
    // });
    // resetField(`TransactionDetail.${id}.Child`, {
    //     defaultValue: rt.BaseChild,
    // });
  };
  const onRoomChange = (r: any, index: any) => {
    setRoomID(r.RoomID);
  };

  const onAdultChange = (evt: any) => {
    setSelectedAdult(evt.target.value);

    try {
      if (typeof resetField === 'function') {
        resetField(`TransactionDetail.${id}.Adult`, {
          defaultValue: evt.target.value,
        });
      }
      else if (typeof setValue === 'function') {
        setValue(`TransactionDetail[${id}].Adult`, evt.target.value);
      } else {
        console.error('Neither resetField nor setValue is a function in onAdultChange');
      }
    } catch (error) {
      console.error('Error setting Adult field value:', error);
      try {
        if (typeof setValue === 'function') {
          setValue(`TransactionDetail[${id}].Adult`, evt.target.value);
        }
      } catch (innerError) {
        console.error('Fallback setValue for Adult also failed:', innerError);
      }
    }
  };

  const onChildChange = (evt: any) => {

    setSelectedChild(evt.target.value);

    try {
      if (typeof resetField === 'function') {
        resetField(`TransactionDetail.${id}.Child`, {
          defaultValue: evt.target.value,
        });
        console.log('resetField call for Child completed successfully');
      }
      else if (typeof setValue === 'function') {
        setValue(`TransactionDetail[${id}].Child`, evt.target.value);
      } else {
        console.error('Neither resetField nor setValue is a function in onChildChange');
      }
    } catch (error) {
      console.error('Error setting Child field value:', error);
      try {
        if (typeof setValue === 'function') {
          setValue(`TransactionDetail[${id}].Child`, evt.target.value);
        }
      } catch (innerError) {
        console.error('Fallback setValue for Child also failed:', innerError);
      }
    }
  };
  return (
    <Box sx={{ width: "100%" }}>
      <Grid key={id} container spacing={1}>
        <div>
          <input
            type="hidden"
            {...register(`TransactionDetail.${id}.Nights`)}
            name={`TransactionDetail.${id}.Nights`}
          />
          <input
            type="hidden"
            {...register(`TransactionDetail.${id}.Amount`)}
            name={`TransactionDetail.${id}.Amount`}
          />
          <input
            type="hidden"
            {...register(`TransactionDetail.${id}.RateModeID`)}
            name={`TransactionDetail.${id}.RateModeID`}
            value={1}
          />
          <input
            type="hidden"
            {...register(`TransactionDetail.${id}.IsReserved`)}
            name={`TransactionDetail.${id}.IsReserved`}
            value={true}
          />
          <input
            type="hidden"
            {...register(`TransactionDetail.${id}.IsCheckIn`)}
            name={`TransactionDetail.${id}.IsCheckIn`}
            value={false}
          />
          <input
            type="hidden"
            {...register(
              `TransactionDetail.${id}.DurationEnabled`
            )}
            name={`TransactionDetail.${id}.DurationEnabled`}
            value={true}
          />
          <input
            type="hidden"
            {...register(
              `TransactionDetail.${id}.ReservationSourceID`
            )}
            name={`TransactionDetail.${id}.ReservationSourceID`}
            value={1}
          />
          <input
            type="hidden"
            {...register(`TransactionDetail.${id}.ArrivalDate`)}
            name={`TransactionDetail.${id}.ArrivalDate`}
          />
          <input
            type="hidden"
            {...register(
              `TransactionDetail.${id}.DepartureDate`
            )}
            name={`TransactionDetail.${id}.DepartureDate`}
          />
          <input
            type="hidden"
            {...register(
              `TransactionDetail.${id}.ReservationSourceID`
            )}
            name={`TransactionDetail.${id}.ReservationSourceID`}
            value={1}
          />
          <input
            type="hidden"
            {...register(`TransactionDetail.${id}.GuestID`)}
            name={`TransactionDetail.${id}.GuestID`}
            value={
              selectedGuest &&
                selectedGuest.value &&
                selectedGuest.value != "createNew"
                ? selectedGuest.value
                : null
            }
          />
          <input
            type="hidden"
            {...register(
              `TransactionDetail.${id}.GuestDetail.GuestTitleID`
            )}
            name={`TransactionDetail.${id}.GuestDetail.GuestTitleID`}
            value={null}
          />
          <input
            type="hidden"
            {...register(
              `TransactionDetail.${id}.GuestDetail.GenderID`
            )}
            name={`TransactionDetail.${id}.GuestDetail.GenderID`}
            value={null}
          />
          <input
            type="hidden"
            {...register(
              `TransactionDetail.${id}.GuestDetail.CountryID`
            )}
            name={`TransactionDetail.${id}.GuestDetail.CountryID`}
            value={country?.CountryID || null}
          />
          <input
            type="hidden"
            {...register(
              `TransactionDetail.${id}.GuestDetail.VipStatusID`
            )}
            name={`TransactionDetail.${id}.GuestDetail.VipStatusID`}
            value={vip?.VipStatusID || null}
          />
        </div>
        <Grid item xs={12}>
          <Typography variant="caption" gutterBottom>
            {intl.formatMessage({
              id: "TextRoom",
            })}{" "}
            {generateIncrementedId(id, 1)}
          </Typography>
        </Grid>
        <Grid item xs={6} sm={6} md={4}>
          <RoomTypeSelect
            register={register}
            errors={errors}
            onRoomTypeChange={onRoomTypeChange}
            customRegisterName={`TransactionDetail.${id}.RoomTypeID`}
            baseStay={{ RoomTypeID: RoomTypeID }}
            RoomTypeID={RoomTypeID}
            customError={
              errors &&
              errors?.TransactionDetail &&
              errors.TransactionDetail[id] &&
              errors.TransactionDetail[id].RoomTypeID &&
              errors.TransactionDetail[id].RoomTypeID.message
            }
            helperText={
              errors &&
              errors?.TransactionDetail &&
              errors.TransactionDetail[id] &&
              errors.TransactionDetail[id].RoomTypeID &&
              errors.TransactionDetail[id].RoomTypeID.message
            }
          />
        </Grid>
        {RoomTypeID && (
          <>
            <Grid item xs={6} sm={3} md={2}>
              <RoomSelect
                register={register}
                errors={errors}
                DepartureDate={DepartureDate}
                RoomTypeID={RoomTypeID}
                onRoomChange={onRoomChange}
                customRegisterName={`TransactionDetail.${id}.RoomID`}
                TransactionID={""}
                ArrivalDate={ArrivalDate}
                RoomID={RoomID}
              />
            </Grid>

            <Grid item xs={6} sm={3} md={2}>
              <RoomRateTypeSelect
                register={register}
                errors={errors}
                reset={reset}
                customRegisterName={`TransactionDetail.${id}.RateTypeID`}
                RoomTypeID={RoomTypeID}
                setRate={setRate}
                Rate={Rate}
                setBreakfastIncluded={setBreakfastIncluded}
                setTaxIncluded={setTaxIncluded}
                id={id}
                resetField={resetField}
                initialValues={getValues(
                  `TransactionDetail[${id}]`
                )}
              />
            </Grid>

            <Grid item xs={6} sm={6} md={4}>
              <CurrencyAmount
                register={register}
                errors={errors}
                reset={reset}
                ArrivalDate={ArrivalDate}
                RoomTypeID={RoomTypeID}
                RateTypeID={Rate && Rate.RateTypeID}
                TaxIncluded={TaxIncluded}
                Nights={Nights}
                setCurrencyAmount={setCurrencyAmount}
                currencyAmount={currencyAmount}
                resetField={resetField}
                id={id}
                setCurrency={setCurrency}
                Currency={Currency}
                control={control}
                Controller={Controller}
                selectedAdult={selectedAdult}
                selectedChild={selectedChild}
                rateCurrencyID={Rate.CurrencyID}
                getValues={getValues}
                isRoomList={true}
                CustomerID={CustomerID}
                ContractRate={Rate.ContractRate}
              />
            </Grid>
            <Grid item xs={6} sm={3} md={2}>
              <NumberSelect
                numberMin={1}
                numberMax={
                  RoomType?.MaxAdult
                    ? RoomType?.MaxAdult
                    : 10
                }
                defaultValue={useDefaultValues ? (RoomType?.BaseAdult || BaseAdult) : RoomType?.BaseAdult}
                value={selectedAdult}
                nameKey={`TransactionDetail.${id}.Adult`}
                register={register}
                errors={errors}
                customError={
                  errors &&
                  errors?.TransactionDetail &&
                  errors.TransactionDetail[id] &&
                  errors.TransactionDetail[id].Adult &&
                  errors.TransactionDetail[id].Adult
                    .message
                }
                customHelperText={
                  errors &&
                  errors?.TransactionDetail &&
                  errors.TransactionDetail[id] &&
                  errors.TransactionDetail[id].Adult &&
                  errors.TransactionDetail[id].Adult
                    .message
                }
                label={intl.formatMessage({
                  id: "TextAdult",
                })}
                onChange={onAdultChange}
              />
            </Grid>

            <Grid item xs={6} sm={3} md={2}>
              <NumberSelect
                numberMin={0}
                numberMax={
                  RoomType?.MaxChild
                    ? RoomType?.MaxChild
                    : 5
                }
                defaultValue={useDefaultValues ? (RoomType?.BaseChild || BaseChild || 0) : (RoomType?.BaseChild || 0)}
                value={selectedChild}
                nameKey={`TransactionDetail.${id}.Child`}
                register={register}
                errors={errors}
                label={intl.formatMessage({
                  id: "TextChild",
                })}
                onChange={onChildChange}
              />
            </Grid>

            <Grid item xs={6} sm={6} md={4}>
              <TextField
                size="small"
                fullWidth
                id="Name"
                label={intl.formatMessage({
                  id: "TextName",
                })}
                {...register(
                  `TransactionDetail.${id}.Name`
                )}
                margin="dense"
                autoFocus
                error={
                  errors &&
                  errors?.TransactionDetail &&
                  errors.TransactionDetail[id] &&
                  errors.TransactionDetail[id].Name &&
                  errors.TransactionDetail[id].Name
                    .message
                }
                helperText={
                  errors &&
                  errors?.TransactionDetail &&
                  errors.TransactionDetail[id] &&
                  errors.TransactionDetail[id].Name &&
                  errors.TransactionDetail[id].Name
                    .message
                }
              />
              {/* <GuestSelect
                            register={register}
                            errors={errors}
                            onRoomTypeChange={onRoomTypeChange}
                            customRegisterName={`TransactionDetail.${id}.GuestName`}
                            baseStay={{ RoomTypeID: RoomTypeID }}
                            RoomTypeID={RoomTypeID}
                            resetField={resetField}
                            control={control}
                            field={field}
                            selectedGuest={selectedGuest}
                            setSelectedGuest={setSelectedGuest}
                            id={id}
                            customError={
                                errors &&
                                errors?.TransactionDetail &&
                                errors.TransactionDetail[id] &&
                                errors.TransactionDetail[id].GuestName &&
                                errors.TransactionDetail[id].GuestName.message
                            }
                            customHelperText={
                                errors &&
                                errors?.TransactionDetail &&
                                errors.TransactionDetail[id] &&
                                errors.TransactionDetail[id].GuestName &&
                                errors.TransactionDetail[id].GuestName.message
                            }
                        /> */}
            </Grid>

            <Grid item xs={6} sm={6} md={4}>
              <TextField
                size="small"
                fullWidth
                id="Email"
                label={intl.formatMessage({
                  id: "TextEmail",
                })}
                type="email"
                {...register(
                  `TransactionDetail.${id}.GuestDetail.Email`
                )}
                margin="dense"
              />
            </Grid>

            <Grid item xs={6} sm={6} md={4}>
              <TextField
                size="small"
                fullWidth
                id="Mobile"
                label={intl.formatMessage({
                  id: "TextMobile",
                })}
                {...register(
                  `TransactionDetail.${id}.GuestDetail.Mobile`
                )}
                margin="dense"
              />
            </Grid>

            <Grid
              item
              xs={6}
              sm={6}
              md={4}
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center"
              }}
            >
              <Tooltip title="Duplicate">
                <IconButton
                  aria-label="close"
                  style={{ width: "fit-content" }}
                  onClick={() =>
                  //@ts-ignore
                  {
                    let tempValue = {
                      ...getValues(
                        //@ts-ignore
                        `TransactionDetail[${id}]`
                      ),
                    };

                    tempValue.RoomID = null;

                    append(tempValue);
                  }
                  }
                // onClick={() =>
                //     append(
                //         getValues(
                //             //@ts-ignore
                //             `TransactionDetail[${id}]`
                //         )
                //     )
                // }
                >
                  <ContentCopyIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Remove">
                <IconButton
                  aria-label="close"
                  onClick={() => remove(id)}
                  disabled={id == 0}
                  style={{ width: "fit-content" }}
                >
                  <DeleteIcon />
                </IconButton>
              </Tooltip>
              {id === 0 && (
                <div style={{ marginLeft: "8px", marginRight: "8px" }}>
                  <ColorPicker onColorChange={(color: string) => {
                    if (typeof window !== 'undefined' && window.parent) {
                      window.parent.postMessage({ type: 'COLOR_CHANGE', color }, '*');
                    }
                  }} />
                </div>
              )}
            </Grid>

            {selectedGuest &&
              (selectedGuest.value == null ||
                selectedGuest.value == "" ||
                selectedGuest.value == "createNew") ? (
              <>
                <Grid item xs={6} sm={3} md={2}>
                  <TextField
                    size="small"
                    fullWidth
                    id="Name"
                    label={intl.formatMessage({
                      id: "TextName",
                    })}
                    {...register(
                      `TransactionDetail.${id}.GuestDetail.Name`
                    )}
                    margin="dense"
                    autoFocus
                  />
                </Grid>

                <Grid item xs={6} sm={3} md={2}>
                  <TextField
                    size="small"
                    fullWidth
                    id="Surname"
                    label={intl.formatMessage({
                      id: "TextLastName",
                    })}
                    {...register(
                      `TransactionDetail.${id}.GuestDetail.Surname`
                    )}
                    margin="dense"
                  />
                </Grid>

                <Grid item xs={6} sm={3} md={2}>
                  <TextField
                    size="small"
                    fullWidth
                    id="Email"
                    label={intl.formatMessage({
                      id: "TextEmail",
                    })}
                    type="email"
                    {...register(
                      `TransactionDetail.${id}.GuestDetail.Email`
                    )}
                    margin="dense"
                  />
                </Grid>

                <Grid item xs={6} sm={3} md={2}>
                  <TextField
                    size="small"
                    fullWidth
                    id="Mobile"
                    label={intl.formatMessage({
                      id: "TextMobile",
                    })}
                    {...register(
                      `TransactionDetail.${id}.GuestDetail.Mobile`
                    )}
                    margin="dense"
                  />
                </Grid>
                <Grid item xs={6} sm={4} md={1}>
                  <CountrySelect
                    register={register}
                    errors={errors}
                    entity={country}
                    setEntity={setCountry}
                    customRegisterName={`TransactionDetail.${id}.GuestDetail.CountryID`}
                  />
                </Grid>
                <Grid item xs={6} sm={4} md={1}>
                  <VipStatusSelect
                    register={register}
                    errors={errors}
                    entity={vip}
                    setEntity={setVip}
                    customRegisterName={`TransactionDetail.${id}.GuestDetail.VipStatusID`}
                  />
                </Grid>
                <Grid item xs={6} sm={4} md={2}>
                  <TextField
                    size="small"
                    fullWidth
                    id="RegistryNo"
                    label={intl.formatMessage({
                      id: "TextRegistrationNo",
                    })}
                    {...register(
                      "TransactionDetail.${id}.GuestDetail.RegistryNo"
                    )}
                    margin="dense"
                  />
                </Grid>
              </>
            ) : (
              ""
            )}
          </>
        )}
      </Grid>
    </Box>
  );
};

export default NewEdit;
