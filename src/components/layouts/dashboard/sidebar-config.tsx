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
        title: "room",
        path: "/room",
        icon: getIcon(peopleFill),
    },
    {
        title: "room type",
        path: "/room/type",
        icon: getIcon(peopleFill),
    },
    {
        title: "room status",
        path: "/room/status",
        icon: getIcon(peopleFill),
    },
    {
        title: "room amenities",
        path: "/room/amenities",
        icon: getIcon(peopleFill),
    },
    {
        title: "rate",
        path: "/rate",
        icon: getIcon(peopleFill),
    },
    {
        title: "rate type",
        path: "/rate/type",
        icon: getIcon(peopleFill),
    },
    {
        title: "tax",
        path: "/rate/tax",
        icon: getIcon(peopleFill),
    },
    {
        title: "season",
        path: "/rate/season",
        icon: getIcon(peopleFill),
    },
    {
        title: "payment method",
        path: "/rate/payment-method",
        icon: getIcon(peopleFill),
    },
    {
        title: "inclusion",
        path: "/rate/inclusion",
        icon: getIcon(peopleFill),
    },
    {
        title: "extra charge group",
        path: "/rate/extra-charge-group",
        icon: getIcon(peopleFill),
    },
    {
        title: "extra charge",
        path: "/rate/extra-charge",
        icon: getIcon(peopleFill),
    },
    {
        title: "mini bar item",
        path: "/mini-bar/item",
        icon: getIcon(peopleFill),
    },
    {
        title: "mini bar group",
        path: "/mini-bar/group",
        icon: getIcon(peopleFill),
    },
    {
        title: "e-mail config",
        path: "/conf/email-conf",
        icon: getIcon(peopleFill),
    },
];

export default sidebarConfig;
