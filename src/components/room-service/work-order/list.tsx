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
        title: "Захиалга #",
        key: "WorkOrderNo",
        dataIndex: "WorkOrderNo",
    },
    {
        title: "Өрөө",
        key: "RoomFullName",
        dataIndex: "RoomFullName",
    },
    {
        title: "Чухал байдал",
        key: "WorkOrderPriorityCode",
        dataIndex: "WorkOrderPriorityCode",
    },
    {
        title: "Тайлбар",
        key: "WODescription",
        dataIndex: "WODescription",
    },
    {
        title: "Эхэлсэн",
        key: "CreatedDate",
        dataIndex: "CreatedDate",
    },
    {
        title: "Эц.хугацаа",
        key: "Deadline",
        dataIndex: "Deadline",
    },
    {
        title: "Оноосон.ажилтан",
        key: "UserName",
        dataIndex: "UserName",
    },
    {
        title: "Өр.Үйлч оноох",
        key: "AssignedUser",
        dataIndex: "AssignedUser",
    },
    {
        title: "Төлөв",
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
                search={
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
                }
            />
        </>
    );
};

export default WorkOrderList;
