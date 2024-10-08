import { useState, useContext } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button } from "@mui/material";
import { useIntl } from "react-intl";
import CustomSearch from "components/common/custom-search";
import ToggleChecked from "components/common/custom-switch";
import CustomTable from "components/common/custom-table";
import { UserSWR, UserAPI, listUrl } from "lib/api/user";
import NewEdit from "./new-edit";
import Search from "./search";
import SetPassword from "./set-password";
import { ModalContext } from "lib/context/modal";

const UserList = ({ title }: any) => {
    const intl = useIntl();
    const { handleModal }: any = useContext(ModalContext);

    const validationSchema = yup.object().shape({
        SearchStr: yup.string().nullable(),
        UserRoleID: yup.string().nullable(),
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

    const { data, error } = UserSWR(search);

    const columns = [
        {
            title: intl.formatMessage({ id: "RowHeaderUserName" }),
            key: "UserName",
            dataIndex: "UserName",
        },
        {
            title: intl.formatMessage({ id: "RowHeaderLoginName" }),
            key: "LoginName",
            dataIndex: "LoginName",
        },
        {
            title: intl.formatMessage({ id: "ConfigUserRole" }),
            key: "UserRoleName",
            dataIndex: "UserRoleName",
        },
        {
            title: intl.formatMessage({ id: "RowHeaderLanguage" }),
            key: "Language",
            dataIndex: "Language",
        },
        {
            title: intl.formatMessage({ id: "RowHeaderEmail" }),
            key: "Email",
            dataIndex: "Email",
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
                        api={UserAPI}
                        apiUrl="UpdateStatus"
                        mutateUrl={`${listUrl}`}
                    />
                );
            },
        },
        {
            title: intl.formatMessage({ id: "RowHeaderAdditionalAction" }),
            key: "RowHeaderAdditionalAction",
            dataIndex: "RowHeaderAdditionalAction",
            renderCell: (element: any) => {
                return (
                    <Button
                        key={element.id}
                        onClick={() =>
                            handleModal(
                                true,
                                `Захиалга`,
                                <SetPassword UserID={element.row.UserID} />,
                                null,
                                "small"
                            )
                        }
                    >
                        {intl.formatMessage({ id: "ButtonSetPassword" })}
                    </Button>
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
                api={UserAPI}
                hasNew={true}
                hasUpdate={true}
                hasDelete={true}
                id="UserID"
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
                modalsize="medium"
            />
        </>
    );
};

export default UserList;
