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

const getIcon = (name: any) => <Icon icon={name} width={22} height={22} />;

// const sidebarConfig = [
//     {
//         title: "dashboard",
//         path: "/",
//         icon: getIcon(pieChart2Fill),
//     },
//     {
//         title: "calendar",
//         path: "/handsontable",
//         icon: getIcon(pieChart2Fill),
//     },
//     {
//         title: "front office",
//         icon: getIcon(peopleFill),
//         children: [
//             {
//                 title: "stay view",
//                 path: "/front-office/stay-view",
//             },
//             // {
//             //     title: "new reservation",
//             //     path: "/front-office/new-reservation",
//             // },
//             {
//                 title: "reservation list",
//                 path: "/front-office/reservation-list",
//             },
//             {
//                 title: "night audit",
//                 path: "/front-office/night-audit",
//             },
//             {
//                 title: "guest database",
//                 path: "/front-office/guest-database",
//             },

//             {
//                 title: "depature list",
//                 path: "/front-office/depature-list",
//             },
//             {
//                 title: "departured list",
//                 path: "/front-office/departured-list",
//             },
//         ],
//     },
//     {
//         title: "group operation",
//         icon: getIcon(peopleFill),
//         children: [
//             {
//                 title: "group reservations list",
//                 path: "/group-operation/group-reservations-list",
//             },
//             {
//                 title: "in house groups",
//                 path: "/group-operation/in-house-group",
//             },
//             {
//                 title: "departed groups",
//                 path: "/group-operation/departed-group",
//             },
//         ],
//     },
//     {
//         title: "payment",
//         icon: getIcon(peopleFill),
//         children: [
//             {
//                 title: "company database",
//                 path: "/payment/company-database",
//             },
//             {
//                 title: "cashier",
//                 path: "/payment/cashier",
//             },
//             {
//                 title: "exchange rate",
//                 path: "/payment/exchange-rate",
//             },
//         ],
//     },
//     {
//         title: "room service",
//         icon: getIcon(peopleFill),
//         children: [
//             {
//                 title: "house keeping",
//                 path: "/room-service/house-keeping",
//             },
//             {
//                 title: "house status",
//                 path: "/room-service/house-status",
//             },
//             {
//                 title: "work order",
//                 path: "/room-service/work-order",
//             },
//             {
//                 title: "room block",
//                 path: "/room-service/room-block",
//             },
//         ],
//     },

//     {
//         title: "reports",
//         icon: getIcon(peopleFill),
//         children: [
//             {
//                 title: "accounting",
//                 path: "/integration/accounting",
//             },
//         ],
//     },
//     {
//         title: "integration",
//         icon: getIcon(peopleFill),
//         children: [
//             {
//                 title: "accounting",
//                 path: "/integration/accounting",
//             },
//         ],
//     },
//     {
//         title: "configuration",
//         icon: getIcon(peopleFill),
//         children: [
//             {
//                 title: "hotel information",
//                 path: "/conf/hotel-information",
//             },
//             {
//                 title: "e-mail configuration",
//                 path: "/conf/email",
//             },
//             {
//                 title: "user role",
//                 path: "/conf/user-role",
//             },
//             {
//                 title: "user",
//                 path: "/conf/user",
//             },
//             {
//                 title: "reasons",
//                 path: "/conf/reason",
//             },
//             {
//                 title: "reservation source",
//                 path: "/conf/reservation-source",
//             },
//             {
//                 title: "pos api config",
//                 path: "/conf/pos-api",
//             },
//             {
//                 title: "vip status",
//                 path: "/conf/vip-status",
//             },
//             {
//                 title: "customer group",
//                 path: "/conf/customer-group",
//             },
//             {
//                 title: "hotel setting",
//                 path: "/conf/hotel-setting",
//             },
//             {
//                 title: "notification",
//                 path: "/conf/notification",
//             },

//             {
//                 title: "Promotion",
//                 path: "/conf/promotion",
//             },
//             {
//                 title: "package",
//                 path: "/conf/package",
//             },
//         ],
//     },
//     {
//         title: "rooms",
//         icon: getIcon(peopleFill),
//         children: [
//             {
//                 title: "room type",
//                 path: "/room/type",
//             },
//             {
//                 title: "room amenities",
//                 path: "/room/amenities",
//             },
//             {
//                 title: "room status",
//                 path: "/room/status",
//             },
//             {
//                 title: "rooms",
//                 path: "/room",
//             },
//             {
//                 title: "door lock",
//                 path: "/room/door-lock",
//             },
//         ],
//     },
//     {
//         title: "rates",
//         icon: getIcon(peopleFill),
//         children: [
//             {
//                 title: "rate type",
//                 path: "/rate/type",
//             },
//             {
//                 title: "season",
//                 path: "/rate/season",
//             },
//             {
//                 title: "rates",
//                 path: "/rate",
//             },
//             {
//                 title: "extra charge group",
//                 path: "/rate/extra-charge-group",
//             },
//             {
//                 title: "extra charges",
//                 path: "/rate/extra-charge",
//             },
//             {
//                 title: "tax",
//                 path: "/rate/tax",
//             },
//             {
//                 title: "payment method",
//                 path: "/rate/payment-method",
//             },
//             {
//                 title: "inclusion",
//                 path: "/rate/inclusion",
//             },
//         ],
//     },
//     {
//         title: "mini bar",
//         icon: getIcon(peopleFill),
//         children: [
//             {
//                 title: "groups",
//                 path: "/mini-bar/group",
//             },
//             {
//                 title: "items",
//                 path: "/mini-bar/item",
//             },
//         ],
//     },
// ];

const sidebarConfig = [
    {
        title: "дашбоард",
        path: "/",
        icon: getIcon(pieChart2Fill),
    },
    {
        title: "захиалга",
        icon: getIcon(shoppingCartFill),
        children: [
            {
                title: "захиалгын жагсаалт",
                path: "/front-office/reservation-list",
            },
            {
                title: "өдрийн өндөрлөгөө",
                path: "/front-office/night-audit",
            },
            {
                title: "зочин",
                path: "/front-office/guest-database",
            },
            {
                title: "групп захиалгын жагсаалт",
                path: "/group-operation/group-reservations-list",
            },

            // {
            //     title: "depature list",
            //     path: "/front-office/depature-list",
            // },
            // {
            //     title: "departured list",
            //     path: "/front-office/departured-list",
            // },
        ],
    },
    {
        title: "календар",
        path: "/handsontable",
        icon: getIcon(calendarFill),
    },
    {
        title: "тариф",
        icon: getIcon(pricetagsFill),
        children: [
            {
                title: "улирал",
                path: "/rate/season",
            },
            {
                title: "тарифын төрөл",
                path: "/rate/type",
            },
            {
                title: "тариф",
                path: "/rate",
            },
            {
                title: "нэмэлт үйлчилгээ грүпп",
                path: "/rate/extra-charge-group",
            },
            {
                title: "нэмэлт үйлчилгээ",
                path: "/rate/extra-charge",
            },
            // {
            //     title: "inclusion",
            //     path: "/rate/inclusion",
            // },
        ],
    },
    {
        title: "өрөө",
        icon: getIcon(homeFill),
        children: [
            {
                title: "өрөөний онцлог",
                path: "/room/amenities",
            },
            {
                title: "өрөөний төлөв",
                path: "/room/status",
            },
            // {
            //     title: "хаалганы цоож",
            //     path: "/room/door-lock",
            // },
            {
                title: "өрөөний төрөл",
                path: "/room/type",
            },
            {
                title: "өрөө",
                path: "/room",
            },
        ],
    },
    {
        title: "төлбөр тооцоо",
        icon: getIcon(creditCardFill),
        children: [
            {
                title: "байгууллага",
                path: "/payment/company-database",
            },
            {
                title: "касс (бэлэн мөнгө)",
                path: "/payment/cashier",
            },
            {
                title: "валютын ханш",
                path: "/payment/exchange-rate",
            },
            {
                title: "татвар",
                path: "/rate/tax",
            },
            {
                title: "төлбөрийн хэлбэр",
                path: "/rate/payment-method",
            },
        ],
    },
    {
        title: "тайлан",
        icon: getIcon(bookOpenFill),
        children: [
            {
                title: "боломжит өрөө",
                path: "/report/available-room",
            },
            {
                title: "баланс",
                path: "/report/balance",
            },
            {
                title: "өглөөний цай",
                path: "/report/breakfast",
            },
            {
                title: "гарах зочид (өдөр тутам)",
                path: "/report/daily/checked-out",
            },
            {
                title: "устгалын тайлбар (өдөр тутам)",
                path: "/report/daily/deleted-reservations",
            },
            {
                title: "нэмэлт төлбөр (өдөр тутам)",
                path: "/report/daily/extra-charge",
            },
            {
                title: "Төлбөрийн тайлан (өдөр тутам)",
                path: "/report/daily/payment",
            },
            {
                title: "өрөөний төлбөр (өдөр тутам)",
                path: "/report/daily/room-charge",
            },
            {
                title: "устгалын тайлан",
                path: "/report/deleted-reservations",
            },
            {
                title: "нэмэлт төлбөрийн (дэлгэрэнгүй)",
                path: "/report/extra-charge/detailed",
            },
            {
                title: "нэмэлт төлбөр (хураангуй)",
                path: "/report/extra-charge/summary",
            },
            {
                title: "байгууллага хоорондын тооцоо",
                path: "/report/interagency",
            },
            {
                title: "сарын тайлан",
                path: "/report/monthly",
            },
            {
                title: "сарын тайлан (орлогоор)",
                path: "/report/monthly-revenue",
            },
            {
                title: "ресепшний буух зочдын тайлан",
                path: "/report/reception/checked-in",
            },
            {
                title: "ресепшний гарах зочдын тайлан",
                path: "/report/reception/checked-out",
            },
            {
                title: "ресепшний устгалын тайлан",
                path: "/report/reception/deleted-reservations",
            },
            {
                title: "ресепшний хугацаа дуусах, үлдэх тайлан",
                path: "/report/reception/dueout-stayover",
            },
            {
                title: "ресепшний нэмэлт төлбөрийн тайлан",
                path: "/report/reception/extra-charge",
            },
            {
                title: "ресепшний төлбөрийн тайлан",
                path: "/report/reception/payment",
            },
            {
                title: "ресепшний өрөөний төлбөр",
                path: "/report/reception/room-charge",
            },
            {
                title: "захиалгын тайлан",
                path: "/report/reservations",
            },

            {
                title: "stayview",
                path: "/report/stayview",
            },
        ],
    },
    {
        title: "тохиргоо",
        icon: getIcon(settings2Fill),
        children: [
            {
                title: "зочид буудлын мэдээлэл",
                path: "/conf/hotel-information",
            },
            {
                title: "э-шуудан тохиргоо",
                path: "/conf/email",
            },
            {
                title: "хэрэглэгчийн төрөл",
                path: "/conf/user-role",
            },
            {
                title: "хэрэглэгч",
                path: "/conf/user",
            },
            {
                title: "шалтгаан",
                path: "/conf/reason",
            },
            {
                title: "захиалгын эх сурвалж",
                path: "/conf/reservation-source",
            },
            // {
            //     title: "pos api тохиргоо",
            //     path: "/conf/pos-api",
            // },
            {
                title: "вип төлөв",
                path: "/conf/vip-status",
            },
            {
                title: "харилцагчийн бүлэг",
                path: "/conf/customer-group",
            },
            {
                title: "зочид буудлын тохиргоо",
                path: "/conf/hotel-setting",
            },
            {
                title: "notification",
                path: "/conf/notification",
            },

            {
                title: "урамшуулал",
                path: "/conf/promotion",
            },
            {
                title: "багц",
                path: "/conf/package",
            },
            {
                title: "мини бар бүлэг",
                path: "/mini-bar/group",
            },
            {
                title: "мини бар бараа",
                path: "/mini-bar/item",
            },
        ],
    },
    {
        title: "өрөө үйлчилгээ",
        icon: getIcon(awardFill),
        children: [
            {
                title: "house keeping",
                path: "/room-service/house-keeping",
            },
            {
                title: "өрөөний төлөв",
                path: "/room-service/house-status",
            },
            {
                title: "ажлын даалгавар",
                path: "/room-service/work-order",
            },
            {
                title: "өрөө блоклох",
                path: "/room-service/room-block",
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
    // {
    //     title: "бүлэг",
    //     icon: getIcon(peopleFill),
    //     children: [
    //         // {
    //         //     title: "групп захиалгын жагсаалт",
    //         //     path: "/group-operation/group-reservations-list",
    //         // },
    //         {
    //             title: "байрлаж буй групп",
    //             path: "/group-operation/in-house-group",
    //         },
    //         {
    //             title: "гарсан групп",
    //             path: "/group-operation/departed-group",
    //         },
    //     ],
    // },
];

export default sidebarConfig;
