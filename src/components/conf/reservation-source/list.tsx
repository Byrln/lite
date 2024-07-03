import { format } from "date-fns";
import { useState, useContext } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Stack } from "@mui/material";
import { useIntl } from "react-intl";
import CustomSearch from "components/common/custom-search";
import ToggleChecked from "components/common/custom-switch";
import CustomTable from "components/common/custom-table";
import {
    ReservationSourceSWR,
    ReservationSourceAPI,
    listUrl,
} from "lib/api/reservation-source";
import NewEdit from "./new-edit";
import Search from "./search";
import BeLink from "./link";
import ReservationStatus from "./reservation-status";
import { ModalContext } from "lib/context/modal";

const ReservationSourceList = ({ title }: any) => {
    const intl = useIntl();
    const { handleModal }: any = useContext(ModalContext);

    const columns = [
        {
            title: intl.formatMessage({id:"ConfigReservationSource"}), 
            key: "ConfigReservationSource",
            dataIndex: "ConfigReservationSource",
        },
        {
            title: intl.formatMessage({id:"RowHeaderChannel"}), 
            key: "RowHeaderChannel",
            dataIndex: "RowHeaderChannel",
        },
        {
            title: intl.formatMessage({id:"RowHeaderUserName"}), 
            key: "RowHeaderUserName",
            dataIndex: "RowHeaderUserName",
        },
        {
            title: intl.formatMessage({id:"RowHeaderChangedDate"}), 
            key: "RowHeaderChangedDate",
            dataIndex: "RowHeaderChangedDate",
            excelRenderPass: true,
            renderCell: (element: any) => {
                return (
                    element.row.CreatedDate &&
                    format(
                        new Date(element.row.CreatedDate.replace(/ /g, "T")),
                        "MM/dd/yyyy hh:mm:ss a"
                    )
                );
            },
        },
        {
            title: intl.formatMessage({id:"RowHeaderIPAddress"}), 
            key: "RowHeaderIPAddress",
            dataIndex: "RowHeaderIPAddress",
        },
        {
            title: intl.formatMessage({id:"ReportStatus"}), 
            key: "ReportStatus",
            dataIndex: "ReportStatus",
            excelRenderPass: true,
            renderCell: (element: any) => {
                return (
                    <ToggleChecked
                        id={element.id}
                        checked={element.row.Status}
                        api={ReservationSourceAPI}
                        apiUrl="UpdateStatus"
                        mutateUrl={`${listUrl}`}
                    />
                );
            },
        },
        {
            title: intl.formatMessage({id:"RowHeaderAdditionalAction"}), 
            key: "RowHeaderAdditionalAction",
            dataIndex: "RowHeaderAdditionalAction",
            excelRenderPass: true,
            renderCell: (element: any) => {
                return element.row.ChannelID == 2 ? (
                    <Stack direction="row" spacing={1}>
                        <Button
                            key={element.id}
                            onClick={() => {
                                handleModal(
                                    true,
                                    `Тохиргоо`,
                                    <ReservationStatus
                                        ChannelSourceID={
                                            element.row.ChannelSourceID
                                        }
                                    />,
                                    null,
                                    "large"
                                );
                            }}
                        >
                            Тохиргоо
                        </Button>

                        <Button
                            key={element.id}
                            onClick={() => {
                                handleModal(
                                    true,
                                    `Холбоос`,
                                    <BeLink
                                        ChannelSourceID={
                                            element.row.ChannelSourceID
                                        }
                                    />,
                                    null,
                                    "large"
                                );
                            }}
                        >
                            Холбоос
                        </Button>
                    </Stack>
                ) : (
                    <></>
                );
            },
        },
    ];

    const validationSchema = yup.object().shape({
        SearchStr: yup.string().nullable(),
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

    const { data, error } = ReservationSourceSWR(search);

    return (
        <>
            <CustomTable
                columns={columns}
                data={data}
                error={error}
                api={ReservationSourceAPI}
                hasNew={true}
                hasUpdate={true}
                hasDelete={true}
                id="ReservationSourceID"
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

export default ReservationSourceList;
