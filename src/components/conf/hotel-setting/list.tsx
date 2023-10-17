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
        title: "Буудлын код",
        key: "HotelCode",
        dataIndex: "HotelCode",
    },
    {
        title: "Буудлын нэр",
        key: "HotelName",
        dataIndex: "HotelName",
    },
    {
        title: "Өрөөний тоо",
        key: "RoomCount",
        dataIndex: "RoomCount",
    },
    {
        title: "PMS эхлэх",
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
        title: "PMS дуусах",
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
        title: "Шууд захиалга",
        key: "BookingEngine",
        dataIndex: "BookingEngine",
        render: function render(id: any, value: any) {
            return <ToggleChecked id={id} checked={value} disabled={true} />;
        },
    },
    {
        title: "Шимтгэл",
        key: "RoomChargeDuration",
        dataIndex: "RoomChargeDuration",
        render: function render(id: any, value: any) {
            return formatPrice(value);
        },
    },
    {
        title: "Багцын нэр",
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
            hasNew={false}
            hasUpdate={true}
            hasDelete={false}
            id="HotelID"
            listUrl={listUrl}
            modalTitle={title}
            modalContent={<NewEdit />}
            excelName={title}
        />
    );
};

export default HotelSettingList;
