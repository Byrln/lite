import { Box, Button } from "@mui/material";
import { useContext } from "react";
import { mutate } from "swr";
import { toast } from "react-toastify";

import { GroupSummarySWR, FolioAPI, listUrl } from "lib/api/folio";
import CustomTable from "components/common/custom-table";
import { ModalContext } from "lib/context/modal";
import NewEdit from "./new-edit";
import { useAppState } from "lib/context/app";

const RoomCharge = ({ GroupID, TransactionID }: any) => {
    const [state, dispatch]: any = useAppState();
    const { handleModal }: any = useContext(ModalContext);

    const { data, error } = GroupSummarySWR(GroupID);

    const columns = [
        {
            title: "№",
            key: "№",
            dataIndex: "№",
        },
        {
            title: "Тооцооны дугаар",
            key: "FolioNO",
            dataIndex: "FolioNO",
        },
        {
            title: "Өрөө",
            key: "RoomFullNo",
            dataIndex: "RoomFullNo",
        },
        {
            title: "Зочны нэр",
            key: "GuestName",
            dataIndex: "GuestName",
        },
        {
            title: "Өрөөний тооцоо",
            key: "RoomCharge",
            dataIndex: "RoomCharge",
        },
        {
            title: "Нэмэлт үйлчилгээ",
            key: "ExtraCharge",
            dataIndex: "ExtraCharge",
        },
        {
            title: "Төлсөн",
            key: "Paid",
            dataIndex: "Paid",
        },
        {
            title: "Үлд.төлбөр",
            key: "Balance",
            dataIndex: "Balance",
        },
        {
            title: "Үйлдэл",
            key: "Action",
            dataIndex: "Action",
            render: function render(id: any, record: any, element: any) {
                return (
                    <>
                        <Button
                            variant={"text"}
                            size="small"
                            onClick={() => {}}
                        >
                            Нэх.хэвлэх
                        </Button>
                        <Button
                            variant={"text"}
                            size="small"
                            onClick={() => {
                                handleModal(
                                    true,
                                    "Засах",
                                    <NewEdit
                                        TransactionID={element.TransactionID}
                                        FolioID={element.FolioID}
                                    />
                                );
                                dispatch({
                                    type: "isShow",
                                    isShow: null,
                                });
                                dispatch({
                                    type: "editId",
                                    editId: element.FolioID,
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

    const onChargeToOwner = async (GroupID: any) => {
        if (!confirm("Are you sure?")) {
            return;
        }
        var res = await FolioAPI.chargeToOwner(GroupID);
        await mutate("/api/Folio/Group/Summary");
        toast("Амжилттай");
    };

    return (
        <Box>
            <CustomTable
                columns={columns}
                data={data}
                error={error}
                modalTitle="Өрөөний тооцоо"
                excelName="Өрөөний тооцоо"
                pagination={false}
                datagrid={true}
                hasPrint={true}
                hasExcel={true}
                hasNew={false}
                hasUpdate={true}
                hasShow={false}
                id="FolioID"
                api={FolioAPI}
                listUrl={listUrl}
                additionalButtons={
                    <>
                        <Button key={1} onClick={() => {}}>
                            Е-баримт хэвлэх
                        </Button>
                        <Button key={2} onClick={() => {}}>
                            Нэх.хэвлэх
                        </Button>
                        <Button
                            key={3}
                            onClick={() => {
                                onChargeToOwner(GroupID);
                            }}
                        >
                            Тооцоог группын ахлагч руу
                        </Button>
                    </>
                }
            />
        </Box>
    );
};

export default RoomCharge;
