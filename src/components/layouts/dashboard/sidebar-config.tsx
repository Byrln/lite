import { Icon } from "@iconify/react";
import pieChart2Fill from "@iconify/icons-eva/pie-chart-2-fill";
import peopleFill from "@iconify/icons-eva/people-fill";
import BookOnlineIcon from "@mui/icons-material/BookOnline";
import calendarFill from "@iconify/icons-eva/calendar-fill";
import pricetagsFill from "@iconify/icons-eva/pricetags-fill";
import homeFill from "@iconify/icons-eva/home-fill";
import creditCardFill from "@iconify/icons-eva/credit-card-fill";
import bookOpenFill from "@iconify/icons-eva/book-open-fill";
import settings2Fill from "@iconify/icons-eva/settings-2-fill";
import awardFill from "@iconify/icons-eva/award-fill";
import options2Fill from "@iconify/icons-eva/options-2-fill";
import shoppingCartFill from "@iconify/icons-eva/shopping-cart-fill";
import { useIntl } from "react-intl";

const getIcon = (name: any) => <Icon icon={name} width={22} height={22} />;

const sidebarConfig = [
    {
        title: "дашбоард",
        titleEn: "dashboard",
        path: "/",
        icon: getIcon(pieChart2Fill),
        oldPath: "FrontOffice/StayView.aspx",
    },
    {
        title: "захиалга",
        titleEn: "reservation",
        icon: getIcon(shoppingCartFill),
        children: [
            {
                title: "захиалгын жагсаалт",
                titleEn: "Reservation List",
                path: "/front-office/reservation-list",
                oldPath: "FrontOffice/ReservationList.aspx",
            },
            {
                title: "өдрийн өндөрлөгөө",
                titleEn: "Night Audit",
                path: "/front-office/night-audit",
                oldPath: "FrontOffice/NightAudit.aspx",
            },
            {
                title: "Зочдын бааз",
                titleEn: "Guest Database",
                path: "/front-office/guest-database",
                oldPath: "FrontOffice/Guests.aspx",
            },
        ],
    },
    {
        title: "Бүлэг",
        titleEn: "Groups",
        icon: getIcon(peopleFill),
        children: [
            {
                title: "Групп захиалгын жагсаалт",
                titleEn: "Group Reservations List",
                path: "/group-operation/group-reservations-list",
                oldPath: "FrontOffice/GroupReservations.aspx",
            },
            {
                title: "байрлаж буй групп",
                titleEn: "In House Groups",
                path: "/group-operation/in-house-group",
                oldPath: "FrontOffice/GroupInHouse.aspx",
            },
            {
                title: "гарсан групп",
                titleEn: "Departed Groups",
                path: "/group-operation/departed-group",
                oldPath: "FrontOffice/GroupDeparted.aspx",
            },
        ],
    },
    {
        title: "календар",
        titleEn: "calendar",
        path: "/handsontable",
        icon: getIcon(calendarFill),
        oldPath: "FrontOffice/StayView.aspx",
    },
    {
        title: "тариф",
        titleEn: "Rate",
        icon: getIcon(pricetagsFill),
        children: [
            {
                title: "улирал",
                titleEn: "Season",
                path: "/rate/season",
                oldPath: "Configuration/Seasons.aspx",
            },
            {
                title: "тарифын төрөл",
                titleEn: "Rate Type",
                path: "/rate/type",
                oldPath: "Configuration/RateType.aspx",
            },
            {
                title: "тариф",
                titleEn: "rate",
                path: "/rate",
                oldPath: "Configuration/Rates.aspx",
            },
            {
                title: "Нэм.Үйлчилгээ бүлэг",
                titleEn: "Extra Charge Group",
                path: "/rate/extra-charge-group",
                oldPath: "Configuration/ExtraChargeGroup.aspx",
            },
            {
                title: "нэмэлт үйлчилгээ",
                titleEn: "Extra Charges",
                path: "/rate/extra-charge",
                oldPath: "Configuration/ExtraCharges.aspx",
            },
            // {
            //     title: "inclusion",
            //     path: "/rate/inclusion",
            // },
        ],
    },
    {
        title: "өрөө",
        titleEn: "Rooms",
        icon: getIcon(homeFill),
        children: [
            {
                title: "өрөөний онцлог",
                titleEn: "Room Amenities",
                path: "/room/amenities",
                oldPath: "Configuration/Amenities.aspx",
            },
            {
                title: "өрөөний төлөв",
                titleEn: "Room Status",
                path: "/room/status",
                oldPath: "Configuration/RoomStatus.aspx",
            },

            {
                title: "өрөөний төрөл",
                titleEn: "Room Type",
                path: "/room/type",
                oldPath: "Configuration/RoomType.aspx",
            },
            {
                title: "өрөө",
                titleEn: "room",
                path: "/room",
                oldPath: "Configuration/Rooms.aspx",
            },
        ],
    },
    {
        title: "Төлбөр, тооцоо",
        titleEn: "Payment",
        icon: getIcon(creditCardFill),
        children: [
            {
                title: "Байгууллага",
                titleEn: "Company Database",
                path: "/payment/company-database",
                oldPath: "FrontOffice/Customer.aspx",
            },
            {
                title: "Касс (Бэлэн мөнгө)",
                titleEn: "Cashier",
                path: "/payment/cashier",
                oldPath: "FrontOffice/Cashier.aspx",
            },
            {
                title: "валютын ханш",
                titleEn: "Exchange Rate",
                path: "/payment/exchange-rate",
                oldPath: "FrontOffice/CurrencyRate.aspx",
            },
            {
                title: "татвар",
                titleEn: "tax",
                path: "/rate/tax",
                oldPath: "Configuration/Taxes.aspx",
            },
            {
                title: "төлбөрийн хэлбэр",
                titleEn: "Payment Method",
                path: "/rate/payment-method",
                oldPath: "Configuration/PaymentMethod.aspx",
            },
        ],
    },
    {
        title: "тайлан",
        titleEn: "report",
        icon: getIcon(bookOpenFill),
        children: [
            {
                title: "өглөөний цай",
                titleEn: "өглөөний цай",
                path: "/report/breakfast",
                oldPath: "~/Report/ReportBreakfast.aspx",
            },
            {
                title: "төлбөр",
                titleEn: "төлбөр",
                path: "/report/folio",
                oldPath: "",
            },
            {
                title: "өдрийн мэдээ",
                titleEn: "өдрийн мэдээ",
                path: "/report/daily",
                oldPath: "",
            },
            {
                title: "буудлын борлуулалт",
                titleEn: "буудлын борлуулалт",
                path: "/report/charge",
                oldPath: "",
            },
            {
                title: "сарын мэдээ",
                titleEn: "сарын мэдээ",
                path: "/report/month",
                oldPath: "",
            },
            {
                title: "Ирэх болон гарах зочдын мэдээ",
                titleEn: "Arrival or Departure (Daily)",
                path: "/report/arrival-departure",
                oldPath: "",
            },
            // {
            //     title: "бүртгэлийн хуудас",
            //     titleEn: "бүртгэлийн хуудас",

            //     path: "/report/transaction",
            //     oldPath: "",
            // },
            {
                title: "боломжит өрөө",
                titleEn: "available rooms",
                path: "/report/available-room",
                oldPath: "~/Report/ReportAvailableRooms.aspx",
            },
            {
                title: "баланс",
                titleEn: "баланс",
                path: "/report/balance",
                oldPath: "~/Report/ReportBalance.aspx",
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
            //     title: "сарын тайлан (орлогоор)",
            //     titleEn: "сарын тайлан (орлогоор)",

            //     path: "/report/monthly-revenue",
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
        title: "тохиргоо",
        titleEn: "Configuration",
        icon: getIcon(settings2Fill),
        children: [
            {
                title: "зочид буудлын мэдээлэл",
                titleEn: "Hotel Information",
                path: "/conf/hotel-information",
                oldPath: "",
            },
            {
                title: "э-шуудан тохиргоо",
                titleEn: "Email Configuration",
                path: "/conf/email",
                oldPath: "",
            },
            {
                title: "хэрэглэгчийн төрөл",
                titleEn: "User Role",
                path: "/conf/user-role",
                oldPath: "",
            },
            {
                title: "хэрэглэгч",
                titleEn: "User",
                path: "/conf/user",
                oldPath: "",
            },
            {
                title: "шалтгаан",
                titleEn: "Reason",
                path: "/conf/reason",
                oldPath: "",
            },
            {
                title: "захиалгын эх сурвалж",
                titleEn: "Reservation Source",
                path: "/conf/reservation-source",
                oldPath: "",
            },
            // {
            //     title: "pos api тохиргоо",
            //     path: "/conf/pos-api",
            // },
            {
                title: "вип төлөв",
                titleEn: "Vip Status",
                path: "/conf/vip-status",
                oldPath: "",
            },
            {
                title: "харилцагчийн бүлэг",
                titleEn: "Customer Group",
                path: "/conf/customer-group",
                oldPath: "",
            },
            {
                title: "зочид буудлын тохиргоо",
                titleEn: "Hotel Settings",
                path: "/conf/hotel-setting",
                oldPath: "",
            },
            {
                title: "notifications",
                titleEn: "Notifications",
                path: "/conf/notification",
                oldPath: "",
            },

            {
                title: "урамшуулал",
                titleEn: "Promotions",
                path: "/conf/promotion",
                oldPath: "",
            },
            {
                title: "багц",
                titleEn: "Packages",
                path: "/conf/package",
                oldPath: "",
            },
            {
                title: "мини бар бүлэг",
                titleEn: "Mini Bar Groups",
                path: "/mini-bar/group",
                oldPath: "",
            },
            {
                title: "мини бар бараа",
                titleEn: "Mini Bar Items",
                path: "/mini-bar/item",
                oldPath: "",
            },
        ],
    },
    {
        title: "өрөө үйлчилгээ",
        titleEn: "House Keeping",
        icon: getIcon(awardFill),
        children: [
            {
                title: "house keeping",
                titleEn: "House Keeping",
                path: "/room-service/house-keeping",
                oldPath: "",
            },
            {
                title: "өрөөний төлөв",
                titleEn: "House Status",
                path: "/room-service/house-status",
                oldPath: "",
            },
            {
                title: "ажлын даалгавар",
                titleEn: "Work Order",
                path: "/room-service/work-order",
                oldPath: "",
            },
            {
                title: "өрөө блоклох",
                titleEn: "Room Block",
                path: "/room-service/room-block",
                oldPath: "",
            },
        ],
    },

    // {
    //     title: "integration",
    //     icon: getIcon(options2Fill),
    //     children: [
    //         {
    //             title: "accounting",
    //             path: "/integration/accounting",
    //         },
    //     ],
    // },
];

export default sidebarConfig;
