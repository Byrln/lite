import { useState, useContext } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import Button from "@mui/material/Button";
import { useIntl } from "react-intl";

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
    const intl = useIntl();
    const { handleModal }: any = useContext(ModalContext);

    const columns = [
        {
            title: intl.formatMessage({
                id: "RowHeaderGuestName",
            }),
            key: "GuestFullName",
            dataIndex: "GuestFullName",
        },
        {
            title: intl.formatMessage({
                id: "RowHeaderCountry",
            }),
            key: "CountryName",
            dataIndex: "CountryName",
        },
        {
            title: intl.formatMessage({
                id: "RowHeaderPhone",
            }),
            key: "Phone",
            dataIndex: "Phone",
        },
        {
            title: intl.formatMessage({
                id: "RowHeaderMobile",
            }),
            key: "Mobile",
            dataIndex: "Mobile",
        },
        {
            title: intl.formatMessage({
                id: "RowHeaderEmail",
            }),
            key: "Email",
            dataIndex: "Email",
        },

        {
            title: intl.formatMessage({
                id: "MenuVipStatus",
            }),
            key: "VipStatusName",
            dataIndex: "VipStatusName",
        },
        {
            title: intl.formatMessage({
                id: "RowHeaderAdditionalAction",
            }),
            key: "Action",
            dataIndex: "Action",
            width: 250,
            __ignore__: true,
            excelRenderPass: true,
            renderCell: (element: any) => {
                return (
                    <>
                        <Button
                            onClick={() => {
                                handleModal(
                                    true,
                                    intl.formatMessage({
                                        id: "ButtonUploadPicture",
                                    }),
                                    <CustomUpload GuestID={element.id} />,
                                    null,
                                    "large"
                                );
                            }}
                        >
                            {intl.formatMessage({
                                id: "ButtonUploadPicture",
                            })}
                        </Button>
                        <Button
                            onClick={() => {
                                handleModal(
                                    true,
                                    intl.formatMessage({
                                        id: "ButtonUploadDocument",
                                    }),
                                    <CustomUpload
                                        GuestID={element.id}
                                        IsDocument={true}
                                    />,
                                    null,
                                    "large"
                                );
                            }}
                        >
                            {intl.formatMessage({
                                id: "ButtonUploadDocument",
                            })}
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

export default GuestdatabaseList;
