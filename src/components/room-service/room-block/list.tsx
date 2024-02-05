import moment from "moment";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

import CustomSearch from "components/common/custom-search";
import CustomTable from "components/common/custom-table";
import { RoomBlockSWR, RoomBlockAPI, listUrl } from "lib/api/room-block";
import NewEdit from "./new-edit";
import Search from "./search";

const columns = [
    {
        title: "Өрөө",
        key: "RoomFullName",
        dataIndex: "RoomFullName",
    },
    {
        title: "Эхлэх огноо",
        key: "BeginDate",
        dataIndex: "BeginDate",
    },
    {
        title: "Дуусах огноо",
        key: "EndDate",
        dataIndex: "EndDate",
    },
    {
        title: "Блоклох",
        key: "CreatedDate",
        dataIndex: "CreatedDate",
    },
    {
        title: "Блоклосон",
        key: "UserName",
        dataIndex: "UserName",
    },
    {
        title: "Шалтгаан",
        key: "Description",
        dataIndex: "Description",
    },
];

const RoomBlockList = ({ title, workingDate }: any) => {
    const validationSchema = yup.object().shape({
        StartDate: yup.string().nullable(),
        EndDate: yup.string().nullable(),
        RoomID: yup.string().nullable(),
    });
    const formOptions = { resolver: yupResolver(validationSchema) };

    const {
        reset,
        register,
        handleSubmit,
        formState: { errors },
        control,
    } = useForm(formOptions);

    const [search, setSearch] = useState({
        StartDate: moment(workingDate).format("YYYY-MM-DD"),
        EndDate: moment(workingDate).add(1, "days").format("YYYY-MM-DD"),
    });

    useEffect(() => {
        reset({
            StartDate: moment(workingDate).format("YYYY-MM-DD"),
            EndDate: moment(workingDate).add(1, "days").format("YYYY-MM-DD"),
        });
    }, []);

    const { data, error } = RoomBlockSWR(search);

    return (
        <CustomTable
            columns={columns}
            data={data}
            error={error}
            api={RoomBlockAPI}
            hasNew={true}
            //hasUpdate={true}
            //hasDelete={true}
            id="RoomBlockID"
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
    );
};

export default RoomBlockList;
