import { useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

import CustomSearch from "components/common/custom-search";
import CustomTable from "components/common/custom-table";
import {
    HouseKeepingRoomSWR,
    HouseKeepingAPI,
    listRoomUrl,
} from "lib/api/house-keeping";
import NewEdit from "./new-edit";
import Search from "./search";

const columns = [
    {
        title: "Room",
        key: "RoomNo",
        dataIndex: "RoomNo",
    },
    {
        title: "Room Type",
        key: "RoomTypeName",
        dataIndex: "RoomTypeName",
    },
    {
        title: "House Status",
        key: "HKSDescription",
        dataIndex: "HKSDescription",
    },
    {
        title: "Room Status",
        key: "RSDescription",
        dataIndex: "RSDescription",
    },
    {
        title: "HouseKeeper",
        key: "HKUserName",
        dataIndex: "HKUserName",
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

            <CustomTable
                columns={columns}
                data={data}
                error={error}
                api={HouseKeepingAPI}
                id="HouseStatusID"
                listUrl={listRoomUrl}
                modalTitle={title}
                modalContent={<NewEdit />}
                excelName={title}
            />
        </>
    );
};

export default HouseStatusList;
