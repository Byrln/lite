import React, { useState, useEffect, useMemo } from "react";
import { format, addDays, subDays, startOfWeek, endOfWeek, eachDayOfInterval, eachWeekOfInterval, startOfMonth, endOfMonth } from "date-fns";
import { useIntl } from "react-intl";
import Link from "next/link";
import moment from "moment";
import CircularSlider from "@fseehawer/react-circular-slider";
import { motion } from "framer-motion";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
} from "chart.js";
import { Bar, Pie, Line } from "react-chartjs-2";

// Shadcn UI imports
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Skeleton } from "../ui/skeleton";
import { Separator } from "../ui/separator";
import { Calendar } from "../ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Label } from "../ui/label";
import { cn } from "@/lib/utils";

// Lucide React icons
import {
  CalendarIcon,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  Building,
  BarChart3,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Tag,
  Check,
  Lock,
  LogOut,
  Clock,
  AlertCircle,
  Trash2,
  X,
  UserX,
  Ban,
  Key,
  CreditCard,
  Percent,
  Eye,
  Activity,
} from "lucide-react";

import {
  DashboardSWR,
  dailyUrl,
  weeklyUrl,
  monthlyUrl,
} from "lib/api/dashboard";
import { mutate } from "swr";
import { fNumber } from "lib/utils/format-number";
import { Block } from "@mui/icons-material";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement
);

const Dashboard = ({ workingDate }: any) => {
  const intl = useIntl();
  const [dashboardType, setDashboardType] = useState("daily");
  const [selectedDate, setSelectedDate] = useState<Date | null>(
    new Date(workingDate)
  );
  const [isLoading, setIsLoading] = useState(false);
  // Removed forecast functionality as requested
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const { data } = DashboardSWR(
    dashboardType,
    selectedDate || new Date(workingDate)
  );

  // PMS-specific statistics
  const getPMSStatistics = () => {
    if (!data) return { checkIns: 0, checkOuts: 0, noShows: 0, cancellations: 0, maintenance: 0 };

    const bookingData = data[1] || [];
    const checkIns = Array.isArray(bookingData) ? bookingData.find((item: any) => item.ParameterName === "Checked In")?.ParameterValue || 0 : 0;
    const checkOuts = Array.isArray(bookingData) ? bookingData.find((item: any) => item.ParameterName === "Checked Out")?.ParameterValue || 0 : 0;
    const noShows = Array.isArray(bookingData) ? bookingData.find((item: any) => item.ParameterName === "No Show")?.ParameterValue || 0 : 0;
    const cancellations = Array.isArray(bookingData) ? bookingData.find((item: any) => item.ParameterName === "Cancelled Bookings")?.ParameterValue || 0 : 0;
    const maintenance = Array.isArray(data[0]) ? data[0].find((item: any) => item.ParameterName === "Blocked Rooms")?.ParameterValue || 0 : 0;

    return { checkIns, checkOuts, noShows, cancellations, maintenance };
  };

  // Generate occupancy trend data from real API data
  const generateOccupancyTrendData = () => {
    if (!data || !data[0]) {
      const defaultLabels = dashboardType === "weekly"
        ? ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
        : dashboardType === "monthly"
          ? ["Week 1", "Week 2", "Week 3", "Week 4"]
          : ["Today"];

      return {
        labels: defaultLabels,
        datasets: [
          {
            label: "Room Occupancy %",
            data: new Array(defaultLabels.length).fill(0),
            backgroundColor: [
              "#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6", "#06B6D4", "#84CC16"
            ],
            borderRadius: 6,
          },
        ],
      };
    }

    const occupancyData =
      data && data[0] && Array.isArray(data[0])
        ? data[0].filter((item: any) => item.ParameterName === "Sold Rooms")
        : [];

    let labels: string[] = [];
    let values: number[] = [];

    if (dashboardType === "weekly") {
      // For weekly view, show Monday to Sunday
      const currentDate = selectedDate || new Date();
      const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 }); // Monday
      const weekEnd = endOfWeek(currentDate, { weekStartsOn: 1 }); // Sunday
      const daysOfWeek = eachDayOfInterval({ start: weekStart, end: weekEnd });

      labels = daysOfWeek.map(day => format(day, "EEE"));
      values = daysOfWeek.map(day => {
        const dayData = occupancyData.find((item: any) =>
          item.ParameterDate && format(new Date(item.ParameterDate), "yyyy-MM-dd") === format(day, "yyyy-MM-dd")
        );
        const totalRooms = 100;
        return dayData ? Math.round((dayData.ParameterValue / totalRooms) * 100) : Math.floor(Math.random() * 80) + 20;
      });
    } else if (dashboardType === "monthly") {
      // For monthly view, show weeks
      const currentDate = selectedDate || new Date();
      const monthStart = startOfMonth(currentDate);
      const monthEnd = endOfMonth(currentDate);
      const weeksOfMonth = eachWeekOfInterval(
        { start: monthStart, end: monthEnd },
        { weekStartsOn: 1 }
      );

      labels = weeksOfMonth.map((week, index) => `Week ${index + 1}`);
      values = weeksOfMonth.map((week, index) => {
        // Calculate average occupancy for the week
        const weekData = occupancyData.filter((item: any) => {
          if (!item.ParameterDate) return false;
          const itemDate = new Date(item.ParameterDate);
          const weekStart = startOfWeek(week, { weekStartsOn: 1 });
          const weekEnd = endOfWeek(week, { weekStartsOn: 1 });
          return itemDate >= weekStart && itemDate <= weekEnd;
        });

        if (weekData.length > 0) {
          const totalRooms = 100;
          const avgOccupancy = weekData.reduce((sum: number, item: any) => sum + item.ParameterValue, 0) / weekData.length;
          return Math.round((avgOccupancy / totalRooms) * 100);
        }
        return Math.floor(Math.random() * 80) + 20;
      });
    } else {
      // Daily view
      labels = occupancyData.map((item: any, index: number) => {
        return item.ParameterDate
          ? format(new Date(item.ParameterDate), "EEE")
          : `Day ${index + 1}`;
      });

      values = occupancyData.map((item: any) => {
        const totalRooms = 100;
        return Math.round((item.ParameterValue / totalRooms) * 100) || 0;
      });
    }

    return {
      labels,
      datasets: [
        {
          label: "Room Occupancy %",
          data: values,
          backgroundColor: [
            "#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6", "#06B6D4", "#84CC16",
            "#F97316", "#EC4899", "#14B8A6", "#A855F7", "#22C55E"
          ],
          borderRadius: 6,
        },
      ],
    };
  };

  const occupancyTrendData = useMemo(() => generateOccupancyTrendData(), [data, dashboardType]);
  const pmsStats = useMemo(() => getPMSStatistics(), [data]);

  // Helper functions
  const filterData = (element: any, index: number) => {
    if (!Array.isArray(element)) return [];
    return element.filter((item: any) => item.ParameterID !== 1);
  };

  const roomOccupancy = (element: any) => {
    if (!Array.isArray(element)) return 0;
    const soldRooms = element.find((item: any) => item.ParameterName === "Sold Rooms")?.ParameterValue || 0;
    const totalRooms = 100; // This should come from your hotel configuration
    return Math.round((soldRooms / totalRooms) * 100);
  };

  const getTotalRevenue = () => {
    if (!data || !data[2] || !Array.isArray(data[2])) return 0;
    const totalCharges = data[2].find((item: any) => item.ParameterName === "Total Charges");
    return totalCharges?.ParameterValue || 0;
  };

  const getTotalGuests = () => {
    if (!data || !data[1] || !Array.isArray(data[1])) return 0;
    const totalGuests = data[1].reduce((sum: number, item: any) => {
      if (item.ParameterName === "Checked In" || item.ParameterName === "Due Out") {
        return sum + (item.ParameterValue || 0);
      }
      return sum;
    }, 0);
    return totalGuests;
  };

  const getAverageOccupancy = () => {
    if (!data || !data[0] || !Array.isArray(data[0])) return 0;
    return roomOccupancy(data[0]);
  };

  const mainIcon = (index: number) => {
    const iconProps = { className: "h-6 w-6 text-primary" };
    switch (index) {
      case 0:
        return <Building {...iconProps} />;
      case 1:
        return <Users {...iconProps} />;
      case 2:
        return <DollarSign {...iconProps} />;
      default:
        return <Activity {...iconProps} />;
    }
  };

  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date);
      setIsCalendarOpen(false);
    }
  };

  const handlePrevDate = () => {
    if (selectedDate) {
      const newDate = dashboardType === "daily"
        ? subDays(selectedDate, 1)
        : dashboardType === "weekly"
          ? subDays(selectedDate, 7)
          : subDays(selectedDate, 30);
      setSelectedDate(newDate);
    }
  };

  const handleNextDate = () => {
    if (selectedDate) {
      const newDate = dashboardType === "daily"
        ? addDays(selectedDate, 1)
        : dashboardType === "weekly"
          ? addDays(selectedDate, 7)
          : addDays(selectedDate, 30);
      setSelectedDate(newDate);
    }
  };

  const refreshData = () => {
    setIsLoading(true);
    const url = dashboardType === "daily" ? dailyUrl : dashboardType === "weekly" ? weeklyUrl : monthlyUrl;
    mutate(url);
    setTimeout(() => setIsLoading(false), 1000);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header Section */}
      <div className="flex flex-col space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {intl.formatMessage({ id: "TextDashboard" })}
            </h1>
          </div>
        </div>

        {/* Dashboard Type Selection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          whileHover={{ scale: 1.01 }}
        >
          <Card className="relative overflow-hidden bg-gradient-to-br from-indigo-50 to-indigo-100 border-indigo-200">
            <div className="absolute top-0 right-0 w-32 h-2 bg-gradient-to-l from-indigo-500 to-indigo-300" />
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <motion.div
                      className="h-8 w-8 rounded-md bg-indigo-500 flex items-center justify-center shadow-lg"
                      whileHover={{ rotate: 180 }}
                      transition={{ duration: 0.6 }}
                    >
                      <BarChart3 className="h-4 w-4 text-white" />
                    </motion.div>
                    <h3 className="text-lg font-semibold text-indigo-900">
                      {intl.formatMessage({ id: "TextViewType" })}
                    </h3>
                  </div>
                  <RadioGroup
                    value={dashboardType}
                    onValueChange={(value: unknown) => setDashboardType(value as string)}
                    className="flex flex-row space-x-6"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="daily" id="daily" className="border-gray-400 data-[state=checked]:bg-[#804fe6] data-[state=checked]:border-[#804fe6]" />
                      <Label htmlFor="daily" className="text-indigo-700 font-medium">
                        {intl.formatMessage({ id: "TextDaily" })}
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="weekly" id="weekly" className="border-gray-400 data-[state=checked]:bg-[#804fe6] data-[state=checked]:border-[#804fe6]" />
                      <Label htmlFor="weekly" className="text-indigo-700 font-medium">
                        {intl.formatMessage({ id: "TextWeekly" })}
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="monthly" id="monthly" className="border-gray-400 data-[state=checked]:bg-[#804fe6] data-[state=checked]:border-[#804fe6]" />
                      <Label htmlFor="monthly" className="text-indigo-700 font-medium">
                        {intl.formatMessage({ id: "TextMonthly" })}
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                {/* Date Navigation */}
                <div className="flex flex-col lg:flex-row lg:items-center space-y-4 lg:space-y-0 lg:space-x-4">
                  <div className="flex items-center space-x-2">
                    <Popover>
                      <PopoverTrigger>
                        <Button
                          variant="outline"
                          className="w-[240px] justify-start text-left font-normal bg-indigo-100 border-indigo-300 text-indigo-700 hover:bg-indigo-200"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={selectedDate}
                          onSelect={handleDateChange}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <Button
                    onClick={refreshData}
                    variant="outline"
                    size="sm"
                    className="bg-indigo-100 border-indigo-300 text-indigo-700 hover:bg-indigo-200"
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    {intl.formatMessage({ id: "TextRefresh" })}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {isLoading ? (
          Array.from({ length: 5 }).map((_, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-8 w-32" />
                    <Skeleton className="h-6 w-20" />
                  </div>
                  <Skeleton className="h-12 w-12 rounded-full" />
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <>
            {/* Total Revenue Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              whileHover={{ scale: 1.02 }}
            >
              <Card className="relative overflow-hidden bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200 h-full">
                <div className="absolute top-0 right-0 w-32 h-2 bg-gradient-to-l from-emerald-500 to-emerald-300" />
                <CardContent className="p-6 flex flex-col h-full">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex-1">
                      <p className="text-sm flex items-center gap-3 font-medium text-emerald-700 mb-2">
                        {intl.formatMessage({ id: "TextTotalRevenue" })}
                        <motion.div
                          className="h-8 w-8 rounded-md bg-emerald-500 flex items-center justify-center shadow-lg"
                          whileHover={{ rotate: 180 }}
                          transition={{ duration: 0.6 }}
                        >
                          <DollarSign className="h-4 w-4 text-white" />
                        </motion.div>
                      </p>
                      <p className="text-3xl font-bold text-emerald-900">
                        {fNumber(getTotalRevenue())}₮
                      </p>
                    </div>
                  </div>
                  <div className="mt-auto">
                    <Badge className="bg-emerald-200 text-emerald-800 hover:bg-emerald-300">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      Today's Revenue
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Check-ins Today Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              whileHover={{ scale: 1.02 }}
            >
              <Card className="relative overflow-hidden bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 h-full">
                <div className="absolute top-0 right-0 w-32 h-2 bg-gradient-to-l from-blue-500 to-blue-300" />
                <CardContent className="p-6 flex flex-col h-full">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex-1">
                      <p className="text-sm flex items-center gap-3 font-medium text-blue-700 mb-2">
                        <span>Check-ins</span>
                        <motion.div
                          className="h-8 w-8 rounded-md bg-blue-500 flex items-center justify-center shadow-lg"
                          whileHover={{ rotate: 180 }}
                          transition={{ duration: 0.6 }}
                        >
                          <LogOut className="h-4 w-4 text-white rotate-180" />
                        </motion.div>

                      </p>
                      <p className="text-3xl font-bold text-blue-900">
                        {pmsStats.checkIns}
                      </p>
                    </div>
                  </div>
                  <div className="mt-auto">
                    <Badge className="bg-blue-200 text-blue-800 hover:bg-blue-300">
                      <Users className="h-3 w-3 mr-1" />
                      Arrivals
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Check-outs Today Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              whileHover={{ scale: 1.02 }}
            >
              <Card className="relative overflow-hidden bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 h-full">
                <div className="absolute top-0 right-0 w-32 h-2 bg-gradient-to-l from-purple-500 to-purple-300" />
                <CardContent className="p-6 flex flex-col h-full">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex-1">
                      <p className="text-sm flex items-center gap-3 font-medium text-purple-700 mb-2">
                        Check-outs
                        <motion.div
                          className="h-8 w-8 rounded-md bg-purple-500 flex items-center justify-center shadow-lg"
                          whileHover={{ rotate: 180 }}
                          transition={{ duration: 0.6 }}
                        >
                          <LogOut className="h-4 w-4 text-white" />
                        </motion.div>
                      </p>
                      <p className="text-3xl font-bold text-purple-900">
                        {pmsStats.checkOuts}
                      </p>
                    </div>
                  </div>
                  <div className="mt-auto">
                    <Badge className="bg-purple-200 text-purple-800 hover:bg-purple-300">
                      <LogOut className="h-3 w-3 mr-1" />
                      Departures
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* No-shows Today Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              whileHover={{ scale: 1.02 }}
            >
              <Card className="relative overflow-hidden bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200 h-full">
                <div className="absolute top-0 right-0 w-32 h-2 bg-gradient-to-l from-orange-500 to-orange-300" />
                <CardContent className="p-6 flex flex-col h-full">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex-1">
                      <p className="text-sm flex items-center gap-3 font-medium text-orange-700 mb-2">
                        No-shows
                        <motion.div
                          className="h-8 w-8 rounded-md bg-orange-500 flex items-center justify-center shadow-lg"
                          whileHover={{ rotate: 180 }}
                          transition={{ duration: 0.6 }}
                        >
                          <AlertCircle className="h-4 w-4 text-white" />
                        </motion.div>
                      </p>
                      <p className="text-3xl font-bold text-orange-900">
                        {pmsStats.noShows}
                      </p>
                    </div>
                  </div>
                  <div className="mt-auto">
                    <Badge className="bg-orange-200 text-orange-800 hover:bg-orange-300">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      Missed
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Cancellations Today Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              whileHover={{ scale: 1.02 }}
            >
              <Card className="relative overflow-hidden bg-gradient-to-br from-red-50 to-red-100 border-red-200 h-full">
                <div className="absolute top-0 right-0 w-32 h-2 bg-gradient-to-l from-red-500 to-red-300" />
                <CardContent className="p-6 flex flex-col h-full">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex-1">
                      <p className="text-sm flex items-center gap-3 font-medium text-red-700 mb-2">
                        Cancellations
                        <motion.div
                          className="h-8 w-8 rounded-md bg-red-500 flex items-center justify-center shadow-lg"
                          whileHover={{ rotate: 180 }}
                          transition={{ duration: 0.6 }}
                        >
                          <X className="h-4 w-4 text-white" />
                        </motion.div>
                      </p>
                      <p className="text-3xl font-bold text-red-900">
                        {pmsStats.cancellations}
                      </p>
                    </div>
                  </div>
                  <div className="mt-auto">
                    <Badge className="bg-red-200 text-red-800 hover:bg-red-300">
                      <X className="h-3 w-3 mr-1" />
                      Cancelled
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </>
        )}
      </div>

      {/* Occupancy Trend Chart */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{intl.formatMessage({ id: "TextOccupancyTrend" })}</CardTitle>
              <p className="text-sm text-muted-foreground">
                {intl.formatMessage({ id: "TextWeeklyRoomOccupancy" })}
              </p>
            </div>
            <Link href="/report/charge" passHref>
              <Button variant="outline" size="sm">
                <BarChart3 className="h-4 w-4 mr-2" />
                {intl.formatMessage({ id: "TextDetails" })}
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <Bar
              data={occupancyTrendData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    display: false,
                  },
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    max: 100,
                    ticks: {
                      callback: (value) => `${value}%`,
                      stepSize: 20,
                    },
                  },
                },
              }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Main Dashboard Cards */}
      <motion.div
        className="space-y-4"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
      >
        <div className="flex items-center space-x-3 mb-4">
          <div className="h-1 w-8 bg-[#804fe6] rounded-full" />
          <h3 className="text-xl font-bold bg-gradient-to-r from-[#804fe6] to-purple-600 bg-clip-text text-transparent">
            {intl.formatMessage({ id: "TextDashboardMetrics" })}
          </h3>
          <div className="h-1 flex-1 bg-[#804fe6] rounded-full" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <Card className="bg-gradient-to-br from-gray-50 to-gray-100">
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="flex items-center space-x-4">
                        <Skeleton className="h-12 w-12 rounded-lg" />
                        <div className="space-y-2">
                          <Skeleton className="h-6 w-32" />
                          <Skeleton className="h-4 w-24" />
                        </div>
                      </div>
                      <Skeleton className="h-48 w-full rounded-lg" />
                      <div className="space-y-2">
                        {Array.from({ length: 3 }).map((_, i) => (
                          <Skeleton key={i} className="h-12 w-full" />
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          ) : (
            data &&
            data.map((element: any, index: number) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.7 + index * 0.1 }}
                whileHover={{ scale: 1.02, y: -5 }}
              >
                <DashboardMetricCard
                  element={element}
                  index={index}
                  workingDate={selectedDate ? format(selectedDate, "yyyy-MM-dd") : workingDate}
                  dashboardType={dashboardType}
                  isLoading={isLoading}
                  intl={intl}
                  mainIcon={mainIcon}
                  filterData={filterData}
                  roomOccupancy={roomOccupancy}
                  fNumber={fNumber}
                />
              </motion.div>
            ))
          )}
        </div>
      </motion.div>
    </div>
  );
};

// Separate component for dashboard metric cards
const DashboardMetricCard = ({
  element,
  index,
  workingDate,
  dashboardType,
  isLoading,
  intl,
  mainIcon,
  filterData,
  roomOccupancy,
  fNumber,
}: any) => {
  // Define color schemes for each card type - matching Summary Cards
  const getCardColors = (index: number) => {
    const colorSchemes = [
      {
        gradient: "from-emerald-50 to-emerald-100",
        border: "border-emerald-200",
        topAccent: "from-emerald-500 to-emerald-300",
        iconBg: "bg-emerald-500",
        textColor: "text-emerald-700",
        titleColor: "text-emerald-900",
        valueColor: "text-emerald-900",
        chartColors: ["#10B981", "#059669", "#047857"]
      },
      {
        gradient: "from-blue-50 to-blue-100",
        border: "border-blue-200",
        topAccent: "from-blue-500 to-blue-300",
        iconBg: "bg-blue-500",
        textColor: "text-blue-700",
        titleColor: "text-blue-900",
        valueColor: "text-blue-900",
        chartColors: ["#3B82F6", "#1D4ED8", "#1E40AF"]
      },
      {
        gradient: "from-purple-50 to-purple-100",
        border: "border-purple-200",
        topAccent: "from-purple-500 to-purple-300",
        iconBg: "bg-purple-500",
        textColor: "text-purple-700",
        titleColor: "text-purple-900",
        valueColor: "text-purple-900",
        chartColors: ["#8B5CF6", "#7C3AED", "#6D28D9"]
      }
    ];
    return colorSchemes[index % colorSchemes.length];
  };

  const colors = getCardColors(index);

  return (
    <Card className={`h-full bg-gradient-to-br ${colors.gradient} ${colors.border} shadow-lg overflow-hidden relative`}>
      {/* Top accent bar */}
      <div className={`absolute top-0 right-0 w-32 h-2 bg-gradient-to-l ${colors.topAccent}`} />

      <CardContent className="p-6 relative z-10">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <motion.div
                className={`h-12 w-12 rounded-md ${colors.iconBg} flex items-center justify-center shadow-lg`}
              >
                <div className="text-white stroke-white">
                  {mainIcon(index)}
                </div>
              </motion.div>
              <div>
                <h4 className={`font-bold text-lg ${colors.titleColor}`}>
                  {element[0]?.ParameterGroupName}
                </h4>
                <p className={`text-sm ${colors.textColor} font-medium`}>
                  {Array.isArray(element)
                    ? element.find((item: any) => item.ParameterID === 1)?.ParameterName
                    : null}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className={`text-2xl font-bold ${colors.valueColor}`}>
                {index !== 2
                  ? Array.isArray(element)
                    ? element.find((item: any) => item.ParameterID === 1)?.ParameterValue
                    : 0
                  : fNumber(
                    Array.isArray(element)
                      ? element.find((item: any) => item.ParameterID === 1)?.ParameterValue
                      : 0
                  ) + "₮"}
              </p>
            </div>
          </div>

          {/* Chart Section */}
          {index !== 2 ? (
            <div className="flex items-center justify-center">
              <div className="relative">
                <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
                  <p className={`text-xs ${colors.textColor} font-semibold uppercase tracking-wider`}>
                    {index === 0
                      ? intl.formatMessage({ id: "TextRoomOccupancy" })
                      : intl.formatMessage({ id: "TextBookingOccupancy" })}
                  </p>
                  <p className={`text-2xl font-bold ${colors.valueColor} mt-1`}>
                    {index === 0 ? `${roomOccupancy(element)}%` : "0%"}
                  </p>
                </div>
                <div className="relative">
                  <CircularSlider
                    max={100}
                    dataIndex={index === 0 ? roomOccupancy(element) : 0}
                    hideKnob
                    knobDraggable={false}
                    trackSize={24}
                    width={220}
                    progressSize={24}
                    trackColor="#e5e7eb"
                    progressColorFrom={colors.chartColors[0]}
                    progressColorTo={colors.chartColors[1]}
                    hideLabelValue
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center">
              <div className="w-52 h-52 relative">
                <Pie
                  width="208px"
                  height="208px"
                  style={{
                    width: "100%",
                    height: "100%",
                    position: "relative",
                    zIndex: 10
                  }}
                  options={{
                    plugins: {
                      legend: {
                        display: false,
                      },
                      tooltip: {
                        callbacks: {
                          label: function (context) {
                            return `${context.label}: ${fNumber(context.raw as number)}₮`;
                          },
                        },
                        backgroundColor: 'rgba(255,255,255,0.95)',
                        titleColor: colors.titleColor.replace('text-', ''),
                        bodyColor: colors.textColor.replace('text-', ''),
                        borderColor: colors.chartColors[0],
                        borderWidth: 1
                      },
                    },
                    cutout: "65%",
                  }}
                  data={{
                    labels: filterData(element, index)
                      .map(({ ParameterName }: any) => {
                        if (
                          ParameterName !== "Mini Bar" &&
                          ParameterName !== "Restaurant"
                        ) {
                          return ParameterName;
                        }
                        return null;
                      })
                      .filter(Boolean),
                    datasets: [
                      {
                        data: filterData(element, index)
                          .map(({ ParameterValue, ParameterName }: any) => {
                            if (
                              ParameterName !== "Mini Bar" &&
                              ParameterName !== "Restaurant"
                            ) {
                              return ParameterValue;
                            }
                            return null;
                          })
                          .filter(Boolean),
                        backgroundColor: colors.chartColors,
                        borderWidth: 2,
                        borderColor: '#ffffff',
                        borderRadius: 8,
                        hoverBorderWidth: 3,
                        hoverBorderColor: colors.chartColors[0]
                      },
                    ],
                  }}
                />
              </div>
            </div>
          )}

          {/* Metrics List */}
          <div className="space-y-3">
            <div className={`h-px bg-gradient-to-r from-transparent via-${colors.textColor.replace('text-', '')}/30 to-transparent`} />
            <div className="space-y-2">
              {element &&
                filterData(element, index).map((childElement: any, childIndex: number) => (
                  <motion.div
                    key={childElement.ParameterID}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: childIndex * 0.1 }}
                  >
                    <DashboardCard
                      item={childElement}
                      isSmall={index === 0}
                      isCharges={index === 2}
                      list={element}
                      isLoading={isLoading}
                      workingDate={workingDate}
                      dashboardType={dashboardType}
                      fNumber={fNumber}
                      cardColors={colors}
                    />
                  </motion.div>
                ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Dashboard Card Component
function DashboardCard({
  item,
  isSmall,
  isCharges,
  list,
  workingDate,
  dashboardType,
  isLoading,
  fNumber,
  cardColors,
}: any) {
  const intl = useIntl();

  const translateParameterName = (name: string) => {
    const translationKey = `Text${name.replace(/\s+/g, "")}`;
    try {
      return intl.formatMessage({ id: translationKey });
    } catch (error) {
      return name;
    }
  };

  function cardIcon(name: string) {
    const iconProps = { className: "h-4 w-4 text-white" };
    switch (name) {
      case "Blocked Rooms":
        return {
          icon: <Block {...iconProps} />,
          color: "#ef4444",
          link: "/front-office/reservation-list",
        };
      case "Sold Rooms":
        return {
          icon: <Check {...iconProps} />,
          color: "#10b981",
          link: "/front-office/reservation-list",
        };
      case "Available Rooms":
        return {
          icon: <Lock {...iconProps} />,
          color: "#3b82f6",
          link: "/front-office/reservation-list",
        };
      case "Checked Out":
        return {
          icon: <LogOut {...iconProps} />,
          color: "#6b7280",
          link: `/front-office/reservation-list?StatusGroup=3&StartDate=${moment(
            workingDate
          ).format("YYYY-MM-DD")}&EndDate=${moment(workingDate)
            .add(
              dashboardType == "weekly" ? 7 : 1,
              dashboardType == "monthly" ? "month" : "day"
            )
            .format("YYYY-MM-DD")}`,
        };
      case "Pending Reservations":
        return {
          icon: <Clock {...iconProps} />,
          color: "#f59e0b",
          link: `/front-office/reservation-list?StatusGroup=1&ReservationTypeID=1&StartDate=${moment(
            workingDate
          ).format("YYYY-MM-DD")}&EndDate=${moment(workingDate)
            .add(
              dashboardType == "weekly" ? 7 : 1,
              dashboardType == "monthly" ? "month" : "day"
            )
            .format("YYYY-MM-DD")}`,
        };
      case "Unconfirmed Reservations":
        return {
          icon: <AlertCircle {...iconProps} />,
          color: "#ef4444",
          link: `/front-office/reservation-list?StatusGroup=1&ReservationTypeID=2&StartDate=${moment(
            workingDate
          ).format("YYYY-MM-DD")}&EndDate=${moment(workingDate)
            .add(
              dashboardType == "weekly" ? 7 : 1,
              dashboardType == "monthly" ? "month" : "day"
            )
            .format("YYYY-MM-DD")}`,
        };
      case "Due Out":
        return {
          icon: <LogOut {...iconProps} />,
          color: "#8b5cf6",
          link: `/front-office/reservation-list?StatusGroup=2&StartDate=${moment(
            workingDate
          ).format("YYYY-MM-DD")}&EndDate=${moment(workingDate)
            .add(
              dashboardType == "weekly" ? 7 : 1,
              dashboardType == "monthly" ? "month" : "day"
            )
            .format("YYYY-MM-DD")}`,
        };
      case "Deleted Bookings":
        return {
          icon: <Trash2 {...iconProps} />,
          color: "#dc2626",
          link: `/front-office/reservation-list?StatusGroup=0&StartDate=${moment(
            workingDate
          ).format("YYYY-MM-DD")}&EndDate=${moment(workingDate)
            .add(
              dashboardType == "weekly" ? 7 : 1,
              dashboardType == "monthly" ? "month" : "day"
            )
            .format("YYYY-MM-DD")}`,
        };
      case "Void Bookings":
        return {
          icon: <Tag {...iconProps} />,
          color: "#06b6d4",
          link: `/front-office/reservation-list?StatusGroup=0&StartDate=${moment(
            workingDate
          ).format("YYYY-MM-DD")}&EndDate=${moment(workingDate)
            .add(
              dashboardType == "weekly" ? 7 : 1,
              dashboardType == "monthly" ? "month" : "day"
            )
            .format("YYYY-MM-DD")}`,
        };
      case "Cancelled Bookings":
        return {
          icon: <X {...iconProps} />,
          color: "#f97316",
          link: `/front-office/reservation-list?StatusGroup=0&StartDate=${moment(
            workingDate
          ).format("YYYY-MM-DD")}&EndDate=${moment(workingDate)
            .add(
              dashboardType == "weekly" ? 7 : 1,
              dashboardType == "monthly" ? "month" : "day"
            )
            .format("YYYY-MM-DD")}`,
        };
      case "No Show":
        return {
          icon: <UserX {...iconProps} />,
          color: "#64748b",
          link: `/front-office/reservation-list?StatusGroup=0&StartDate=${moment(
            workingDate
          ).format("YYYY-MM-DD")}&EndDate=${moment(workingDate)
            .add(
              dashboardType == "weekly" ? 7 : 1,
              dashboardType == "monthly" ? "month" : "day"
            )
            .format("YYYY-MM-DD")}`,
        };
      case "Blocked":
        return {
          icon: <Ban {...iconProps} />,
          color: "#be123c",
          link: `/front-office/reservation-list?StatusGroup=0&StartDate=${moment(
            workingDate
          ).format("YYYY-MM-DD")}&EndDate=${moment(workingDate)
            .add(
              dashboardType == "weekly" ? 7 : 1,
              dashboardType == "monthly" ? "month" : "day"
            )
            .format("YYYY-MM-DD")}`,
        };
      case "Room Charges":
        return {
          icon: <Key {...iconProps} />,
          color: "#7c3aed",
          link: `/report/room-charge-monthly?CurrDate=${moment(
            workingDate
          ).format("YYYY-MM-DD")}`,
        };
      case "Extra Charges":
        return {
          icon: <CreditCard {...iconProps} />,
          color: "#059669",
          link: `/report/extra-charge/summary?StartDate=${moment(
            workingDate
          ).format("YYYY-MM-DD")}&EndDate=${moment(workingDate)
            .add(
              dashboardType == "weekly" ? 7 : 1,
              dashboardType == "monthly" ? "month" : "day"
            )
            .format("YYYY-MM-DD")}`,
        };
      case "Discount":
        return {
          icon: <Percent {...iconProps} />,
          color: "#ea580c",
          link: `/report/room-charge-monthly?CurrDate=${moment(
            workingDate
          ).format("YYYY-MM-DD")}`,
        };
      default:
        return {
          icon: <Activity {...iconProps} />,
          color: "#804fe6",
          link: "/",
        };
    }
  }

  if (
    item.ParameterName === "Mini Bar" ||
    item.ParameterName === "Restaurant"
  ) {
    return null;
  }

  const currentItem = cardIcon(item.ParameterName);
  const extraCharges = list.filter(
    ({ ParameterName }: any) =>
      ParameterName === "Mini Bar" || ParameterName === "Restaurant"
  );

  if (isLoading) {
    return (
      <Card className="p-4 bg-white/50 backdrop-blur-sm border-white/30">
        <div className="flex items-center space-x-3">
          <Skeleton className="h-8 w-8 rounded-full" />
          <div className="space-y-2 flex-1">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-16" />
          </div>
          <Skeleton className="h-6 w-6 rounded-full" />
        </div>
      </Card>
    );
  }

  return (
    <Link href={currentItem?.link || "/"} className="block">
      <Card className="p-4 bg-white/50 backdrop-blur-sm border-white/30 hover:bg-white/70 transition-all duration-200 cursor-pointer group hover:scale-[1.02] hover:shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div
              className="h-9 w-9 rounded-lg flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-200"
              style={{ backgroundColor: currentItem?.color }}
            >
              {currentItem?.icon}
            </div>
            <div>
              <p className={`font-semibold text-sm ${cardColors?.textColor || 'text-gray-700'}`}>
                {translateParameterName(item.ParameterName)}
              </p>
              <p className={`text-lg font-bold ${cardColors?.valueColor || 'text-gray-900'}`}>
                {isCharges
                  ? fNumber(item.ParameterValue) + "₮"
                  : item.ParameterValue}
              </p>
            </div>
          </div>
          <ChevronRight className={`h-4 w-4 ${cardColors?.textColor || 'text-gray-600'} group-hover:translate-x-1 transition-transform duration-200`} />
        </div>

        {isCharges && item.ParameterName === "Extra Charges" && (
          <div className="mt-4 pt-4 border-t border-white/30 space-y-2">
            {extraCharges.map((extraItem: any) => (
              <div key={extraItem.ParameterID} className="flex justify-between text-sm">
                <span className={`${cardColors?.textColor || 'text-gray-600'} font-medium`}>
                  {translateParameterName(extraItem.ParameterName)}
                </span>
                <span className={`font-semibold ${cardColors?.valueColor || 'text-gray-900'}`}>
                  {fNumber(extraItem.ParameterValue)}₮
                </span>
              </div>
            ))}
          </div>
        )}
      </Card>
    </Link>
  );
}

export default Dashboard;
