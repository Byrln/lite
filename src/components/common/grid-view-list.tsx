import React, { useState, useMemo } from 'react';
import moment from 'moment';
import Iconify from '@/components/iconify/iconify';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/Input';
import { useIntl } from 'react-intl';

interface GridViewListProps {
  data: any[];
  onItemClick?: (item: any) => void;
  emptyMessage?: string;
  emptyIcon?: string;
  className?: string;
  cardClassName?: string;
  columns?: {
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
  renderCard?: (item: any, index: number) => React.ReactNode;
  showFilters?: boolean;
  showSummary?: boolean;
  filterOptions?: {
    statusFilter?: boolean;
    roomTypeFilter?: boolean;
    searchFilter?: boolean;
    dateFilter?: boolean;
  };
  summaryData?: {
    totalReservations?: number;
    totalGuests?: number;
    totalRevenue?: number;
    occupancyRate?: number;
    checkInsToday?: number;
    checkOutsToday?: number;
  };
  roomTypesData?: any[];
}

const GridViewList: React.FC<GridViewListProps> = ({
  data,
  onItemClick,
  emptyMessage = "No items found",
  emptyIcon = "📅",
  className = "p-4 space-y-4",
  cardClassName,
  columns = {
    sm: 1,
    md: 2,
    lg: 3,
    xl: 4
  },
  renderCard,
  showFilters = false,
  showSummary = false,
  filterOptions = {},
  summaryData = {},
  roomTypesData = []
}) => {
  const intl = useIntl();
  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [roomTypeFilter, setRoomTypeFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  // Filtered data based on search and filters
  const filteredData = useMemo(() => {
    if (!data) return [];

    return data.filter(item => {
      // Search filter
      if (searchTerm) {
        const title = typeof item.title === 'string' ? item.title : String(item.title || '');
        const guestName = typeof item.GuestName === 'string' ? item.GuestName : String(item.GuestName || '');

        if (!title.toLowerCase().includes(searchTerm.toLowerCase()) &&
          !guestName.toLowerCase().includes(searchTerm.toLowerCase())) {
          return false;
        }
      }

      // Status filter
      if (statusFilter !== 'all' && item.statusGroup !== statusFilter) {
        return false;
      }

      // Room type filter
      if (roomTypeFilter !== 'all' && item.roomTypeID?.toString() !== roomTypeFilter) {
        return false;
      }

      // Date filter
      if (dateFilter !== 'all') {
        const today = moment();
        const itemDate = moment(item.start);

        switch (dateFilter) {
          case 'today':
            return itemDate.isSame(today, 'day');
          case 'tomorrow':
            return itemDate.isSame(today.clone().add(1, 'day'), 'day');
          case 'this_week':
            return itemDate.isSame(today, 'week');
          case 'next_week':
            return itemDate.isSame(today.clone().add(1, 'week'), 'week');
          case 'check_in_today':
            return itemDate.isSame(today, 'day');
          case 'check_out_today':
            return moment(item.end).isSame(today, 'day');
          case 'due_out':
            return moment(item.end).isSame(today, 'day') || moment(item.end).isBefore(today, 'day');
          case 'arriving_tomorrow':
            return itemDate.isSame(today.clone().add(1, 'day'), 'day');
          default:
            return true;
        }
      }

      return true;
    });
  }, [data, searchTerm, statusFilter, roomTypeFilter, dateFilter]);

  // Calculate summary statistics
  const calculatedSummary = useMemo(() => {
    if (!filteredData.length) return summaryData;

    const totalReservations = filteredData.length;
    const totalGuests = filteredData.reduce((sum, item) => sum + (item.Adult || 0) + (item.Child || 0), 0);
    const totalRevenue = filteredData.reduce((sum, item) => sum + (parseFloat(item.Balance) || 0), 0);
    const today = moment();
    const checkInsToday = filteredData.filter(item => moment(item.start).isSame(today, 'day')).length;
    const checkOutsToday = filteredData.filter(item => moment(item.end).isSame(today, 'day')).length;

    return {
      totalReservations,
      totalGuests,
      totalRevenue,
      checkInsToday,
      checkOutsToday,
      ...summaryData
    };
  }, [filteredData, summaryData]);

  // Get unique values for filter options
  const uniqueStatuses = useMemo(() => {
    if (!data) return [];
    const statuses = Array.from(new Set(data.map(item => item.statusGroup).filter(Boolean)));
    return statuses;
  }, [data]);

  const uniqueRoomTypes = useMemo(() => {
    if (roomTypesData && roomTypesData.length > 0) {
      return roomTypesData.map(roomType => ({
        id: roomType.RoomTypeID,
        name: roomType.RoomTypeName || `Room Type ${roomType.RoomTypeID}`
      }));
    }
    // Fallback to data if roomTypesData is not available
    if (!data) return [];
    const roomTypeIds = Array.from(new Set(data.map(item => item.roomTypeID).filter(Boolean)));
    return roomTypeIds.map(id => ({ id, name: `Room Type ${id}` }));
  }, [data, roomTypesData]);

  const getGridCols = () => {
    return 'grid-cols-4';
  };

  const defaultRenderCard = (item: any, index: number) => {
    const startDate = moment(item.start);
    const endDate = moment(item.end);
    const duration = endDate.diff(startDate, 'days');
    const balance = parseFloat(item.Balance) || 0;
    const isGroupReservation = item.groupColor || item.isGroup;

    return (
      <div
        key={index}
        className={`bg-white border border-gray-200 rounded-xl px-4 py-4 shadow-sm hover:shadow-lg transition-all duration-200 cursor-pointer transform hover:-translate-y-1 ${cardClassName || ''
          }`}
        onClick={() => onItemClick && onItemClick(item)}
        style={{
          borderLeft: isGroupReservation ? `5px solid ${item.groupColor || '#ff6b6b'}` : 'none',
          background: isGroupReservation ? 'linear-gradient(135deg, #ffffff 0%, #f8f9ff 100%)' : '#ffffff'
        }}
      >
        <div className="flex mb-2">
          <div className="flex gap-2 items-center justify-between">
            <div className='flex gap-2 items-center'>
              <h3 className="font-bold text-sm text-gray-900 truncate mb-1">
                {item.title || item.GuestName || 'Guest'}
              </h3>
              {isGroupReservation && (
                <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  <Iconify icon="mdi:account-group" className="w-3 h-3 mr-1" />
                  {intl.formatMessage({ id: 'TextGroup' })}
                </div>
              )}
            </div>
            {/* Nights, Guests and Breakfast section */}
            <div className="flex items-center gap-2">
              {duration > 0 && (
                <span className="text-xs font-semibold text-purple-900">
                  {duration} {duration === 1 ? 'night' : 'nights'}
                </span>
              )}
              {item.Breakfast && (
                <Iconify icon="mdi:coffee" className="w-4 h-4 text-orange-600" />
              )}
            </div>
          </div>
        </div>

        <div className="space-y-2 text-sm text-gray-600">
          {item.resourceId && (
            <div className="flex items-center bg-gray-50 rounded-lg px-3 py-2">
              <Iconify icon="mdi:bed" className="w-4 h-4 mr-2 text-gray-500" />
              <span className="text-xs font-medium text-gray-700">{intl.formatMessage({ id: "TextRoomNo" })}:</span>
              <span className="ml-1 text-xs font-semibold text-gray-900">{item.resourceId}</span>
            </div>
          )}

          {item.statusGroup && typeof item.statusGroup === 'string' && ['check in', 'check out', 'due out'].includes(item.statusGroup.toLowerCase()) && (
            <div className="flex items-center bg-gray-50 rounded-lg px-3 py-2">
              <Iconify icon="mdi:information" className="w-4 h-4 mr-2 text-gray-500" />
              <span className="text-xs font-medium text-gray-700">Status:</span>
              <span
                className="ml-2 px-2 py-1 rounded-full text-xs font-semibold capitalize"
                style={{
                  backgroundColor: item.statusColor ? `${item.statusColor}20` : '#e5e7eb',
                  color: item.statusColor || '#374151'
                }}
              >
                {item.statusGroup}
              </span>
            </div>
          )}

          <div className="grid grid-cols-2 gap-2">
            <div className="bg-green-50 rounded-lg px-3 py-2">
              <div className="flex items-center">
                <Iconify icon="mdi:calendar-arrow-right" className="w-4 h-4 mr-2 text-green-600" />
                <span className="font-medium text-green-700 text-xs">{intl.formatMessage({ id: "TextCheckIn" })}</span>
              </div>
              <span className="text-xs font-semibold text-green-900">{startDate.format('MMM DD')}</span>
            </div>

            <div className="bg-red-50 rounded-lg px-3 py-2">
              <div className="flex items-center">
                <Iconify icon="mdi:calendar-arrow-left" className="w-4 h-4 mr-2 text-red-600" />
                <span className="font-medium text-red-700 text-xs">{intl.formatMessage({ id: "TextCheckOut" })}</span>
              </div>
              <span className="text-xs font-semibold text-red-900">{endDate.format('MMM DD')}</span>
            </div>
          </div>


        </div>

        <div className="mt-4 pt-3 border-t border-gray-200">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Iconify icon="mdi:identifier" className="w-4 h-4 mr-1 text-gray-400" />
              <span className="text-xs text-gray-500 font-medium">
                {item.transactionID || item.id}
              </span>
            </div>
            {balance !== 0 && (
              <div className={`flex items-center px-2 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700`}>
                ₮{Math.abs(balance)}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={className}>
      {/* Summary Cards */}
      {showSummary && (
        <div className="mb-2 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <div
            className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => {
              setSearchTerm('');
              setStatusFilter('all');
              setRoomTypeFilter('all');
              setDateFilter('all');
            }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">{intl.formatMessage({ id: "TextTotalReservations" })}</p>
                <p className="text-2xl font-bold text-gray-900">{calculatedSummary.totalReservations || 0}</p>
              </div>
              <div className="p-2 bg-blue-100 rounded-lg">
                <Iconify icon="mdi:calendar-check" className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">{intl.formatMessage({ id: "TextTotalGuests" })}</p>
                <p className="text-2xl font-bold text-gray-900">{calculatedSummary.totalGuests || 0}</p>
              </div>
              <div className="p-2 bg-green-100 rounded-lg">
                <Iconify icon="mdi:account-group" className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">{intl.formatMessage({ id: "TextTotalRevenue" })}</p>
                <p className="text-2xl font-bold text-gray-900">₮{calculatedSummary.totalRevenue?.toFixed(2) || '0.00'}</p>
              </div>
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Iconify icon="mdi:currency-usd" className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>

          <div
            className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => {
              setSearchTerm('');
              setStatusFilter('all');
              setRoomTypeFilter('all');
              setDateFilter('check_in_today');
            }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">{intl.formatMessage({ id: "TextCheckInsToday" })}</p>
                <p className="text-2xl font-bold text-gray-900">{calculatedSummary.checkInsToday || 0}</p>
              </div>
              <div className="p-2 bg-purple-100 rounded-lg">
                <Iconify icon="mdi:login" className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div
            className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => {
              setSearchTerm('');
              setStatusFilter('all');
              setRoomTypeFilter('all');
              setDateFilter('check_out_today');
            }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">{intl.formatMessage({ id: "TextCheckOutsToday" })}</p>
                <p className="text-2xl font-bold text-gray-900">{calculatedSummary.checkOutsToday || 0}</p>
              </div>
              <div className="p-2 bg-red-100 rounded-lg">
                <Iconify icon="mdi:logout" className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">{intl.formatMessage({ id: "TextOccupancyRate" })}</p>
                <p className="text-2xl font-bold text-gray-900">{calculatedSummary.occupancyRate?.toFixed(1) || '0.0'}%</p>
              </div>
              <div className="p-2 bg-indigo-100 rounded-lg">
                <Iconify icon="mdi:chart-line" className="w-6 h-6 text-indigo-600" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      {showFilters && (
        <div className="mb-2 bg-white border border-gray-200 rounded-lg p-4 shadow-sm overflow-y-auto">
          <div className="flex flex-wrap gap-4 items-center">
            {filterOptions.searchFilter && (
              <div className="flex-1 min-w-[200px]">
                <div className="relative">
                  
                  <Input
                    placeholder={intl.formatMessage({ id: "TextSearchReservations" })}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-white border-[#804FE6] rounded-full"
                  />
                </div>
              </div>
            )}

            {filterOptions.statusFilter && uniqueStatuses.length > 0 && (
              <div className="min-w-[150px]">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="bg-white border-[#804FE6] rounded-full">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    {uniqueStatuses.map(status => (
                      <SelectItem key={status} value={status}>{status}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {filterOptions.roomTypeFilter && uniqueRoomTypes.length > 0 && (
              <div className="min-w-[150px]">
                <Select value={roomTypeFilter} onValueChange={setRoomTypeFilter}>
                  <SelectTrigger className="bg-white border-[#804FE6] rounded-full">
                    <SelectValue placeholder="Room Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Room Types</SelectItem>
                    {uniqueRoomTypes.map(roomType => (
                      <SelectItem key={roomType.id} value={roomType.id.toString()}>{roomType.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {filterOptions.dateFilter && (
              <div className="min-w-[150px]">
                <Select value={dateFilter} onValueChange={setDateFilter}>
                  <SelectTrigger className="bg-white border-[#804FE6] rounded-full">
                    <SelectValue placeholder="Date Range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Dates</SelectItem>
                    <SelectItem value="check_in_today">{intl.formatMessage({ id: "TextCheckInsToday" })}</SelectItem>
                    <SelectItem value="check_out_today">{intl.formatMessage({ id: "TextCheckOutsToday" })}</SelectItem>
                    <SelectItem value="due_out">Due Out</SelectItem>
                    <SelectItem value="arriving_tomorrow">Arriving Tomorrow</SelectItem>
                    <SelectItem value="today">Today</SelectItem>
                    <SelectItem value="tomorrow">Tomorrow</SelectItem>
                    <SelectItem value="this_week">This Week</SelectItem>
                    <SelectItem value="next_week">Next Week</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {(searchTerm || statusFilter !== 'all' || roomTypeFilter !== 'all' || dateFilter !== 'all') && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setStatusFilter('all');
                  setRoomTypeFilter('all');
                  setDateFilter('all');
                }}
                className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
              >
                Clear Filters
              </button>
            )}
          </div>

          {filteredData.length !== data?.length && (
            <div className="mt-3 text-sm text-gray-600">
              Showing {filteredData.length} of {data?.length || 0} reservations
            </div>
          )}
        </div>
      )}

      {/* Grid Content */}
      <div className={`grid gap-4 ${getGridCols()} max-h-[calc(100vh-300px)] overflow-y-auto`}>
        {filteredData && filteredData.map((item, index) => {
          return renderCard ? renderCard(item, index) : defaultRenderCard(item, index);
        })}
      </div>

      {(!filteredData || filteredData.length === 0) && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-lg mb-2">{emptyIcon}</div>
          <p className="text-gray-500">{emptyMessage}</p>
        </div>
      )}
    </div>
  );
};

export default GridViewList;