import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/radix-popover";
import { Calendar as CalendarIcon, Settings } from "lucide-react";
import { format } from "date-fns";
import { useIntl } from "react-intl";
import Iconify from "components/iconify/iconify";
import Image from "next/image";
import RoomTypeCustomSelect from "components/select/room-type-custom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { RoomStatusSWR } from "lib/api/room-status";

interface CalendarControlsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  trigger?: React.ReactNode;
  // Filter props from parent component
  dayCount?: number;
  currentView?: string;
  searchRoomTypeID?: number;
  searchCurrDate?: Date;
  isHoverEnabled?: boolean;
  // Callbacks to update parent state
  onDayCountChange?: (dayCount: number) => void;
  onCurrentViewChange?: (view: string) => void;
  onSearchRoomTypeIDChange?: (roomTypeID: number) => void;
  onSearchCurrDateChange?: (date: Date) => void;
  onHoverEnabledChange?: (enabled: boolean) => void;
}

const CalendarControlsModal: React.FC<CalendarControlsModalProps> = ({
  open,
  onOpenChange,
  trigger,
  // Filter props with defaults
  dayCount = 15,
  currentView = "resourceTimeline",
  searchRoomTypeID = 0,
  searchCurrDate = new Date(),
  isHoverEnabled = true,
  // Callbacks
  onDayCountChange,
  onCurrentViewChange,
  onSearchRoomTypeIDChange,
  onSearchCurrDateChange,
  onHoverEnabledChange,
}) => {
  const intl = useIntl();
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const [workingDate] = useState(new Date());

  // Form setup
  const validationSchema = yup.object().shape({
    CurrDate: yup.string().nullable(),
    NumberOfDays: yup.string().nullable(),
    RoomTypeID: yup.string().nullable(),
  });
  const formOptions = { resolver: yupResolver(validationSchema) };
  const {
    register,
    formState: { errors },
    control,
  } = useForm(formOptions);

  // Fetch room status data
  const { data: roomStatusData } = RoomStatusSWR({ RoomTypeID: 0 });

  // Room type change handler
  const onRoomTypeChange = (rt: any) => {
    const newRoomTypeID = rt ? rt.RoomTypeID : 0;
    onSearchRoomTypeIDChange?.(newRoomTypeID);
  };

  // Custom setter function for room type ID
  const handleSetSearchRoomTypeID = (id: number) => {
    onSearchRoomTypeIDChange?.(id);
  };



  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl font-semibold text-[#804FE6]">
            <Settings className="h-6 w-6" />
            {intl.formatMessage({
              id: "TextCalendarControls",
            })}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 p-4">
          {/* Calendar Controls Section */}
          <div className="mb-8 space-y-4">
            {/* Main Actions Row */}
            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
              {/* Primary Actions Group */}
              <div className="flex flex-wrap gap-3 items-center">
                {/* Hover Toggle */}
                <div className="flex items-center space-x-2 bg-white border border-[#804FE6] rounded-full px-3 py-2 shadow-sm cursor-pointer" onClick={() => onHoverEnabledChange?.(!isHoverEnabled)}>
                  <Switch
                    checked={isHoverEnabled}
                    onCheckedChange={onHoverEnabledChange}
                    className="data-[state=checked]:bg-[#804fe6]"
                  />
                  <span className="text-sm font-semibold text-black">Hover</span>
                </div>
                {/* Filters Group */}
                <div className="flex flex-wrap gap-3 items-center">
                  {/* Room Type Filter */}
                  <div className="bg-white border border-[#804FE6] rounded-full shadow-sm min-w-[160px]">
                    <RoomTypeCustomSelect
                      searchRoomTypeID={searchRoomTypeID}
                      setSearchRoomTypeID={handleSetSearchRoomTypeID}
                      onRoomTypeChange={onRoomTypeChange}
                      baseStay={{ RoomTypeID: searchRoomTypeID }}
                      label={intl.formatMessage({
                        id: "TextRoomType",
                      })}
                    />
                  </div>

                  {/* Date Picker */}
                  <div className="bg-white border border-[#804FE6] rounded-full shadow-sm min-w-[160px]">
                    <Popover>
                      <PopoverTrigger asChild>
                        <button className="w-full justify-start text-left font-normal bg-white border-0 text-gray-700 hover:bg-gray-50 flex h-9 items-center px-3 text-sm rounded-full">
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {searchCurrDate ? format(new Date(searchCurrDate), "P") : <span>{intl.formatMessage({ id: "RowHeaderStarDate" })}</span>}
                        </button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={searchCurrDate ? new Date(searchCurrDate) : undefined}
                          onSelect={(date) => {
                            if (date) {
                              onSearchCurrDateChange?.(date);
                            }
                          }}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

              </div>

              {/* Status Legend */}
              <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto">
                <TooltipProvider>
                  <Tooltip open={tooltipOpen}>
                    <TooltipTrigger asChild>
                      <span
                        className="bg-[#804FE6] hover:bg-[#6B3BC0] text-white border-[#804FE6] rounded-full px-2 py-2 cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          setTooltipOpen(!tooltipOpen);
                        }}
                      >
                        <Iconify
                          icon="eva:info-outline"
                          width={20}
                          height={20}
                        />
                      </span>
                    </TooltipTrigger>
                    <TooltipContent side="left" className="bg-white text-black border border-gray-200 shadow-lg rounded-xl p-4 max-w-xs">
                      <h4 className="font-semibold text-sm mb-3 pb-2 border-b border-gray-200">
                        {intl.formatMessage({ id: "TextRoomStatus" })}
                      </h4>
                      <div className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-2 text-xs">
                        {(roomStatusData || []).filter((status: any) => {
                          const hideStatuses = ['StatusCancel', 'StatusUnconfirmReservation', 'StatusNoShow', 'StatusVoid'];
                          const statusCode = status.StatusCode || '';
                          const description = status.Description || '';
                          return statusCode.trim() !== '' && description.trim() !== '' && !hideStatuses.includes(statusCode);
                        }).map((status: any, index: number) => (
                          <React.Fragment key={index}>
                            <div
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: `#${status.StatusColor || 'cccccc'}` }}
                            />
                            <span className="text-gray-600">
                              {status.StatusCode ? intl.formatMessage({ id: status.StatusCode }, { defaultMessage: status.Description || status.StatusCode }) : (status.Description || status.StatusCode)}
                            </span>
                          </React.Fragment>
                        ))}
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                {/* View Period Controls */}
                <div className="bg-[#804FE6] rounded-full outline outline-[#804FE6] outline-2 shadow-md w-full sm:w-auto overflow-hidden">
                  <div className="flex gap-1 flex-nowrap">
                    {[
                      { value: "hourly", label: <div className=""><Iconify icon="mdi:clock-outline" className="w-4 h-4" /></div> },
                      { value: 7, label: "7 хоног" },
                      { value: 15, label: "15 хоног" },
                      { value: 30, label: "30 хоног" },
                    ].map((period) => {
                      const isActive = period.value === "hourly"
                        ? currentView === "resourceTimelineDay"
                        : dayCount === period.value;

                      return (
                        <button
                          key={period.value}
                          type="button"
                          onClick={() => {
                            if (period.value === "hourly") {
                              onCurrentViewChange?.("resourceTimelineDay");
                              onDayCountChange?.(1);
                            } else {
                              onCurrentViewChange?.("resourceTimeline");
                              onDayCountChange?.(Number(period.value));
                            }
                          }}
                          className={`
                          px-2 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 cursor-pointer whitespace-nowrap
                          ${isActive
                              ? "bg-white text-[#804FE6] shadow-sm"
                              : "text-white hover:bg-white/10"
                            }
                        `}
                        >
                          {period.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CalendarControlsModal;