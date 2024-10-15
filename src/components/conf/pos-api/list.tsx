import { useContext } from "react";
import { useIntl } from "react-intl";
import { Button, Stack } from "@mui/material";

import ToggleChecked from "components/common/custom-switch";
import CustomTable from "components/common/custom-table";
import { PosApiSWR, PosApiAPI, listUrl } from "lib/api/pos-api";
import NewEdit from "./new-edit";
import { ModalContext } from "lib/context/modal";
import Send from "./send";
import Info from "./info";
import ChargeType from "./extra-charge/charge-type";
import ChargeTypeGroup from "./extra-charge/charge-type-group";

const PosApiList = ({ title }: any) => {
    const intl = useIntl();
    const { data, error } = PosApiSWR();
    const { handleModal }: any = useContext(ModalContext);

    const columns = [
        {
            title: intl.formatMessage({
                id: "RowHeaderRegistryNo",
            }),
            key: "RegisterNo",
            dataIndex: "RegisterNo",
        },
        {
            title: intl.formatMessage({
                id: "RowHeaderCompanyName",
            }),
            key: "CompanyName",
            dataIndex: "CompanyName",
        },
        {
            title: intl.formatMessage({
                id: "RowHeaderBranchNo",
            }),
            key: "BranchNo",
            dataIndex: "BranchNo",
        },
        {
            title: intl.formatMessage({
                id: "RowHeaderDistrict",
            }),
            key: "DistrictName",
            dataIndex: "DistrictName",
        },
        {
            title: intl.formatMessage({
                id: "RowHeaderIsVat",
            }),
            key: "IsVat",
            dataIndex: "IsVat",
            excelRenderPass: true,
            renderCell: (element: any) => {
                return (
                    <ToggleChecked
                        id={element.row.PosApiID}
                        checked={element.row.IsVat}
                        disabled={true}
                    />
                );
            },
        },
        {
            title: intl.formatMessage({
                id: "RowHeaderIsCityTax",
            }),
            key: "IsCityTax",
            dataIndex: "IsCityTax",
            excelRenderPass: true,
            renderCell: (element: any) => {
                return (
                    <ToggleChecked
                        id={element.row.PosApiID}
                        checked={element.row.IsCityTax}
                        disabled={true}
                    />
                );
            },
        },
        {
            title: intl.formatMessage({
                id: "RowHeaderStatus",
            }),
            key: "Status",
            dataIndex: "Status",
            excelRenderPass: true,
            renderCell: (element: any) => {
                return (
                    <ToggleChecked
                        id={element.row.PosApiID}
                        checked={element.row.Status}
                        api={PosApiAPI}
                        apiUrl="UpdateStatus"
                        mutateUrl={`${listUrl}`}
                    />
                );
            },
        },
        {
            title: intl.formatMessage({ id: "RowHeaderAdditionalAction" }),
            key: "Action",
            dataIndex: "Action",
            width: "400",
            excelRenderPass: true,
            renderCell: (element: any) => {
                return (
                    <Stack direction="row" spacing={1}>
                        <Button
                            key={element.id}
                            onClick={() => {
                                handleModal(
                                    true,
                                    intl.formatMessage({
                                        id: "ButtonEdit",
                                    }),
                                    <NewEdit data={element.row} />,
                                    null,
                                    "small"
                                );
                            }}
                        >
                            {intl.formatMessage({
                                id: "ButtonEdit",
                            })}
                        </Button>

                        <Send HotelCode={element.row.HotelCode} />

                        <Button
                            key={element.id}
                            onClick={() => {
                                handleModal(
                                    true,
                                    intl.formatMessage({
                                        id: "ButtonAPIInfo",
                                    }),
                                    <Info HotelCode={element.row.HotelCode} />,
                                    null,
                                    "small"
                                );
                            }}
                        >
                            {intl.formatMessage({
                                id: "ButtonAPIInfo",
                            })}
                        </Button>
                    </Stack>
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
                api={PosApiAPI}
                hasNew={false}
                hasUpdate={false}
                hasDelete={false}
                hasShow={false}
                id="PosApiID"
                listUrl={listUrl}
                modalTitle={title}
                modalContent={<NewEdit />}
                excelName={title}
                additionalButtons={
                    <>
                        <Button
                            variant="contained"
                            onClick={() => {
                                handleModal(
                                    true,
                                    intl.formatMessage({
                                        id: "ButtonSettings",
                                    }),

                                    <ChargeType handleModal={handleModal} />,
                                    null,
                                    "medium"
                                );
                            }}
                            style={{ width: "100px" }}
                        >
                            {intl.formatMessage({
                                id: "ButtonSettings",
                            })}
                        </Button>
                        <Button
                            variant="contained"
                            onClick={() => {
                                handleModal(
                                    true,
                                    intl.formatMessage({
                                        id: "ButtonOther",
                                    }),

                                    <ChargeTypeGroup
                                        handleModal={handleModal}
                                        data={data}
                                    />,
                                    null,
                                    "medium"
                                );
                            }}
                            style={{ width: "100px", marginLeft: "20px" }}
                        >
                            {intl.formatMessage({
                                id: "ButtonOther",
                            })}
                        </Button>
                    </>
                }
            />
        </>
    );
};

export default PosApiList;
