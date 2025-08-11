import React, { useState, useMemo, useCallback } from 'react';
import moment from 'moment';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { CalendarDays, Users, DollarSign, ArrowRight, ArrowLeft, Bed, AlertTriangle } from 'lucide-react';

interface Reservation {
  id: string;
  transactionID: string;
  guestName: string;
  checkIn: string;
  checkOut: string;
  status: 'confirmed' | 'pending' | 'checked-in' | 'checked-out' | 'cancelled';
  roomStatus: 'clean' | 'dirty' | 'out-of-service' | 'maintenance';
  adults: number;
  children?: number;
  pricePerNight?: number;
  totalAmount?: number;
  balance?: number;
  statusColor?: string;
}

interface Room {
  id: string;
  number: string;
  type: string;
  floor?: number;
  status: 'available' | 'occupied' | 'out-of-service' | 'maintenance';
}

interface DaySummary {
  date: string;
  totalBooked: number;
  totalVacant: number;
  revenue: number;
  checkIns: number;
  checkOuts: number;
}

interface HotelGridViewProps {
  rooms: Room[];
  reservations: Reservation[];
  startDate: string;
  numberOfDays?: number;
  onReservationClick?: (reservation: Reservation) => void;
  onRoomClick?: (room: Room, date: string) => void;
  onReservationDrop?: (reservationId: string, newRoomId: string, newDate: string) => void;
  className?: string;
}

const HotelGridView: React.FC<HotelGridViewProps> = ({
  rooms,
  reservations,
  startDate,
  numberOfDays = 14,
  onReservationClick,
  onRoomClick,
  onReservationDrop,
  className = ''
}) => {
  const [draggedReservation, setDraggedReservation] = useState<string | null>(null);
  const [hoveredCell, setHoveredCell] = useState<{ roomId: string; date: string } | null>(null);

  // Generate date range
  const dateRange = useMemo(() => {
    const dates = [];
    const start = moment(startDate);
    for (let i = 0; i < numberOfDays; i++) {
      dates.push(start.clone().add(i, 'days'));
    }
    return dates;
  }, [startDate, numberOfDays]);

  // Calculate daily summaries
  const dailySummaries = useMemo((): DaySummary[] => {
    return dateRange.map(date => {
      const dateStr = date.format('YYYY-MM-DD');
      const dayReservations = reservations.filter(res => {
        const checkIn = moment(res.checkIn);
        const checkOut = moment(res.checkOut);
        return date.isBetween(checkIn, checkOut, 'day', '[)');
      });

      const checkIns = reservations.filter(res => 
        moment(res.checkIn).isSame(date, 'day')
      ).length;

      const checkOuts = reservations.filter(res => 
        moment(res.checkOut).isSame(date, 'day')
      ).length;

      const revenue = dayReservations.reduce((sum, res) => 
        sum + (res.pricePerNight || 0), 0
      );

      return {
        date: dateStr,
        totalBooked: dayReservations.length,
        totalVacant: rooms.length - dayReservations.length,
        revenue,
        checkIns,
        checkOuts
      };
    });
  }, [dateRange, reservations, rooms]);

  // Get reservation for specific room and date
  const getReservationForCell = useCallback((roomId: string, date: moment.Moment) => {
    return reservations.find(res => {
      const checkIn = moment(res.checkIn);
      const checkOut = moment(res.checkOut);
      return res.id.includes(roomId) && date.isBetween(checkIn, checkOut, 'day', '[)');
    });
  }, [reservations]);

  // Get status color
  const getStatusColor = (status: string) => {
    const colors = {
      'confirmed': 'bg-green-100 border-green-300 text-green-800',
      'pending': 'bg-yellow-100 border-yellow-300 text-yellow-800',
      'checked-in': 'bg-blue-100 border-blue-300 text-blue-800',
      'checked-out': 'bg-gray-100 border-gray-300 text-gray-800',
      'cancelled': 'bg-red-100 border-red-300 text-red-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 border-gray-300 text-gray-800';
  };

  // Get room status color
  const getRoomStatusColor = (status: string) => {
    const colors = {
      'clean': 'text-green-600',
      'dirty': 'text-orange-600',
      'out-of-service': 'text-red-600',
      'maintenance': 'text-purple-600'
    };
    return colors[status as keyof typeof colors] || 'text-gray-600';
  };

  // Drag handlers
  const handleDragStart = (e: React.DragEvent, reservationId: string) => {
    setDraggedReservation(reservationId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, roomId: string, date: string) => {
    e.preventDefault();
    if (draggedReservation && onReservationDrop) {
      onReservationDrop(draggedReservation, roomId, date);
    }
    setDraggedReservation(null);
  };

  const handleDragEnd = () => {
    setDraggedReservation(null);
  };

  // Render reservation card
  const renderReservationCard = (reservation: Reservation, isStart: boolean, isEnd: boolean, span: number) => {
    const statusColor = getStatusColor(reservation.status);
    const roomStatusColor = getRoomStatusColor(reservation.roomStatus);
    
    return (
      <TooltipProvider key={reservation.id}>
        <Tooltip>
          <TooltipTrigger asChild>
            <div
              className={`
                ${statusColor} 
                border-2 rounded-lg p-2 m-1 cursor-pointer transition-all hover:shadow-md
                ${span > 1 ? 'col-span-' + Math.min(span, 7) : ''}
                ${draggedReservation === reservation.id ? 'opacity-50' : ''}
              `}
              draggable
              onDragStart={(e) => handleDragStart(e, reservation.id)}
              onDragEnd={handleDragEnd}
              onClick={() => onReservationClick?.(reservation)}
              style={{
                gridColumn: span > 1 ? `span ${Math.min(span, 7)}` : undefined
              }}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-semibold text-xs truncate">
                  {reservation.guestName}
                </span>
                {reservation.pricePerNight && (
                  <span className="text-xs font-medium">
                    ${reservation.pricePerNight}
                  </span>
                )}
              </div>
              
              <div className="flex items-center gap-1 mb-1">
                <Badge variant="outline" className="text-xs px-1 py-0">
                  {reservation.status}
                </Badge>
                <Bed className={`w-3 h-3 ${roomStatusColor}`} />
              </div>
              
              <div className="text-xs text-gray-600">
                ID: {reservation.transactionID}
              </div>
              
              {(reservation.adults || reservation.children) && (
                <div className="flex items-center gap-1 text-xs text-gray-600">
                  <Users className="w-3 h-3" />
                  {reservation.adults}{reservation.children ? `+${reservation.children}` : ''}
                </div>
              )}
              
              {reservation.balance && reservation.balance !== 0 && (
                <div className={`text-xs font-medium ${
                  reservation.balance > 0 ? 'text-red-600' : 'text-green-600'
                }`}>
                  ${Math.abs(reservation.balance).toFixed(2)}
                  {reservation.balance > 0 ? ' Due' : ' Credit'}
                </div>
              )}
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <div className="p-2">
              <div className="font-semibold">{reservation.guestName}</div>
              <div className="text-sm text-gray-600">
                {moment(reservation.checkIn).format('MMM DD')} - {moment(reservation.checkOut).format('MMM DD, YYYY')}
              </div>
              <div className="text-sm">
                Status: {reservation.status} | Room: {reservation.roomStatus}
              </div>
              {reservation.totalAmount && (
                <div className="text-sm font-medium">
                  Total: ${reservation.totalAmount}
                </div>
              )}
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  };

  return (
    <div className={`hotel-grid-view ${className}`}>
      {/* Summary Cards Header */}
      <div className="mb-6">
        <div className="grid gap-4" style={{ gridTemplateColumns: `200px repeat(${numberOfDays}, 1fr)` }}>
          <div></div> {/* Empty space for room column */}
          {dateRange.map((date, index) => {
            const summary = dailySummaries[index];
            return (
              <Card key={date.format('YYYY-MM-DD')} className="min-w-0">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-center">
                    {date.format('MMM DD')}
                    <div className="text-xs text-gray-500 font-normal">
                      {date.format('ddd')}
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0 space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      Booked
                    </span>
                    <span className="font-semibold">{summary.totalBooked}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                      Vacant
                    </span>
                    <span className="font-semibold">{summary.totalVacant}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-1">
                      <DollarSign className="w-3 h-3" />
                      Revenue
                    </span>
                    <span className="font-semibold">${summary.revenue}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-1">
                      <ArrowRight className="w-3 h-3 text-green-600" />
                      In
                    </span>
                    <span className="font-semibold text-green-600">{summary.checkIns}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-1">
                      <ArrowLeft className="w-3 h-3 text-red-600" />
                      Out
                    </span>
                    <span className="font-semibold text-red-600">{summary.checkOuts}</span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Grid */}
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <div className="grid" style={{ gridTemplateColumns: `200px repeat(${numberOfDays}, 1fr)` }}>
          {/* Header Row */}
          <div className="bg-gray-50 border-b border-gray-200 p-3 font-semibold text-sm">
            Rooms
          </div>
          {dateRange.map(date => (
            <div key={date.format('YYYY-MM-DD')} className="bg-gray-50 border-b border-l border-gray-200 p-2 text-center text-xs font-medium">
              <div>{date.format('DD')}</div>
              <div className="text-gray-500">{date.format('ddd')}</div>
            </div>
          ))}

          {/* Room Rows */}
          {rooms.map(room => (
            <React.Fragment key={room.id}>
              {/* Room Header */}
              <div className="bg-white border-b border-gray-200 p-3 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-sm">{room.number}</div>
                  <div className="text-xs text-gray-500">{room.type}</div>
                  {room.floor && (
                    <div className="text-xs text-gray-400">Floor {room.floor}</div>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  {room.status === 'out-of-service' && (
                    <AlertTriangle className="w-4 h-4 text-red-500" />
                  )}
                  {room.status === 'maintenance' && (
                    <AlertTriangle className="w-4 h-4 text-purple-500" />
                  )}
                </div>
              </div>

              {/* Date Cells */}
              {dateRange.map(date => {
                const reservation = getReservationForCell(room.id, date);
                const dateStr = date.format('YYYY-MM-DD');
                const isHovered = hoveredCell?.roomId === room.id && hoveredCell?.date === dateStr;
                
                return (
                  <div
                    key={`${room.id}-${dateStr}`}
                    className={`
                      min-h-[80px] border-b border-l border-gray-200 p-1 relative
                      ${isHovered ? 'bg-blue-50' : 'bg-white'}
                      ${!reservation ? 'hover:bg-gray-50 cursor-pointer' : ''}
                    `}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, room.id, dateStr)}
                    onClick={() => !reservation && onRoomClick?.(room, dateStr)}
                    onMouseEnter={() => setHoveredCell({ roomId: room.id, date: dateStr })}
                    onMouseLeave={() => setHoveredCell(null)}
                  >
                    {reservation && (
                      (() => {
                        const checkIn = moment(reservation.checkIn);
                        const checkOut = moment(reservation.checkOut);
                        const isStart = date.isSame(checkIn, 'day');
                        const isEnd = date.isSame(checkOut.clone().subtract(1, 'day'), 'day');
                        const span = Math.min(
                          checkOut.diff(date, 'days'),
                          numberOfDays - dateRange.findIndex(d => d.isSame(date, 'day'))
                        );
                        
                        return isStart ? renderReservationCard(reservation, isStart, isEnd, span) : null;
                      })()
                    )}
                    
                    {/* Available cell indicator */}
                    {!reservation && (
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                        <div className="text-xs text-gray-400">Available</div>
                      </div>
                    )}
                  </div>
                );
              })}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="mt-4 p-4 bg-gray-50 rounded-lg">
        <h4 className="font-semibold text-sm mb-2">Legend</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-100 border border-green-300 rounded"></div>
            <span>Confirmed</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-yellow-100 border border-yellow-300 rounded"></div>
            <span>Pending</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-100 border border-blue-300 rounded"></div>
            <span>Checked-in</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-100 border border-red-300 rounded"></div>
            <span>Cancelled</span>
          </div>
          <div className="flex items-center gap-2">
            <Bed className="w-3 h-3 text-green-600" />
            <span>Clean</span>
          </div>
          <div className="flex items-center gap-2">
            <Bed className="w-3 h-3 text-orange-600" />
            <span>Dirty</span>
          </div>
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-3 h-3 text-red-500" />
            <span>Out of Service</span>
          </div>
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-3 h-3 text-purple-500" />
            <span>Maintenance</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HotelGridView;