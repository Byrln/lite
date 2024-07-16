import { useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button } from "@mui/material";
import { useIntl } from "react-intl";
import CustomSearch from "components/common/custom-search";
import CustomTable from "components/common/custom-table";
import {
    HouseKeepingRoomSWR,
    HouseKeepingAPI,
    listRoomUrl,
} from "lib/api/house-keeping";
import NewEdit from "./new-edit";
import Search from "./search";
import Unasign from "components/room-service/house-status/additional-actions/unasign";
import Asign from "components/room-service/house-status/additional-actions/asign";
import StatusChange from "components/room-service/house-status/additional-actions/status-change";
import StatusRemove from "components/room-service/house-status/additional-actions/status-remove";

const HouseStatusList = ({ title }: any) => {
    const intl = useIntl();
    const validationSchema = yup.object().shape({
        RoomTypeID: yup.string().nullable(),
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

    const { data, error } = HouseKeepingRoomSWR(search);

    const columns = [
        {
            title: "№",
            key: "№",
            dataIndex: "№",
        },
        {
            title: intl.formatMessage({id:"ConfigRooms"}), 
            key: "RoomNo",
            dataIndex: "RoomNo",
        },
        {
            title: intl.formatMessage({id:"ReportRoomType"}), 
            key: "RoomTypeName",
            dataIndex: "RoomTypeName",
        },
        {
            title: intl.formatMessage({id:"RowHeaderHouseStatus"}), 
            key: "HKSDescription",
            dataIndex: "HKSDescription",
        },
        {
            title: intl.formatMessage({id:"RowHeaderAction"}), 
            key: "Action",
            dataIndex: "Action",
            excelRenderPass: true,
            render: function render(id: any, record: any, entity: any) {
                return (
                    <>
                        <StatusChange
                            RoomID={entity.RoomID}
                            listUrl={listRoomUrl}
                            RoomTypeName={entity.RoomTypeName}
                            RoomNo={entity.RoomNo}
                        />
                        {entity.HouseKeepingStatusID != 0 && (
                            <StatusRemove
                                RoomID={entity.RoomID}
                                listUrl={listRoomUrl}
                            />
                        )}
                    </>
                );
            },
        },
        {
            title: intl.formatMessage({id:"RowHeaderRoomStatus"}), 
            key: "RSDescription",
            dataIndex: "RSDescription",
        },
        {
            title: intl.formatMessage({id:"RowHeaderHouseKeeper"}), 
            key: "HKUserName",
            dataIndex: "HKUserName",
        },
        {
            title: intl.formatMessage({id:"RowHeaderAction"}), 
            key: "Action",
            dataIndex: "Action",
            excelRenderPass: true,
            render: function render(id: any, record: any, entity: any) {
                return (
                    <>
                        <Asign
                            RoomID={entity.RoomID}
                            listUrl={listRoomUrl}
                            RoomTypeName={entity.RoomTypeName}
                            RoomNo={entity.RoomNo}
                        />
                        {entity.HKUserName.length > 0 && (
                            <Unasign
                                RoomID={entity.RoomID}
                                listUrl={listRoomUrl}
                            />
                        )}
                    </>
                );
            },
        },
    ];

    return (
        <>
            <CustomTable
                columns={columns}
                data={data}
                error={error}
                api={HouseKeepingAPI}
                id="RoomID"
                listUrl={listRoomUrl}
                modalTitle={title}
                modalContent={<NewEdit />}
                excelName={title}
                search={
                    <CustomSearch
                        listUrl={listRoomUrl}
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
                datagrid={false}
                rowColor="HKStatusColor"
            />
        </>
    );
};

export default HouseStatusList;
