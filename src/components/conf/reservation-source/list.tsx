import { format } from "date-fns";
import { useState, useContext } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Stack } from "@mui/material";

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
    const { handleModal }: any = useContext(ModalContext);

    const columns = [
        {
            title: "Захиалгын эх сурвалж",
            key: "ReservationSourceName",
            dataIndex: "ReservationSourceName",
        },
        {
            title: "Суваг",
            key: "ChannelName",
            dataIndex: "ChannelName",
        },
        {
            title: "Хэрэглэгчийн нэр",
            key: "UserName",
            dataIndex: "UserName",
        },
        {
            title: "Огноо өөрчлөх",
            key: "CreatedDate",
            dataIndex: "CreatedDate",
            render: function render(id: any, value: any) {
                return (
                    value &&
                    format(
                        new Date(value.replace(/ /g, "T")),
                        "MM/dd/yyyy hh:mm:ss a"
                    )
                );
            },
        },
        {
            title: "Сүлжээний хаяг",
            key: "IPAddress",
            dataIndex: "IPAddress",
        },
        {
            title: "Төлөв",
            key: "Status",
            dataIndex: "Status",
            render: function render(id: any, value: any) {
                return (
                    <ToggleChecked
                        id={id}
                        checked={value}
                        api={ReservationSourceAPI}
                        apiUrl="UpdateStatus"
                        mutateUrl={`${listUrl}`}
                    />
                );
            },
        },
        {
            title: "Нэмэлт үйлдэл",
            key: "Action",
            dataIndex: "Action",
            render: function render(id: any, record: any, entity: any) {
                return entity.ChannelID == 2 ? (
                    <Stack direction="row" spacing={1}>
                        <Button
                            key={id}
                            onClick={() => {
                                handleModal(
                                    true,
                                    `Тохиргоо`,
                                    <ReservationStatus
                                        ChannelSourceID={entity.ChannelSourceID}
                                    />,
                                    null,
                                    "large"
                                );
                            }}
                        >
                            Тохиргоо
                        </Button>

                        <Button
                            key={id}
                            onClick={() => {
                                handleModal(
                                    true,
                                    `Холбоос`,
                                    <BeLink
                                        ChannelSourceID={entity.ChannelSourceID}
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
