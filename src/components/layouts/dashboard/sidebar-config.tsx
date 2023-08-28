import { Icon } from "@iconify/react";
import pieChart2Fill from "@iconify/icons-eva/pie-chart-2-fill";
import peopleFill from "@iconify/icons-eva/people-fill";

const getIcon = (name: any) => <Icon icon={name} width={22} height={22} />;

const sidebarConfig = [
    {
        title: "dashboard",
        path: "/",
        icon: getIcon(pieChart2Fill),
    },
    {
        title: "calendar",
        path: "/handsontable",
        icon: getIcon(pieChart2Fill),
    },
    {
        title: "front office",
        icon: getIcon(peopleFill),
        children: [
            {
                title: "stay view",
                path: "/front-office/stay-view",
            },
            // {
            //     title: "new reservation",
            //     path: "/front-office/new-reservation",
            // },
            {
                title: "reservation list",
                path: "/front-office/reservation-list",
            },
            {
                title: "night audit",
                path: "/front-office/night-audit",
            },
            {
                title: "guest database",
                path: "/front-office/guest-database",
            },

            {
                title: "depature list",
                path: "/front-office/depature-list",
            },
            {
                title: "departured list",
                path: "/front-office/departured-list",
            },
        ],
    },
    {
        title: "group operation",
        icon: getIcon(peopleFill),
        children: [
            {
                title: "group reservations list",
                path: "/group-operation/group-reservations-list",
            },
            {
                title: "in house groups",
                path: "/group-operation/in-house-group",
            },
            {
                title: "departed groups",
                path: "/group-operation/departed-group",
            },
        ],
    },
    {
        title: "payment",
        icon: getIcon(peopleFill),
        children: [
            {
                title: "company database",
                path: "/payment/company-database",
            },
            {
                title: "cashier",
                path: "/payment/cashier",
            },
            {
                title: "exchange rate",
                path: "/payment/exchange-rate",
            },
        ],
    },
    {
        title: "room service",
        icon: getIcon(peopleFill),
        children: [
            {
                title: "house keeping",
                path: "/room-service/house-keeping",
            },
            {
                title: "house status",
                path: "/room-service/house-status",
            },
            {
                title: "work order",
                path: "/room-service/work-order",
            },
            {
                title: "room block",
                path: "/room-service/room-block",
            },
        ],
    },

    {
        title: "reports",
        icon: getIcon(peopleFill),
        children: [
            {
                title: "accounting",
                path: "/integration/accounting",
            },
        ],
    },
    {
        title: "integration",
        icon: getIcon(peopleFill),
        children: [
            {
                title: "accounting",
                path: "/integration/accounting",
            },
        ],
    },
    {
        title: "configuration",
        icon: getIcon(peopleFill),
        children: [
            {
                title: "hotel information",
                path: "/conf/hotel-information",
            },
            {
                title: "e-mail configuration",
                path: "/conf/email",
            },
            {
                title: "user role",
                path: "/conf/user-role",
            },
            {
                title: "user",
                path: "/conf/user",
            },
            {
                title: "reasons",
                path: "/conf/reason",
            },
            {
                title: "reservation source",
                path: "/conf/reservation-source",
            },
            {
                title: "pos api config",
                path: "/conf/pos-api",
            },
            {
                title: "vip status",
                path: "/conf/vip-status",
            },
            {
                title: "customer group",
                path: "/conf/customer-group",
            },
            {
                title: "hotel setting",
                path: "/conf/hotel-setting",
            },
            {
                title: "notification",
                path: "/conf/notification",
            },

            {
                title: "Promotion",
                path: "/conf/promotion",
            },
            {
                title: "package",
                path: "/conf/package",
            },
        ],
    },
    {
        title: "rooms",
        icon: getIcon(peopleFill),
        children: [
            {
                title: "room type",
                path: "/room/type",
            },
            {
                title: "room amenities",
                path: "/room/amenities",
            },
            {
                title: "room status",
                path: "/room/status",
            },
            {
                title: "rooms",
                path: "/room",
            },
            {
                title: "door lock",
                path: "/room/door-lock",
            },
        ],
    },
    {
        title: "rates",
        icon: getIcon(peopleFill),
        children: [
            {
                title: "rate type",
                path: "/rate/type",
            },
            {
                title: "season",
                path: "/rate/season",
            },
            {
                title: "rates",
                path: "/rate",
            },
            {
                title: "extra charge group",
                path: "/rate/extra-charge-group",
            },
            {
                title: "extra charges",
                path: "/rate/extra-charge",
            },
            {
                title: "tax",
                path: "/rate/tax",
            },
            {
                title: "payment method",
                path: "/rate/payment-method",
            },
            {
                title: "inclusion",
                path: "/rate/inclusion",
            },
        ],
    },
    {
        title: "mini bar",
        icon: getIcon(peopleFill),
        children: [
            {
                title: "groups",
                path: "/mini-bar/group",
            },
            {
                title: "items",
                path: "/mini-bar/item",
            },
        ],
    },
];

export default sidebarConfig;
