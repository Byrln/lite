import { format } from "date-fns";
import { useState, useContext } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import moment from "moment";
import { Button } from "@mui/material";

import CustomSearch from "components/common/custom-search";
import CustomTable from "components/common/custom-table";
import { PackageSWR, PackageAPI, listUrl } from "lib/api/package";
import NewEdit from "./new-edit";
import { formatPrice } from "lib/utils/helpers";
import Search from "./search";
import { dateStringToObj } from "lib/utils/helpers";
import { ModalContext } from "lib/context/modal";

const PackageList = ({ title }: any) => {
    const { handleModal }: any = useContext(ModalContext);

    const columns = [
        {
            title: "Package Name",
            key: "PackageName",
            dataIndex: "PackageName",
        },
        {
            title: "Nights",
            key: "Nights",
            dataIndex: "Nights",
        },
        {
            title: "Begin Date",
            key: "BeginDate",
            dataIndex: "BeginDate",
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
            title: "End Date",
            key: "EndDate",
            dataIndex: "EndDate",
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
            title: "Room Count",
            key: "RoomCount",
            dataIndex: "RoomCount",
        },
        {
            title: "Room",
            key: "RoomAmount",
            dataIndex: "RoomAmount",
            render: function render(id: any, value: any) {
                return formatPrice(value);
            },
        },
        {
            title: "Extra Charge",
            key: "ExtraChargeAmount",
            dataIndex: "ExtraChargeAmount",
            render: function render(id: any, value: any) {
                return formatPrice(value);
            },
        },
        {
            title: "User Name",
            key: "UserName",
            dataIndex: "UserName",
        },
        {
            title: "IP Address",
            key: "IPAddress",
            dataIndex: "IPAddress",
        },
        // {
        //     title: "Нэмэлт үйлдэл",
        //     key: "Action",
        //     dataIndex: "Action",
        //     render: function render(id: any, record: any) {
        //         return (
        //             <>
        //                 <Button
        //                     onClick={() => {
        //                         handleModal(
        //                             true,
        //                             `Upload Picture`,
        //                             <>test</>,
        //                             null,
        //                             "large"
        //                         );
        //                     }}
        //                 >
        //                     Upload Picture
        //                 </Button>
        //             </>
        //         );
        //     },
        // },
    ];

    const validationSchema = yup.object().shape({
        SearchStr: yup.string().nullable(),
        BeginDate: yup.date().nullable(),
        EndDate: yup.date().nullable(),
    });
    const formOptions = { resolver: yupResolver(validationSchema) };
    const {
        reset,
        register,
        handleSubmit,
        formState: { errors },
        control,
    } = useForm(formOptions);

    const [search, setSearch] = useState({
        BeginDate: moment(
            dateStringToObj(
                moment(new Date(new Date().getFullYear(), 0, 1)).format(
                    "YYYY-MM-DD"
                )
            ),
            "YYYY-MM-DD"
        ),
        EndDate: moment(
            dateStringToObj(
                moment(new Date(new Date().getFullYear(), 11, 31)).format(
                    "YYYY-MM-DD"
                )
            ),
            "YYYY-MM-DD"
        ),
    });

    const { data, error } = PackageSWR(search);

    return (
        <>
            <Button
                onClick={() => {
                    handleModal(
                        true,
                        `Room List`,
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
                                api={PackageAPI}
                                hasNew={true}
                                hasUpdate={true}
                                id="PackageID"
                                listUrl={listUrl}
                                modalTitle={title}
                                modalContent={<NewEdit />}
                                excelName={title}
                            />
                        </>,
                        null,
                        "large"
                    );
                }}
            >
                Upload Picture
            </Button>
        </>
    );
};

export default PackageList;
