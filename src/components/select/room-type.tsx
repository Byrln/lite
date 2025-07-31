/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import {
    FormControl,
    FormHelperText,
    InputLabel,
    NativeSelect,
    OutlinedInput,
} from "@mui/material";
import { useIntl } from "react-intl";
import { RoomTypeAPI } from 'lib/api/room-type';

interface RoomTypeSelectProps {
  register?: any;
  errors?: any;
  onRoomTypeChange?: (roomType: any, index?: number) => void;
  baseStay?: { RoomTypeID: any };
  customRegisterName?: string;
  RoomTypeID?: any;
  customError?: any;
  helperText?: string;
  error?: boolean;
  isSearch?: boolean;
  searchRoomTypeID?: number;
  setSearchRoomTypeID?: (id: number) => void;
  groupIndex?: number;
}

const RoomTypeSelect: React.FC<RoomTypeSelectProps> = ({
  register,
  errors,
  onRoomTypeChange,
  baseStay,
  customRegisterName,
  RoomTypeID,
  customError,
  helperText,
  error = false,
  isSearch,
  searchRoomTypeID,
  setSearchRoomTypeID,
  groupIndex,
}) => {
  const intl = useIntl();
  const [data, setData]: any = useState([]);

  const fetchRoomTypes = async () => {
    const values = {
      RoomTypeID: 0,
      SearchStr: "",
      EmptyRow: 0,
    };
    const response = await RoomTypeAPI.list(values);

    setData(response);
  };

  const eventRoomTypeChange = (val: any) => {
    let rt;
    let roomType = null;

    for (rt of data) {
      if (rt.RoomTypeID === val) {
        roomType = rt;
        break;
      }
    }

    // Only call onRoomTypeChange if roomType is found or if val is 0 (AllRoomTypes)
    if (roomType || val === 0) {
      onRoomTypeChange && onRoomTypeChange(roomType, groupIndex ?? 0);
    }
  };

  useEffect(() => {
    fetchRoomTypes();
  }, []);

  useEffect(() => {
    if (data && data.length > 0 && RoomTypeID) {
      eventRoomTypeChange(RoomTypeID);
    }
  }, [data]);

  const handleRoomTypeChange = (value: string) => {
    const numValue = parseInt(value);
    eventRoomTypeChange(numValue);
  };

  const currentValue = (baseStay && baseStay.RoomTypeID) || RoomTypeID;
  const displayError = error || customError || (errors && errors.RoomTypeID?.message);
  const displayHelperText = helperText || (errors && errors.RoomTypeID?.message);

  return (
    <FormControl
      fullWidth
      variant="outlined"
      size="small"
      margin="dense"
      error={displayError}
    >
      <InputLabel variant="outlined" htmlFor="roomtype-select">
        {isSearch ? "Room Type" : intl.formatMessage({ id: "ConfigRoomType" }) || "Өрөөний төрөл"}
      </InputLabel>
      <NativeSelect
        input={<OutlinedInput label={isSearch ? "Room Type" : intl.formatMessage({ id: "ConfigRoomType" }) || "Өрөөний төрөл"} />}
        inputProps={{
          name: customRegisterName || 'roomtype-select',
          id: 'roomtype-select',
          ...(register && customRegisterName ? register(customRegisterName) : {}),
        }}
        onChange={(event) => handleRoomTypeChange(event.target.value)}
        value={currentValue?.toString() || "0"}
      >
        {isSearch && (
          <option value="0">
            {intl.formatMessage({ id: "AllRoomTypes" })}
          </option>
        )}
        {data.map((element: any) => (
          <option key={element.RoomTypeID} value={element.RoomTypeID.toString()}>
            {element.RoomTypeName}
          </option>
        ))}
      </NativeSelect>
      {displayHelperText && (
         <FormHelperText>{displayHelperText}</FormHelperText>
       )}
      </FormControl>
    );
};

export default RoomTypeSelect;
