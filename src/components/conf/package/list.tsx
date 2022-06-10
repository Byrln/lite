import ToggleChecked from "components/common/custom-switch";
import CustomTable from "components/common/custom-table";
import { PackageSWR, PackageAPI, listUrl } from "lib/api/package";
import NewEdit from "./new-edit";

const columns = [
    {
        title: "Package Name",
        key: "PackageName",
        dataIndex: "PackageName",
    },
    {
        title: "Nigths",
        key: "Nigths",
        dataIndex: "Nigths",
    },
    {
        title: "Begin Date",
        key: "BeginDate",
        dataIndex: "BeginDate",
    },
    {
        title: "End Date",
        key: "EndDate",
        dataIndex: "EndDate",
    },
    {
        title: "Room Count",
        key: "RoomCount",
        dataIndex: "RoomCount",
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
                    api={PackageAPI}
                    apiUrl="UpdateStatus"
                    mutateUrl={`${listUrl}`}
                />
            );
        },
    },
];

const PackageList = ({ title }: any) => {
    const { data, error } = PackageSWR();

    return (
        <CustomTable
            columns={columns}
            data={data}
            error={error}
            api={PackageAPI}
            hasNew={true}
            hasUpdate={true}
            hasDelete={true}
            id="PackageID"
            listUrl={listUrl}
            modalTitle={title}
            modalContent={<NewEdit />}
            excelName={title}
        />
    );
};

export default PackageList;
