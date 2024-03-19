import { useContext, useState } from "react";
import { Box, Menu, MenuItem } from "@mui/material";
import Button from "@mui/material/Button";
import { format } from "date-fns";

import CustomTable from "components/common/custom-table";
import { RoomChargeSWR } from "lib/api/charge";
import { ModalContext } from "lib/context/modal";
import { formatPrice } from "lib/utils/helpers";
import UpdateRateType from "./update-rate-type";
import UpdatePox from "./update-pox";
import UpdateRate from "./update-rate";

const RoomCharge = ({ TransactionID, RoomTypeID }: any) => {
    const { handleModal }: any = useContext(ModalContext);
    const { data, error } = RoomChargeSWR(TransactionID);
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedRow, setSelectedRow] = useState<any>(null);

    const handleClick = (event: any, row: any) => {
        setAnchorEl(event.currentTarget);
        setSelectedRow(row);
    };

    const handleClose = () => {
        setAnchorEl(null);
        setSelectedRow(null);
    };

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
            __ignore__: true,
            excelRenderPass: true,
            render: (id: any, value: any, element: any, dataIndex: any) => {
                return format(new Date(value.replace(/ /g, "T")), "MM/dd/yyyy");
            },
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
            __ignore__: true,
            excelRenderPass: true,
            render: (id: any, value: any, element: any, dataIndex: any) => {
                return formatPrice(value);
            },
        },
        {
            title: "Татвар",
            key: "Tax",
            dataIndex: "Tax",
            render: (id: any, value: any, element: any, dataIndex: any) => {
                return formatPrice(value);
            },
        },
        {
            title: "Нийлбэр дүн",
            key: "RateAmount",
            dataIndex: "RateAmount",
            render: (id: any, value: any, element: any, dataIndex: any) => {
                return formatPrice(value);
            },
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
                            aria-controls={`menu${id}`}
                            variant={"outlined"}
                            size="small"
                            onClick={(e) => handleClick(e, element)}
                        >
                            Үйлдэл
                        </Button>
                        <Menu
                            id={`menu${id}`}
                            anchorEl={anchorEl}
                            open={Boolean(anchorEl)}
                            onClose={handleClose}
                        >
                            <MenuItem
                                key={`updateRate${id}`}
                                onClick={() => {
                                    handleModal(
                                        true,
                                        `Тариф өөрчлөх`,
                                        <UpdateRateType
                                            element={selectedRow}
                                            RoomTypeID={RoomTypeID}
                                        />,
                                        null,
                                        "large"
                                    );
                                    handleClose();
                                }}
                            >
                                Тариф өөрчлөх
                            </MenuItem>
                            <MenuItem
                                key={`updatePox${id}`}
                                onClick={() => {
                                    handleModal(
                                        true,
                                        `Хүний тоо өөрчлөх`,
                                        <UpdatePox
                                            element={selectedRow}
                                            RoomTypeID={RoomTypeID}
                                        />,
                                        null,
                                        "large"
                                    );
                                    handleClose();
                                }}
                            >
                                Хүний тоо өөрчлөх
                            </MenuItem>

                            <MenuItem
                                key={`updateRate${id}`}
                                onClick={() => {
                                    handleModal(
                                        true,
                                        `Үнэ өөрчлөх`,
                                        <UpdateRate
                                            element={selectedRow}
                                            RoomTypeID={RoomTypeID}
                                        />,
                                        null,
                                        "large"
                                    );
                                    handleClose();
                                }}
                            >
                                Үнэ өөрчлөх
                            </MenuItem>
                        </Menu>
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
