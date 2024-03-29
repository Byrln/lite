import { useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

import CustomSearch from "components/common/custom-search";
import ToggleChecked from "components/common/custom-switch";
import CustomTable from "components/common/custom-table";
import {
    ChargeTypeGroupSWR,
    ChargeTypeGroupAPI,
    listUrl,
} from "lib/api/charge-type-group";
import NewEdit from "./new-edit";
import Search from "./search";

const columns = [
    {
        title: "Бүлгийн нэр",
        key: "RoomChargeTypeGroupName",
        dataIndex: "RoomChargeTypeGroupName",
    },
    {
        title: "Эрэмбэлэх",
        key: "SortOrder",
        dataIndex: "SortOrder",
    },
    {
        title: "Төлөв",
        key: "Status",
        dataIndex: "Status",
        excelRenderPass: true,
        renderCell: (element: any) => {
            return (
                <ToggleChecked
                    id={element.id}
                    checked={element.row.Status}
                    api={ChargeTypeGroupAPI}
                    apiUrl="UpdateStatus"
                    mutateUrl={`${listUrl}`}
                />
            );
        },
    },
];

const MiniBarGroupList = ({ title }: any) => {
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

    const [search, setSearch] = useState({ IsMiniBar: true });

    const { data, error } = ChargeTypeGroupSWR(search);

    return (
        <>
            <CustomTable
                columns={columns}
                data={data}
                error={error}
                api={ChargeTypeGroupAPI}
                hasNew={true}
                hasUpdate={true}
                hasDelete={true}
                id="RoomChargeTypeGroupID"
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

export default MiniBarGroupList;
