import React, { useState, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { RoomTypeAPI } from 'lib/api/room-type';

// Define the item type for the select options
export interface RoomTypeSelectItem {
  value: string;
  label: string;
}

interface RoomTypeCustomSelectProps {
  searchRoomTypeID: number;
  setSearchRoomTypeID: (id: number) => void;
}

const RoomTypeCustomSelect: React.FC<RoomTypeCustomSelectProps> = ({
  searchRoomTypeID,
  setSearchRoomTypeID,
}) => {
  const [roomTypes, setRoomTypes] = useState<any[]>([]);
  const [selectItems, setSelectItems] = useState<RoomTypeSelectItem[]>([]);

  const fetchRoomTypes = async () => {
    try {
      const values = {
        RoomTypeID: 0,
        SearchStr: "",
        EmptyRow: 0,
      };
      const response = await RoomTypeAPI.list(values);
      setRoomTypes(response);
      const items: RoomTypeSelectItem[] = [
        { value: "0", label: "Бүх өрөө" },
        ...response.map((roomType: any) => ({
          value: roomType.RoomTypeID.toString(),
          label: roomType.RoomTypeName,
        }))
      ];
      setSelectItems(items);
    } catch (error) {
      console.error('Өрөөний төрөл авахад алдаа гарлаа:', error);
    }
  };

  useEffect(() => {
    fetchRoomTypes();
  }, []);

  const handleRoomTypeChange = (value: string) => {
    const roomTypeId = parseInt(value, 10);
    setSearchRoomTypeID(roomTypeId);
  };

  const currentValue = searchRoomTypeID.toString();
  const selectedItem = selectItems.find(item => item.value === currentValue);

  return (
    <div className="min-w-[150px]">
      <Select value={currentValue} onValueChange={handleRoomTypeChange}>
        <SelectTrigger className="flex h-8 min-w-36 items-center justify-between gap-3 rounded-full border-none pr-3 pl-3.5 text-sm text-black select-none hover:bg-gray-50 focus-visible:outline-none bg-transparent">
          <SelectValue placeholder="Өрөөний төрөл" />
        </SelectTrigger>
        <SelectContent className="min-w-[var(--anchor-width)] overflow-y-auto rounded-lg bg-white py-2 shadow-xl border border-gray-200 z-50">
          {selectItems.map((item) => (
            <SelectItem
              key={item.value}
              value={item.value}
              className="flex min-w-[var(--anchor-width)] cursor-pointer items-center px-3 py-2 text-sm text-gray-700 outline-none select-none hover:bg-gray-100 data-[highlighted]:bg-gray-100 data-[highlighted]:text-gray-900 transition-colors duration-150"
            >
              {item.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default RoomTypeCustomSelect;