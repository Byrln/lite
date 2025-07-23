import {
  Grid,
  Typography,
  TextField,
  CardContent,
  Card,
  Box,
  Paper,
  Divider,
  Button,
  IconButton,
  Chip,
  Tooltip as MuiTooltip,
  useTheme,
  Container,
  Stack,
  Skeleton,
  useMediaQuery,
  alpha,
  CircularProgress,
} from "@mui/material";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import { useState, useEffect } from "react";
import { useIntl } from "react-intl";
import { format, subDays, addDays } from "date-fns";
import CircularSlider from "@fseehawer/react-circular-slider";
import {
  Check,
  ChevronRight,
  Close,
  CreditCard,
  Delete,
  Discount,
  DoNotDisturb,
  DryCleaning,
  HourglassEmpty,
  Key,
  Lock,
  Logout,
  Pending,
  PersonOff,
  Receipt,
  Sell,
  Task,
  TrendingUp,
  TrendingDown,
  CalendarToday,
  Dashboard as DashboardIcon,
  ArrowBack,
  ArrowForward,
  AttachMoney,
  BarChart,
  PeopleAlt,
  Hotel,
  LocalOffer,
  Refresh,
} from "@mui/icons-material";
import { Pie, Line, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
} from "chart.js";
import Link from "next/link";
import moment from "moment";
import AdapterDateFns from "@date-io/date-fns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

import {
  DashboardSWR,
  dailyUrl,
  weeklyUrl,
  monthlyUrl,
} from "lib/api/dashboard";
import { mutate } from "swr";

import { fNumber } from "lib/utils/format-number";
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
  const theme = useTheme();
  const intl = useIntl();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  const [dashboardType, setDashboardType] = useState("daily");
  const [selectedDate, setSelectedDate] = useState<Date | null>(
    new Date(workingDate)
  );
  const [isLoading, setIsLoading] = useState(false);
  const [showForecast, setShowForecast] = useState(false);

  const { data } = DashboardSWR(
    dashboardType,
    selectedDate || new Date(workingDate)
  );

  // Generate forecast data from real API data
  const generateForecastData = () => {
    if (!data || !data[2]) {
      return {
        labels: [
          "Today",
          "Tomorrow",
          "Day 3",
          "Day 4",
          "Day 5",
          "Day 6",
          "Day 7",
        ],
        datasets: [
          {
            label: "Revenue Forecast",
            data: [0, 0, 0, 0, 0, 0, 0],
            borderColor: theme.palette.primary.main,
            backgroundColor: "rgba(120, 86, 222, 0.1)",
            fill: true,
            tension: 0.4,
          },
        ],
      };
    }

    // Extract revenue data from API response
    const revenueData =
      data && data[2] && Array.isArray(data[2])
        ? data[2].filter(
          (item: any) => item.ParameterName === "Total Charges"
        )
        : [];

    const labels = revenueData.map((item: any, index: number) => {
      if (dashboardType === "daily") {
        return item.ParameterDate
          ? format(new Date(item.ParameterDate), "EEE")
          : `Day ${index + 1}`;
      } else if (dashboardType === "weekly") {
        return item.ParameterDate
          ? `Week ${format(new Date(item.ParameterDate), "w")}`
          : `Week ${index + 1}`;
      } else {
        return item.ParameterDate
          ? format(new Date(item.ParameterDate), "MMM d")
          : `Day ${index + 1}`;
      }
    });

    const values = revenueData.map((item: any) => item.ParameterValue || 0);

    return {
      labels,
      datasets: [
        {
          label: "Revenue Forecast",
          data: values,
          borderColor: theme.palette.primary.main,
          backgroundColor: "rgba(120, 86, 222, 0.1)",
          fill: true,
          tension: 0.4,
        },
      ],
    };
  };

  // Generate occupancy trend data from real API data
  const generateOccupancyTrendData = () => {
    if (!data || !data[0]) {
      return {
        labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        datasets: [
          {
            label: "Room Occupancy %",
            data: [0, 0, 0, 0, 0, 0, 0],
            backgroundColor: "#28C76F",
            borderRadius: 6,
          },
        ],
      };
    }

    // Extract occupancy data from API response
    const occupancyData =
      data && data[0] && Array.isArray(data[0])
        ? data[0].filter(
          (item: any) => item.ParameterName === "Room Occupancy"
        )
        : [];

    // If we have data, use it; otherwise use placeholder
    const labels = occupancyData.map((item: any, index: number) => {
      if (dashboardType === "daily") {
        return item.ParameterDate
          ? format(new Date(item.ParameterDate), "EEE")
          : `Day ${index + 1}`;
      } else if (dashboardType === "weekly") {
        return item.ParameterDate
          ? `Week ${format(new Date(item.ParameterDate), "w")}`
          : `Week ${index + 1}`;
      } else {
        return item.ParameterDate
          ? format(new Date(item.ParameterDate), "MMM d")
          : `Day ${index + 1}`;
      }
    });

    const values = occupancyData.map(
      (item: any) => item.ParameterValue || 0
    );

    return {
      labels,
      datasets: [
        {
          label: "Room Occupancy %",
          data: values,
          backgroundColor: "#28C76F",
          borderRadius: 6,
        },
      ],
    };
  };

  // Use real data for charts
  const forecastData = generateForecastData();
  const occupancyTrendData = generateOccupancyTrendData();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let value = (event.target as HTMLInputElement).value;
    setIsLoading(true);
    setDashboardType(value);
    setTimeout(() => setIsLoading(false), 500); // Simulate loading
  };

  const handleDateChange = async (
    value: unknown,
    keyboardInputValue?: string
  ) => {
    console.log("testestes", value);
    const newDate = value as Date | null;
    if (newDate) {
      console.log("testestes2222", value);

      setIsLoading(true);
      setSelectedDate(value as Date | null);
      await mutate(
        dashboardType == "daily"
          ? dailyUrl
          : dashboardType == "weekly"
            ? weeklyUrl
            : monthlyUrl
      );
      setTimeout(() => setIsLoading(false), 500); // Simulate loading
    }
  };

  const navigateDate = (direction: "forward" | "back") => {
    if (selectedDate) {
      const newDate =
        direction === "forward"
          ? addDays(
            selectedDate,
            dashboardType === "daily"
              ? 1
              : dashboardType === "weekly"
                ? 7
                : 30
          )
          : subDays(
            selectedDate,
            dashboardType === "daily"
              ? 1
              : dashboardType === "weekly"
                ? 7
                : 30
          );
      handleDateChange(newDate);
    }
  };

  function roomOccupancy(element: any) {
    if (!Array.isArray(element)) return 0;
    return (
      element.find((item: any) => item.ParameterName === "Room Occupancy")
        ?.ParameterValue || 0
    );
  }

  function filterData(element: any, index: number) {
    if (!Array.isArray(element)) return [];
    switch (index) {
      case 0:
        return element.filter(
          (item: any) =>
            item.ParameterName !== "Room Occupancy" &&
            item.ParameterName !== "Total Rooms"
        );
      case 1:
        return element.filter(
          (item: any) =>
            item.ParameterName !== "Checked In" &&
            item.ParameterName !== "Booking Occupancy"
        );
      case 2:
        return element.filter(
          (item: any) => item.ParameterName !== "Total Charges"
        );
      default:
        return [];
    }
  }

  function mainIcon(index: number) {
    const style = {
      fontSize: "24px",
      color: "#7856DE",
    };

    switch (index) {
      case 0:
        return <Hotel style={style} />;
      case 1:
        return <PeopleAlt style={style} />;
      case 2:
        return <AttachMoney style={style} />;
      default:
        return <DashboardIcon style={style} />;
    }
  }

  // Calculate total revenue and guests from data
  const getTotalRevenue = () => {
    if (!data || !data[2]) return 0;
    const totalCharges =
      data && data[2] && Array.isArray(data[2])
        ? data[2].find(
          (item: any) => item.ParameterName === "Total Charges"
        )
        : null;
    return totalCharges ? totalCharges.ParameterValue : 0;
  };

  const getTotalGuests = () => {
    if (!data || !data[1]) return 0;
    const checkedIn =
      data && data[1] && Array.isArray(data[1])
        ? data[1].find(
          (item: any) => item.ParameterName === "Checked In"
        )
        : null;
    return checkedIn ? checkedIn.ParameterValue : 0;
  };

  const getAverageOccupancy = () => {
    if (!data || !data[0] || !Array.isArray(data[0])) return 0;
    return roomOccupancy(data[0]);
  };

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      {/* Header with date controls and type selector */}
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2, md: 3 },
          mb: 3,
          borderRadius: 2,
          background: (theme) => `linear-gradient(to right, ${alpha(theme.palette.primary.main, 0.02)}, ${alpha(theme.palette.background.paper, 1)})`,
          boxShadow: "0 4px 20px 0 rgba(0,0,0,0.05)",
          position: "relative",
          overflow: "hidden",
          "&::after": {
            content: '""',
            position: "absolute",
            top: 0,
            right: 0,
            width: "30%",
            height: "100%",
            background: (theme) => `linear-gradient(to left, ${alpha(theme.palette.primary.main, 0.03)}, transparent)`,
            zIndex: 0,
          }
        }}
      >
        {isLoading ? (
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={6}>
              <Box display="flex" alignItems="center" gap={1}>
                <Skeleton variant="circular" width={24} height={24} />
                <Skeleton variant="text" width={180} height={40} />
              </Box>
              <Skeleton variant="text" width={240} height={24} sx={{ mt: 1 }} />
            </Grid>
            <Grid item xs={12} md={6}>
              <Box
                display="flex"
                flexWrap="wrap"
                gap={2}
                justifyContent={{
                  xs: "flex-start",
                  md: "flex-end",
                }}
                alignItems="center"
              >
                <Skeleton variant="rectangular" width={200} height={40} sx={{ borderRadius: 1 }} />
                <Skeleton variant="rectangular" width={240} height={40} sx={{ borderRadius: 1 }} />
              </Box>
            </Grid>
          </Grid>
        ) : (
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={6}>
              <Box display="flex" alignItems="center" gap={1}>
                <Box
                  sx={{
                    bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1),
                    borderRadius: "50%",
                    p: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <DashboardIcon color="primary" />
                </Box>
                <Typography variant="h4" fontWeight="bold">
                  {intl.formatMessage({ id: "TextDashboard" })}
                </Typography>
              </Box>
              <Typography
                variant="subtitle1"
                color="text.secondary"
                sx={{ mt: 1 }}
              >
                {dashboardType === "daily"
                  ? intl.formatMessage({
                    id: "TextDailyOverview",
                  })
                  : dashboardType === "weekly"
                    ? intl.formatMessage({
                      id: "TextWeeklyPerformance",
                    })
                    : intl.formatMessage({
                      id: "TextMonthlyAnalysis",
                    })}
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box
                display="flex"
                flexDirection={{ xs: "column", sm: "row" }}
                flexWrap="wrap"
                gap={2}
                justifyContent={{
                  xs: "flex-start",
                  md: "flex-end",
                }}
                alignItems={{ xs: "flex-start", sm: "center" }}
              >
                <Box
                  display="flex"
                  alignItems="center"
                  gap={1}
                  sx={{
                    bgcolor: (theme) => alpha(theme.palette.background.paper, 0.6),
                    borderRadius: 1,
                    p: 0.5,
                    border: "1px solid",
                    borderColor: "divider",
                  }}
                >
                  <IconButton
                    size="small"
                    onClick={() => navigateDate("back")}
                    sx={{
                      bgcolor: (theme) => alpha(theme.palette.primary.main, 0.05),
                      '&:hover': {
                        bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1),
                      }
                    }}
                  >
                    <ArrowBack fontSize="small" />
                  </IconButton>
                  <DatePicker
                    value={selectedDate}
                    onChange={handleDateChange}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        size="small"
                        sx={{
                          width: { xs: 120, sm: 150 },
                          '& .MuiOutlinedInput-notchedOutline': {
                            border: 'none'
                          },
                          '& .MuiOutlinedInput-root': {
                            bgcolor: 'transparent'
                          }
                        }}
                      />
                    )}
                  />
                  <IconButton
                    size="small"
                    onClick={() => navigateDate("forward")}
                    sx={{
                      bgcolor: (theme) => alpha(theme.palette.primary.main, 0.05),
                      '&:hover': {
                        bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1),
                      }
                    }}
                  >
                    <ArrowForward fontSize="small" />
                  </IconButton>
                </Box>
                <Box
                  sx={{
                    bgcolor: (theme) => alpha(theme.palette.background.paper, 0.6),
                    borderRadius: 1,
                    p: 0.5,
                    border: "1px solid",
                    borderColor: "divider",
                  }}
                >
                  <RadioGroup
                    row
                    aria-labelledby="dashboard-type-radio-group"
                    name="dashboard-type-radio-group"
                    onChange={handleChange}
                    value={dashboardType}
                    sx={{
                      "& .MuiFormControlLabel-root": {
                        marginRight: 1,
                        marginLeft: 0,
                      },
                      "& .MuiRadio-root": {
                        padding: "4px",
                      },
                    }}
                  >
                    <FormControlLabel
                      value="daily"
                      control={<Radio size="small" />}
                      label={
                        <Typography variant="body2">
                          {intl.formatMessage({
                            id: "TextDaily",
                          })}
                        </Typography>
                      }
                    />
                    <FormControlLabel
                      value="weekly"
                      control={<Radio size="small" />}
                      label={
                        <Typography variant="body2">
                          {intl.formatMessage({
                            id: "TextWeekly",
                          })}
                        </Typography>
                      }
                    />
                    <FormControlLabel
                      value="monthly"
                      control={<Radio size="small" />}
                      label={
                        <Typography variant="body2">
                          {intl.formatMessage({
                            id: "TextMonthly",
                          })}
                        </Typography>
                      }
                    />
                  </RadioGroup>
                </Box>
                <IconButton
                  size="small"
                  onClick={() => {
                    setIsLoading(true);
                    setTimeout(() => setIsLoading(false), 500);
                  }}
                  sx={{
                    bgcolor: (theme) => alpha(theme.palette.primary.main, 0.05),
                    '&:hover': {
                      bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1),
                    }
                  }}
                >
                  <Refresh fontSize="small" />
                </IconButton>
              </Box>
            </Grid>
          </Grid>
        )}
      </Paper>
      {/* Summary Cards */}
      <Box mb={3}>
        {isLoading ? (
          <Grid container spacing={2}>
            {[0, 1, 2].map((index) => (
              <Grid item xs={12} sm={6} md={4} key={`summary-skeleton-${index}`}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    height: "100%",
                    borderRadius: 2,
                    boxShadow: "0 4px 20px 0 rgba(0,0,0,0.05)",
                  }}
                >
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Box width="70%">
                      <Skeleton variant="text" width="60%" height={24} />
                      <Skeleton variant="text" width="80%" height={60} sx={{ my: 1 }} />
                      <Skeleton variant="rectangular" width={100} height={24} sx={{ borderRadius: 1 }} />
                    </Box>
                    <Skeleton variant="circular" width={56} height={56} />
                  </Stack>
                </Paper>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={4}>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  height: "100%",
                  borderRadius: 2,
                  background: (theme) => `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.08)}, ${alpha(theme.palette.primary.main, 0.12)})`,
                  boxShadow: "0 4px 20px 0 rgba(0,0,0,0.05)",
                  transition: "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
                  "&:hover": {
                    transform: "translateY(-5px)",
                    boxShadow: "0 8px 25px 0 rgba(0,0,0,0.1)",
                  },
                }}
              >
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Box>
                    <Typography
                      color="text.secondary"
                      variant="body2"
                      fontWeight="medium"
                    >
                      {intl.formatMessage({
                        id: "TextTotalRevenue",
                      })}
                    </Typography>
                    <Typography
                      variant={isMobile ? "h4" : "h3"}
                      fontWeight="bold"
                      sx={{ my: 1 }}
                    >
                      {fNumber(getTotalRevenue())}₮
                    </Typography>
                    <Box
                      display="flex"
                      alignItems="center"
                      gap={1}
                    >
                      <Chip
                        icon={
                          <TrendingUp fontSize="small" />
                        }
                        label={intl.formatMessage(
                          {
                            id: "TextPercentFromLastPeriod",
                          },
                          { percent: "+12%" }
                        )}
                        size="small"
                        color="success"
                        sx={{ height: 24 }}
                      />
                    </Box>
                  </Box>
                  <Box
                    sx={{
                      width: 56,
                      height: 56,
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: (theme) => alpha(theme.palette.primary.main, 0.12),
                      boxShadow: "0 4px 12px 0 rgba(120, 86, 222, 0.2)",
                    }}
                  >
                    <AttachMoney
                      sx={{ fontSize: 30, color: "primary.main" }}
                    />
                  </Box>
                </Stack>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  height: "100%",
                  borderRadius: 2,
                  background: "linear-gradient(135deg, #28C76F11, #28C76F22)",
                  boxShadow: "0 4px 20px 0 rgba(0,0,0,0.05)",
                  transition: "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
                  "&:hover": {
                    transform: "translateY(-5px)",
                    boxShadow: "0 8px 25px 0 rgba(0,0,0,0.1)",
                  },
                }}
              >
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Box>
                    <Typography
                      color="text.secondary"
                      variant="body2"
                      fontWeight="medium"
                    >
                      {intl.formatMessage({
                        id: "TextTotalGuests",
                      })}
                    </Typography>
                    <Typography
                      variant={isMobile ? "h4" : "h3"}
                      fontWeight="bold"
                      sx={{ my: 1 }}
                    >
                      {getTotalGuests()}
                    </Typography>
                    <Box
                      display="flex"
                      alignItems="center"
                      gap={1}
                    >
                      <Chip
                        icon={
                          <TrendingUp fontSize="small" />
                        }
                        label={intl.formatMessage(
                          {
                            id: "TextPercentFromLastPeriod",
                          },
                          { percent: "+5%" }
                        )}
                        size="small"
                        color="success"
                        sx={{ height: 24 }}
                      />
                    </Box>
                  </Box>
                  <Box
                    sx={{
                      width: 56,
                      height: 56,
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: "#28C76F22",
                      boxShadow: "0 4px 12px 0 rgba(40, 199, 111, 0.2)",
                    }}
                  >
                    <PeopleAlt
                      sx={{ fontSize: 30, color: "#28C76F" }}
                    />
                  </Box>
                </Stack>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  height: "100%",
                  borderRadius: 2,
                  background: "linear-gradient(135deg, #00CFE811, #00CFE822)",
                  boxShadow: "0 4px 20px 0 rgba(0,0,0,0.05)",
                  transition: "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
                  "&:hover": {
                    transform: "translateY(-5px)",
                    boxShadow: "0 8px 25px 0 rgba(0,0,0,0.1)",
                  },
                }}
              >
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Box>
                    <Typography
                      color="text.secondary"
                      variant="body2"
                      fontWeight="medium"
                    >
                      {intl.formatMessage({
                        id: "TextAverageOccupancy",
                      })}
                    </Typography>
                    <Typography
                      variant={isMobile ? "h4" : "h3"}
                      fontWeight="bold"
                      sx={{ my: 1 }}
                    >
                      {getAverageOccupancy()}%
                    </Typography>
                    <Box
                      display="flex"
                      alignItems="center"
                      gap={1}
                    >
                      <Chip
                        icon={
                          <TrendingDown fontSize="small" />
                        }
                        label={intl.formatMessage(
                          {
                            id: "TextPercentFromLastPeriod",
                          },
                          { percent: "-2%" }
                        )}
                        size="small"
                        color="error"
                        sx={{ height: 24 }}
                      />
                    </Box>
                  </Box>
                  <Box
                    sx={{
                      width: 56,
                      height: 56,
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: "#00CFE822",
                      boxShadow: "0 4px 12px 0 rgba(0, 207, 232, 0.2)",
                    }}
                  >
                    <Hotel
                      sx={{ fontSize: 30, color: "#00CFE8" }}
                    />
                  </Box>
                </Stack>
              </Paper>
            </Grid>
          </Grid>
        )}
      </Box>
      {/* Occupancy Trend Chart */}
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2, md: 3 },
          mb: 3,
          borderRadius: 2,
          boxShadow: "0 4px 20px 0 rgba(0,0,0,0.05)",
          overflow: "hidden",
          position: "relative",
          "&::after": {
            content: '""',
            position: "absolute",
            top: 0,
            right: 0,
            width: "30%",
            height: "5px",
            background: (theme) => `linear-gradient(to left, ${alpha(theme.palette.primary.main, 0.7)}, transparent)`,
            borderTopRightRadius: 2,
          }
        }}
      >
        <Box
          display="flex"
          flexDirection={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "flex-start", sm: "center" }}
          mb={2}
        >
          <Box>
            <Typography variant={isMobile ? "subtitle1" : "h6"} fontWeight="bold">
              {intl.formatMessage({ id: "TextOccupancyTrend" })}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {intl.formatMessage({
                id: "TextWeeklyRoomOccupancy",
              })}
            </Typography>
          </Box>
          <MuiTooltip
            title={intl.formatMessage({
              id: "TextViewDetailedReport",
            })}
          >
            <Link href="/report/charge" passHref legacyBehavior>
              <Button
                variant="outlined"
                size="small"
                startIcon={<BarChart />}
                sx={{ borderRadius: 2 }}
                component="a"
              >
              {intl.formatMessage({ id: "TextDetails" })}
            </Button>
            </Link>
          </MuiTooltip>
        </Box>
        <Box height={250}>
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
                    stepSize: 20, // Set step size to 20% increments
                  },
                },
              },
            }}
          />
        </Box>
      </Paper>
      {/* Revenue Forecast */}
      <Box mb={3}>
        <Box
          display="flex"
          flexDirection={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "flex-start", sm: "center" }}
          mb={2}
          gap={1}
        >
          <Box>
            <Typography variant={isMobile ? "subtitle1" : "h6"} fontWeight="bold">
              {intl.formatMessage({ id: "TextRevenueForecast" })}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {intl.formatMessage({ id: "TextProjectedRevenue" }, { period: dashboardType })}
            </Typography>
          </Box>
          <Button
            variant="contained"
            size="small"
            onClick={() => setShowForecast(!showForecast)}
            startIcon={
              showForecast ? <TrendingDown /> : <TrendingUp />
            }
            sx={{
              borderRadius: 2,
              bgcolor: (theme) => showForecast ? alpha(theme.palette.error.main, 0.8) : alpha(theme.palette.success.main, 0.8),
              '&:hover': {
                bgcolor: (theme) => showForecast ? theme.palette.error.main : theme.palette.success.main,
              }
            }}
          >
            {showForecast
              ? intl.formatMessage({ id: "TextHideForecast" })
              : intl.formatMessage({ id: "TextShowForecast" })}
          </Button>
        </Box>
        {showForecast && (
          <Paper
            elevation={0}
            sx={{
              p: { xs: 2, md: 3 },
              borderRadius: 2,
              boxShadow: "0 4px 20px 0 rgba(0,0,0,0.05)",
              overflow: "hidden",
              position: "relative",
              transition: "all 0.3s ease",
              "&:hover": {
                boxShadow: "0 8px 24px 0 rgba(0,0,0,0.1)",
              },
              "&::after": {
                content: '""',
                position: "absolute",
                top: 0,
                right: 0,
                width: "30%",
                height: "5px",
                background: (theme) => `linear-gradient(to left, ${alpha(theme.palette.success.main, 0.7)}, transparent)`,
                borderTopRightRadius: 2,
              }
            }}
          >
            {isLoading ? (
              <Box height={250} display="flex" alignItems="center" justifyContent="center">
                <CircularProgress />
              </Box>
            ) : (
              <Box height={250}>
                <Line
                  data={forecastData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: "top",
                      },
                    },
                    scales: {
                      y: {
                        beginAtZero: false,
                        ticks: {
                          callback: (value) =>
                            `${value}₮`,
                        },
                      },
                    },
                  }}
                />
              </Box>
            )}
          </Paper>
        )}
      </Box>
      {/* Main Dashboard Cards */}
      <Box mb={3}>
        <Typography variant={isMobile ? "subtitle1" : "h6"} fontWeight="bold" mb={2}>
          {intl.formatMessage({ id: "TextDashboardMetrics" })}
        </Typography>
        <Grid container spacing={3} sx={{ width: "100%" }}>
          {isLoading ? (
            <>
              {[0, 1, 2].map((index) => (
                <Grid item xl={4} md={6} sm={6} xs={12} key={`skeleton-${index}`}>
                  <Paper
                    elevation={0}
                    sx={{
                      height: "100%",
                      borderRadius: 2,
                      overflow: "hidden",
                      boxShadow: "0 4px 20px 0 rgba(0,0,0,0.05)",
                      p: { xs: 2, md: 3 },
                      background: (theme) => `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.9)}, ${alpha(theme.palette.background.paper, 1)})`,
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                      <Skeleton variant="circular" width={48} height={48} sx={{ mr: 2 }} />
                      <Box>
                        <Skeleton variant="text" width={120} height={28} />
                        <Skeleton variant="text" width={80} height={20} />
                      </Box>
                    </Box>
                    <Skeleton variant="rectangular" width="100%" height={180} sx={{ borderRadius: 2, mb: 3 }} />
                    <Box sx={{ mt: 2 }}>
                      {[1, 2, 3].map((item) => (
                        <Box key={`skeleton-item-${item}`} sx={{ mb: 2 }}>
                          <Skeleton variant="rectangular" width="100%" height={50} sx={{ borderRadius: 1 }} />
                        </Box>
                      ))}
                    </Box>
                  </Paper>
                </Grid>
              ))}
            </>
          ) : (
            data &&
            data.map((element: any, index: number) => (
              <Grid item xl={4} md={6} sm={6} xs={12} key={index}>
                <Paper
                  elevation={0}
                  sx={{
                    height: "100%",
                    borderRadius: 2,
                    overflow: "hidden",
                    boxShadow: "0 8px 25px 0 rgba(0,0,0,0.08)",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: "0 8px 24px 0 rgba(0,0,0,0.1)",
                    }
                  }}
                >
                  <CardContent>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        mb: 2,
                        pb: 2,
                        borderBottom: "1px solid #E6E8EE",
                        minHeight: "224px",
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "space-between",
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 2,
                          }}
                        >
                          <Box
                            sx={{
                              width: 56,
                              height: 56,
                              borderRadius: 2,
                              bgcolor: "#7856DE11",
                              display: "flex",
                              alignItems: "center",
                              justifyContent:
                                "center",
                            }}
                          >
                            {mainIcon(index)}
                          </Box>
                          <Typography
                            variant="h4"
                            fontWeight="bold"
                          >
                            {
                              element[0]
                                .ParameterGroupName
                            }
                          </Typography>
                        </Box>
                        <Box>
                          <Typography
                            color="text.secondary"
                            variant="body2"
                            fontWeight="medium"
                          >
                            {Array.isArray(element)
                              ? element.find(
                                (item: any) =>
                                  item.ParameterID ===
                                  1
                              )?.ParameterName
                              : null}
                          </Typography>
                          <Typography
                            variant="h3"
                            fontWeight="bold"
                            sx={{ mt: 1 }}
                          >
                            {index !== 2
                              ? Array.isArray(element)
                                ? element.find(
                                  (item: any) =>
                                    item.ParameterID ===
                                    1
                                )?.ParameterValue
                                : 0
                              : fNumber(
                                Array.isArray(
                                  element
                                )
                                  ? element.find(
                                    (
                                      item: any
                                    ) =>
                                      item.ParameterID ===
                                      1
                                  )
                                    ?.ParameterValue
                                  : 0
                              ) + "₮"}
                          </Typography>
                        </Box>
                      </Box>
                      {index !== 2 ? (
                        <Box
                          sx={{
                            position: "relative",
                          }}
                        >
                          <Box
                            sx={{
                              position: "absolute",
                              inset: 0,
                              display: "flex",
                              justifyContent:
                                "center",
                              alignItems: "center",
                              flexDirection: "column",
                              gap: 0.5,
                            }}
                          >
                            <Typography
                              variant="body2"
                              color="text.secondary"
                            >
                              {index === 0
                                ? intl.formatMessage(
                                  {
                                    id: "TextRoomOccupancy",
                                  }
                                )
                                : intl.formatMessage(
                                  {
                                    id: "TextBookingOccupancy",
                                  }
                                )}
                            </Typography>
                            <Typography
                              variant="h5"
                              fontWeight="bold"
                            >
                              {index === 0
                                ? `${roomOccupancy(
                                  element
                                )}%`
                                : "0%"}
                            </Typography>
                          </Box>
                          <CircularSlider
                            max={100}
                            dataIndex={
                              index === 0
                                ? roomOccupancy(
                                  element
                                )
                                : 0
                            }
                            hideKnob
                            knobDraggable={false}
                            trackSize={20}
                            width={200}
                            progressSize={20}
                            trackColor="#F0F0F0"
                            progressColorFrom="#7856DE"
                            progressColorTo="#7856DE"
                            hideLabelValue
                          />
                        </Box>
                      ) : (
                        <Box
                          sx={{
                            width: 200,
                            height: 200,
                            position: "relative",
                          }}
                        >
                          <Pie
                            width="200px"
                            height="200px"
                            style={{
                              width: "100%",
                              height: "100%",
                            }}
                            options={{
                              plugins: {
                                legend: {
                                  display: false,
                                },
                                tooltip: {
                                  callbacks: {
                                    label: function (
                                      context
                                    ) {
                                      return `${context.label
                                        }: ${fNumber(
                                          context.raw as number
                                        )}₮`;
                                    },
                                  },
                                },
                              },
                              cutout: "60%",
                              // borderWidth and borderRadius are applied at the dataset level in Chart.js v4
                            }}
                            data={{
                              labels: filterData(
                                element,
                                index
                              )
                                .map(
                                  ({
                                    ParameterName,
                                  }: any) => {
                                    if (
                                      ParameterName !==
                                      "Mini Bar" &&
                                      ParameterName !==
                                      "Restaurant"
                                    ) {
                                      return ParameterName;
                                    }
                                    return null;
                                  }
                                )
                                .filter(Boolean),
                              datasets: [
                                {
                                  data: filterData(
                                    element,
                                    index
                                  )
                                    .map(
                                      ({
                                        ParameterValue,
                                        ParameterName,
                                      }: any) => {
                                        if (
                                          ParameterName !==
                                          "Mini Bar" &&
                                          ParameterName !==
                                          "Restaurant"
                                        ) {
                                          return ParameterValue;
                                        }
                                        return null;
                                      }
                                    )
                                    .filter(
                                      Boolean
                                    ),
                                  backgroundColor:
                                    [
                                      "#7856DE",
                                      "#00CFE8",
                                      "#28C76F",
                                      "#FF9F43",
                                      "#EE5C78",
                                    ],
                                  hoverBackgroundColor:
                                    [
                                      "#6745C3",
                                      "#00BDD9",
                                      "#23B662",
                                      "#F08F34",
                                      "#DD4B67",
                                    ],
                                  borderWidth: 0,
                                  borderRadius: 4,
                                },
                              ],
                            }}
                          />
                        </Box>
                      )}
                    </Box>
                    <Grid container spacing={2}>
                      {data &&
                        filterData(element, index).map(
                          (childElement: any) => (
                            <Grid
                              item
                              xs={
                                index === 0 ? 6 : 12
                              }
                              key={
                                childElement.ParameterID
                              }
                            >
                              <DashboardCard
                                item={childElement}
                                isSmall={index === 0}
                                isCharges={index === 2}
                                list={element}
                                isLoading={isLoading}
                                workingDate={
                                  selectedDate
                                    ? format(selectedDate, "yyyy-MM-dd")
                                    : workingDate
                                }
                                dashboardType={dashboardType}
                              />
                            </Grid>
                          )
                        )}
                    </Grid>
                  </CardContent>
                </Paper>
              </Grid>
            ))
          )}
        </Grid>
      </Box>
    </Container>
  );
};

export default Dashboard;

function DashboardCard({
  item,
  isSmall,
  isCharges,
  list,
  workingDate,
  dashboardType,
  isLoading,
}: any) {
  const intl = useIntl();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const iconStyle = {
    color: "#FFFFFF",
    fontSize: isMobile ? "14px" : "16px",
  };

  const translateParameterName = (name: string) => {
    const translationKey = `Text${name.replace(/\s+/g, "")}`;
    try {
      return intl.formatMessage({ id: translationKey });
    } catch (error) {
      return name;
    }
  };

  function cardIcon(name: string) {
    switch (name) {
      case "Blocked Rooms":
        return {
          icon: <Sell sx={iconStyle} />,
          color: "#EE5C78",
          link: "/front-office/reservation-list",
        };
      case "Sold Rooms":
        return {
          icon: <Check sx={iconStyle} />,
          color: "#7856DE",
          link: "/front-office/reservation-list",
        };
      case "Available Rooms":
        return {
          icon: <Lock sx={iconStyle} />,
          color: "#55C7EB",
          link: "/front-office/reservation-list",
        };
      case "Checked Out":
        return {
          icon: <Logout sx={iconStyle} />,
          color: "#000000",
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
          icon: <HourglassEmpty sx={iconStyle} />,
          color: "#FF9F43",
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
          icon: <Pending sx={iconStyle} />,
          color: "#EE5C78",
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
          icon: <Logout sx={iconStyle} />,
          color: "#00CFE8",
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
          icon: <Delete sx={iconStyle} />,
          color: "#EE5C78",
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
          icon: <Sell sx={iconStyle} />,
          color: "#7856DE",
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
          icon: <Close sx={iconStyle} />,
          color: "#EE5C78",
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
          icon: <PersonOff sx={iconStyle} />,
          color: "#000000",
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
          icon: <DoNotDisturb sx={iconStyle} />,
          color: "#EE5C78",
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
          icon: <Key sx={iconStyle} />,
          color: "#7856DE",
          link: `/report/room-charge-monthly?CurrDate=${moment(
            workingDate
          ).format("YYYY-MM-DD")}`,
        };
      case "Extra Charges":
        return {
          icon: <CreditCard sx={iconStyle} />,
          color: "#00CFE8",
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
          icon: <Discount sx={iconStyle} />,
          color: "#28C76F",
          link: `/report/room-charge-monthly?CurrDate=${moment(
            workingDate
          ).format("YYYY-MM-DD")}`,
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

  if (isSmall) {
    return (
      <Card
        sx={{
          padding: isMobile ? "0.75rem" : "1rem",
          transition: "all 0.3s ease",
          boxShadow: `0px 4px 20px ${alpha(theme.palette.grey[500], 0.1)}`,
          borderRadius: "12px",
          '&:hover': {
            transform: "translateY(-4px)",
            boxShadow: `0px 8px 25px ${alpha(theme.palette.grey[500], 0.2)}`,
          },
          background: isLoading ? theme.palette.background.paper : `linear-gradient(135deg, ${alpha(currentItem?.color || '#7856DE', 0.05)} 0%, ${alpha(theme.palette.background.paper, 1)} 60%)`,
          height: "100%",
        }}
      >
        {isLoading ? (
          <>
            <Skeleton
              variant="circular"
              width={isMobile ? 36 : 40}
              height={isMobile ? 36 : 40}
              sx={{ bgcolor: alpha(theme.palette.primary.main, 0.1) }}
            />
            <Box sx={{ mt: isMobile ? 1.5 : 2, display: "flex", alignItems: "center", gap: isMobile ? 1 : 1.5 }}>
              <Skeleton
                variant="text"
                width={isMobile ? 100 : 150}
                height={24}
                sx={{ bgcolor: alpha(theme.palette.grey[500], 0.1) }}
              />
              <Skeleton
                variant="text"
                width={isMobile ? 60 : 80}
                height={28}
                sx={{ bgcolor: alpha(theme.palette.grey[500], 0.1) }}
              />
            </Box>
          </>
        ) : (
          <>
            <div
              style={{
                width: isMobile ? "36px" : "40px",
                height: isMobile ? "36px" : "40px",
                borderRadius: "100%",
                backgroundColor: currentItem?.color,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                boxShadow: `0px 4px 10px ${alpha(currentItem?.color || '#7856DE', 0.3)}`,
              }}
            >
              {currentItem?.icon}
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: isMobile ? "0.75rem" : "1rem",
                flex: 1,
                marginTop: isMobile ? "12px" : "16px",
              }}
            >
              <Typography
                sx={{
                  fontSize: isMobile ? "14px" : "16px",
                  fontWeight: 600,
                  width: isMobile ? "120px" : "172px",
                  color: theme.palette.text.primary,
                }}
              >
                {translateParameterName(item.ParameterName)}
              </Typography>
              <Typography
                sx={{
                  fontSize: isMobile ? "18px" : "20px",
                  fontWeight: 600,
                  color: theme.palette.text.primary,
                }}
              >
                {isCharges
                  ? fNumber(item.ParameterValue) + "₮"
                  : item.ParameterValue}
              </Typography>
            </div>
          </>
        )}
      </Card>
    );
  }

  return (
    <Card
      sx={{
        padding: isMobile ? "0.75rem" : "1rem",
        transition: "all 0.3s ease",
        boxShadow: `0px 4px 20px ${alpha(theme.palette.grey[500], 0.1)}`,
        borderRadius: "12px",
        '&:hover': {
          transform: "translateY(-4px)",
          boxShadow: `0px 8px 25px ${alpha(theme.palette.grey[500], 0.2)}`,
        },
        background: isLoading ? theme.palette.background.paper : `linear-gradient(135deg, ${alpha(currentItem?.color || '#7856DE', 0.05)} 0%, ${alpha(theme.palette.background.paper, 1)} 60%)`,
        height: "100%",
      }}
    >
      {isLoading ? (
        <>
          <Box sx={{ display: "flex", alignItems: "center", gap: isMobile ? 1.5 : 2 }}>
            <Skeleton
              variant="circular"
              width={isMobile ? 36 : 40}
              height={isMobile ? 36 : 40}
              sx={{ bgcolor: alpha(theme.palette.primary.main, 0.1) }}
            />
            <Box sx={{ flex: 1, display: "flex", alignItems: "center", gap: isMobile ? 1 : 1.5 }}>
              <Skeleton
                variant="text"
                width={isMobile ? 100 : 150}
                height={24}
                sx={{ bgcolor: alpha(theme.palette.grey[500], 0.1) }}
              />
              <Skeleton
                variant="text"
                width={isMobile ? 60 : 80}
                height={28}
                sx={{ bgcolor: alpha(theme.palette.grey[500], 0.1) }}
              />
            </Box>
            <Skeleton
              variant="circular"
              width={isMobile ? 32 : 40}
              height={isMobile ? 32 : 40}
              sx={{ bgcolor: alpha(theme.palette.grey[500], 0.1) }}
            />
          </Box>
          {isCharges && (
            <Box sx={{ mt: 2, pl: isMobile ? 6 : 7, pt: 2, borderTop: `1px solid ${alpha(theme.palette.divider, 0.8)}` }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1.5 }}>
                <Skeleton variant="text" width={120} height={24} sx={{ bgcolor: alpha(theme.palette.grey[500], 0.1) }} />
                <Skeleton variant="text" width={60} height={24} sx={{ bgcolor: alpha(theme.palette.grey[500], 0.1) }} />
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                <Skeleton variant="text" width={120} height={24} sx={{ bgcolor: alpha(theme.palette.grey[500], 0.1) }} />
                <Skeleton variant="text" width={60} height={24} sx={{ bgcolor: alpha(theme.palette.grey[500], 0.1) }} />
              </Box>
            </Box>
          )}
        </>
      ) : (
        <//@ts-ignore
        Link
          href={currentItem && currentItem.link ? currentItem.link : "/"}
          passHref
          style={{ textDecoration: "unset", color: theme.palette.text.primary }}>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: isMobile ? "12px" : "16px",
            }}
          >
            <div
              style={{
                width: isMobile ? "36px" : "40px",
                height: isMobile ? "36px" : "40px",
                borderRadius: "100%",
                backgroundColor: currentItem?.color,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                boxShadow: `0px 4px 10px ${alpha(currentItem?.color || '#7856DE', 0.3)}`,
              }}
            >
              {currentItem?.icon}
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: isMobile ? "0.75rem" : "1rem",
                flex: 1,
              }}
            >
              <Typography
                sx={{
                  fontSize: isMobile ? "14px" : "16px",
                  fontWeight: 600,
                  width: isMobile ? "120px" : "172px",
                  color: theme.palette.text.primary,
                }}
              >
                {translateParameterName(item.ParameterName)}
              </Typography>
              <Typography
                sx={{
                  fontSize: isMobile ? "18px" : "20px",
                  fontWeight: 600,
                  color: theme.palette.text.primary,
                }}
              >
                {isCharges
                  ? fNumber(item.ParameterValue) + "₮"
                  : item.ParameterValue}
              </Typography>
            </div>
            <div
              style={{
                width: isMobile ? "32px" : "40px",
                height: isMobile ? "32px" : "40px",
                borderRadius: "100%",
                backgroundColor: alpha(theme.palette.grey[100], 0.8),
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                transition: "all 0.3s ease",
              }}
            >
              <ChevronRight sx={{ fontSize: isMobile ? "14px" : "16px", color: theme.palette.text.secondary }} />
            </div>
            {isCharges && item.ParameterName === "Extra Charges" && (
              <div
                style={{
                  marginTop: isMobile ? "12px" : "16px",
                  borderTop: `1px solid ${alpha(theme.palette.divider, 0.8)}`,
                  paddingTop: isMobile ? "12px" : "16px",
                  paddingLeft: isMobile ? "48px" : "56px",
                  flexDirection: "column",
                  display: "flex",
                  gap: isMobile ? "12px" : "16px",
                  background: alpha(theme.palette.background.default, 0.4),
                  borderRadius: "0 0 8px 8px",
                }}
              >
                {extraCharges.map((item: any) => (
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: isMobile ? "0.75rem" : "1rem",
                      flex: 1,
                      color: theme.palette.text.secondary,
                      transition: "all 0.2s ease",
                      padding: isMobile ? "4px 8px" : "6px 10px",
                      borderRadius: "8px",
                      '&:hover': {
                        backgroundColor: alpha(theme.palette.background.default, 0.8),
                      },
                    }}
                    key={item.ParameterID}
                  >
                    <Typography
                      sx={{
                        fontSize: isMobile ? "14px" : "16px",
                        fontWeight: 600,
                        width: isMobile ? "120px" : "172px",
                        color: theme.palette.text.secondary,
                      }}
                    >
                      {translateParameterName(
                        item.ParameterName
                      )}
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: isMobile ? "16px" : "18px",
                        fontWeight: 600,
                        color: theme.palette.text.secondary,
                      }}
                    >
                      {isCharges
                        ? fNumber(item.ParameterValue) + "₮"
                        : item.ParameterValue}
                    </Typography>
                  </Box>
                ))}
              </div>
            )}
          </div>

        </Link>
      )}
    </Card>
  );
}
