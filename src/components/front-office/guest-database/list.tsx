import { useState, useContext } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import Button from "@mui/material/Button";

import CustomTable from "components/common/custom-table";
import CustomSearch from "components/common/custom-search";
import {
    GuestdatabaseSWR,
    GuestdatabaseAPI,
    listUrl,
} from "lib/api/guest-database";
import NewEdit from "./new-edit";
import Search from "./search";
import CustomUpload from "components/common/custom-upload";
import { ModalContext } from "lib/context/modal";

const GuestdatabaseList = ({ title }: any) => {
    const { handleModal }: any = useContext(ModalContext);

    const columns = [
        {
            title: "Зочны нэр",
            key: "GuestFullName",
            dataIndex: "GuestFullName",
        },
        {
            title: "Улс",
            key: "CountryName",
            dataIndex: "CountryName",
        },
        {
            title: "Утас",
            key: "Phone",
            dataIndex: "Phone",
        },
        {
            title: "Гар утас",
            key: "Mobile",
            dataIndex: "Mobile",
        },
        {
            title: "Цах.шуудан",
            key: "Email",
            dataIndex: "Email",
        },

        {
            title: "ВИП төрөл",
            key: "VipStatusName",
            dataIndex: "VipStatusName",
        },
        {
            title: "Нэмэлт үйлдэл",
            key: "Action",
            dataIndex: "Action",
            render: function render(id: any, record: any) {
                return (
                    <>
                        <Button
                            onClick={() => {
                                handleModal(
                                    true,
                                    `Upload Picture`,
                                    <CustomUpload GuestID={id} />,
                                    null,
                                    "large"
                                );
                            }}
                        >
                            Upload Picture
                        </Button>
                        <Button
                            onClick={() => {
                                handleModal(
                                    true,
                                    `Upload Document`,
                                    <CustomUpload
                                        GuestID={id}
                                        IsDocument={true}
                                    />,
                                    null,
                                    "large"
                                );
                            }}
                        >
                            Upload Document
                        </Button>
                    </>
                );
            },
        },
    ];

    const validationSchema = yup.object().shape({
        GuestName: yup.string().nullable(),
        CountryID: yup.string().nullable(),
        Phone: yup.string().nullable(),
        GuestEmail: yup.string().nullable(),
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

    const { data, error } = GuestdatabaseSWR(search);

    return (
        <>
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

            <CustomTable
                columns={columns}
                data={data}
                error={error}
                api={GuestdatabaseAPI}
                hasNew={true}
                hasUpdate={true}
                //hasDelete={true}
                id="GuestID"
                listUrl={listUrl}
                modalTitle={title}
                modalContent={<NewEdit />}
                excelName={title}
            />
        </>
    );
};

export default GuestdatabaseList;
