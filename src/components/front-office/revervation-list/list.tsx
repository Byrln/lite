import { format } from "date-fns";

import ToggleChecked from "components/common/custom-switch";
import CustomTable from "components/common/custom-table";
import { RevervationSWR, RevervationAPI, listUrl } from "lib/api/revervation";
import NewEdit from "./new-edit";

const columns = [
    {
        title: "Begin Date",
        key: "BeginDate",
        dataIndex: "BeginDate",
        render: function render(id: any, value: any) {
            return (
                value &&
                format(new Date(value.replace(/ /g, "T")), "MM/dd/yyyy")
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
                format(new Date(value.replace(/ /g, "T")), "MM/dd/yyyy")
            );
        },
    },
    {
        title: "Company",
        key: "Company",
        dataIndex: "Company",
    },
    {
        title: "Name",
        key: "Name",
        dataIndex: "Name",
    },
    {
        title: "Phone",
        key: "Phone",
        dataIndex: "Phone",
    },
    {
        title: "Email",
        key: "Email",
        dataIndex: "Email",
    },
    {
        title: "Revervation Type",
        key: "RevervationType",
        dataIndex: "RevervationType",
        render: function render(id: any, value: any) {
            return value === 1
                ? "Confirm Booking"
                : value === 2
                ? "Unconfirmed Booking Inquiry"
                : "";
        },
    },
    {
        title: "Revervation Source",
        key: "RevervationSource",
        dataIndex: "RevervationSource",
        render: function render(id: any, value: any) {
            return value === 1
                ? "Confirm Booking"
                : value === 2
                ? "Unconfirmed Booking Inquiry"
                : "";
        },
    },
];

const RevervationList = ({ title }: any) => {
    const { data, error } = RevervationSWR();

    return (
        <CustomTable
            columns={columns}
            data={data}
            error={error}
            api={RevervationAPI}
            hasNew={true}
            hasUpdate={true}
            hasDelete={true}
            id="RevervationID"
            listUrl={listUrl}
            modalTitle={title}
            modalContent={<NewEdit />}
            excelName={title}
        />
    );
};

export default RevervationList;
