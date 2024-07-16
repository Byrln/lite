import { useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useIntl } from "react-intl";
import CustomSearch from "components/common/custom-search";
import CustomTable from "components/common/custom-table";
import { WorkOrderSWR, WorkOrderAPI, listUrl } from "lib/api/work-order";
import NewEdit from "./new-edit";
import Search from "./search";


const WorkOrderList = ({ title }: any) => {
    const intl = useIntl();
    const columns = [
        {
            title: intl.formatMessage({id:"RowHeaderWorkOrderNo"}), 
            key: "WorkOrderNo",
            dataIndex: "WorkOrderNo",
        },
        {
            title: intl.formatMessage({id:"ConfigRooms"}), 
            key: "RoomFullName",
            dataIndex: "RoomFullName",
        },
        {
            title: intl.formatMessage({id:"RowHeaderPriority"}), 
            key: "WorkOrderPriorityCode",
            dataIndex: "WorkOrderPriorityCode",
        },
        {
            title: intl.formatMessage({id:"RowHeaderWODescription"}), 
            key: "WODescription",
            dataIndex: "WODescription",
        },
        {
            title: intl.formatMessage({id:"RowHeaderStarted"}), 
            key: "CreatedDate",
            dataIndex: "CreatedDate",
        },
        {
            title: intl.formatMessage({id:"RowHeaderDeadline"}), 
            key: "Deadline",
            dataIndex: "Deadline",
        },
        {
            title: intl.formatMessage({id:"TargetedEmployee"}), 
            key: "UserName",
            dataIndex: "UserName",
        },
        {
            title: intl.formatMessage({id:"RowHeaderAssignedTo"}), 
            key: "AssignedUser",
            dataIndex: "AssignedUser",
        },
        {
            title: intl.formatMessage({id:"ReportStatus"}), 
            key: "StDescription",
            dataIndex: "StDescription",
        },
    ];
    
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
                hasShow={false}
                id="WorkOrderRegisterID"
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
                datagrid={true}
            />
        </>
    );
};

export default WorkOrderList;
