import { useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button } from "@mui/material";

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

const columns = [
    {
        title: "№",
        key: "№",
        dataIndex: "№",
    },
    {
        title: "Өрөө",
        key: "RoomNo",
        dataIndex: "RoomNo",
    },
    {
        title: "Өр.төрөл",
        key: "RoomTypeName",
        dataIndex: "RoomTypeName",
    },
    {
        title: "Цэвэрлэгээ/төлөв",
        key: "HKSDescription",
        dataIndex: "HKSDescription",
    },
    {
        title: "Үйлдэл",
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
        title: "Зочны төлөв",
        key: "RSDescription",
        dataIndex: "RSDescription",
    },
    {
        title: "Өрөө үйлчлэгч",
        key: "HKUserName",
        dataIndex: "HKUserName",
    },
    {
        title: "Үйлдэл",
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
                        <Unasign RoomID={entity.RoomID} listUrl={listRoomUrl} />
                    )}
                </>
            );
        },
    },
];

const HouseStatusList = ({ title }: any) => {
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
            />
        </>
    );
};

export default HouseStatusList;
