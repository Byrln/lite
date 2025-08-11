import React, { useState } from 'react';
import { NextPage } from 'next';
import moment from 'moment';
import HotelGridView from '@/components/common/hotel-grid-view';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarDays, Plus, Settings } from 'lucide-react';

// Sample data
const sampleRooms = [
  { id: 'room-101', number: '101', type: 'Standard King', floor: 1, status: 'available' as const },
  { id: 'room-102', number: '102', type: 'Standard Queen', floor: 1, status: 'available' as const },
  { id: 'room-103', number: '103', type: 'Deluxe King', floor: 1, status: 'available' as const },
  { id: 'room-201', number: '201', type: 'Standard King', floor: 2, status: 'available' as const },
  { id: 'room-202', number: '202', type: 'Standard Queen', floor: 2, status: 'maintenance' as const },
  { id: 'room-203', number: '203', type: 'Suite', floor: 2, status: 'available' as const },
  { id: 'room-301', number: '301', type: 'Deluxe King', floor: 3, status: 'available' as const },
  { id: 'room-302', number: '302', type: 'Standard Queen', floor: 3, status: 'out-of-service' as const },
  { id: 'room-303', number: '303', type: 'Suite', floor: 3, status: 'available' as const },
  { id: 'room-401', number: '401', type: 'Presidential Suite', floor: 4, status: 'available' as const },
];

const sampleReservations = [
  {
    id: 'res-1-room-101',
    transactionID: 'TXN001',
    guestName: 'John Smith',
    checkIn: moment().format('YYYY-MM-DD'),
    checkOut: moment().add(3, 'days').format('YYYY-MM-DD'),
    status: 'confirmed' as const,
    roomStatus: 'clean' as const,
    adults: 2,
    children: 1,
    pricePerNight: 120,
    totalAmount: 360,
    balance: 0,
    statusColor: '#10b981'
  },
  {
    id: 'res-2-room-102',
    transactionID: 'TXN002',
    guestName: 'Sarah Johnson',
    checkIn: moment().add(1, 'day').format('YYYY-MM-DD'),
    checkOut: moment().add(4, 'days').format('YYYY-MM-DD'),
    status: 'pending' as const,
    roomStatus: 'clean' as const,
    adults: 1,
    pricePerNight: 100,
    totalAmount: 300,
    balance: 150,
    statusColor: '#f59e0b'
  },
  {
    id: 'res-3-room-103',
    transactionID: 'TXN003',
    guestName: 'Michael Brown',
    checkIn: moment().add(2, 'days').format('YYYY-MM-DD'),
    checkOut: moment().add(5, 'days').format('YYYY-MM-DD'),
    status: 'checked-in' as const,
    roomStatus: 'dirty' as const,
    adults: 2,
    pricePerNight: 150,
    totalAmount: 450,
    balance: -50,
    statusColor: '#3b82f6'
  },
  {
    id: 'res-4-room-201',
    transactionID: 'TXN004',
    guestName: 'Emily Davis',
    checkIn: moment().add(3, 'days').format('YYYY-MM-DD'),
    checkOut: moment().add(7, 'days').format('YYYY-MM-DD'),
    status: 'confirmed' as const,
    roomStatus: 'clean' as const,
    adults: 2,
    children: 2,
    pricePerNight: 130,
    totalAmount: 520,
    balance: 260,
    statusColor: '#10b981'
  },
  {
    id: 'res-5-room-203',
    transactionID: 'TXN005',
    guestName: 'David Wilson',
    checkIn: moment().add(5, 'days').format('YYYY-MM-DD'),
    checkOut: moment().add(8, 'days').format('YYYY-MM-DD'),
    status: 'pending' as const,
    roomStatus: 'clean' as const,
    adults: 1,
    pricePerNight: 200,
    totalAmount: 600,
    balance: 600,
    statusColor: '#f59e0b'
  },
  {
    id: 'res-6-room-301',
    transactionID: 'TXN006',
    guestName: 'Lisa Anderson',
    checkIn: moment().add(6, 'days').format('YYYY-MM-DD'),
    checkOut: moment().add(10, 'days').format('YYYY-MM-DD'),
    status: 'confirmed' as const,
    roomStatus: 'clean' as const,
    adults: 2,
    pricePerNight: 140,
    totalAmount: 560,
    balance: 0,
    statusColor: '#10b981'
  },
  {
    id: 'res-7-room-303',
    transactionID: 'TXN007',
    guestName: 'Robert Taylor',
    checkIn: moment().add(8, 'days').format('YYYY-MM-DD'),
    checkOut: moment().add(12, 'days').format('YYYY-MM-DD'),
    status: 'checked-in' as const,
    roomStatus: 'clean' as const,
    adults: 2,
    children: 1,
    pricePerNight: 220,
    totalAmount: 880,
    balance: 0,
    statusColor: '#3b82f6'
  },
  {
    id: 'res-8-room-401',
    transactionID: 'TXN008',
    guestName: 'Jennifer Martinez',
    checkIn: moment().add(10, 'days').format('YYYY-MM-DD'),
    checkOut: moment().add(13, 'days').format('YYYY-MM-DD'),
    status: 'confirmed' as const,
    roomStatus: 'clean' as const,
    adults: 2,
    pricePerNight: 350,
    totalAmount: 1050,
    balance: 525,
    statusColor: '#10b981'
  }
];

const HotelGridDemo: NextPage = () => {
  const [startDate, setStartDate] = useState(moment().format('YYYY-MM-DD'));
  const [numberOfDays, setNumberOfDays] = useState(14);

  const handleReservationClick = (reservation: any) => {
    alert(`Clicked on reservation: ${reservation.guestName} (${reservation.transactionID})`);
  };

  const handleRoomClick = (room: any, date: string) => {
    alert(`Clicked on room ${room.number} for date ${date}`);
  };

  const handleReservationDrop = (reservationId: string, newRoomId: string, newDate: string) => {
    alert(`Moved reservation ${reservationId} to room ${newRoomId} on ${newDate}`);
  };

  const goToPreviousWeek = () => {
    setStartDate(moment(startDate).subtract(7, 'days').format('YYYY-MM-DD'));
  };

  const goToNextWeek = () => {
    setStartDate(moment(startDate).add(7, 'days').format('YYYY-MM-DD'));
  };

  const goToToday = () => {
    setStartDate(moment().format('YYYY-MM-DD'));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-full mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Hotel Grid View</h1>
              <p className="text-gray-600 mt-1">
                Comprehensive room and reservation management interface
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm">
                <Plus className="w-4 h-4 mr-2" />
                New Reservation
              </Button>
              <Button variant="outline" size="sm">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
            </div>
          </div>

          {/* Navigation Controls */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <CalendarDays className="w-5 h-5" />
                Date Range Controls
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 flex-wrap">
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={goToPreviousWeek}>
                    ← Previous Week
                  </Button>
                  <Button variant="outline" size="sm" onClick={goToToday}>
                    Today
                  </Button>
                  <Button variant="outline" size="sm" onClick={goToNextWeek}>
                    Next Week →
                  </Button>
                </div>
                
                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium">Start Date:</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="px-3 py-1 border border-gray-300 rounded-md text-sm"
                  />
                </div>
                
                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium">Days to Show:</label>
                  <select
                    value={numberOfDays}
                    onChange={(e) => setNumberOfDays(parseInt(e.target.value))}
                    className="px-3 py-1 border border-gray-300 rounded-md text-sm"
                  >
                    <option value={7}>7 Days</option>
                    <option value={14}>14 Days</option>
                    <option value={21}>21 Days</option>
                    <option value={30}>30 Days</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Grid View */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">
              Room Availability Grid
              <span className="text-sm font-normal text-gray-500 ml-2">
                {moment(startDate).format('MMM DD, YYYY')} - {moment(startDate).add(numberOfDays - 1, 'days').format('MMM DD, YYYY')}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <HotelGridView
              rooms={sampleRooms}
              reservations={sampleReservations}
              startDate={startDate}
              numberOfDays={numberOfDays}
              onReservationClick={handleReservationClick}
              onRoomClick={handleRoomClick}
              onReservationDrop={handleReservationDrop}
              className="w-full"
            />
          </CardContent>
        </Card>

        {/* Instructions */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-lg">How to Use</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <h4 className="font-semibold mb-2">Interactions:</h4>
                <ul className="space-y-1 text-gray-600">
                  <li>• Click on reservation cards to view details</li>
                  <li>• Click on empty cells to create new reservations</li>
                  <li>• Drag reservation cards to move between rooms/dates</li>
                  <li>• Hover over cards for detailed tooltips</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Features:</h4>
                <ul className="space-y-1 text-gray-600">
                  <li>• Daily summary cards with occupancy and revenue</li>
                  <li>• Color-coded reservation status</li>
                  <li>• Room status indicators</li>
                  <li>• Responsive grid layout</li>
                  <li>• Real-time drag & drop functionality</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default HotelGridDemo;