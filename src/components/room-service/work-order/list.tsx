import CustomTable from "components/common/custom-table";
import { WorkOrderSWR, WorkOrderAPI, listUrl } from "lib/api/work-order";
import NewEdit from "./new-edit";

const columns = [
    {
        title: "Order #",
        key: "WorkOrderNo",
        dataIndex: "WorkOrderNo",
    },
    {
        title: "Room",
        key: "RoomFullName",
        dataIndex: "RoomFullName",
    },
    {
        title: "Priority",
        key: "WorkOrderPriorityCode",
        dataIndex: "WorkOrderPriorityCode",
    },
    {
        title: "Description",
        key: "WODescription",
        dataIndex: "WODescription",
    },
    {
        title: "Started",
        key: "CreatedDate",
        dataIndex: "CreatedDate",
    },
    {
        title: "Deadline",
        key: "Deadline",
        dataIndex: "Deadline",
    },
    {
        title: "Assigner",
        key: "UserName",
        dataIndex: "UserName",
    },
    {
        title: "Assigned To",
        key: "AssignedUser",
        dataIndex: "AssignedUser",
    },
    {
        title: "Status",
        key: "StDescription",
        dataIndex: "StDescription",
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
