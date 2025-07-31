import { TextField, Grid } from "@mui/material";
import { Controller } from "react-hook-form";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import moment from "moment";
import { useIntl } from "react-intl";
import { useState } from "react";
import CustomerSelect from "components/select/customer";
import RoomTypeSelect from "components/select/room-type";

const Search = ({ register, errors, control }: any) => {
  const intl = useIntl();
  const [searchRoomTypeID, setSearchRoomTypeID] = useState<number>(0);
  return (
    <Grid container spacing={1}>
      <Grid item xs={3}>
        <Controller
          name="StartDate"
          control={control}
          defaultValue={null}
          render={({ field: { onChange, value } }) => (
            <DatePicker
              label={intl.formatMessage({ id: "RowHeaderBeginDate" })}
              value={value}
              onChange={(value) =>
                onChange(moment(value, "YYYY-MM-DD"))
              }
              renderInput={(params) => (
                <TextField
                  size="small"
                  id="StartDate"
                  {...register("StartDate")}
                  margin="dense"
                  fullWidth
                  {...params}
                  error={!!errors.StartDate?.message}
                  helperText={errors.StartDate?.message as string}
                />
              )}
            />
          )}
        />
      </Grid>

      <Grid item xs={3}>
        <Controller
          name="EndDate"
          control={control}
          defaultValue={null}
          render={({ field: { onChange, value } }) => (
            <DatePicker
              label={intl.formatMessage({ id: "RowHeaderEndDate" })}
              value={value}
              onChange={(value) =>
                onChange(moment(value, "YYYY-MM-DD"))
              }
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

      <Grid item xs={3}>
        <CustomerSelect
          register={register}
          errors={errors}
          isCustomSelect={true}
          isNA={true}
        />
      </Grid>
      {/* <Grid item xs={3}>
        <RoomTypeSelect
          register={register}
          errors={errors}
          isSearch={true}
        />
      </Grid> */}
      <Grid item xs={3}>
        <RoomTypeSelect
          searchRoomTypeID={searchRoomTypeID}
          setSearchRoomTypeID={setSearchRoomTypeID}
        />
      </Grid>
    </Grid>
  );
};

export default Search;
