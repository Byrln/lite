import { useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

import CustomSearch from "components/common/custom-search";
import ToggleChecked from "components/common/custom-switch";
import CustomTable from "components/common/custom-table";
import { FloorSWR, FloorAPI, listUrl } from "lib/api/floor";
import NewEdit from "./new-edit";

const columns = [
    {
        title: "Давхар",
        key: "FloorNo",
        dataIndex: "FloorNo",
    },
    {
        title: "Status",
        key: "Status",
        dataIndex: "Status",
        render: function render(id: any, value: any) {
            return (
                <ToggleChecked
                    id={id}
                    checked={value}
                    apiUrl="UpdateStatus"
                    mutateUrl={`${listUrl}`}
                />
            );
        },
    },
];

const AmenityList = ({ title }: any) => {
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

    const { data, error } = FloorSWR();

    return (
        <>
            <CustomTable
                columns={columns}
                data={data}
                error={error}
                api={FloorAPI}
                hasNew={true}
                hasUpdate={false}
                hasDelete={false}
                hasShow={false}
                id="FloorID"
                listUrl={listUrl}
                modalTitle={title}
                modalContent={<NewEdit />}
                excelName={title}
                datagrid={false}
            />
        </>
    );
};

export default AmenityList;
