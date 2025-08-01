import { format } from "date-fns";
import { useState, useContext } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import moment from "moment";
import { Button } from "@mui/material";
import Link from "next/link";
import { useIntl } from "react-intl";
import CustomSearch from "components/common/custom-search";
import CustomTable from "components/common/custom-table";
import { PackageSWR, PackageAPI, listUrl } from "lib/api/package";
import NewEdit from "./new-edit";
import { formatPrice } from "lib/utils/helpers";
import Search from "./search";
import { dateStringToObj } from "lib/utils/helpers";
import RoomList from "./room-list";

const PackageList = ({ title }: any) => {
    const intl = useIntl();
    // const { handleModal }: any = useContext(ModalContext);

    const columns = [
        {
            title: intl.formatMessage({id:"RowHeaderPackageName"}), 
            key: "PackageName",
            dataIndex: "PackageName",
        },
        {
            title: intl.formatMessage({id:"ReportNights"}), 
            key: "Nights",
            dataIndex: "Nights",
        },
        {
            title: intl.formatMessage({id:"TextBeginDate"}),
            key: "BeginDate",
            dataIndex: "BeginDate",
            excelRenderPass: true,
            renderCell: (element: any) => {
                return (element.row.BeginDate && format(
                    new Date(element.row.BeginDate.replace(/ /g, "T")),
                    "MM/dd/yyyy hh:mm:ss a"
                ));
            },
        },
        {
            title: intl.formatMessage({id:"TextEndDate"}),
            key: "EndDate",
            dataIndex: "EndDate",
            excelRenderPass: true,
            renderCell: (element: any) => {
                return (element.row.EndDate && format(
                    new Date(element.row.EndDate.replace(/ /g, "T")),
                    "MM/dd/yyyy hh:mm:ss a"
                ));
            },
        },
        {
            title: intl.formatMessage({id:"TextRoomCount"}),
            key: "RoomCount",
            dataIndex: "RoomCount",
        },
        {
            title: intl.formatMessage({id:"TextRoomAmount"}),
            key: "RoomAmount",
            dataIndex: "RoomAmount",
            excelRenderPass: true,
            renderCell: (element: any) => {
                return (
                    element.row.RoomAmount &&
                    formatPrice(element.row.RoomAmount)
                );
            },
        },
        {
            title: intl.formatMessage({id:"ExtraChargeAmount"}),
            key: "ExtraChargeAmount",
            dataIndex: "ExtraChargeAmount",
            excelRenderPass: true,
            renderCell: (element: any) => {
                return (
                    element.row.ExtraChargeAmount &&
                    formatPrice(element.row.ExtraChargeAmount)
                );
            },
        },
        {
            title: intl.formatMessage({id:"RowHeaderUserName"}),
            key: "UserName",
            dataIndex: "UserName",
        },
        {
            title: intl.formatMessage({id:"RowHeaderIPAddress"}),
            key: "IPAddress",
            dataIndex: "IPAddress",
        },
        {
            title: intl.formatMessage({id:"RowHeaderAction"}),
            key: "Action",
            dataIndex: "Action",
            excelRenderPass: true,
            renderCell: (element: any) => {
                return (
                    <>
                        <Link
                            key={element.id}
                            href={`/conf/package/room-list/${element.row.PackageID}`}
                            legacyBehavior>
                            <Button key={element.id}>Room List</Button>
                        </Link>
                        <Link
                            key={element.id}
                            href={`/conf/package/extra-charge/${element.row.PackageID}`}
                            legacyBehavior>
                            <Button key={element.id}>Extra Charge</Button>
                        </Link>
                    </>
                );
            },
        },
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

export default PackageList;
