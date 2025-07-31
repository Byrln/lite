import React, { useState, useEffect, useContext, useRef } from "react";
import FullCalendar from "@fullcalendar/react";
import interactionPlugin from "@fullcalendar/interaction";
import resourceTimelinePlugin from "@fullcalendar/resource-timeline";
import timeGridPlugin from "@fullcalendar/timegrid";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import moment from "moment";
import { Icon } from "@iconify/react";
import plusFill from "@iconify/icons-eva/plus-fill";
import {
  Tooltip,
  FormControlLabel,
  RadioGroup,
  Radio,
  Button,
  Checkbox,
} from "@mui/material";
import { toast } from "react-toastify";
import Iconify from "components/iconify/iconify";
import { getContrastYIQ } from "lib/utils/helpers";
import { useIntl } from "react-intl";
import Image from "next/image";

// Mock data for demo
const mockRoomTypes = [
  { RoomTypeID: 1, RoomTypeName: "Standard", SortOrder: 1 },
  { RoomTypeID: 2, RoomTypeName: "Deluxe", SortOrder: 2 },
  { RoomTypeID: 3, RoomTypeName: "Suite", SortOrder: 3 },
];

const mockRooms = {
  data: [
    { RoomID: 101, RoomNo: "101", RoomTypeID: 1, RoomTypeName: "Standard", Status: true, MaxAdult: 2, MaxChild: 1, BaseAdult: 2, BaseChild: 0, SortOrder: 1 },
    { RoomID: 102, RoomNo: "102", RoomTypeID: 1, RoomTypeName: "Standard", Status: true, MaxAdult: 2, MaxChild: 1, BaseAdult: 2, BaseChild: 0, SortOrder: 2 },
    { RoomID: 201, RoomNo: "201", RoomTypeID: 2, RoomTypeName: "Deluxe", Status: true, MaxAdult: 3, MaxChild: 2, BaseAdult: 2, BaseChild: 0, SortOrder: 3 },
    { RoomID: 202, RoomNo: "202", RoomTypeID: 2, RoomTypeName: "Deluxe", Status: true, MaxAdult: 3, MaxChild: 2, BaseAdult: 2, BaseChild: 0, SortOrder: 4 },
    { RoomID: 301, RoomNo: "301", RoomTypeID: 3, RoomTypeName: "Suite", Status: true, MaxAdult: 4, MaxChild: 2, BaseAdult: 2, BaseChild: 0, SortOrder: 5 },
  ]
};

const mockReservations = [
  {
    TransactionID: 1,
    GuestName: "John Doe",
    StartDate: "2024-12-25",
    DepartureDate: "2024-12-27",
    RoomID: 101,
    RoomTypeID: 1,
    StatusColor: "4CAF50",
    StatusCode: "CI",
    StatusGroup: 1,
    GroupID: null,
    Balance: 0,
    Adult: 2,
    Child: 0,
    Breakfast: true,
    GroupColor: null,
    GroupCode: null,
    IsGroupOwner: false
  },
  {
    TransactionID: 2,
    GuestName: "Jane Smith",
    StartDate: "2024-12-26",
    DepartureDate: "2024-12-29",
    RoomID: 201,
    RoomTypeID: 2,
    StatusColor: "FF9800",
    StatusCode: "RES",
    StatusGroup: 2,
    GroupID: null,
    Balance: 150,
    Adult: 2,
    Child: 1,
    Breakfast: false,
    GroupColor: null,
    GroupCode: null,
    IsGroupOwner: false
  }
];

const mockRoomStatus = [
  { StatusCode: "CI", Description: "Checked In", StatusColor: "4CAF50" },
  { StatusCode: "RES", Description: "Reserved", StatusColor: "FF9800" },
  { StatusCode: "CO", Description: "Checked Out", StatusColor: "9E9E9E" },
  { StatusCode: "OOO", Description: "Out of Order", StatusColor: "F44336" },
];

// Mock components for demo
const NewReservation = ({ selectedDate, roomType, roomNo, onSave }: any) => {
  const [formData, setFormData] = useState({
    guestName: '',
    startDate: selectedDate || '',
    endDate: selectedDate || '',
    roomType: roomType || '',
    roomNo: roomNo || '',
    adults: 1,
    children: 0,
    breakfast: false,
    notes: ''
  });

  // Load form data from localStorage on component mount
  useEffect(() => {
    const savedFormData = localStorage.getItem('newReservationForm');
    if (savedFormData) {
      try {
        const parsedData = JSON.parse(savedFormData);
        setFormData({
          ...parsedData,
          startDate: selectedDate || parsedData.startDate,
          roomType: roomType || parsedData.roomType,
          roomNo: roomNo || parsedData.roomNo
        });
      } catch (error) {
        console.error('Error parsing saved form data:', error);
        localStorage.removeItem('newReservationForm');
      }
    }
  }, [selectedDate, roomType, roomNo]);

  // Save form data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('newReservationForm', JSON.stringify(formData));
  }, [formData]);

  const handleSubmit = (e: any) => {
    e.preventDefault();
    const newReservation = {
      TransactionID: Date.now(),
      GuestName: formData.guestName,
      StartDate: formData.startDate,
      DepartureDate: formData.endDate,
      RoomID: parseInt(formData.roomNo) || 101,
      RoomTypeID: 1,
      StatusColor: "FF9800",
      StatusCode: "RES",
      StatusGroup: 2,
      GroupID: null,
      Balance: 0,
      Adult: formData.adults,
      Child: formData.children,
      Breakfast: formData.breakfast,
      GroupColor: null,
      GroupCode: null,
      IsGroupOwner: false
    };

    // Save to localStorage
    const existing = JSON.parse(localStorage.getItem('demoReservations') || '[]');
    existing.push(newReservation);
    localStorage.setItem('demoReservations', JSON.stringify(existing));

    // Clear form data from localStorage after successful submission
    localStorage.removeItem('newReservationForm');

    toast.success('New reservation created successfully!');
    onSave && onSave();
  };

  return (
    <div className="p-6 max-w-md">
      <h3 className="text-lg font-semibold mb-4">New Reservation</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Guest Name</label>
          <input
            type="text"
            value={formData.guestName}
            onChange={(e) => setFormData({ ...formData, guestName: e.target.value })}
            className="w-full px-3 py-2 border rounded-md"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium mb-1">Check-in</label>
            <input
              type="date"
              value={formData.startDate}
              onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              className="w-full px-3 py-2 border rounded-md"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Check-out</label>
            <input
              type="date"
              value={formData.endDate}
              onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
              className="w-full px-3 py-2 border rounded-md"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium mb-1">Room Type</label>
            <select
              value={''}
              onChange={(e) => {
                setFormData({ ...formData, roomType: null });
              }}
              className="w-full px-3 py-2 border rounded-md"
              required
            >
              <option value="">Select Room Type</option>
              {mockRoomTypes.map(rt => (
                <option key={rt.RoomTypeID} value={rt.RoomTypeID}>{rt.RoomTypeName}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Room No</label>
            <select
              value={formData.roomNo}
              onChange={(e) => setFormData({ ...formData, roomNo: e.target.value })}
              className="w-full px-3 py-2 border rounded-md"
              required
            >
              <option value="">Select Room</option>
              {mockRooms.data
                .filter(room => true)
                .map(room => (
                  <option key={room.RoomID} value={room.RoomNo}>{room.RoomNo}</option>
                ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium mb-1">Adults</label>
            <input
              type="number"
              min="1"
              value={formData.adults}
              onChange={(e) => setFormData({ ...formData, adults: parseInt(e.target.value) })}
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Children</label>
            <input
              type="number"
              min="0"
              value={formData.children}
              onChange={(e) => setFormData({ ...formData, children: parseInt(e.target.value) })}
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>
        </div>

        <div>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={formData.breakfast}
              onChange={(e) => setFormData({ ...formData, breakfast: e.target.checked })}
              className="mr-2"
            />
            Include Breakfast
          </label>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Notes</label>
          <textarea
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            className="w-full px-3 py-2 border rounded-md"
            rows={3}
          />
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Create Reservation
          </button>
          <button
            type="button"
            onClick={() => document.querySelector('.fixed')?.remove()}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

const ReservationEdit = ({ transactionID, extendedProps, customRerender }: any) => {
  const [reservation, setReservation] = useState(null);
  const [formData, setFormData] = useState({
    guestName: '',
    startDate: '',
    endDate: '',
    roomType: null,
    roomNo: '',
    adults: 1,
    children: 0,
    breakfast: false,
    status: 'RES'
  });

  useEffect(() => {
    // Load reservation data
    const reservations = JSON.parse(localStorage.getItem('demoReservations') || '[]');
    const res = reservations.find((r: any) => r.TransactionID === transactionID);
    if (res) {
      setReservation(res);
      setFormData({
        guestName: res.GuestName || '',
        startDate: res.StartDate || '',
        endDate: res.DepartureDate || '',
        roomType: null,
        roomNo: res.RoomID?.toString() || '',
        adults: res.Adult || 1,
        children: res.Child || 0,
        breakfast: res.Breakfast || false,
        status: res.StatusCode || 'RES'
      });
    }
  }, [transactionID]);

  const handleSubmit = (e: any) => {
    e.preventDefault();
    const reservations = JSON.parse(localStorage.getItem('demoReservations') || '[]');
    const index = reservations.findIndex((r: any) => r.TransactionID === transactionID);

    if (index !== -1) {
      reservations[index] = {
        ...reservations[index],
        GuestName: formData.guestName,
        StartDate: formData.startDate,
        DepartureDate: formData.endDate,
        RoomID: parseInt(formData.roomNo),
        RoomTypeID: 1,
        Adult: formData.adults,
        Child: formData.children,
        Breakfast: formData.breakfast,
        StatusCode: formData.status
      };

      localStorage.setItem('demoReservations', JSON.stringify(reservations));
      toast.success('Reservation updated successfully!');
      customRerender && customRerender();
    }
  };

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this reservation?')) {
      const reservations = JSON.parse(localStorage.getItem('demoReservations') || '[]');
      const filtered = reservations.filter((r: any) => r.TransactionID !== transactionID);
      localStorage.setItem('demoReservations', JSON.stringify(filtered));
      toast.success('Reservation deleted successfully!');
      customRerender && customRerender();
      document.querySelector('.fixed')?.remove();
    }
  };

  if (!reservation) {
    return (
      <div className="p-6">
        <h3 className="text-lg font-semibold mb-4">Edit Reservation</h3>
        <p>Loading reservation data...</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-md">
      <h3 className="text-lg font-semibold mb-4">Edit Reservation</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Transaction ID</label>
          <input
            type="text"
            value={transactionID}
            disabled
            className="w-full px-3 py-2 border rounded-md bg-gray-100"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Guest Name</label>
          <input
            type="text"
            value={formData.guestName}
            onChange={(e) => setFormData({ ...formData, guestName: e.target.value })}
            className="w-full px-3 py-2 border rounded-md"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium mb-1">Check-in</label>
            <input
              type="date"
              value={formData.startDate}
              onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              className="w-full px-3 py-2 border rounded-md"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Check-out</label>
            <input
              type="date"
              value={formData.endDate}
              onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
              className="w-full px-3 py-2 border rounded-md"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium mb-1">Room Type</label>
            <select
              value={''}
              onChange={(e) => {
                setFormData({ ...formData, roomType: null });
              }}
              className="w-full px-3 py-2 border rounded-md"
              required
            >
              <option value="">Select Room Type</option>
              {mockRoomTypes.map(rt => (
                <option key={rt.RoomTypeID} value={rt.RoomTypeID}>{rt.RoomTypeName}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Room No</label>
            <select
              value={formData.roomNo}
              onChange={(e) => setFormData({ ...formData, roomNo: e.target.value })}
              className="w-full px-3 py-2 border rounded-md"
              required
            >
              <option value="">Select Room</option>
              {mockRooms.data
                .filter(room => true)
                .map(room => (
                  <option key={room.RoomID} value={room.RoomID}>{room.RoomNo}</option>
                ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium mb-1">Adults</label>
            <input
              type="number"
              min="1"
              value={formData.adults}
              onChange={(e) => setFormData({ ...formData, adults: parseInt(e.target.value) })}
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Children</label>
            <input
              type="number"
              min="0"
              value={formData.children}
              onChange={(e) => setFormData({ ...formData, children: parseInt(e.target.value) })}
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Status</label>
          <select
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            className="w-full px-3 py-2 border rounded-md"
          >
            {mockRoomStatus.map(status => (
              <option key={status.StatusCode} value={status.StatusCode}>
                {status.Description}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={formData.breakfast}
              onChange={(e) => setFormData({ ...formData, breakfast: e.target.checked })}
              className="mr-2"
            />
            Include Breakfast
          </label>
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Update Reservation
          </button>
          <button
            type="button"
            onClick={handleDelete}
            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
          >
            Delete
          </button>
          <button
            type="button"
            onClick={() => document.querySelector('.fixed')?.remove()}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

const RoomAssignGroup = ({ entities, customRerender }: any) => (
  <div className="p-4">
    <h3>Room Assign Group Demo</h3>
    <p>Entities: {entities?.length || 0}</p>
    <p>This is a demo modal for room assignment.</p>
    <button onClick={customRerender} className="mt-2 px-4 py-2 bg-green-500 text-white rounded">
      Assign Rooms
    </button>
  </div>
);

const AmendStayForm = ({ transactionInfo, customRerender }: any) => {
  const [formData, setFormData] = useState({
    arrivalDate: moment(transactionInfo?.ArrivalDate).format('YYYY-MM-DD'),
    departureDate: moment(transactionInfo?.DepartureDate).format('YYYY-MM-DD'),
    arrivalTime: transactionInfo?.ArrivalTime || '14:00',
    departureTime: transactionInfo?.DepartureTime || '12:00',
    guestName: transactionInfo?.GuestName || '',
    adults: transactionInfo?.Adult || 1,
    children: transactionInfo?.Child || 0,
    breakfast: transactionInfo?.Breakfast || false,
    notes: transactionInfo?.Notes || ''
  });

  const handleInputChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSave = () => {
    console.log('Amend stay data:', formData);
    toast.success('Stay amended successfully!');
    customRerender && customRerender();
    document.querySelector('.fixed')?.remove();
  };

  return (
    <form id="modal-form" onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
      <div className="p-4 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Guest Name</label>
          <input
            type="text"
            name="guestName"
            value={formData.guestName}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter guest name"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Check-in Date</label>
            <input
              type="date"
              name="arrivalDate"
              value={formData.arrivalDate}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Check-out Date</label>
            <input
              type="date"
              name="departureDate"
              value={formData.departureDate}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Check-in Time</label>
            <input
              type="time"
              name="arrivalTime"
              value={formData.arrivalTime}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Check-out Time</label>
            <input
              type="time"
              name="departureTime"
              value={formData.departureTime}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Adults</label>
            <input
              type="number"
              name="adults"
              value={formData.adults}
              onChange={handleInputChange}
              min="1"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Children</label>
            <input
              type="number"
              name="children"
              value={formData.children}
              onChange={handleInputChange}
              min="0"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="breakfast"
              checked={formData.breakfast}
              onChange={handleInputChange}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm font-medium text-gray-700">Include Breakfast</span>
          </label>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleInputChange}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Additional notes..."
          />
        </div>

        <div className="bg-gray-50 p-3 rounded-md">
          <p className="text-sm text-gray-600">
            <strong>Transaction ID:</strong> {transactionInfo?.TransactionID}
          </p>
        </div>
      </div>
    </form>
  );
};

const RoomMoveForm = ({ transactionInfo, customRerender }: any) => {
  const [formData, setFormData] = useState({
    arrivalDate: moment(transactionInfo?.ArrivalDate).format('YYYY-MM-DD'),
    departureDate: moment(transactionInfo?.DepartureDate).format('YYYY-MM-DD'),
    arrivalTime: transactionInfo?.ArrivalTime || '14:00',
    departureTime: transactionInfo?.DepartureTime || '12:00',
    roomTypeID: transactionInfo?.RoomTypeID || '',
    roomID: transactionInfo?.RoomID || ''
  });

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    console.log('Room move data:', formData);
    toast.success('Room moved successfully!');
    customRerender && customRerender();
    document.querySelector('.fixed')?.remove();
  };

  return (
    <form id="modal-form" onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
      <div className="p-4 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Arrival Date</label>
            <input
              type="date"
              name="arrivalDate"
              value={formData.arrivalDate}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Departure Date</label>
            <input
              type="date"
              name="departureDate"
              value={formData.departureDate}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Arrival Time</label>
            <input
              type="time"
              name="arrivalTime"
              value={formData.arrivalTime}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Departure Time</label>
            <input
              type="time"
              name="departureTime"
              value={formData.departureTime}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Room Type</label>
            <select
              name="roomTypeID"
              value={formData.roomTypeID}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Room Type</option>
              {mockRoomTypes.map(rt => (
                <option key={rt.RoomTypeID} value={rt.RoomTypeID}>{rt.RoomTypeName}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Room Number</label>
            <select
              name="roomID"
              value={formData.roomID}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Room</option>
              {mockRooms.data
                .filter(room => !formData.roomTypeID || room.RoomTypeID.toString() === formData.roomTypeID)
                .map(room => (
                  <option key={room.RoomID} value={room.RoomID}>{room.RoomNo}</option>
                ))
              }
            </select>
          </div>
        </div>

        <div className="bg-gray-50 p-3 rounded-md">
          <p className="text-sm text-gray-600">
            <strong>Transaction ID:</strong> {transactionInfo?.TransactionID}
          </p>
        </div>
      </div>
    </form>
  );
};

const RoomTypeSelect = ({ onRoomTypeChange, baseStay, isSearch }: any) => (
  <select
    onChange={(e) => onRoomTypeChange(e.target.value ? { RoomTypeID: parseInt(e.target.value) } : null)}
    defaultValue={baseStay?.RoomTypeID || 0}
    className="w-full px-3 py-2 border-0 rounded-full bg-transparent text-sm focus:outline-none"
  >
    <option value={0}>All Room Types</option>
    {mockRoomTypes.map(rt => (
      <option key={rt.RoomTypeID} value={rt.RoomTypeID}>{rt.RoomTypeName}</option>
    ))}
  </select>
);

const DatePickerCustom = ({ defaultValue, onFilterChange, label }: any) => (
  <input
    type="date"
    defaultValue={moment(defaultValue).format('YYYY-MM-DD')}
    onChange={(e) => onFilterChange(e.target.value)}
    className="w-full px-3 py-2 border-0 rounded-full bg-transparent text-sm focus:outline-none"
  />
);

// Mock modal context
const ModalContext = React.createContext({
  handleModal: (show: boolean, title: string, content: any, onClose: any, size: string) => {
    if (show) {
      // Remove any existing modals
      const existingModal = document.querySelector('.modal-overlay');
      if (existingModal) {
        existingModal.remove();
      }

      const modal = document.createElement('div');
      modal.className = 'modal-overlay fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';

      const sizeClass = size === 'lg' ? 'max-w-2xl' : size === 'xl' ? 'max-w-4xl' : 'max-w-md';

      modal.innerHTML = `
        <div class="bg-white rounded-lg shadow-xl ${sizeClass} w-full mx-4 max-h-[90vh] overflow-y-auto">
          <div class="flex justify-between items-center p-4 border-b">
            <h2 class="text-xl font-semibold text-gray-800">${title}</h2>
            <button class="modal-close text-gray-400 hover:text-gray-600 text-2xl font-bold" onclick="this.closest('.modal-overlay').remove()">
              ×
            </button>
          </div>
          <div id="modal-content" class="modal-body"></div>
        </div>
      `;

      document.body.appendChild(modal);

      // Handle React component content
      const contentDiv = modal.querySelector('#modal-content');
      if (contentDiv && content) {
        if (React.isValidElement(content)) {
          // For React elements, render as string for now
          contentDiv.innerHTML = '<div>React component content</div>';
        } else {
          contentDiv.appendChild(content);
        }
      }

      // Close modal when clicking outside
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          modal.remove();
          onClose && onClose();
        }
      });
    }
  }
});

// Mock app state
const useAppState = () => {
  const [state, setState] = useState({ editId: null });

  const dispatch = (action: { type: string; payload?: any }) => {
    console.log('Dispatch:', action.type, action.payload);
    switch (action.type) {
      case 'SET_EDIT_ID':
        setState(prev => ({ ...prev, editId: action.payload }));
        break;
      default:
        console.log('Unknown action type:', action.type);
    }
  };

  return [state, dispatch];
};

export const generateIncrementedId = (baseId: string | number, increment: number = 1, conflictChecker?: (id: string | number) => boolean): string | number => {
  if (conflictChecker) {
    let currentId = typeof baseId === 'number' ? baseId + increment : baseId;
    let attempts = 0;
    const maxAttempts = 1000;

    while (attempts < maxAttempts) {
      if (typeof currentId === 'number') {
        if (!conflictChecker(currentId)) {
          return currentId;
        }
        currentId = currentId + 1;
      } else {
        const numMatch = currentId.toString().match(/(\d+)$/);
        if (numMatch) {
          const baseStr = currentId.toString().replace(/(\d+)$/, '');
          const num = parseInt(numMatch[1]);
          const testId = `${baseStr}${num}`;
          if (!conflictChecker(testId)) {
            return testId;
          }
          currentId = `${baseStr}${num + 1}`;
        } else {
          const testId = `${currentId}_${attempts + 1}`;
          if (!conflictChecker(testId)) {
            return testId;
          }
          currentId = testId;
        }
      }
      attempts++;
    }
    return typeof baseId === 'number' ? baseId + increment + attempts : `${baseId}_${increment + attempts}`;
  }

  if (typeof baseId === 'number') {
    return (baseId + increment).toString();
  }
  const numMatch = baseId.match(/(\d+)$/);
  if (numMatch) {
    const baseStr = baseId.replace(/(\d+)$/, '');
    const num = parseInt(numMatch[1]) + increment;
    return `${baseStr}${num}`;
  }
  return `${baseId}_${increment}`;
};

const MyCalendar: React.FC<{ workingDate: string }> = ({ workingDate }) => {
  const intl = useIntl();
  const [state, dispatch]: any = useAppState();
  const { handleModal }: any = useContext(ModalContext);
  const [dayCount, setDayCount] = useState(15);
  const [search, setSearch] = useState({
    CurrDate: workingDate,
    NumberOfDays: dayCount,
    RoomTypeID: 0,
  });
  const [searchCurrDate, setSearchCurrDate] = useState(workingDate);
  const [searchRoomTypeID, setSearchRoomTypeID] = useState(0);

  const onRoomTypeChange = (rt: any) => {
    setSearchRoomTypeID(rt ? rt.RoomTypeID : 0);
  };
  const [isHoverEnabled, setIsHoverEnabled] = useState(false);
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const [reservationItems, setReservationItems] = useState<any>(null);

  // Mock room status data
  const roomStatusData = mockRoomStatus;

  const handleTooltipClose = () => {
    setTooltipOpen(false);
  };

  const handleTooltipOpen = () => {
    setTooltipOpen(true);
  };

  useEffect(() => {
    const hoverSetting = localStorage.getItem("isHover");
    setIsHoverEnabled(hoverSetting === "true");
  }, []);

  const handleHoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    setIsHoverEnabled(checked);
    localStorage.setItem("isHover", checked.toString());
  };

  function extractNumberFromString(str: any) {
    const parts = str.split("-");
    const firstNumber = parseInt(parts[1], 10);
    return firstNumber;
  }

  function areDatesOnSameDay(date1: any, date2: any) {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  }

  const customHeader = (info: any) => {
    const dateText =
      info.currentRange.end.toISOString().slice(0, 10) +
      " " +
      info.currentRange.end.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    const day = info.currentRange.start.getDay();
    const isWeekend = day === 0 || day === 6;

    const monthNames = [
      intl.formatMessage({ id: "January" }) || "January",
      intl.formatMessage({ id: "February" }) || "February",
      intl.formatMessage({ id: "March" }) || "March",
      intl.formatMessage({ id: "April" }) || "April",
      intl.formatMessage({ id: "May" }) || "May",
      intl.formatMessage({ id: "June" }) || "June",
      intl.formatMessage({ id: "July" }) || "July",
      intl.formatMessage({ id: "August" }) || "August",
      intl.formatMessage({ id: "September" }) || "September",
      intl.formatMessage({ id: "October" }) || "October",
      intl.formatMessage({ id: "November" }) || "November",
      intl.formatMessage({ id: "December" }) || "December",
    ];
    const monthName = monthNames[info.currentRange.start.getMonth()];

    return (
      <div
        style={{
          padding: "6px 8px",
          backgroundColor: isWeekend ? "#ffd700" : "#f8f9fa",
          borderRadius: "6px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
        }}
      >
        <div
          style={{
            fontSize: "12px",
            fontWeight: "500",
            color: isWeekend ? "#ff9800" : "#4a6cf7",
            marginBottom: "4px",
            textTransform: "uppercase",
          }}
        >
          {info.dayHeader.text}
        </div>
        <div
          style={{
            fontSize: "13px",
            fontWeight: "600",
            color: "#212529",
          }}
        >
          {dateText}
        </div>
        <div
          style={{
            fontSize: "11px",
            fontWeight: "500",
            color: "#666",
            marginTop: "2px",
          }}
        >
          {monthName}
        </div>
      </div>
    );
  };

  const [timeStart, setTimeStart] = useState(
    new Date(searchCurrDate ? searchCurrDate : workingDate)
  );
  const [timeEnd, setTimeEnd] = useState(
    new Date(
      new Date(searchCurrDate ? searchCurrDate : workingDate).setDate(
        new Date(
          searchCurrDate ? searchCurrDate : workingDate
        ).getDate() + dayCount
      )
    )
  );
  const [resources, setResources] = useState<any>(null);
  const [itemData, setItemData] = useState<any>(null);
  const [rerenderKey, setRerenderKey] = useState(0);
  const [customMutate, setCustomMutate] = useState(0);
  const [isCalendarLoading, setIsCalendarLoading] = useState(false);
  const [height, setHeight] = useState<any>(null);
  const [availableRooms, setAvailableRooms] = useState<any>(null);
  const [currentView, setCurrentView] = useState("resourceTimeline");

  useEffect(() => {
    if (searchCurrDate == "Огноо алдаатай байна!") {
      setSearchCurrDate(workingDate);
      setTimeStart(new Date(workingDate));
      setTimeEnd(
        new Date(
          new Date(workingDate).setDate(
            new Date(workingDate).getDate() + dayCount
          )
        )
      );
    } else {
      setTimeStart(new Date(searchCurrDate));
      setTimeEnd(
        new Date(
          new Date(searchCurrDate).setDate(
            new Date(searchCurrDate).getDate() + dayCount
          )
        )
      );
    }

    // Load data from localStorage or use mock data
    const loadData = () => {
      try {
        const storedReservations = localStorage.getItem('demoReservations');
        const items = storedReservations ? JSON.parse(storedReservations) : mockReservations;

        setReservationItems(items);
        setAvailableRooms([{ D1: "2/5", D2: "3/5", D3: "1/5" }]);

        // Process room types and rooms
        const newRoomTypeData = mockRoomTypes.map((obj: any) => {
          return {
            id: `${obj.RoomTypeName}?${obj.RoomTypeID}`,
            title: obj.RoomTypeName,
            SortOrder: obj.SortOrder,
          };
        });

        const newData = mockRooms.data
          .filter((event: any) => event.Status === true)
          .map((obj: any) => {
            return {
              parentId: `${obj.RoomTypeName}?${obj.RoomTypeID}`,
              roomTypeId: obj.RoomTypeID,
              id: obj.RoomID,
              title: obj.RoomNo,
              resourceLaneContent: obj.RoomNo,
              MaxAdult: obj.MaxAdult,
              MaxChild: obj.MaxChild,
              BaseAdult: obj.BaseAdult,
              BaseChild: obj.BaseChild,
              SortOrder: Number(obj.SortOrder),
            };
          })
          .sort((a: any, b: any) => a.SortOrder - b.SortOrder);

        setResources(newRoomTypeData.concat(newData));

        // Process reservations for calendar events
        const newItemData = items
          .filter((obj: any) => {
            if (searchRoomTypeID && obj.RoomTypeID !== searchRoomTypeID) return false;
            return obj.RoomID;
          })
          .map((obj: any) => {
            return {
              id: obj.TransactionID,
              title: obj.GuestName,
              start: obj.StartDate,
              end: obj.DepartureDate,
              resourceId: obj.RoomID,
              roomTypeID: obj.RoomTypeID,
              transactionID: obj.TransactionID,
              startDate: obj.StartDate,
              departureDate: obj.DepartureDate,
              GroupID: obj.GroupID,
              Balance: obj.Balance,
              Adult: obj.Adult,
              Child: obj.Child,
              Breakfast: obj.Breakfast,
              endDate: obj.DepartureDate,
              groupColor: obj.GroupColor,
              GroupCode: obj.GroupCode,
              IsGroupOwner: obj.IsGroupOwner,
              statusColor: `#${obj.StatusColor}`,
              statusGroup: obj.StatusGroup,
              editable: !obj.StatusCode,
              color: getContrastYIQ(`#${obj.StatusColor}`),
              textColor: getContrastYIQ(`#${obj.StatusColor}`),
              border: "none",
            };
          });

        setItemData(newItemData);
        setRerenderKey((prevKey) => prevKey + 1);
      } catch (error) {
        console.error('Error loading demo data:', error);
      }
    };

    loadData();
  }, [searchRoomTypeID, dayCount, workingDate, searchCurrDate, customMutate]);

  const validationSchema = yup.object().shape({
    CurrDate: yup.string().nullable(),
    NumberOfDays: yup.string().nullable(),
    RoomTypeID: yup.string().nullable(),
  });
  const formOptions = { resolver: yupResolver(validationSchema) };
  const {
    reset,
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm(formOptions);

  const handleChange = async (event: any) => {
    try {
      const value = event.target.value;
      if (value === "day") {
        await setDayCount(1);
      } else if (value === "hourly") {
        await setDayCount(1);
        setCurrentView("resourceTimelineDay");
      } else {
        await setDayCount(Number(value));
        setCurrentView("resourceTimeline");
      }
    } finally {
    }
  };

  useEffect(() => {
    setHeight(window.innerHeight - 75);
  }, [window.innerHeight]);

  const handleEventClick = (info: any) => {
    console.log("info", info.event);
    if (info.event._def.title != "Blocked") {
      if (info.event._def.extendedProps.entities) {
        handleModal(
          true,
          intl.formatMessage({
            id: "ButtonAssignRoom",
          }) || "Assign Room",
          <RoomAssignGroup
            entities={info.event._def.extendedProps.entities}
            customRerender={() =>
              setCustomMutate((prevKey) => prevKey + 1)
            }
          />,
          null,
          "large"
        );
      } else {
        handleModal(
          true,
          intl.formatMessage({
            id: "FrontNewReservation",
          }) || "Edit Reservation",
          <ReservationEdit
            transactionID={
              info.event._def.extendedProps.transactionID
            }
            extendedProps={info.event._def.extendedProps}
            customRerender={() =>
              setCustomMutate((prevKey) => prevKey + 1)
            }
          />,
          null,
          "medium"
        );
      }
    }
  };

  const handleEventDrop = (info: any) => {
    if (
      areDatesOnSameDay(
        new Date(info.event._def.extendedProps.startDate),
        info.event._instance.range.start
      ) == false
    ) {
      if (Number(info.event._def.extendedProps.transactionID)) {
        dispatch({
          type: "SET_EDIT_ID",
          payload: Number(info.event._def.extendedProps.transactionID),
        });
      } else {
        dispatch({
          type: "SET_EDIT_ID",
          payload: null,
        });
      }
      const hasTimeInfo = currentView === "resourceTimelineDay" || currentView === "timeGridDay";

      let arrivalTime = "14:00";
      let departureTime = "12:00";

      if (hasTimeInfo) {
        arrivalTime = moment(info.event._instance.range.start).format("HH:mm");
        departureTime = moment(info.event._instance.range.end).format("HH:mm");
      }

      const newEventObject = {
        title: "New Event",
        ArrivalDate: info.event._instance.range.start,
        DepartureDate: info.event._instance.range.end,
        ArrivalTime: arrivalTime,
        DepartureTime: departureTime,
        RoomTypeID: Number(info.event._def.extendedProps.roomTypeID),
        RoomID: Number(info.event._def.resourceIds[0]),
        TransactionID: info.event._def.extendedProps.transactionID,
        GroupID: info.event.extendedProps.GroupID
          ? info.event.extendedProps.GroupID
          : null,
      };

      let filteredItemData = itemData.filter(
        (event: any) =>
          event.roomTypeID ===
          Number(info.event._def.extendedProps.roomTypeID) &&
          event.resourceId ==
          Number(info.event._def.resourceIds[0]) &&
          event.id != info.event._def.extendedProps.transactionID &&
          new Date(event.start) <=
          new Date(info.event._instance.range.end) &&
          new Date(event.end) >
          new Date(info.event._instance.range.start)
      );

      if (filteredItemData.length > 0) {
        toast("Захиалга давхцаж байна.");
      } else {
        if (info.event.extendedProps.statusGroup != 3) {
          handleModal(
            true,
            intl.formatMessage({
              id: "ButtonAmendStay",
            }) || "Amend Stay",
            <AmendStayForm
              transactionInfo={newEventObject}
              reservation={newEventObject}
              customRerender={() =>
                setCustomMutate((prevKey) => prevKey + 1)
              }
            />,
            false,
            "small"
          );
        } else {
          toast("Хугацаа өөрчлөх боломжгүй.");
        }
      }
      setRerenderKey((prevKey) => prevKey + 1);
    } else {
      const hasTimeInfo = currentView === "resourceTimelineDay" || currentView === "timeGridDay";

      let arrivalTime = "14:00";
      let departureTime = "12:00";

      if (hasTimeInfo) {
        arrivalTime = moment(info.event._instance.range.start).format("HH:mm");
        departureTime = moment(info.event._instance.range.end).format("HH:mm");
      }

      const newEventObject = {
        title: "New Event",
        ArrivalDate: info.event._instance.range.start,
        DepartureDate: info.event._instance.range.end,
        ArrivalTime: arrivalTime,
        DepartureTime: departureTime,
        RoomTypeID: Number(
          info.newResource._resource.parentId.split("?")[1]
        ),
        RoomID: Number(info.event._def.resourceIds[0]),
        TransactionID: Number(
          info.event._def.extendedProps.transactionID
        ),
      };

      let filteredItemData = itemData.filter(
        (event: any) =>
          event.roomTypeID ===
          extractNumberFromString(
            info.newResource._resource.parentId
          ) &&
          event.resourceId ==
          Number(info.event._def.resourceIds[0]) &&
          event.id != info.event._def.extendedProps.transactionID &&
          new Date(event.start) <=
          new Date(info.oldEvent._def.extendedProps.endDate) &&
          new Date(event.end) >
          new Date(info.oldEvent._def.extendedProps.startDate)
      );

      if (!info.event.extendedProps.block) {
        if (filteredItemData.length > 0) {
          toast("Захиалга давхцаж байна.");
          setRerenderKey((prevKey) => prevKey + 1);
        } else {
          if (info.event.extendedProps.statusGroup != 3) {
            handleModal(
              true,
              "Room move",
              <RoomMoveForm
                transactionInfo={newEventObject}
                customRerender={() =>
                  setCustomMutate((prevKey) => prevKey + 1)
                }
              />,
              null,
              "small"
            );
          } else {
            toast("Өрөө солих боломжгүй.");
          }
        }
      }
      setRerenderKey((prevKey) => prevKey + 1);
    }
  };

  const handleEventResize = async (info: any) => {
    // Handle event resize logic here
    console.log('Event resized:', info);
    toast('Event resized in demo mode');
  };

  const handleSelect = (info: any) => {
    console.log('Date selected:', info);

    // Extract room information from the selected resource
    const resourceId = info.resource?.id;
    const roomTypeId = info.resource?.parentId?.split('?')[1];

    // Find room and room type details
    const selectedRoom = mockRooms.data.find(room => room.RoomID.toString() === resourceId);
    const selectedRoomType = mockRoomTypes.find(rt => rt.RoomTypeID.toString() === roomTypeId);

    const selectedDate = moment(info.start).format('YYYY-MM-DD');

    // Open new reservation modal with selected date, room type, and room number
    handleModal(
      true,
      'New Reservation',
      React.createElement(NewReservation, {
        selectedDate: selectedDate,
        roomType: selectedRoomType,
        roomNo: selectedRoom?.RoomNo,
        onSave: () => {
          document.querySelector('.fixed')?.remove();
          setCustomMutate(prev => prev + 1); // Trigger calendar refresh
        }
      }),
      () => { },
      'lg'
    );

    toast.success(`Selected: ${selectedDate} - Room ${selectedRoom?.RoomNo || 'N/A'} (${selectedRoomType?.RoomTypeName || 'Unknown'})`);
  };

  const eventContent = (arg: any) => {
    return (
      <Tooltip
        title={
          arg.event._def.extendedProps.statusColor ==
            "rgba(255, 220, 40, 0.15)" ? (
            <div
              style={{
                padding: "8px",
                fontWeight: 500,
                display: "flex",
                flexDirection: "row",
                gap: "4px",
              }}
              className="sm:flex-row sm:items-center"
            >
              <span
                style={{
                  color: "#4a6cf7",
                  marginRight: "4px",
                  whiteSpace: "nowrap",
                }}
              >
                <div
                  style={{
                    fontWeight: "bold",
                    marginBottom: "2px",
                  }}
                >
                  Unassigned Room:{" "}
                </div>
              </span>
              <span
                style={{
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {arg.event.title}
              </span>
            </div>
          ) : arg.event.title == "Blocked" ? (
            <div
              style={{
                display: 'flex',
                padding: "8px",
                fontWeight: 500,
                color: "#ff4842",
              }}
            >
              <Iconify
                icon="mdi:block-helper"
                width="16px"
                style={{
                  marginRight: "6px",
                  verticalAlign: "text-bottom",
                }}
              />
              Blocked
            </div>
          ) : (
            <div
              style={{
                padding: "12px",
                minWidth: "220px",
                borderRadius: "8px",
                fontSize: "13px",
                lineHeight: "1.6",
              }}
            >
              {/* Header with name */}
              <div
                title={arg.event.title}
                style={{
                  display: "inline-block",
                  fontWeight: "600",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  width: "100%",
                }}
              >
                {arg.event.title}
              </div>

              {/* Info grid */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "auto 1fr",
                  gap: "6px 12px",
                }}
              >
                {arg.event._def.extendedProps.GroupCode &&
                  arg.event._def.extendedProps.GroupCode !=
                  "" && (
                    <>
                      <span
                        style={{
                          display: "flex", alignItems: 'center',
                          color: "rgba(255,255,255,0.7)",
                        }}
                      >
                        <Iconify
                          icon="clarity:group-line"
                          width="14px"
                          style={{
                            marginRight: "4px",
                            verticalAlign:
                              "text-bottom",
                          }}
                        />
                        Group Code:
                      </span>
                      <span style={{ fontWeight: 500 }}>
                        {
                          arg.event._def.extendedProps
                            .GroupCode
                        }
                      </span>
                    </>
                  )}

                <span
                  style={{ display: "flex", alignItems: 'center', color: "rgba(255,255,255,0.7)" }}
                >
                  <Iconify
                    icon="mdi:account-outline"
                    width="14px"
                    style={{
                      marginRight: "4px",
                      verticalAlign: "text-bottom",
                    }}
                  />
                  A/C:
                </span>
                <span style={{ fontWeight: 500 }}>
                  {arg.event._def.extendedProps.Adult}/
                  {arg.event._def.extendedProps.Child}
                </span>

                {arg.event._def.extendedProps.pax && (
                  <>
                    <span
                      style={{
                        display: "flex", alignItems: 'center',
                        color: "rgba(255,255,255,0.7)",
                      }}
                    >
                      <Iconify
                        icon="mdi:account-group-outline"
                        width="14px"
                        style={{
                          marginRight: "4px",
                          verticalAlign:
                            "text-bottom",
                        }}
                      />
                      Group A/C:
                    </span>
                    <span style={{ fontWeight: 500 }}>
                      {arg.event._def.extendedProps.pax}
                    </span>
                  </>
                )}

                <span
                  style={{ display: "flex", alignItems: 'center', color: "rgba(255,255,255,0.7)" }}
                >
                  <Iconify
                    icon="vaadin:cash"
                    width="14px"
                    style={{
                      marginRight: "4px",
                      verticalAlign: "text-bottom",
                    }}
                  />
                  Balance:
                </span>
                <span style={{ fontWeight: 500 }}>
                  {Number(arg.event._def.extendedProps.Balance).toLocaleString()}
                  ₮
                </span>

                <span
                  style={{ display: "flex", alignItems: 'center', color: "rgba(255,255,255,0.7)" }}
                >
                  <Iconify
                    icon="fluent:food-16-regular"
                    width="14px"
                    style={{
                      marginRight: "4px",
                      verticalAlign: "text-bottom",
                    }}
                  />
                  Breakfast:
                </span>
                <span
                  style={{
                    fontWeight: 500,
                    color: arg.event._def.extendedProps
                      .Breakfast
                      ? "#4caf50"
                      : "#ff9800",
                  }}
                >
                  {arg.event._def.extendedProps.Breakfast
                    ? "Yes"
                    : "No"}
                </span>
              </div>
            </div>
          )
        }
        arrow
        placement="top"
        componentsProps={{
          tooltip: {
            sx: {
              bgcolor: "#212B36",
              "& .MuiTooltip-arrow": {
                color: "#212B36",
              },
              boxShadow: "0 8px 16px 0 rgba(0,0,0,0.2)",
              borderRadius: "8px",
              p: 0,
            },
          },
        }}
      >
        <div
          className={`event-custom ${isHoverEnabled
            ? arg.event._def.extendedProps.statusColor ==
              "rgba(255, 220, 40, 0.15)"
              ? ""
              : "hover-enabled"
            : ""
            }`}
          style={{
            display:
              arg.event._def.extendedProps.statusColor !=
                "rgba(255, 220, 40, 0.15)" ||
                arg.event.title == "Blocked"
                ? "flex"
                : "",
            borderRadius:
              arg.event._def.extendedProps.statusColor !=
                "rgba(255, 220, 40, 0.15)"
                ? "6px"
                : "0px",
            background: "none",
            padding: "6px 8px 2px 8px",
            overflow: "",
            margin: "-2px -3px -2px -1px",
            height: "100%",
            textAlign:
              arg.event._def.extendedProps.statusColor !=
                "rgba(255, 220, 40, 0.15)" ||
                arg.event.title == "Blocked"
                ? "left"
                : "center",
            backgroundColor:
              arg.event.title == "Blocked"
                ? "#212529"
                : arg.event._def.extendedProps.statusColor,
            color: arg.event._def.extendedProps.statusColor
              ? arg.event._def.extendedProps.statusColor !=
                "rgba(255, 220, 40, 0.15)"
                ? getContrastYIQ(
                  arg.event._def.extendedProps.statusColor
                )
                : "#4a6cf7"
              : "white",
            border:
              arg.event._def.extendedProps.statusColor ==
                "rgba(255, 220, 40, 0.15)"
                ? `1px solid rgba(74, 108, 247, 0.3)`
                : "null",
            fontSize: "13px",
            fontWeight: "500",
            alignItems: "center",
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.05)",
          }}
        >
          {arg.event._def.extendedProps.statusColor !=
            "rgba(255, 220, 40, 0.15)" ? (
            <Iconify
              icon="lsicon:drag-filled"
              width="14px"
              style={{ marginRight: "8px", marginTop: "2px" }}
            />
          ) : (
            ""
          )}

          {arg.event._def.extendedProps.GroupID &&
            arg.event._def.extendedProps.GroupID != "" ? (
            <span
              style={{
                marginRight: "8px",
                marginTop: "2px",
                color:
                  arg.event._def.extendedProps.groupColor &&
                    arg.event._def.extendedProps.groupColor !=
                    ""
                    ? arg.event._def.extendedProps
                      .groupColor
                    : "#495057",
              }}
            >
              {arg.event._def.extendedProps.IsGroupOwner ==
                "true" ? (
                <Iconify
                  icon="solar:crown-outline"
                  width="14px"
                />
              ) : (
                <Iconify
                  icon="clarity:group-line"
                  width="14px"
                />
              )}
            </span>
          ) : (
            <></>
          )}

          {arg.event._def.extendedProps.Balance &&
            Number(arg.event._def.extendedProps.Balance) > 0 ? (
            <span style={{ marginRight: "8px", marginTop: "2px" }}>
              {" "}
              <Iconify icon="vaadin:cash" width="14px" />
            </span>
          ) : (
            <></>
          )}

          {arg.event._def.extendedProps.Breakfast &&
            arg.event._def.extendedProps.Breakfast == true ? (
            <span style={{ marginRight: "8px", marginTop: "2px" }}>
              {" "}
              <Iconify
                icon="fluent:food-16-regular"
                width="14px"
              />
            </span>
          ) : (
            <></>
          )}
          <p
            title={arg.event.title}
            style={{
              display: "inline-block",
              fontWeight: "600",
              whiteSpace: "nowrap",
              textOverflow: "ellipsis",
              width: "fit-content",
            }}
          >
            {arg.event.title}
          </p>
          <div
            style={{
              display: "flex",
              justifyContent: "right",
              width: "100%",
              alignItems: "center",
              overflow: "hidden",
              marginLeft: "35px",
            }}
            className={
              isHoverEnabled ? "time-balance-container" : ""
            }
          >
            <div className="flex gap-3 mb-1">
              {/* Departure Time */}
              <div
                className="whitespace-nowrap time-info"
                style={{
                  backgroundColor: "#fff",
                  color: "#000",
                  padding: "2px 6px",
                  borderRadius: "4px",
                  fontWeight: "500",
                  display: "flex",
                  alignItems: "center",
                  fontSize: "11px",
                }}
              >
                <Iconify
                  icon="mdi:logout"
                  width="10px"
                  style={{ marginRight: "2px" }}
                />
                <span>
                  {new Date(
                    arg.event._def.extendedProps.departureDate
                  ).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
              {arg.event._def.extendedProps.Balance &&
                Number(arg.event._def.extendedProps.Balance) > 0 ? (
                <div
                  className="balance-info"
                  style={{
                    backgroundColor: "#fff",
                    color: "#000",
                    padding: "2px 6px",
                    borderRadius: "4px",
                    fontWeight: "500",
                  }}
                >
                  {Number(
                    arg.event._def.extendedProps.Balance
                  ).toLocaleString()}
                  ₮
                </div>
              ) : null}
            </div>
          </div>

          {arg.event._def.extendedProps.statusColor !=
            "rgba(255, 220, 40, 0.15)" ? (
            <Iconify
              icon="lsicon:drag-filled"
              width="14px"
              style={{ marginLeft: "auto", marginTop: "2px" }}
            />
          ) : (
            ""
          )}
        </div>
      </Tooltip>
    );
  };

  return (
    timeStart && (
      <>
        {/* Calendar Controls Section */}
        <div className="mb-8 space-y-4">
          {/* Main Actions Row */}
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            {/* Primary Actions Group */}
            <div className="flex flex-wrap gap-3 items-center">
              {/* New Reservation Button */}
              <Button
                onClick={() => {
                  dispatch({
                    type: "SET_EDIT_ID",
                    payload: null,
                  });
                  handleModal(
                    true,
                    intl.formatMessage({ id: "FrontNewReservation" }) || "New Reservation",
                    <NewReservation workingDate={workingDate} />,
                    null,
                    "medium"
                  );
                }}
                className="bg-[#804FE6] hover:bg-[#6B3BC0] text-white font-medium px-6 py-2 rounded-full transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
              >
                <Icon
                  style={{ color: "white", marginRight: "8px" }}
                  icon={plusFill}
                  width={16}
                  height={16}
                />
                <span className="font-bold">{intl.formatMessage({ id: "FrontNewReservation" }) || "New Reservation"}</span>
              </Button>

              {/* Refresh Button */}
              <Button
                onClick={() => {
                  setIsCalendarLoading(true);
                  setRerenderKey((prevKey) => prevKey + 1);
                  setTimeout(() => {
                    setIsCalendarLoading(false);
                  }, 1000);
                }}
                disabled={isCalendarLoading}
                className="border-[#804FE6] text-[#804FE6] hover:bg-[#804FE6] hover:text-white font-medium py-2 rounded-full transition-all duration-200 transform hover:scale-105"
              >
                <Image
                  src="/images/logo_sm.png"
                  alt="Refresh"
                  width={20}
                  height={20}
                  className="w-7 h-4"
                />
              </Button>

              {/* Hover Toggle */}
              <div className="flex items-center space-x-2 bg-white border border-[#804FE6] rounded-full px-3 py-2 shadow-sm cursor-pointer" onClick={() => setIsHoverEnabled(!isHoverEnabled)}>
                <Checkbox
                  checked={isHoverEnabled}
                  onChange={handleHoverChange}
                  sx={{
                    padding: "0px",
                    color: "#804fe6",
                    "&.Mui-checked": {
                      color: "#804fe6",
                    },
                    "& .MuiSvgIcon-root": { fontSize: 16 },
                  }}
                />
                <span className="text-sm font-semibold text-black">Hover</span>
              </div>

              {/* Filters Group */}
              <div className="flex flex-wrap gap-3 items-center">
                {/* Room Type Filter */}
                <div className="bg-white border border-[#804FE6] rounded-full shadow-sm py-[2px] min-w-[140px]">
                  <RoomTypeSelect
                    register={register}
                    errors={errors}
                    onRoomTypeChange={onRoomTypeChange}
                    baseStay={{ RoomTypeID: searchRoomTypeID }}
                    isSearch={true}
                  />
                </div>

                {/* Date Picker */}
                <div className="bg-white border border-[#804FE6] rounded-full shadow-sm min-w-[160px]">
                  <DatePickerCustom
                    name="CurrDate"
                    control={control}
                    defaultValue={searchCurrDate || workingDate}
                    label={intl.formatMessage({
                      id: "RowHeaderStarDate",
                    }) || "Start Date"}
                    error={!!errors.CurrDate}
                    register={register}
                    onFilterChange={(value: any) => {
                      setSearchCurrDate(value);
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Status Legend */}
            <div className="flex items-center gap-2">
              <Tooltip
                open={tooltipOpen}
                onClose={handleTooltipClose}
                onOpen={handleTooltipOpen}
                title={
                  <div className="p-4 max-w-xs">
                    <h4 className="font-semibold text-sm mb-3 pb-2 border-b border-gray-200">
                      Статусын төрлүүд
                    </h4>
                    <div className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-2 text-xs">
                      {(roomStatusData || []).map((status: any, index: number) => (
                        <React.Fragment key={index}>
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: `#${status.StatusColor || 'cccccc'}` }}
                          />
                          <span className="text-gray-600">{status.Description || status.StatusCode}</span>
                        </React.Fragment>
                      ))}
                    </div>
                  </div>
                }
                arrow
                placement="left-end"
                componentsProps={{
                  tooltip: {
                    sx: {
                      bgcolor: "white",
                      color: "black",
                      "& .MuiTooltip-arrow": {
                        color: "white",
                      },
                      boxShadow: "0 8px 16px 0 rgba(0,0,0,0.15)",
                      borderRadius: "12px",
                      border: "1px solid #e5e7eb",
                    },
                  },
                }}
              >
                <span
                  className="bg-[#804FE6] hover:bg-[#6B3BC0] text-white border-[#804FE6] rounded-full px-2 py-2"
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
              </Tooltip>

              {/* View Period Controls */}
              <div className="bg-[#804FE6] rounded-full outline outline-[#804FE6] outline-2 shadow-md">
                <RadioGroup
                  row
                  value={dayCount}
                  onChange={handleChange}
                  defaultValue={window.innerWidth < 950 ? 7 : 15}
                  className="flex gap-1"
                >
                  {[
                    { value: "hourly", label: <div className=""><Iconify icon="mdi:clock-outline" className="w-4 h-4" /></div> },
                    { value: 7, label: "7 хоног" },
                    { value: 15, label: "15 хоног" },
                    { value: 30, label: "30 хоног" },
                  ].map((period) => (
                    <FormControlLabel
                      key={period.value}
                      value={period.value}
                      control={
                        <Radio
                          sx={{
                            display: "none",
                          }}
                        />
                      }
                      label={
                        <div
                          className={`px-3 py-1 text-sm font-medium rounded-full transition-all duration-200 cursor-pointer ${(period.value === "hourly" && currentView === "resourceTimelineDay") ||
                            (period.value !== "hourly" && dayCount === period.value)
                            ? "bg-white text-[#804FE6] shadow-sm"
                            : "text-white hover:bg-white/10"
                            }`}
                        >
                          {period.label}
                        </div>
                      }
                      sx={{
                        margin: 0,
                        "& .MuiFormControlLabel-label": {
                          padding: 0,
                        },
                      }}
                    />
                  ))}
                </RadioGroup>
              </div>
            </div>
          </div>
        </div>

        {/* Calendar Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          {isCalendarLoading ? (
            <div className="flex items-center justify-center h-96">
              <div className="text-lg text-gray-500">Loading calendar...</div>
            </div>
          ) : (
            <FullCalendar
              key={rerenderKey}
              plugins={[
                resourceTimelinePlugin,
                interactionPlugin,
                timeGridPlugin,
              ]}
              initialView={currentView}
              resourceOrder="SortOrder"
              headerToolbar={{
                left: "",
                center: "",
                right: "",
              }}
              viewDidMount={(info) => {
                setCurrentView(info.view.type);
              }}
              resources={resources}
              initialDate={timeStart}
              events={itemData}
              selectable={true}
              select={handleSelect}
              editable={true}
              eventDrop={handleEventDrop}
              eventResize={handleEventResize}
              eventClick={handleEventClick}
              now={new Date(workingDate)}
              nowIndicator={true}
              height={height}
              eventContent={eventContent}
              visibleRange={{
                start: timeStart,
                end: moment(timeStart)
                  .add(dayCount, "days")
                  .format("YYYY-MM-DD"),
              }}
              slotDuration={currentView === "resourceTimelineDay" ? "01:00:00" : "24:00:00"}
              slotLabelInterval={currentView === "resourceTimelineDay" ? { hours: 1 } : { hours: 24 }}
              slotMinTime={currentView === "resourceTimelineDay" ? "00:00:00" : "00:00:00"}
              slotMaxTime={currentView === "resourceTimelineDay" ? "24:00:00" : "24:00:00"}
              selectConstraint={{
                start: "00:00:00",
                end: "24:00:00"
              }}
              resourceAreaWidth={180}
              slotMinWidth={20}
              eventBackgroundColor="transparent"
              eventBorderColor="transparent"
              eventAllow={function (
                dropInfo: any,
                draggedEvent: any
              ) {
                if (
                  areDatesOnSameDay(
                    dropInfo.start,
                    draggedEvent._instance.range.start
                  ) == false ||
                  new Date(workingDate) >
                  draggedEvent._instance.range.start
                ) {
                  return true;
                }
                return true;
              }}
              views={{
                timeline: {
                  type: "resourceTimeline",
                  duration: { days: dayCount },
                  dayHeaderContent: customHeader,
                  slotLabelContent: (arg: any) => {
                    arg.date.setHours(8);
                    var Difference_In_Time =
                      arg.date.getTime() -
                      timeStart.getTime();
                    var Difference_In_Days = Math.floor(
                      Difference_In_Time /
                      (1000 * 3600 * 24)
                    );
                    const day = arg.date.getDay();
                    const isWeekend =
                      day === 0 || day === 6;

                    const availableRoomsKey = `D${Difference_In_Days + 1}`;
                    const availableRoomsData =
                      availableRooms &&
                        availableRooms[0] &&
                        availableRooms[0][availableRoomsKey]
                        ? availableRooms[0][availableRoomsKey].split("/")
                        : ["0", "0"];

                    const availableCount =
                      parseInt(availableRoomsData[0]) || 0;
                    const totalCount =
                      parseInt(availableRoomsData[1]) || 1;
                    const occupancyPercentage =
                      Math.round(
                        ((totalCount - availableCount) / totalCount) * 100
                      );

                    return arg.level == 1 ? (
                      <div
                        style={{
                          textAlign: "center",
                          fontWeight: "normal",
                          color: "#495057",
                        }}
                      >
                        <div className="text-xs">
                          {availableCount} / {totalCount}
                        </div>
                      </div>
                    ) : (
                      <Tooltip
                        title={
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              gap: "8px",
                              padding: "4px",
                            }}
                          >
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                              }}
                            >
                              <div
                                style={{
                                  display: "flex",
                                  fontSize: "12px",
                                  fontWeight: "bold",
                                  color:
                                    occupancyPercentage > 80
                                      ? "#d32f2f"
                                      : occupancyPercentage > 50
                                        ? "#ff9800"
                                        : "#4caf50",
                                  backgroundColor: "rgba(0,0,0,0.05)",
                                  padding: "2px 4px",
                                  borderRadius: "4px",
                                  whiteSpace: "nowrap",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  maxWidth: "auto",
                                }}
                              >
                                {occupancyPercentage}%
                              </div>
                              <div
                                style={{
                                  fontWeight: "bold",
                                  marginBottom: "2px",
                                }}
                              >
                                {intl.formatMessage({ id: "TextFull" }) || "Full"}
                              </div>
                            </div>
                            <div
                              style={{
                                display: "flex",
                                fontSize: "11px",
                                justifyContent: "center",
                                textAlign: "center",
                                gap: "4px",
                              }}
                            >
                              <div
                                style={{
                                  color: availableCount > 0 ? "#4caf50" : "#d32f2f",
                                }}
                              >
                                {availableCount}
                              </div>
                              <div
                                style={{
                                  fontWeight: "bold",
                                  marginBottom: "2px",
                                }}
                              >
                                {intl.formatMessage({ id: "MenuReportAvailableRooms" }) || "Available"}
                              </div>
                            </div>
                          </div>
                        }
                      >
                        <div
                          style={{
                            fontSize: dayCount > 7 ? "14px" : "13px",
                            padding: dayCount > 7 ? "2px" : "4px",
                            backgroundColor: isWeekend ? "#fff9c4" : "#f8f9fa",
                            borderRadius: "4px",
                            height: "100%",
                          }}
                        >
                          <div
                            className="flex gap-5"
                            style={{
                              flexDirection: dayCount > 7 ? "column" : "row",
                              justifyContent: dayCount === 7 ? "space-between" : "",
                              alignContent: "center",
                              alignItems: dayCount === 7 ? "center" : "",
                              gap: dayCount > 7 ? "2px" : "5px",
                            }}
                          >
                            <div
                              style={{
                                fontWeight: "500",
                                textAlign: "center",
                                color: isWeekend ? "#ff9800" : "#4a6cf7",
                                textTransform: "uppercase",
                                fontSize:
                                  dayCount > 7
                                    ? dayCount > 15
                                      ? "10px"
                                      : "14px"
                                    : "16px",
                              }}
                            >
                              {arg.dayHeader?.text || ''}
                            </div>
                            <div
                              style={{
                                fontWeight: "600",
                                textAlign: "center",
                                fontSize:
                                  dayCount > 7
                                    ? dayCount > 15
                                      ? "12px"
                                      : "14px"
                                    : "18px",
                                color: "#212529",
                              }}
                            >
                              {arg.date.getDate()}
                            </div>
                          </div>
                        </div>
                      </Tooltip>
                    );
                  },
                },
                resourceTimeline: {
                  dayHeaderContent: customHeader,
                },
                timeGridDay: {
                  type: "timeGrid",
                  duration: { days: 1 },
                  slotMinTime: "06:00:00",
                  slotMaxTime: "24:00:00",
                  slotDuration: "01:00:00",
                  slotLabelInterval: "01:00:00",
                  allDaySlot: false,
                  nowIndicator: true,
                },
                resourceTimelineDay: {
                  type: "resourceTimeline",
                  duration: { days: 1 },
                  slotMinTime: "00:00:00",
                  slotMaxTime: "24:00:00",
                  slotDuration: "01:00:00",
                  slotLabelInterval: "01:00:00",
                  slotLabelFormat: {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: false
                  },
                  resourceAreaWidth: 180,
                  nowIndicator: true,
                  slotLabelContent: (arg: any) => {
                    return (
                      <div
                        style={{
                          fontSize: "12px",
                          fontWeight: "500",
                          color: "#666",
                          textAlign: "center",
                          padding: "4px 2px",
                        }}
                      >
                        {arg.date.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: false
                        })}
                      </div>
                    );
                  },
                  dayHeaderContent: (arg: any) => {
                    const day = arg.date.getDay();
                    const isWeekend = day === 0 || day === 6;
                    const monthNames = [
                      intl.formatMessage({ id: "January" }) || "January",
                      intl.formatMessage({ id: "February" }) || "February",
                      intl.formatMessage({ id: "March" }) || "March",
                      intl.formatMessage({ id: "April" }) || "April",
                      intl.formatMessage({ id: "May" }) || "May",
                      intl.formatMessage({ id: "June" }) || "June",
                      intl.formatMessage({ id: "July" }) || "July",
                      intl.formatMessage({ id: "August" }) || "August",
                      intl.formatMessage({ id: "September" }) || "September",
                      intl.formatMessage({ id: "October" }) || "October",
                      intl.formatMessage({ id: "November" }) || "November",
                      intl.formatMessage({ id: "December" }) || "December",
                    ];
                    const monthName = monthNames[arg.date.getMonth()];

                    return (
                      <div
                        style={{
                          padding: "8px",
                          backgroundColor: isWeekend ? "#ffd700" : "#f8f9fa",
                          borderRadius: "6px",
                          textAlign: "center",
                          boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                        }}
                      >
                        <div
                          style={{
                            fontSize: "14px",
                            fontWeight: "600",
                            color: isWeekend ? "#ff9800" : "#4a6cf7",
                            marginBottom: "4px",
                            textTransform: "uppercase",
                          }}
                        >
                          {arg.date.toLocaleDateString('en-US', { weekday: 'short' })}
                        </div>
                        <div
                          style={{
                            fontSize: "16px",
                            fontWeight: "bold",
                            color: "#212529",
                            marginBottom: "2px",
                          }}
                        >
                          {arg.date.getDate()}
                        </div>
                        <div
                          style={{
                            fontSize: "12px",
                            color: "#666",
                          }}
                        >
                          {monthName}
                        </div>
                      </div>
                    );
                  },
                },
              }}
            />
          )}
        </div>
      </>
    )
  );
};

const Index = () => {
  const workingDate = new Date().toISOString().split('T')[0];
  const [modalState, setModalState] = useState<{ show: boolean; title: string; content: any; onClose: (() => void) | null; size: string }>({ show: false, title: '', content: null, onClose: null, size: 'md' });

  // Load modal state from localStorage on component mount
  useEffect(() => {
    const savedModalState = localStorage.getItem('modalState');
    if (savedModalState) {
      try {
        const parsedState = JSON.parse(savedModalState);
        if (parsedState.show) {
          setModalState(parsedState);
        }
      } catch (error) {
        console.error('Error parsing saved modal state:', error);
        localStorage.removeItem('modalState');
      }
    }
  }, []);

  const handleModal = (show: boolean, title: string, content: any, onClose: any, size: string = 'md') => {
    const newState = show
      ? { show: true, title, content, onClose, size }
      : { show: false, title: '', content: null, onClose: null, size: 'md' };

    setModalState(newState);

    // Save modal state to localStorage
    if (show) {
      localStorage.setItem('modalState', JSON.stringify({
        show: true,
        title,
        content: content?.type?.name || 'ModalContent', // Store component name instead of JSX
        onClose: null, // Don't store functions
        size
      }));
    } else {
      localStorage.removeItem('modalState');
    }
  };

  const closeModal = () => {
    if (modalState.onClose) modalState.onClose();
    setModalState({ show: false, title: '', content: null, onClose: null, size: 'md' });
    localStorage.removeItem('modalState');
  };

  return (
    <ModalContext.Provider value={{ handleModal }}>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Hotel Calendar Demo</h1>
        <MyCalendar workingDate={workingDate} />
      </div>

      {modalState.show && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-5"
          onClick={(e) => e.target === e.currentTarget && closeModal()}
        >
          <div
            className={`bg-white rounded-lg max-h-[90vh] overflow-hidden flex flex-col ${modalState.size === 'lg' ? 'w-[90%] max-w-[1200px]' :
              modalState.size === 'xl' ? 'w-[90%] max-w-[1200px]' :
                'w-[90%] max-w-[800px]'
              }`}
            style={{
              boxShadow: '0px 11px 15px -7px rgba(0,0,0,0.2), 0px 24px 38px 3px rgba(0,0,0,0.14), 0px 9px 46px 8px rgba(0,0,0,0.12)'
            }}
          >
            <div className="flex-shrink-0 rounded-t-lg">
              <div
                className="flex justify-between items-center px-4 py-3 text-white"
                style={{ backgroundColor: '#804fe6e6' }}
              >
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-medium mt-2 mb-2">{modalState.title}</h2>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="submit"
                    form="modal-form"
                    className="text-white hover:text-gray-200 p-1"
                    title="Save"
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17 3H5C3.89 3 3 3.9 3 5V19C3 20.1 3.89 21 5 21H19C20.1 21 21 20.1 21 19V7L17 3ZM19 19H5V5H16.17L19 7.83V19ZM12 12C13.66 12 15 13.34 15 15S13.66 18 12 18 9 16.66 9 15 10.34 12 12 12ZM6 6H15V10H6V6Z" />
                    </svg>
                  </button>
                  <button
                    onClick={closeModal}
                    className="text-white hover:text-gray-200 p-1"
                    title="Close"
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41Z" />
                    </svg>
                  </button>
                </div>
              </div>
              <div className="border-b border-gray-200"></div>
            </div>
            <div className="flex-1 overflow-auto">
              <div className="py-1 px-4 pb-3">
                {modalState.content}
              </div>
            </div>
          </div>
        </div>
      )}
    </ModalContext.Provider>
  );
};

export default Index;
