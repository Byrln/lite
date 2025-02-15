import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useIntl } from "react-intl";
import CustomSearch from "components/common/custom-search";
import ToggleChecked from "components/common/custom-switch";
import CustomTable from "components/common/custom-table";
import { ChargeTypeSWR, ChargeTypeAPI, listUrl } from "lib/api/charge-type";
import { formatPrice } from "lib/utils/helpers";
import NewEdit from "./new-edit";
import Search from "./search";

const ExtraChargeList = ({ title, setHasData = null }: any) => {
    const intl = useIntl();
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

    const { data, error } = ChargeTypeSWR(search);

    useEffect(() => {
        if (data && setHasData) {
            setHasData(true);
        }
    }, [data]);

    const columns = [
        {
            title: intl.formatMessage({ id: "RowHeaderExtraChargeGroup" }),
            key: "RoomChargeTypeGroupName",
            dataIndex: "RoomChargeTypeGroupName",
        },

        {
            title: intl.formatMessage({ id: "RowHeaderExtraCharge" }),
            key: "RoomChargeTypeName",
            dataIndex: "RoomChargeTypeName",
        },
        {
            title: intl.formatMessage({ id: "RowHeaderRate" }),
            key: "RoomChargeTypeRate",
            dataIndex: "RoomChargeTypeRate",
            excelRenderPass: true,
            renderCell: (element: any) => {
                return (
                    element.row.RoomChargeTypeRate &&
                    formatPrice(element.row.RoomChargeTypeRate)
                );
            },
        },
        {
            title: intl.formatMessage({ id: "RowHeaderEditable" }),
            key: "IsEditable",
            dataIndex: "IsEditable",
            excelRenderPass: true,
            renderCell: (element: any) => {
                return (
                    <ToggleChecked
                        id={element.id}
                        checked={element.row.IsEditable}
                        disabled={true}
                    />
                );
            },
        },
        {
            title: intl.formatMessage({ id: "SortOrder" }),
            key: "SortOrder",
            dataIndex: "SortOrder",
        },
        {
            title: intl.formatMessage({ id: "ReportStatus" }),
            key: "Status",
            dataIndex: "Status",
            excelRenderPass: true,
            renderCell: (element: any) => {
                return (
                    <ToggleChecked
                        id={element.id}
                        checked={element.row.Status}
                        api={ChargeTypeAPI}
                        apiUrl="UpdateStatus"
                        mutateUrl={`${listUrl}`}
                    />
                );
            },
        },
        {
            title: intl.formatMessage({ id: "RowHeaderInclusion" }),
            key: "Inclusion",
            dataIndex: "Inclusion",
            excelRenderPass: true,
            renderCell: (element: any) => {
                return (
                    <ToggleChecked
                        id={element.id}
                        checked={element.row.IsInclusion}
                        // api={ChargeTypeAPI}
                        // apiUrl="IsInclusion"
                        // mutateUrl={`${listUrl}`}
                    />
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
                api={ChargeTypeAPI}
                hasNew={true}
                hasUpdate={true}
                hasDelete={true}
                id="RoomChargeTypeID"
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

export default ExtraChargeList;
