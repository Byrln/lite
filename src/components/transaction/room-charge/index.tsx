import { useContext } from "react";
import { Box } from "@mui/material";
import Button from "@mui/material/Button";

import CustomTable from "components/common/custom-table";
import { RoomChargeSWR } from "lib/api/charge";
import { ModalContext } from "lib/context/modal";
import UpdateRateType from "./update-rate-type";
import UpdatePox from "./update-pox";
import UpdateRate from "./update-rate";

const RoomCharge = ({ TransactionID, RoomTypeID }: any) => {
    const { handleModal }: any = useContext(ModalContext);
    const { data, error } = RoomChargeSWR(TransactionID);

    const columns = [
        {
            title: "№",
            key: "№",
            dataIndex: "№",
        },
        {
            title: "Огноо",
            key: "StayDate",
            dataIndex: "StayDate",
        },
        {
            title: "Өрөө",
            key: "RoomFullNo",
            dataIndex: "RoomFullNo",
        },
        {
            title: "Тарифын төрөл",
            key: "RateTypeName",
            dataIndex: "RateTypeName",
        },
        {
            title: "Хүний тоо",
            key: "Pax",
            dataIndex: "Pax",
        },
        {
            title: "Тооцоо",
            key: "Charge",
            dataIndex: "Charge",
        },
        {
            title: "Татвар",
            key: "Tax",
            dataIndex: "Tax",
        },
        {
            title: "Нийлбэр дүн",
            key: "RateAmount",
            dataIndex: "RateAmount",
        },
        {
            title: "Хэрэглэгч",
            key: "UserName",
            dataIndex: "UserName",
        },
        {
            title: "Нэмэлт үйлдэл",
            key: "Action",
            dataIndex: "Action",
            width: 250,
            __ignore__: true,
            excelRenderPass: true,
            render: (id: any, value: any, element: any, dataIndex: any) => {
                return (
                    <>
                        <Button
                            onClick={() => {
                                handleModal(
                                    true,
                                    `Тариф өөрчлөх`,
                                    <UpdateRateType
                                        element={element}
                                        RoomTypeID={RoomTypeID}
                                    />,
                                    null,
                                    "large"
                                );
                            }}
                        >
                            Тариф өөрчлөх
                        </Button>

                        <Button
                            onClick={() => {
                                handleModal(
                                    true,
                                    `Хүний тоо өөрчлөх`,
                                    <UpdatePox
                                        element={element}
                                        RoomTypeID={RoomTypeID}
                                    />,
                                    null,
                                    "large"
                                );
                            }}
                        >
                            Хүний тоо өөрчлөх
                        </Button>

                        <Button
                            onClick={() => {
                                handleModal(
                                    true,
                                    `Үнэ өөрчлөх`,
                                    <UpdateRate
                                        element={element}
                                        RoomTypeID={RoomTypeID}
                                    />,
                                    null,
                                    "large"
                                );
                            }}
                        >
                            Үнэ өөрчлөх
                        </Button>
                    </>
                );
            },
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
                id="RoomChargeID"
            />
        </Box>
    );
};

export default RoomCharge;
