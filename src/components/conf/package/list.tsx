import { format } from "date-fns";

import CustomTable from "components/common/custom-table";
import { PackageSWR, PackageAPI, listUrl } from "lib/api/package";
import NewEdit from "./new-edit";
import { formatPrice } from "lib/utils/helpers";

const columns = [
    {
        title: "Package Name",
        key: "PackageName",
        dataIndex: "PackageName",
    },
    {
        title: "Nigths",
        key: "Nights",
        dataIndex: "Nights",
    },
    {
        title: "Begin Date",
        key: "BeginDate",
        dataIndex: "BeginDate",
        render: function render(id: any, value: any) {
            return (
                value &&
                format(
                    new Date(value.replace(/ /g, "T")),
                    "MM/dd/yyyy hh:mm:ss a"
                )
            );
        },
    },
    {
        title: "End Date",
        key: "EndDate",
        dataIndex: "EndDate",
        render: function render(id: any, value: any) {
            return (
                value &&
                format(
                    new Date(value.replace(/ /g, "T")),
                    "MM/dd/yyyy hh:mm:ss a"
                )
            );
        },
    },
    {
        title: "Room Count",
        key: "RoomCount",
        dataIndex: "RoomCount",
    },
    {
        title: "Room",
        key: "RoomAmount",
        dataIndex: "RoomAmount",
        render: function render(id: any, value: any) {
            return formatPrice(value);
        },
    },
    {
        title: "Extra Charge",
        key: "ExtraChargeAmount",
        dataIndex: "ExtraChargeAmount",
        render: function render(id: any, value: any) {
            return formatPrice(value);
        },
    },
    {
        title: "User Name",
        key: "UserName",
        dataIndex: "UserName",
    },
    {
        title: "IP Address",
        key: "IPAddress",
        dataIndex: "IPAddress",
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
            id="PackageID"
            listUrl={listUrl}
            modalTitle={title}
            modalContent={<NewEdit />}
            excelName={title}
        />
    );
};

export default PackageList;
