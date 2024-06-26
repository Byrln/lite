import { useState, useContext } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useIntl } from "react-intl";
import { Button } from "@mui/material";

import CustomSearch from "components/common/custom-search";
import CustomTable from "components/common/custom-table";
import {
    AccountingExtraChargeSWR,
    extraChargeUrl,
    AccountingExtraChargeAPI,
} from "lib/api/accounting-extra-charge";
import NewEdit from "./new-edit";
import Search from "./search";
import { ModalContext } from "lib/context/modal";
import { useAppState } from "lib/context/app";
import CustomSelect from "components/common/custom-select";

const ChargeList = ({ title }: any) => {
    const [state, dispatch]: any = useAppState();
    const { handleModal }: any = useContext(ModalContext);
    const intl = useIntl();
    const validationSchema = yup.object().shape({
        ReasonTypeID: yup.string().nullable(),
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

    const { data, error } = AccountingExtraChargeSWR(search);

    const columns = [
        {
            title: intl.formatMessage({
                id: "RowHeaderExtraCharge",
            }),
            key: "RoomChargeTypeName",
            dataIndex: "RoomChargeTypeName",
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
                id: "RowHeaderItemCode",
            }),
            key: "ItemCode",
            dataIndex: "ItemCode",
        },
        {
            title: intl.formatMessage({
                id: "RowHeaderLocation",
            }),
            key: "Location",
            dataIndex: "Location",
        },
        {
            title: intl.formatMessage({
                id: "TextExpenseAccountNo",
            }),
            key: "ExpenseAccountNo",
            dataIndex: "ExpenseAccountNo",
        },
        {
            title: intl.formatMessage({
                id: "RowHeaderIsService",
            }),
            key: "IsService",
            dataIndex: "IsService",
            excelRenderPass: true,
            renderCell: (element: any) => {
                return (
                    <CustomSelect
                        register={(value: any) => {}}
                        errors={{}}
                        field="IsService"
                        options={[
                            { key: 0, value: "" },
                            { key: 1, value: "Үйлчилгээ" },
                            { key: 2, value: "Материал" },
                        ]}
                        optionValue="key"
                        optionLabel="value"
                        entity={element.row}
                        disabled={true}
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
                                        RoomChargeTypeID={
                                            element.row.RoomChargeTypeID
                                        }
                                        handleModal={handleModal}
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
                                    editId: element.row.RoomChargeTypeID,
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
                api={AccountingExtraChargeAPI}
                hasNew={false}
                hasUpdate={false}
                hasShow={false}
                hasDelete={false}
                id="Nn"
                listUrl={extraChargeUrl}
                modalTitle={title}
                modalContent={<NewEdit />}
                excelName={title}
                search={
                    <CustomSearch
                        listUrl={extraChargeUrl}
                        search={search}
                        setSearch={setSearch}
                        handleSubmit={handleSubmit}
                        reset={reset}
                    >
                        <Search register={register} errors={errors} />
                    </CustomSearch>
                }
            />
        </>
    );
};

export default ChargeList;
