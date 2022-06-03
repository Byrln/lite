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
        title: "Calendar PMS",
        path: "/timeline",
        icon: getIcon(pieChart2Fill),
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
                path: "/conf/hotel",
            },
            {
                title: "e-mail configuration",
                path: "/conf/email",
            },
            {
                title: "user role",
                path: "/conf/role",
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
                title: "post api config",
                path: "/conf/post-api",
            },
            {
                title: "vip status",
                path: "/conf/vip status",
            },
            {
                title: "customer group",
                path: "/conf/customer-group",
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
