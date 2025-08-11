import React, { createContext, useContext, useState, ReactNode } from 'react';

interface CalendarFiltersContextType {
  dayCount: number;
  setDayCount: (count: number) => void;
  currentView: string;
  setCurrentView: (view: string) => void;
  searchRoomTypeID: number;
  setSearchRoomTypeID: (id: number) => void;
  searchCurrDate: Date;
  setSearchCurrDate: (date: Date) => void;
  isHoverEnabled: boolean;
  setIsHoverEnabled: (enabled: boolean) => void;
  rerenderKey: number;
  setRerenderKey: (key: number | ((prevKey: number) => number)) => void;
  isGridView: boolean;
  setIsGridView: (enabled: boolean) => void;
}

const CalendarFiltersContext = createContext<CalendarFiltersContextType | undefined>(undefined);

export const useCalendarFilters = () => {
  const context = useContext(CalendarFiltersContext);
  if (context === undefined) {
    throw new Error('useCalendarFilters must be used within a CalendarFiltersProvider');
  }
  return context;
};

interface CalendarFiltersProviderProps {
  children: ReactNode;
  initialDayCount?: number;
  initialCurrentView?: string;
  initialSearchRoomTypeID?: number;
  initialSearchCurrDate?: Date;
  initialIsHoverEnabled?: boolean;
  initialIsGridView?: boolean;
}

export const CalendarFiltersProvider: React.FC<CalendarFiltersProviderProps> = ({
  children,
  initialDayCount = 15,
  initialCurrentView = "resourceTimeline",
  initialSearchRoomTypeID = 0,
  initialSearchCurrDate = new Date(),
  initialIsHoverEnabled = true,
  initialIsGridView = false,
}) => {
  // Initialize hover setting from localStorage
  const getInitialHoverSetting = () => {
    if (typeof window !== 'undefined') {
      const hoverSetting = localStorage.getItem("isHover");
      return hoverSetting === "true";
    }
    return initialIsHoverEnabled;
  };

  // Initialize grid view setting from localStorage
  const getInitialGridViewSetting = () => {
    if (typeof window !== 'undefined') {
      const gridViewSetting = localStorage.getItem("isGridView");
      return gridViewSetting === "true";
    }
    return initialIsGridView;
  };

  const [dayCount, setDayCount] = useState(initialDayCount);
  const [currentView, setCurrentView] = useState(initialCurrentView);
  const [searchRoomTypeID, setSearchRoomTypeID] = useState(initialSearchRoomTypeID);
  const [searchCurrDate, setSearchCurrDate] = useState(initialSearchCurrDate);
  const [isHoverEnabled, setIsHoverEnabled] = useState(getInitialHoverSetting);
  const [isGridView, setIsGridView] = useState(getInitialGridViewSetting);
  const [rerenderKey, setRerenderKey] = useState(0);

  // Save hover setting to localStorage when it changes
  const handleSetIsHoverEnabled = (enabled: boolean) => {
    setIsHoverEnabled(enabled);
    if (typeof window !== 'undefined') {
      localStorage.setItem("isHover", enabled.toString());
    }
  };

  // Save grid view setting to localStorage when it changes
  const handleSetIsGridView = (enabled: boolean) => {
    setIsGridView(enabled);
    if (typeof window !== 'undefined') {
      localStorage.setItem("isGridView", enabled.toString());
    }
  };

  const value = {
    dayCount,
    setDayCount,
    currentView,
    setCurrentView,
    searchRoomTypeID,
    setSearchRoomTypeID,
    searchCurrDate,
    setSearchCurrDate,
    isHoverEnabled,
    setIsHoverEnabled: handleSetIsHoverEnabled,
    rerenderKey,
    setRerenderKey,
    isGridView,
    setIsGridView: handleSetIsGridView,
  };

  return (
    <CalendarFiltersContext.Provider value={value}>
      {children}
    </CalendarFiltersContext.Provider>
  );
};