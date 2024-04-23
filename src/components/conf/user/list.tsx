import { useState, useContext } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button } from "@mui/material";

import CustomSearch from "components/common/custom-search";
import ToggleChecked from "components/common/custom-switch";
import CustomTable from "components/common/custom-table";
import { UserSWR, UserAPI, listUrl } from "lib/api/user";
import NewEdit from "./new-edit";
import Search from "./search";
import SetPassword from "./set-password";
import { ModalContext } from "lib/context/modal";

const UserList = ({ title }: any) => {
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
            title: "Хэрэглэгчийн нэр",
            key: "UserName",
            dataIndex: "UserName",
        },
        {
            title: "Нэвтрэх нэр",
            key: "LoginName",
            dataIndex: "LoginName",
        },
        {
            title: "Хэрэглэгчийн төрөл",
            key: "UserRoleName",
            dataIndex: "UserRoleName",
        },
        {
            title: "Хэл",
            key: "Language",
            dataIndex: "Language",
        },
        {
            title: "Цах.шуудан",
            key: "Email",
            dataIndex: "Email",
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
                        api={UserAPI}
                        apiUrl="UpdateStatus"
                        mutateUrl={`${listUrl}`}
                    />
                );
            },
        },
        {
            title: "Нэмэлт үйлдэл",
            key: "Action",
            dataIndex: "Action",
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
                                "large"
                            )
                        }
                    >
                        Нууц үг солих
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
            />
        </>
    );
};

export default UserList;
