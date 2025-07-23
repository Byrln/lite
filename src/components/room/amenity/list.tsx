import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useIntl } from "react-intl";
import Link from "next/link";
import { Icon } from "@iconify/react";

import CustomSearch from "components/common/custom-search";
import ToggleChecked from "components/common/custom-switch";
import CustomTable from "components/common/custom-table";
import { AmenitySWR, AmenityAPI, listUrl } from "lib/api/amenity";
import NewEdit from "./new-edit";
import Search from "./search";

const AmenityList = ({ title, setHasData = null }: any) => {
    const intl = useIntl();
    const columns = [
        {
            title: intl.formatMessage({ id: "AmenityTypeName" }),
            key: "AmenityTypeName",
            dataIndex: "AmenityTypeName",
        },
        {
            title: intl.formatMessage({ id: "AmenityShortName" }),
            key: "AmenityShortName",
            dataIndex: "AmenityShortName",
        },
        {
            title: intl.formatMessage({ id: "AmenityName" }),
            key: "AmenityName",
            dataIndex: "AmenityName",
        },
        {
            title: intl.formatMessage({ id: "SortOrder" }),
            key: "SortOrder",
            dataIndex: "SortOrder",
        },
        {
            title: intl.formatMessage({ id: "Left_SortByStatus" }),
            key: "Status",
            dataIndex: "Status",
            excelRenderPass: true,
            renderCell: (element: any) => {
                return (
                    <ToggleChecked
                        id={element.id}
                        checked={element.row.Status}
                        api={AmenityAPI}
                        apiUrl="UpdateStatus"
                        mutateUrl={`${listUrl}`}
                    />
                );
            },
        },
    ];
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

    const { data, error } = AmenitySWR(search);

    useEffect(() => {
        if (data && data.length > 0 && setHasData) {
            setHasData(true);
        }
    }, [data]);

    return (
        <>
            <div style={{ display: "flex", flexDirection: "row-reverse" }}>
                <Link
                    href="https://youtu.be/9Wma76JvzHE?si=_WaQU6ExCdgA9CNO"
                    passHref
                    target="_blank"
                    style={{
                        paddingLeft: "6px",
                        paddingRight: "6px",
                        paddingTop: "3px",
                    }}
                    legacyBehavior>

                    <Icon
                        icon="mdi:youtube"
                        color="#FF0000"
                        height={24}
                    />

                </Link>
            </div>
            <CustomTable
                columns={columns}
                data={data}
                error={error}
                api={AmenityAPI}
                hasNew={true}
                hasUpdate={true}
                hasDelete={true}
                id="AmenityID"
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

export default AmenityList;
