import { useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

import CustomSearch from "components/common/custom-search";
import CustomTable from "components/common/custom-table";
import { WorkOrderSWR, WorkOrderAPI, listUrl } from "lib/api/work-order";
import NewEdit from "./new-edit";
import Search from "./search";

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
    const validationSchema = yup.object().shape({
        RoomID: yup.string().nullable(),
        WorkOrderPriorityID: yup.string().nullable(),
        AssignedUserID: yup.string().nullable(),
        Status: yup.string().nullable(),
    });
    const formOptions = { resolver: yupResolver(validationSchema) };
    const {
        reset,
        register,
        handleSubmit,
        formState: { errors },
        control,
    } = useForm(formOptions);

    const [search, setSearch] = useState({});

    const { data, error } = WorkOrderSWR(search);

    return (
        <>
            <CustomSearch
                listUrl={listUrl}
                search={search}
                setSearch={setSearch}
                handleSubmit={handleSubmit}
                reset={reset}
            >
                <Search
                    register={register}
                    errors={errors}
                    control={control}
                    reset={reset}
                />
            </CustomSearch>

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
        </>
    );
};

export default WorkOrderList;
