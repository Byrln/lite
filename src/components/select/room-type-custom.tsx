import React, { useState, useEffect } from "react";
import {
  FormControl,
  FormHelperText,
  NativeSelect,
  OutlinedInput,
} from "@mui/material";
import { RoomTypeAPI } from "lib/api/room-type";
import { useIntl } from "react-intl";

interface RoomTypeCustomSelectProps {
  searchRoomTypeID?: number;
  setSearchRoomTypeID?: (id: number) => void;
  error?: boolean;
  helperText?: string;
  baseStay?: any;
  onRoomTypeChange?: (roomType: any) => void;
  label?: string;
}

const RoomTypeCustomSelect: React.FC<RoomTypeCustomSelectProps> = ({
  searchRoomTypeID = 0,
  setSearchRoomTypeID,
  error = false,
  helperText = "",
  baseStay,
  onRoomTypeChange,
  label,
}) => {
  const intl = useIntl();
  const [roomTypes, setRoomTypes] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchRoomTypes = async () => {
    setLoading(true);
    try {
      const values = {
        RoomTypeID: 0,
        SearchStr: "",
        EmptyRow: 0,
      };
      const response = await RoomTypeAPI.list(values);
      setRoomTypes(response || []);
    } catch (error) {
      console.error("Error fetching room types:", error);
      setRoomTypes([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoomTypes();
  }, []);

  const handleRoomTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const val = parseInt(event.target.value);
    if (setSearchRoomTypeID) {
      setSearchRoomTypeID(val);
    }
    eventRoomTypeChange(val);
  };

  const eventRoomTypeChange = (val: number) => {
    if (onRoomTypeChange) {
      if (val === 0) {
        onRoomTypeChange(null);
      } else {
        const roomType = roomTypes.find((rt) => rt.RoomTypeID === val);
        if (roomType) {
          onRoomTypeChange(roomType);
        }
      }
    }
  };

  const currentValue = baseStay?.roomType?.RoomTypeID || baseStay?.RoomTypeID || searchRoomTypeID || 0;
  
  let displayLabel = label || intl.formatMessage({ id: "TextRoomType" });
  displayLabel = displayLabel.replace(/өрөөний төрөл/gi, '').trim();
  displayLabel = displayLabel.replace(/TextRoomType/gi, '').trim();

  if (loading) {
    return (
      <div className="flex items-center justify-center">
        <FormControl 
          fullWidth 
          size="small" 
          error={error}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: '9999px',
            },
            '& .MuiInputBase-input': {
              fontSize: '0.875rem',
              fontWeight: '500',
              color: 'black',
            },
            '& .MuiOutlinedInput-notchedOutline': {
              border: 'none',
            },
            backgroundColor: 'transparent',
          }}
        >
          <NativeSelect
            input={<OutlinedInput />}
            disabled
          >
            <option value={0}>
              {intl.formatMessage({ id: "TextLoading" })}
            </option>
          </NativeSelect>
          {helperText && <FormHelperText>{helperText}</FormHelperText>}
        </FormControl>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center">
      <FormControl 
        fullWidth 
        size="small" 
        error={error}
        sx={{
          '& .MuiOutlinedInput-root': {
            borderRadius: '9999px',
          },
          '& .MuiInputBase-input': {
            fontSize: '0.875rem',
            fontWeight: '500',
            color: 'black',
          },
          '& .MuiOutlinedInput-notchedOutline': {
            border: 'none',
          },
          backgroundColor: 'transparent',
        }}
      >
        <NativeSelect
          value={currentValue}
          onChange={handleRoomTypeChange}
          input={<OutlinedInput />}
        >
          <option value={0}>
            {intl.formatMessage({ id: "TextAll" })}
          </option>
          {roomTypes.map((element) => (
            <option key={element.RoomTypeID} value={element.RoomTypeID}>
              {element.RoomTypeName}
            </option>
          ))}
        </NativeSelect>
        {helperText && <FormHelperText>{helperText}</FormHelperText>}
      </FormControl>
    </div>
  );
};

export default RoomTypeCustomSelect;
