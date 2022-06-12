import { format } from "date-fns";

import CustomTable from "components/common/custom-table";
import {
    HotelSettingSWR,
    HotelSettingAPI,
    listUrl,
} from "lib/api/hotel-setting";
import { formatPrice } from "lib/utils/helpers";
import NewEdit from "./new-edit";
import ToggleChecked from "components/common/custom-switch";

const columns = [
    {
        title: "Hotel Code",
        key: "HotelCode",
        dataIndex: "HotelCode",
    },
    {
        title: "Hotel Name",
        key: "HotelName",
        dataIndex: "HotelName",
    },
    {
        title: "Room Count",
        key: "RoomCount",
        dataIndex: "RoomCount",
    },
    {
        title: "PMS Start",
        key: "PMSStart",
        dataIndex: "PMSStart",
        render: function render(id: any, value: any) {
            return (
                value &&
                format(new Date(value.replace(/ /g, "T")), "MM/dd/yyyy")
            );
        },
    },
    {
        title: "PMS End",
        key: "PMSEnd",
        dataIndex: "PMSEnd",
        render: function render(id: any, value: any) {
            return (
                value &&
                format(new Date(value.replace(/ /g, "T")), "MM/dd/yyyy")
            );
        },
    },
    {
        title: "Booking Engine",
        key: "BookingEngine",
        dataIndex: "BookingEngine",
        render: function render(id: any, value: any) {
            return <ToggleChecked id={id} checked={value} disabled={true} />;
        },
    },
    {
        title: "Commission",
        key: "RoomChargeDuration",
        dataIndex: "RoomChargeDuration",
        render: function render(id: any, value: any) {
            return formatPrice(value);
        },
    },
    {
        title: "Package Name",
        key: "EditionName",
        dataIndex: "EditionName",
    },
];

const HotelSettingList = ({ title }: any) => {
    const { data, error } = HotelSettingSWR();

    return (
        <CustomTable
            columns={columns}
            data={data}
            error={error}
            api={HotelSettingAPI}
            hasNew={true}
            hasUpdate={true}
            hasDelete={true}
            id="HotelSettingID"
            listUrl={listUrl}
            modalTitle={title}
            modalContent={<NewEdit />}
            excelName={title}
        />
    );
};

export default HotelSettingList;
