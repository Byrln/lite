import CustomTable from "components/common/custom-table";
import { WorkOrderSWR, WorkOrderAPI, listUrl } from "lib/api/work-order";
import NewEdit from "./new-edit";

const columns = [
    {
        title: "Order #",
        key: "Order",
        dataIndex: "Order",
    },
    {
        title: "Room",
        key: "Room",
        dataIndex: "Room",
    },
    {
        title: "Priority",
        key: "Priority",
        dataIndex: "Priority",
    },
    {
        title: "Description",
        key: "Description",
        dataIndex: "Description",
    },
    {
        title: "Started",
        key: "Started",
        dataIndex: "Started",
    },
    {
        title: "Deadline",
        key: "Deadline",
        dataIndex: "Deadline",
    },
    {
        title: "Assigner",
        key: "Assigner",
        dataIndex: "Assigner",
    },
    {
        title: "Assigned To",
        key: "AssignedTo",
        dataIndex: "AssignedTo",
    },
    {
        title: "Status",
        key: "Status",
        dataIndex: "Status",
    },
];

const WorkOrderList = ({ title }: any) => {
    const { data, error } = WorkOrderSWR();

    return (
        <CustomTable
            columns={columns}
            data={data}
            error={error}
            api={WorkOrderAPI}
            hasNew={true}
            hasUpdate={true}
            hasDelete={true}
            id="WorkOrderID"
            listUrl={listUrl}
            modalTitle={title}
            modalContent={<NewEdit />}
            excelName={title}
        />
    );
};

export default WorkOrderList;
