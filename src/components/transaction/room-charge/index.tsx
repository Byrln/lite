import { useContext, useState } from "react";
import { Box, Menu, MenuItem } from "@mui/material";
import Button from "@mui/material/Button";
import { format } from "date-fns";
import { useIntl } from "react-intl";

import CustomTable from "components/common/custom-table";
import { RoomChargeSWR } from "lib/api/charge";
import { ModalContext } from "lib/context/modal";
import { formatPrice } from "lib/utils/helpers";
import UpdateRateType from "./update-rate-type";
import UpdatePox from "./update-pox";
import UpdateRate from "./update-rate";

const RoomCharge = ({ TransactionID, RoomTypeID }: any) => {
    const intl = useIntl();
    const { handleModal }: any = useContext(ModalContext);
    const { data, error } = RoomChargeSWR({ TransactionID: TransactionID });
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
            title: intl.formatMessage({ id: 'roomCharge.date' }),
            key: "StayDate",
            dataIndex: "StayDate",
            __ignore__: true,
            excelRenderPass: true,
            render: (id: any, value: any, element: any, dataIndex: any) => {
                return format(new Date(value.replace(/ /g, "T")), "MM/dd/yyyy");
            },
        },
        {
            title: intl.formatMessage({ id: 'roomCharge.room' }),
            key: "RoomFullNo",
            dataIndex: "RoomFullNo",
        },
        {
            title: intl.formatMessage({ id: 'roomCharge.rateType' }),
            key: "RateTypeName",
            dataIndex: "RateTypeName",
        },
        {
            title: intl.formatMessage({ id: 'roomCharge.pax' }),
            key: "Pax",
            dataIndex: "Pax",
        },
        {
            title: intl.formatMessage({ id: 'roomCharge.charge' }),
            key: "Charge",
            dataIndex: "Charge",
            __ignore__: true,
            excelRenderPass: true,
            render: (id: any, value: any, element: any, dataIndex: any) => {
                return formatPrice(value);
            },
        },
        {
            title: intl.formatMessage({ id: 'roomCharge.tax' }),
            key: "Tax",
            dataIndex: "Tax",
            render: (id: any, value: any, element: any, dataIndex: any) => {
                return formatPrice(value);
            },
        },
        {
            title: intl.formatMessage({ id: 'roomCharge.totalAmount' }),
            key: "RateAmount",
            dataIndex: "RateAmount",
            render: (id: any, value: any, element: any, dataIndex: any) => {
                return formatPrice(value);
            },
        },
        {
            title: intl.formatMessage({ id: 'roomCharge.user' }),
            key: "UserName",
            dataIndex: "UserName",
        },
        {
            title: intl.formatMessage({ id: 'roomCharge.actions' }),
            key: "Action",
            dataIndex: "Action",
            width: 250,
            __ignore__: true,
            excelRenderPass: true,
            render: (id: any, value: any, element: any, dataIndex: any) => {
                return (
                    <>
                        {element && element.IsEdit == true && (
                            <Button
                                aria-controls={`menu${id}`}
                                variant={"outlined"}
                                size="small"
                                onClick={(e) => handleClick(e, element)}
                            >
                                {intl.formatMessage({ id: 'common.actions' })}
                            </Button>
                        )}
                        <Menu
                            id={`menu${id}`}
                            anchorEl={anchorEl}
                            open={Boolean(anchorEl)}
                            onClose={handleClose}
                        >
                            <>
                                <MenuItem
                                    key={`updateRate${id}`}
                                    onClick={() => {
                                        handleModal(
                                            true,
                                            intl.formatMessage({ id: 'roomCharge.updateRateType' }),
                                            <UpdateRateType
                                                element={selectedRow}
                                                RoomTypeID={RoomTypeID}
                                            />,
                                            null,
                                            "small"
                                        );
                                        handleClose();
                                    }}
                                >
                                    {intl.formatMessage({ id: 'roomCharge.updateRateType' })}
                                </MenuItem>
                                <MenuItem
                                    key={`updatePox${id}`}
                                    onClick={() => {
                                        handleModal(
                                            true,
                                            intl.formatMessage({ id: 'roomCharge.updatePax' }),
                                            <UpdatePox
                                                element={selectedRow}
                                                RoomTypeID={RoomTypeID}
                                            />,
                                            null,
                                            "small"
                                        );
                                        handleClose();
                                    }}
                                >
                                    {intl.formatMessage({ id: 'roomCharge.updatePax' })}
                                </MenuItem>

                                <MenuItem
                                    key={`updateRate${id}`}
                                    onClick={() => {
                                        handleModal(
                                            true,
                                            intl.formatMessage({ id: 'roomCharge.updateRate' }),
                                            <UpdateRate
                                                element={selectedRow}
                                                RoomTypeID={RoomTypeID}
                                            />,
                                            null,
                                            "small"
                                        );
                                        handleClose();
                                    }}
                                >
                                    {intl.formatMessage({ id: 'roomCharge.updateRate' })}
                                </MenuItem>
                            </>
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
                modalTitle={intl.formatMessage({ id: 'roomCharge.title' })}
                excelName={intl.formatMessage({ id: 'roomCharge.title' })}
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
