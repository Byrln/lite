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
];

export default sidebarConfig;
