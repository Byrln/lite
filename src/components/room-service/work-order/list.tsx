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
            key: "RowHeaderWorkOrderNo",
            dataIndex: "RowHeaderWorkOrderNo",
        },
        {
            title: intl.formatMessage({id:"ConfigRooms"}), 
            key: "ConfigRooms",
            dataIndex: "ConfigRooms",
        },
        {
            title: intl.formatMessage({id:"RowHeaderPriority"}), 
            key: "RowHeaderPriority",
            dataIndex: "RowHeaderPriority",
        },
        {
            title: intl.formatMessage({id:"RowHeaderWODescription"}), 
            key: "RowHeaderWODescription",
            dataIndex: "RowHeaderWODescription",
        },
        {
            title: intl.formatMessage({id:"RowHeaderStarted"}), 
            key: "RowHeaderStarted",
            dataIndex: "RowHeaderStarted",
        },
        {
            title: intl.formatMessage({id:"RowHeaderDeadline"}), 
            key: "RowHeaderDeadline",
            dataIndex: "RowHeaderDeadline",
        },
        {
            title: intl.formatMessage({id:"TargetedEmployee"}), 
            key: "TargetedEmployee",
            dataIndex: "TargetedEmployee",
        },
        {
            title: intl.formatMessage({id:"RowHeaderAssignedTo"}), 
            key: "RowHeaderAssignedTo",
            dataIndex: "RowHeaderAssignedTo",
        },
        {
            title: intl.formatMessage({id:"ReportStatus"}), 
            key: "ReportStatus",
            dataIndex: "ReportStatus",
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
