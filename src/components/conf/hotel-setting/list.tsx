import ToggleChecked from "components/common/custom-switch";
import CustomTable from "components/common/custom-table";
import {
    HotelSettingSWR,
    HotelSettingAPI,
    listUrl,
} from "lib/api/hotel-setting";
import NewEdit from "./new-edit";

const columns = [
    {
        title: "Hotel Setting",
        key: "HotelSettingName",
        dataIndex: "HotelSettingName",
    },
    {
        title: "Description",
        key: "HotelSettingDescription",
        dataIndex: "HotelSettingDescription",
    },
    {
        title: "Show Warning",
        key: "ShowWarning",
        dataIndex: "ShowWarning",
        render: function render(id: any, value: any) {
            return <ToggleChecked id={id} checked={value} disabled={true} />;
        },
    },
    {
        title: "Status",
        key: "Status",
        dataIndex: "Status",
        render: function render(id: any, value: any) {
            return (
                <ToggleChecked
                    id={id}
                    checked={value}
                    api={HotelSettingAPI}
                    apiUrl="UpdateStatus"
                    mutateUrl={`${listUrl}`}
                />
            );
        },
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
