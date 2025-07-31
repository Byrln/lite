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

    // Handle search-specific props
    if (setSearchRoomTypeID) {
      setSearchRoomTypeID(val);
    }

    // Only call onRoomTypeChange if roomType is found or if val is 0 (AllRoomTypes)
    if (roomType || val === 0) {
      const roomTypeToPass = roomType || { RoomTypeID: 0 };
      onRoomTypeChange && onRoomTypeChange(roomTypeToPass, groupIndex ?? 0);
    }
  };

  useEffect(() => {
    fetchRoomTypes();
  }, []);

  useEffect(() => {
    if (data && data.length > 0) {
      // If searchRoomTypeID is provided, use it; otherwise use RoomTypeID or default to 0 (All Room Types)
      const valueToSet = searchRoomTypeID || RoomTypeID || 0;
      eventRoomTypeChange(valueToSet);
    }
  }, [data, RoomTypeID, searchRoomTypeID]);

  const handleRoomTypeChange = (value: string) => {
    const numValue = parseInt(value) || 0;
    eventRoomTypeChange(numValue);
  };

  // Set default value to 0 (All Room Types) if no specific value is provided
  const currentValue = searchRoomTypeID || (baseStay && baseStay.RoomTypeID) || RoomTypeID || 0;
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
        {intl.formatMessage({ id: "ConfigRoomType" })}
      </InputLabel>
      <NativeSelect
        input={<OutlinedInput label={intl.formatMessage({ id: "ConfigRoomType" })} />}
        inputProps={{
          name: customRegisterName || 'roomtype-select',
          id: 'roomtype-select',
          ...(register && customRegisterName ? register(customRegisterName) : {}),
        }}
        onChange={(event) => handleRoomTypeChange(event.target.value)}
        value={currentValue?.toString() || "0"}
      >
        {/* Always show "All Room Types" as the first option */}
        <option value="0">
          {intl.formatMessage({ id: "AllRoomTypes" })}
        </option>
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
