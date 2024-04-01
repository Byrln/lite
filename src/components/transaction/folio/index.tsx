import { Box, Button, Typography, Menu, MenuItem } from "@mui/material";
import { useContext, useState, useEffect } from "react";
import { format } from "date-fns";
import { Checkbox } from "@mui/material";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";

import { FolioItemSWR, FolioAPI, listUrl } from "lib/api/folio";
import CustomTable from "components/common/custom-table";
import FolioSelect from "components/select/folio";
import { ModalContext } from "lib/context/modal";
import { formatPrice } from "lib/utils/helpers";
import NewEdit from "./new-edit-test";
import CutForm from "./cut";
import SplitForm from "./split";
import BillTo from "./bill-to";
import EditFolioTransaction from "./edit-transaction";
import DeleteFolio from "./delete-folio";

const RoomCharge = ({ TransactionID }: any) => {
    const { handleModal }: any = useContext(ModalContext);
    const [entity, setEntity] = useState<any>({});
    const [rerenderKey, setRerenderKey] = useState(0);
    const [userTypeID, setUserTypeID]: any = useState(null);
    const [FolioID, setFolioID] = useState(0);
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedRow, setSelectedRow] = useState<any>(null);

    const handleClick = (event: any, row: any) => {
        console.log("row", row);
        setAnchorEl(event.currentTarget);
        setSelectedRow(row);
    };

    const handleClose = () => {
        setAnchorEl(null);
        setSelectedRow(null);
    };

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
    const validationSchema = yup.object().shape({});

    const formOptions = { resolver: yupResolver(validationSchema) };

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        resetField,
    } = useForm(formOptions);

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
            render: function render(id: any, record: any) {
                return format(
                    new Date(record.replace(/ /g, "T")),
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
            key: "Amount2",
            dataIndex: "Amount2",
            __ignore__: true,
            excelRenderPass: true,
            render: function render(id: any, record: any, entity: any) {
                return formatPrice(record);
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
        {
            title: "Үйлдэл",
            key: "Action",
            dataIndex: "Action",
            render: function render(id: any, value: any, entity: any) {
                return (
                    <>
                        <Button
                            aria-controls={`menu${entity.CurrID}`}
                            variant={"outlined"}
                            size="small"
                            onClick={(e) => handleClick(e, entity)}
                        >
                            Үйлдэл
                        </Button>
                        <Menu
                            id={`menu${entity.CurrID}`}
                            anchorEl={anchorEl}
                            open={Boolean(anchorEl)}
                            onClose={handleClose}
                        >
                            {selectedRow && (
                                <>
                                    <MenuItem
                                        key={`newOrder${selectedRow.CurrID}`}
                                        onClick={() => {
                                            handleModal(
                                                true,
                                                `Засах`,
                                                <div><EditFolioTransaction TransactionID={TransactionID} FolioID={selectedRow.FolioID} CurrID={selectedRow.CurrID} TypeID={selectedRow.TypeID} handleModal={handleModal}/></div>,
                                                null,
                                                "large"
                                            );handleClose();
                                        }}
                                    >
                                        Засах
                                    </MenuItem>
                                    <MenuItem
                                        key={`newOrder${selectedRow.CurrID}`}
                                        onClick={() => {
                                            handleModal(
                                                true,
                                                `Устгах`,
                                                <div><DeleteFolio TransactionID={TransactionID} FolioID={selectedRow.FolioID} CurrID={selectedRow.CurrID} TypeID={selectedRow.TypeID} handleModal={handleModal}/></div>,
                                                null,
                                                "large"
                                            );handleClose();
                                        }}
                                    >
                                        Устгах
                                    </MenuItem>
                                </>
                            )}
                        </Menu>
                    </>
                );
            },
        },
    ];

    useEffect(() => {
        const fetchDatas = async () => {
            if (FolioID) {
                try {
                    const response = await FolioAPI.items(FolioID);
                    setEntity(response);
                } finally {
                }
            }
        };

        fetchDatas();
    }, [FolioID]);

    return (
        <Box>
            <CustomTable
                columns={columns}
                data={entity ? entity : {}}
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
                    <NewEdit
                        TransactionID={TransactionID}
                        FolioID={FolioID}
                        handleModal={handleModal}
                    />
                }
                api={FolioAPI}
                listUrl={listUrl}
                additionalButtons={
                    <>
                        <Button
                            key={0}
                            variant={"outlined"}
                            className="mr-3"
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
                            variant={"outlined"}
                            className="mr-3"
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
                            variant={"outlined"}
                            className="mr-3"
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
                        <div style={{ width: "200px" }}>
                            <FolioSelect
                                register={register}
                                errors={errors}
                                TransactionID={TransactionID}
                                resetField={resetField}
                                onChange={setFolioID}
                            />
                        </div>
                    </>
                }
            />
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "row-reverse",
                    marginTop: "10px",
                }}
            >
                <Typography variant="subtitle1">
                    Үлдэгдэл{" "}
                    {entity && entity.length > 0
                        ? formatPrice(
                              entity.reduce(
                                  (acc: any, obj: any) =>
                                      Number(acc) + Number(obj.Amount2),
                                  0
                              )
                          )
                        : 0}
                </Typography>
            </Box>
        </Box>
    );
};

export default RoomCharge;
