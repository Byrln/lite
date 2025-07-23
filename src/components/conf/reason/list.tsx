import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { format } from "date-fns";
import { useIntl } from "react-intl";
import CustomSearch from "components/common/custom-search";
import CustomTable from "components/common/custom-table";
import { ReasonSWR, ReasonAPI, listUrl } from "lib/api/reason";
import NewEdit from "./new-edit";
import Search from "./search";

const ReasonList = ({ title, setHasData = null }: any) => {
    const intl = useIntl();
    const validationSchema = yup.object().shape({
        ReasonTypeID: yup.string().nullable(),
    });
    const columns = [
        {
            title: intl.formatMessage({ id: "ReportReason" }),
            key: "ReasonName",
            dataIndex: "ReportReason",
        },
        {
            title: intl.formatMessage({ id: "ReportReason" }),
            key: "ReasonTypeName",
            dataIndex: "ReasonTypeName",
        },
        {
            title: intl.formatMessage({ id: "RowHeaderUserName" }),
            key: "UserName",
            dataIndex: "UserName",
        },
        {
            title: intl.formatMessage({ id: "RowHeaderChangedDate" }),
            key: "CreatedDate",
            excelRenderPass: true,
            renderCell: (element: any) => {
                return (element.row.CreatedDate && format(
                    new Date(element.row.CreatedDate.replace(/ /g, "T")),
                    "MM/dd/yyyy hh:mm:ss a"
                ));
            },
        },
        {
            title: intl.formatMessage({ id: "RowHeaderIPAddress" }),
            key: "IPAddress",
            dataIndex: "IPAddress",
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

    const { data, error } = ReasonSWR(search);

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
                api={ReasonAPI}
                hasNew={true}
                hasUpdate={false}
                hasShow={false}
                hasDelete={true}
                id="ReasonID"
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

export default ReasonList;
