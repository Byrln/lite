import ToggleChecked from "components/common/custom-switch";
import CustomTable from "components/common/custom-table";
import { AmenitySWR, AmenityAPI, listUrl } from "lib/api/amenity";
import NewEdit from "./new-edit";

const columns = [
    {
        title: "Type",
        key: "AmenityTypeName",
        dataIndex: "AmenityTypeName",
    },
    {
        title: "Short Code",
        key: "AmenityShortName",
        dataIndex: "AmenityShortName",
    },
    {
        title: "Amenity Name",
        key: "AmenityName",
        dataIndex: "AmenityName",
    },
    { title: "Sort Order", key: "SortOrder", dataIndex: "SortOrder" },
    {
        title: "Status",
        key: "Status",
        dataIndex: "Status",
        render: function render(id: any, value: any) {
            return (
                <ToggleChecked
                    id={id}
                    checked={value}
                    api={AmenityAPI}
                    apiUrl="UpdateStatus"
                    mutateUrl={`${listUrl}`}
                />
            );
        },
    },
];

const AmenityList = ({ title }: any) => {
    const { data, error } = AmenitySWR();

    return (
        <CustomTable
            columns={columns}
            data={data}
            error={error}
            api={AmenityAPI}
            hasNew={true}
            hasUpdate={true}
            hasDelete={true}
            id="AmenityID"
            listUrl={listUrl}
            modalTitle={title}
            modalContent={<NewEdit />}
            excelName={title}
        />
    );
};

export default AmenityList;
