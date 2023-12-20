import { useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Tooltip } from "@mui/material";

import CustomSearch from "components/common/custom-search";
import CustomTable from "components/common/custom-table";
import { RoomStatusSWR, RoomStatusAPI, listUrl } from "lib/api/room-status";
import NewEdit from "./new-edit";
import Search from "./search";

const columns = [
    {
        title: "Өрөөний төлөв",
        key: "StatusCode",
        dataIndex: "StatusCode",
    },
    {
        title: "Өнгө",
        key: "StatusColor",
        dataIndex: "StatusColor",
        render: function render(id: any, value: any) {
            return (
                <Tooltip title={`#${value}`} placement="top">
                    <div
                        style={{
                            width: "40px",
                            height: "20px",
                            background: `#${value}`,
                            borderRadius: "5px",
                        }}
                    ></div>
                </Tooltip>
            );
        },
    },
    { title: "Тайлбар", key: "Description", dataIndex: "Description" },
];

const RoomStatusList = ({ title }: any) => {
    const validationSchema = yup.object().shape({
        SearchStr: yup.string().nullable(),
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

    const { data, error } = RoomStatusSWR(search);

    return (
        <>
            <CustomTable
                columns={columns}
                data={data}
                error={error}
                api={RoomStatusAPI}
                hasUpdate={true}
                id="RoomStatusID"
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

export default RoomStatusList;
