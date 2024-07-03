import { useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useIntl } from "react-intl";
import CustomSearch from "components/common/custom-search";
import ToggleChecked from "components/common/custom-switch";
import CustomTable from "components/common/custom-table";
import { RoomTypeSWR, RoomTypeAPI, listUrl } from "lib/api/room-type";
import NewEdit from "./new-edit";
import Search from "./search";



const RoomTypeList = ({ title }: any) => {
    const intl = useIntl();
    const columns = [
        {
            title: intl.formatMessage({id:"AmenityShortName"}), 
            key: "RoomTypeShortName",
            dataIndex: "RoomTypeShortName",
        },
        {
            title: intl.formatMessage({id:"Left_SortByRoomType"}), 
            key: "RoomTypeName",
            dataIndex: "RoomTypeName",
        },
        { title: intl.formatMessage({id:"ReportPax"}), 
             key: "BaseAC",
              dataIndex: "BaseAC" },

        { title: intl.formatMessage({id:"RowHeaderMaxAC"}), 
            key: "MaxAC", 
            dataIndex: "MaxAC" },
        {


            title: intl.formatMessage({id:"Left_SortByStatus"}), 
            key: "Status",
            dataIndex: "Status",
            excelRenderPass: true,
            renderCell: (element: any) => {
                return (
                    <ToggleChecked
                        id={element.id}
                        checked={element.row.Status}
                        api={RoomTypeAPI}
                        apiUrl="UpdateStatus"
                        mutateUrl={`${listUrl}`}
                    />
                );
            },
        },
    ];
    const validationSchema = yup.object().shape({
        SearchStr: yup.string().nullable(),
        RoomChargeTypeGroupID: yup.string().nullable(),
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

    const { data, error } = RoomTypeSWR(search);

    return (
        <>
            <CustomTable
                columns={columns}
                data={data}
                error={error}
                api={RoomTypeAPI}
                hasNew={true}
                hasUpdate={true}
                hasDelete={true}
                id="RoomTypeID"
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

export default RoomTypeList;
