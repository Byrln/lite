// import { format } from "date-fns";
import { useState, useContext, useEffect } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button } from "@mui/material";
import { format } from "date-fns";
import { useIntl } from "react-intl";
import { useRouter } from "next/router";

import CustomTable from "components/common/custom-table";
import CustomSearch from "components/common/custom-search";
import { ReservationSWR, ReservationAPI, listUrl } from "lib/api/reservation";
import NewEdit from "./new";
import Search from "./search";
import ReservationEdit from "components/front-office/reservation-list/edit";
import { ModalContext } from "lib/context/modal";

const DeparturedListList = ({ title, workingDate }: any) => {
    const router = useRouter();
    const { StatusGroup, StartDate, EndDate, ReservationTypeID } = router.query;
    const [rerenderKey, setRerenderKey] = useState(0);

    useEffect(() => {
        setRerenderKey((prevKey) => prevKey + 1);
    }, [StatusGroup, StartDate, EndDate, ReservationTypeID]);

    const intl = useIntl();

    const { handleModal }: any = useContext(ModalContext);

    const columns = [
        {
            title: intl.formatMessage({
                id: "RowHeaderReservationNo",
            }),
            key: "ReservationNo",
            dataIndex: "ReservationNo",
        },

        {
            title: intl.formatMessage({
                id: "RowHeaderArrival",
            }),
            key: "ArrivalDate",
            dataIndex: "ArrivalDate",
            renderCell: (element: any) => {
                return format(
                    new Date(element.row.ArrivalDate.replace(/ /g, "T")),
                    "MM/dd/yyyy"
                );
            },
        },
        {
            title: intl.formatMessage({
                id: "RowHeaderDeparture",
            }),
            key: "DepartureDate",
            dataIndex: "DepartureDate",
            renderCell: (element: any) => {
                return format(
                    new Date(element.row.DepartureDate.replace(/ /g, "T")),
                    "MM/dd/yyyy"
                );
            },
        },
        {
            title: intl.formatMessage({
                id: "RowHeaderGuest",
            }),
            key: "GuestName",
            dataIndex: "GuestName",
        },
        {
            title: intl.formatMessage({
                id: "RowHeaderRoom",
            }),
            key: "RoomFullName",
            dataIndex: "RoomFullName",
        },
        {
            title: intl.formatMessage({
                id: "RowHeaderCompany",
            }),
            key: "CustomerName",
            dataIndex: "CustomerName",
        },
        {
            title: intl.formatMessage({
                id: "RowHeaderTotalAmount",
            }),
            key: "TotalAmount",
            dataIndex: "TotalAmount",
        },
        {
            title: intl.formatMessage({
                id: "RowHeaderBalance",
            }),
            key: "CurrentBalance",
            dataIndex: "CurrentBalance",
        },

        {
            title: intl.formatMessage({
                id: "RowHeaderReservationType",
            }),
            key: "ReservationTypeName",
            dataIndex: "ReservationTypeName",
        },
        {
            title: intl.formatMessage({
                id: "RowHeaderUserName",
            }),
            key: "UserName",
            dataIndex: "UserName",
        },
        {
            title: intl.formatMessage({
                id: "RowHeaderAction",
            }),
            key: "Action",
            dataIndex: "Action",
            renderCell: (element: any) => {
                return (
                    <Button
                        key={element.id}
                        onClick={() =>
                            handleModal(
                                true,
                                `${intl.formatMessage({
                                    id: "ButtonEdit",
                                })}`,
                                <ReservationEdit
                                    transactionID={element.id}
                                    extendedProps={{
                                        GroupID: element.GroupID
                                            ? element.GroupID
                                            : null,
                                    }}
                                />,
                                null,
                                "large"
                            )
                        }
                    >
                        {intl.formatMessage({
                            id: "ButtonEdit",
                        })}
                    </Button>
                );
            },
        },
    ];

    const validationSchema = yup.object().shape({
        StartDate: yup.date().nullable(),
        EndDate: yup.date().nullable(),
        ReservationTypeID: yup.string().nullable(),
        ReservationSourceID: yup.string().nullable(),
        StatusGroup: yup.string().nullable(),
        GuestName: yup.string(),
        GuestPhone: yup.string(),
        GuestEmail: yup.string(),
        CustomerID: yup.string(),
    });
    const formOptions = {
        defaultValues: {
            StatusGroup: StatusGroup ? StatusGroup : "1",
            StartDate: StartDate ? StartDate : null,
            EndDate: EndDate ? EndDate : null,
            ReservationTypeID: ReservationTypeID ? ReservationTypeID : null,
        },
        resolver: yupResolver(validationSchema),
    };
    const {
        reset,
        register,
        handleSubmit,
        formState: { errors },
        control,
    } = useForm(formOptions);

    const [search, setSearch] = useState({
        StatusGroup: StatusGroup ? StatusGroup : "1",
        StartDate: StartDate ? StartDate : null,
        EndDate: EndDate ? EndDate : null,
        ReservationTypeID: ReservationTypeID ? ReservationTypeID : null,
    });

    const { data, error } = ReservationSWR(search);

    return (
        <>
            {rerenderKey && (
                <CustomTable
                    columns={columns}
                    data={data}
                    error={error}
                    api={ReservationAPI}
                    hasNew={true}
                    hasUpdate={false}
                    hasDelete={false}
                    hasShow={false}
                    id="TransactionID"
                    listUrl={listUrl}
                    modalTitle={title}
                    modalContent={<NewEdit workingDate={workingDate} />}
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
                    modalsize="medium"
                />
            )}
        </>
    );
};

export default DeparturedListList;
