import { useIntl } from "react-intl";

const getIcon = (name: string, color?: string) => ({ name, color });

const sidebarConfig = [
  {
    title: "дашбоард",
    titleEn: "dashboard",
    path: "/",
    icon: getIcon("lucide:pie-chart"),
    oldPath: "FrontOffice/StayView.aspx",
  },
  // {
  //     title: "захиалга",
  //     titleEn: "reservation",
  //     icon: getIcon(shoppingCartFill),
  //     children: [
  //         {
  //             title: "захиалгын жагсаалт",
  //             titleEn: "Reservation List",
  //             path: "/front-office/reservation-list",
  //             oldPath: "FrontOffice/ReservationList.aspx",
  //         },
  //         {
  //             title: "өдрийн өндөрлөгөө",
  //             titleEn: "Night Audit",
  //             path: "/front-office/night-audit",
  //             oldPath: "FrontOffice/NightAudit.aspx",
  //         },
  //         {
  //             title: "Зочдын бааз",
  //             titleEn: "Guest Database",
  //             path: "/front-office/guest-database",
  //             oldPath: "FrontOffice/Guests.aspx",
  //         },
  //     ],
  // },
  {
    title: "захиалгын жагсаалт",
    titleEn: "Reservation List",
    path: "/front-office/reservation-list",
    oldPath: "FrontOffice/ReservationList.aspx",
    icon: getIcon("lucide:shopping-cart"),
  },
  {
    title: "өдрийн өндөрлөгөө",
    titleEn: "Night Audit",
    path: "/front-office/night-audit",
    oldPath: "FrontOffice/NightAudit.aspx",
    icon: getIcon("lucide:moon"),
  },
  {
    title: "Бүлэг",
    titleEn: "Groups",
    icon: getIcon("lucide:users"),
    children: [
      {
        title: "Групп захиалгын жагсаалт",
        titleEn: "Group Reservations List",
        icon: getIcon("lucide:list", "#3b82f6"),
        path: "/group-operation/group-reservations-list",
        oldPath: "FrontOffice/GroupReservations.aspx",
      },
      {
        title: "байрлаж буй групп",
        titleEn: "In House Groups",
        icon: getIcon("lucide:home", "#10b981"),
        path: "/group-operation/in-house-group",
        oldPath: "FrontOffice/GroupInHouse.aspx",
      },
      {
        title: "гарсан групп",
        titleEn: "Departed Groups",
        icon: getIcon("lucide:log-out", "#ef4444"),
        path: "/group-operation/departed-group",
        oldPath: "FrontOffice/GroupDeparted.aspx",
      },
    ],
  },
  {
    title: "календар",
    titleEn: "calendar",
    path: "/handsontable",
    icon: getIcon("lucide:calendar"),
    oldPath: "FrontOffice/StayView.aspx",
  },
  {
    title: "Тариф",
    titleEn: "Rate",
    icon: getIcon("lucide:tag"),
    path: "/rate",
    oldPath: "Configuration/Rates.aspx",
  },
  {
    title: "Төлбөр, тооцоо",
    titleEn: "Payment",
    icon: getIcon("lucide:credit-card"),
    path: "/payment",
    oldPath: "FrontOffice/CurrencyRate.aspx",
  },
  {
    title: "өрөөний удирдлага",
    titleEn: "Room Management",
    icon: getIcon("lucide:home"),
    path: "/room/management",
    oldPath: "Configuration/Rooms.aspx",
  },
  {
    title: "тайлан",
    titleEn: "report",
    icon: getIcon("lucide:file-text"),
    children: [
      {
        title: "Өдрийн тайлан",
        titleEn: "Daily Reports",
        icon: getIcon("lucide:calendar-days", "#3b82f6"),
        children: [
          {
            title: "өдрийн мэдээ",
            titleEn: "Daily Report",
            path: "/report/daily",
            oldPath: "",
          },
          {
            title: "Ирэх болон гарах зочдын мэдээ",
            titleEn: "Arrival or Departure (Daily)",
            path: "/report/arrival-departure",
            oldPath: "",
          },
          {
            title: "өдрийн өндөрлөгөө",
            titleEn: "Night Audit",
            path: "/report/night-audit",
            oldPath: "",
          },
          // {
          //   title: "Ресепшний гарааны тайлан",
          //   titleEn: "Day End Report (Reception)",
          //   path: "/report/reception",
          //   oldPath: "",
          // },
        ],
      },
      {
        title: "Сарын тайлан",
        titleEn: "Monthly Reports",
        icon: getIcon("lucide:calendar", "#8b5cf6"),
        children: [
          {
            title: "сарын мэдээ",
            titleEn: "Monthly Report",
            path: "/report/month",
            oldPath: "",
          },
          {
            title: "Сарын тайлан (Орлогоор)",
            titleEn: "Monthly Report (Revenue)",
            path: "/report/monthly-revenue",
            oldPath: "",
          },
          {
            title: "Ор хоногийн тооцоо(Сараар)",
            titleEn: "Nights Report (Monthly)",
            path: "/report/room-charge-monthly",
            oldPath: "",
          },
        ],
      },
      {
        title: "Захиалгын тайлан",
        titleEn: "Reservation Reports",
        icon: getIcon("lucide:calendar-check", "#10b981"),
        children: [
          {
            title: "Захиалгын тайлан",
            titleEn: "Report Reservations",
            path: "/report/reservations",
            oldPath: "",
          },
          {
            title: "Захиалга цуцлалтын тайлан",
            titleEn: "Cancel Reservation",
            path: "/report/cancel-reservation",
            oldPath: "",
          },
          {
            title: "Ирээгүй зочдын тайлан",
            titleEn: "No Show Report",
            path: "/report/no-show-reservation",
            oldPath: "",
          },
          {
            title: "MenuReportVoid",
            titleEn: "Void Report",
            path: "/report/void-reservation",
            oldPath: "",
          },
        ],
      },
      {
        title: "Санхүүгийн тайлан",
        titleEn: "Financial Reports",
        icon: getIcon("lucide:dollar-sign", "#ef4444"),
        children: [
          {
            title: "төлбөр",
            titleEn: "Payment Report",
            path: "/report/folio",
            oldPath: "",
          },
          {
            title: "баланс",
            titleEn: "Balance Report",
            path: "/report/balance",
            oldPath: "~/Report/ReportBalance.aspx",
          },
          {
            title: "буудлын борлуулалт",
            titleEn: "Hotel Sales",
            path: "/report/charge",
            oldPath: "",
          },
        ],
      },
      {
        title: "Нэмэлт үйлчилгээ",
        titleEn: "Extra Services Reports",
        icon: getIcon("lucide:plus-circle", "#f59e0b"),
        children: [
          {
            title: "Үйлчилгээ (Дэлгэрэнгүй)",
            titleEn: "Extra Charges (Detailed)",
            path: "/report/extra-charge/detailed",
            oldPath: "",
          },
          {
            title: "Үйлчилгээ (Хураангуй)",
            titleEn: "Extra Charges (Summary)",
            path: "/report/extra-charge/summary",
            oldPath: "",
          },
          {
            title: "Нэм. үйлчилгээ, Мини бар",
            titleEn: "Extra Charges and Mini Bar",
            path: "/report/extra-charge/reception",
            oldPath: "",
          },
          {
            title: "өглөөний цай",
            titleEn: "Breakfast Report",
            path: "/report/breakfast",
            oldPath: "~/Report/ReportBreakfast.aspx",
          },
        ],
      },
      {
        title: "Өрөөний тайлан",
        titleEn: "Room Reports",
        icon: getIcon("lucide:bed", "#06b6d4"),
        children: [
          {
            title: "боломжит өрөө",
            titleEn: "Available Rooms",
            path: "/report/available-room",
            oldPath: "~/Report/ReportAvailableRooms.aspx",
          },
          {
            title: "Гарсан",
            titleEn: "Checked Out",
            path: "/report/checked-out",
            oldPath: "",
          },
        ],
      },
      // {
      //     title: "гарах зочид (өдөр тутам)",
      //     titleEn: "гарах зочид (өдөр тутам)",

      //     path: "/report/daily/checked-out",
      //     oldPath: "~/Report/ReportCheckedOutDetailed.aspx",
      // },
      // {
      //     title: "устгалын тайлбар (өдөр тутам)",
      //     titleEn: "устгалын тайлбар (өдөр тутам)",

      //     path: "/report/daily/deleted-reservations",
      //     oldPath: "~/Report/ReportVoidReservation.aspx",
      // },
      // {
      //     title: "нэмэлт төлбөр (өдөр тутам)",
      //     titleEn: "нэмэлт төлбөр (өдөр тутам)",

      //     path: "/report/daily/extra-charge",
      //     oldPath: "~/Report/ReportExtraChargeDetail.aspx",
      // },
      // {
      //     title: "Төлбөрийн тайлан (өдөр тутам)",
      //     titleEn: "Төлбөрийн тайлан (өдөр тутам)",

      //     path: "/report/daily/payment",
      //     oldPath: "",
      // },
      // {
      //     title: "өрөөний төлбөр (өдөр тутам)",
      //     titleEn: "өрөөний төлбөр (өдөр тутам)",

      //     path: "/report/daily/room-charge",
      //     oldPath: "",
      // },
      // {
      //     title: "устгалын тайлан",
      //     titleEn: "устгалын тайлан",

      //     path: "/report/deleted-reservations",
      //     oldPath: "",
      // },
      // {
      //     title: "нэмэлт төлбөрийн (дэлгэрэнгүй)",
      //     titleEn: "нэмэлт төлбөрийн (дэлгэрэнгүй)",

      //     path: "/report/extra-charge/detailed",
      //     oldPath: "",
      // },
      // {
      //     title: "нэмэлт төлбөр (хураангуй)",
      //     titleEn: "нэмэлт төлбөр (хураангуй)",

      //     path: "/report/extra-charge/summary",
      //     oldPath: "",
      // },
      // {
      //     title: "байгууллага хоорондын тооцоо",
      //     titleEn: "байгууллага хоорондын тооцоо",

      //     path: "/report/interagency",
      //     oldPath: "",
      // },
      // {
      //     title: "сарын тайлан",
      //     titleEn: "сарын тайлан",

      //     path: "/report/monthly",
      //     oldPath: "",
      // },

      // {
      //     title: "ресепшний буух зочдын тайлан",
      //     titleEn: "ресепшний буух зочдын тайлан",

      //     path: "/report/reception/checked-in",
      //     oldPath: "",
      // },
      // {
      //     title: "ресепшний гарах зочдын тайлан",
      //     titleEn: "ресепшний гарах зочдын тайлан",

      //     path: "/report/reception/checked-out",
      //     oldPath: "",
      // },
      // {
      //     title: "ресепшний устгалын тайлан",
      //     titleEn: "ресепшний устгалын тайлан",

      //     path: "/report/reception/deleted-reservations",
      //     oldPath: "",
      // },
      // {
      //     title: "ресепшний хугацаа дуусах, үлдэх тайлан",
      //     titleEn: "ресепшний хугацаа дуусах, үлдэх тайлан",

      //     path: "/report/reception/dueout-stayover",
      //     oldPath: "",
      // },
      // {
      //     title: "ресепшний нэмэлт төлбөрийн тайлан",
      //     titleEn: "ресепшний нэмэлт төлбөрийн тайлан",

      //     path: "/report/reception/extra-charge",
      //     oldPath: "",
      // },
      // {
      //     title: "ресепшний төлбөрийн тайлан",
      //     titleEn: "ресепшний төлбөрийн тайлан",

      //     path: "/report/reception/payment",
      //     oldPath: "",
      // },
      // {
      //     title: "ресепшний өрөөний төлбөр",
      //     titleEn: "ресепшний өрөөний төлбөр",

      //     path: "/report/reception/room-charge",
      //     oldPath: "",
      // },
      // {
      //     title: "захиалгын тайлан",
      //     titleEn: "захиалгын тайлан",

      //     path: "/report/reservations",
      //     oldPath: "",
      // },

      // {
      //     title: "stayview",
      //     titleEn: "stayview",

      //     path: "/report/stayview",
      //     oldPath: "",
      // },
    ],
  },
  {
    title: "өрөө үйлчилгээ",
    titleEn: "House Keeping",
    icon: getIcon("lucide:home"),
    children: [
      {
        title: "house keeping",
        titleEn: "House Keeping",
        icon: getIcon("lucide:brush-cleaning", "#10b981"),
        path: "/room-service/house-keeping",
        oldPath: "",
      },
      {
        title: "өрөөний төлөв",
        titleEn: "House Status",
        icon: getIcon("lucide:clipboard-check", "#3b82f6"),
        path: "/room-service/house-status",
        oldPath: "",
      },
      {
        title: "ажлын даалгавар",
        titleEn: "Work Order",
        icon: getIcon("lucide:clipboard-list", "#f59e0b"),
        path: "/room-service/work-order",
        oldPath: "",
      },
    ],
  },
  {
    title: "холболт",
    titleEn: "Connect",
    icon: getIcon("lucide:link"),
    children: [
      {
        title: "санхүү",
        titleEn: "Finance",
        icon: getIcon("lucide:banknote", "#10b981"),
        path: "",
        oldPath: ""
      },
      {
        title: "төлбөр тооцоо өдрөөр",
        titleEn: "Daily Payment Calculation",
        icon: getIcon("lucide:calculator", "#f59e0b"),
        path: "",
        oldPath: "",
      },
    ],
  },
  {
    title: "зочид буудлын мэдээлэл",
    titleEn: "Hotel Information",
    icon: getIcon("lucide:building-2", "#3b82f6"),
    path: "/conf/hotel-information",
    oldPath: "",
  },
  {
    title: "зочид буудлын тохиргоо",
    titleEn: "Hotel Settings",
    icon: getIcon("lucide:settings", "#10b981"),
    path: "/conf/hotel-setting",
    oldPath: "",
  },
  // {
  //   title: "notifications",
  //   titleEn: "Notifications",
  //   icon: getIcon("lucide:bell", "#ef4444"),
  //   path: "/conf/notification",
  //   oldPath: "",
  // },
  {
    title: "хэрэглэгчийн төрөл",
    titleEn: "User Role",
    icon: getIcon("lucide:shield", "#8b5cf6"),
    path: "/conf/user-role",
    oldPath: "",
  },
  {
    title: "хэрэглэгч",
    titleEn: "User",
    icon: getIcon("lucide:user", "#06b6d4"),
    path: "/conf/user",
    oldPath: "",
  },
  {
    title: "шалтгаан",
    titleEn: "Reason",
    icon: getIcon("lucide:message-square", "#10b981"),
    path: "/conf/reason",
    oldPath: "",
  },
  {
    title: "захиалгын эх сурвалж",
    titleEn: "Reservation Source",
    icon: getIcon("lucide:map-pin", "#3b82f6"),
    path: "/conf/reservation-source",
    oldPath: "",
  },
  {
    title: "вип төлөв",
    titleEn: "Vip Status",
    icon: getIcon("lucide:crown", "#f59e0b"),
    path: "/conf/vip-status",
    oldPath: "",
  },
  {
    title: "урамшуулал",
    titleEn: "Promotions",
    icon: getIcon("lucide:gift", "#ef4444"),
    path: "/conf/promotion",
    oldPath: "",
  },
  {
    title: "багц",
    titleEn: "Packages",
    icon: getIcon("lucide:package-2", "#10b981"),
    path: "/conf/package",
    oldPath: "",
  },
  {
    title: "мини бар бүлэг",
    titleEn: "Mini Bar Groups",
    icon: getIcon("lucide:folder", "#3b82f6"),
    path: "/mini-bar/group",
    oldPath: "",
  },
  {
    title: "мини бар бараа",
    titleEn: "Mini Bar Items",
    icon: getIcon("lucide:wine", "#8b5cf6"),
    path: "/mini-bar/item",
    oldPath: "",
  },
  {
    title: "Санхүү",
    titleEn: "Accounting",
    icon: getIcon("lucide:calculator", "#10b981"),
    path: "/conf/accounting",
    oldPath: "",
  },
  {
    title: "Pos Api тохиргоо",
    titleEn: "Pos Api Config",
    icon: getIcon("lucide:plug-zap", "#06b6d4"),
    path: "/conf/pos-api",
    oldPath: "",
  },
];

export default sidebarConfig;
