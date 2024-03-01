import { Box, Button } from "@mui/material";
import { useContext, useState, useEffect } from "react";
import { format } from "date-fns";
import { Checkbox } from "@mui/material";

import { FolioItemSWR, FolioAPI, listUrl } from "lib/api/folio";
import CustomTable from "components/common/custom-table";
import { ModalContext } from "lib/context/modal";
import { formatPrice } from "lib/utils/helpers";
import NewEdit from "./new-edit";
import CutForm from "./cut";
import SplitForm from "./split";

import BillTo from "./bill-to";

const RoomCharge = ({ FolioID, TransactionID }: any) => {
    const { handleModal }: any = useContext(ModalContext);
    const [entity, setEntity] = useState<any>({});
    const [rerenderKey, setRerenderKey] = useState(0);

    const { data, error } = FolioItemSWR(FolioID);

    useEffect(() => {
        if (data) {
            setEntity(data);
        }
    }, [data]);

    const onCheckboxChange = (e: any) => {
        let tempEntity = [...entity];
        tempEntity.forEach(
            (element: any) => (element.isChecked = e.target.checked)
        );
        setEntity(tempEntity);
        setRerenderKey((prevKey) => prevKey + 1);
    };

    const columns = [
        {
            title: "№",
            key: "№",
            dataIndex: "№",
        },
        {
            title: "",
            key: "№",
            dataIndex: "№",
            withCheckBox: true,
            onChange: onCheckboxChange,
            render: function render(
                id: any,
                value: any,
                element: any,
                dataIndex: any
            ) {
                return (
                    <Checkbox
                        key={rerenderKey}
                        checked={
                            entity &&
                            entity[dataIndex] &&
                            entity[dataIndex].isChecked
                        }
                        onChange={(e: any) => {
                            let tempEntity = [...entity];
                            tempEntity[dataIndex].isChecked = e.target.checked;
                            setEntity(tempEntity);
                        }}
                    />
                );
            },
        },
        {
            title: "Огноо",
            key: "CurrDate",
            dataIndex: "CurrDate",
            __ignore__: true,
            excelRenderPass: true,
            renderCell: (element: any) => {
                return format(
                    new Date(element.row.CurrDate.replace(/ /g, "T")),
                    "MM/dd/yyyy"
                );
            },
        },
        {
            title: "Өрөө",
            key: "RoomFullName",
            dataIndex: "RoomFullName",
        },
        {
            title: "Хэлбэр",
            key: "ItemName",
            dataIndex: "ItemName",
        },
        {
            title: "Дүн",
            key: "Amount1",
            dataIndex: "Amount1",
            __ignore__: true,
            excelRenderPass: true,
            renderCell: (element: any) => {
                return formatPrice(element.row.Amount1);
            },
        },
        {
            title: "Тайлбар",
            key: "Description",
            dataIndex: "Description",
        },
        {
            title: "Хэрэглэгч",
            key: "Username",
            dataIndex: "Username",
        },
    ];

    return (
        <Box>
            <CustomTable
                columns={columns}
                data={data}
                error={error}
                modalTitle="Өрөөний тооцоо"
                excelName="Өрөөний тооцоо"
                pagination={false}
                datagrid={false}
                hasPrint={false}
                hasExcel={false}
                hasNew={true}
                hasUpdate={true}
                id="CurrID"
                modalContent={
                    <NewEdit TransactionID={TransactionID} FolioID={FolioID} />
                }
                api={FolioAPI}
                listUrl={listUrl}
                additionalButtons={
                    <>
                        <Button
                            key={0}
                            onClick={() => {
                                handleModal(
                                    true,
                                    `Тооцоо хуваах`,
                                    <SplitForm
                                        FolioID={FolioID}
                                        TransactionID={TransactionID}
                                        handleModal={handleModal}
                                        entities={entity}
                                    />,
                                    null,
                                    "large"
                                );
                            }}
                        >
                            Тооцоо хуваах
                        </Button>

                        <Button
                            key={1}
                            onClick={() => {
                                handleModal(
                                    true,
                                    `Тооцоо салгах`,
                                    <CutForm
                                        FolioID={FolioID}
                                        handleModal={handleModal}
                                    />,
                                    null,
                                    "small"
                                );
                            }}
                        >
                            Тооцоо салгах
                        </Button>

                        <Button
                            key={2}
                            onClick={() => {
                                handleModal(
                                    true,
                                    `Bill To`,
                                    <BillTo
                                        TransactionID={TransactionID}
                                        FolioID={FolioID}
                                        handleModal={handleModal}
                                    />,
                                    null,
                                    "medium"
                                );
                            }}
                        >
                            Bill To
                        </Button>
                    </>
                }
            />
        </Box>
    );
};

export default RoomCharge;
