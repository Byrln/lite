import { useState, useContext } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useIntl } from "react-intl";
import { Button } from "@mui/material";

import CustomSearch from "components/common/custom-search";
import CustomTable from "components/common/custom-table";
import {
    AccountListSWR,
    accountListUrl,
    AccountingAPI,
} from "lib/api/accounting";
import NewEdit from "./new-edit";
import Search from "./search";
import ToggleChecked from "components/common/custom-switch";
import { ModalContext } from "lib/context/modal";
import { useAppState } from "lib/context/app";

const AccountList = ({ title }: any) => {
    const [state, dispatch]: any = useAppState();
    const intl = useIntl();
    const { handleModal }: any = useContext(ModalContext);

    const validationSchema = yup.object().shape({
        CustomerGroupID: yup.string().nullable(),
        CustomerID: yup.string().nullable(),
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

    const { data, error } = AccountListSWR(search);

    const columns = [
        {
            title: intl.formatMessage({
                id: "RowHeaderAccountName",
            }),
            key: "AccountName",
            dataIndex: "AccountName",
        },
        {
            title: intl.formatMessage({
                id: "RowHeaderAccountNo",
            }),
            key: "AccountNo",
            dataIndex: "AccountNo",
        },
        {
            title: intl.formatMessage({
                id: "RowHeaderGroupName",
            }),
            key: "GroupName",
            dataIndex: "GroupName",
        },
        {
            title: intl.formatMessage({
                id: "RowHeaderItemName",
            }),
            key: "ItemName",
            dataIndex: "ItemName",
        },
        {
            title: intl.formatMessage({
                id: "RowHeaderRoomType",
            }),
            key: "RoomTypeName",
            dataIndex: "RoomTypeName",
        },
        {
            title: intl.formatMessage({
                id: "RowHeaderRoom",
            }),
            key: "RoomNo",
            dataIndex: "RoomNo",
        },
        {
            title: intl.formatMessage({
                id: "RowHeaderCurrencyCode",
            }),
            key: "CurrencyCode",
            dataIndex: "CurrencyCode",
        },
        {
            title: intl.formatMessage({
                id: "RowHeaderDebit",
            }),
            key: "IsDebit",
            dataIndex: "IsDebit",
            excelRenderPass: true,
            renderCell: (element: any) => {
                return (
                    <ToggleChecked
                        id={element.id}
                        checked={element.row.IsDebit}
                        // api={CustomerGroupAPI}
                        apiUrl="UpdateStatus"
                        // mutateUrl={`${listUrl}`}
                    />
                );
            },
        },
        {
            title: intl.formatMessage({
                id: "RowHeaderCredit",
            }),
            key: "IsCredit",
            dataIndex: "IsCredit",
            excelRenderPass: true,
            renderCell: (element: any) => {
                return (
                    <ToggleChecked
                        id={element.id}
                        checked={element.row.IsCredit}
                        // api={CustomerGroupAPI}
                        apiUrl="UpdateStatus"
                        // mutateUrl={`${listUrl}`}
                    />
                );
            },
        },
        {
            title: "Үйлдэл",
            key: "Action",
            dataIndex: "Action",
            renderCell: (element: any) => {
                return (
                    <>
                        <Button
                            variant={"outlined"}
                            size="small"
                            onClick={() => {
                                handleModal(
                                    true,
                                    "Засах",
                                    <NewEdit
                                        IsDebit={element.row.IsDebit}
                                        GroupID={element.row.GroupID}
                                        CurrencyID={element.row.CurrencyID}
                                        AccountID={element.row.AccountID}
                                        handleModal={handleModal}
                                        ItemID={element.row.ItemID}
                                    />,
                                    null,
                                    "large"
                                );
                                dispatch({
                                    type: "isShow",
                                    isShow: null,
                                });
                                dispatch({
                                    type: "editId",
                                    editId: element.row.AccountID,
                                });
                            }}
                        >
                            Засах
                        </Button>
                    </>
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
                api={AccountingAPI}
                hasNew={true}
                hasUpdate={false}
                hasShow={false}
                hasDelete={false}
                id="AccountID"
                listUrl={accountListUrl}
                modalTitle={title}
                modalContent={<NewEdit />}
                excelName={title}
                search={
                    <CustomSearch
                        listUrl={accountListUrl}
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

export default AccountList;
