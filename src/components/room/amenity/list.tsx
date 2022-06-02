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
