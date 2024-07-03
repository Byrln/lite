import { useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useIntl } from "react-intl";
import CustomSearch from "components/common/custom-search";
import ToggleChecked from "components/common/custom-switch";
import CustomTable from "components/common/custom-table";
import { UserRoleSWR, UserRoleAPI, listUrl } from "lib/api/user-role";
import NewEdit from "./new-edit";
import Search from "./search";



const UserRoleList = ({ title }: any) => {
    const intl = useIntl();
    const validationSchema = yup.object().shape({
        SearchStr: yup.string().nullable(),
    });
    const columns = [
        {
            title: intl.formatMessage({id:"RowHeaderShortCode"}), 
            key: "RowHeaderShortCode",
            dataIndex: "RowHeaderShortCode",
        },
        {
            title: intl.formatMessage({id:"ConfigUserRole"}), 
            key: "ConfigUserRole",
            dataIndex: "ConfigUserRole",
        },
        {
            title: intl.formatMessage({id:"RowHeaderDescription"}), 
            key: "RowHeaderDescription",
            dataIndex: "RowHeaderDescription",
        },
        {
            title: intl.formatMessage({id:"ReportStatus"}), 
            key: "ReportStatus",
            excelRenderPass: true,
            renderCell: (element: any) => {
                return (
                    <ToggleChecked
                        id={element.id}
                        checked={element.row.Status}
                        api={UserRoleAPI}
                        apiUrl="UpdateStatus"
                        mutateUrl={`${listUrl}`}
                    />
                );
            },
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

    const { data, error } = UserRoleSWR(search);

    return (
        <>
            <CustomTable
                columns={columns}
                data={data}
                error={error}
                api={UserRoleAPI}
                hasNew={true}
                hasUpdate={true}
                hasDelete={true}
                id="UserRoleID"
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

export default UserRoleList;
