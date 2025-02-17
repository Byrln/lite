import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useIntl } from "react-intl";

import CustomSearch from "components/common/custom-search";
import ToggleChecked from "components/common/custom-switch";
import CustomTable from "components/common/custom-table";
import { RoomSWR, RoomAPI, listUrl } from "lib/api/room";
import NewEdit from "./new-edit";
import Search from "./search";

const RoomList = ({ title, setHasData = null }: any) => {
    const intl = useIntl();
    const validationSchema = yup.object().shape({
        SearchStr: yup.string().nullable(),
        RoomTypeID: yup.string().nullable(),
    });
    const columns = [
        {
            title: intl.formatMessage({ id: "RowHeaderRoomNo" }),
            key: "RoomNo",
            dataIndex: "RoomNo",
        },
        {
            title: intl.formatMessage({ id: "ConfigRoomType" }),
            key: "RoomTypeName",
            dataIndex: "RoomTypeName",
        },
        {
            title: intl.formatMessage({ id: "TextPhone" }),
            key: "TextPhone",
            dataIndex: "TextPhone",
        },
        {
            title: intl.formatMessage({ id: "RowHeaderStatus" }),
            key: "RowHeaderStatus",
            dataIndex: "RowHeaderStatus",
            excelRenderPass: true,
            renderCell: (element: any) => {
                return (
                    <ToggleChecked
                        id={element.id}
                        checked={element.row.Status}
                        api={RoomAPI}
                        apiUrl="UpdateStatus"
                        mutateUrl={`${listUrl}`}
                    />
                );
            },
        },
        {
            title: intl.formatMessage({ id: "RowHeaderFloor" }),
            key: "RowHeaderFloor",
            dataIndex: "RowHeaderFloor",
            sortable: true,
        },
    ];
    const formOptions = { resolver: yupResolver(validationSchema) };
    const {
        reset,
        register,
        handleSubmit,
        formState: { errors },
        control,
    } = useForm(formOptions);

    const [search, setSearch] = useState({});

    const { data, error } = RoomSWR(search);

    useEffect(() => {
        if (data && data.length > 0 && setHasData) {
            setHasData(true);
        }
    }, [data]);

    return (
        <>
            <CustomTable
                columns={columns}
                data={data}
                error={error}
                api={RoomAPI}
                hasNew={true}
                hasUpdate={true}
                hasDelete={true}
                id="RoomID"
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

export default RoomList;
