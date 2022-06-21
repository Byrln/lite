import CustomTable from "components/common/custom-table";
import {
    ExchangeRateSWR,
    ExchangeRateAPI,
    listUrl,
} from "lib/api/exchange-rate";
import NewEdit from "./new-edit";

const columns = [
    {
        title: "Reservation No",
        key: "ReservationNo",
        dataIndex: "ReservationNo",
    },
    {
        title: "Guest",
        key: "Guest",
        dataIndex: "Guest",
    },
    {
        title: "Room",
        key: "Room",
        dataIndex: "Room",
    },
    {
        title: "Rate Type",
        key: "RateType",
        dataIndex: "RateType",
    },
    {
        title: "Revervation Type",
        key: "RevervationType",
        dataIndex: "RevervationType",
    },
    {
        title: "Departure",
        key: "Departure",
        dataIndex: "Departure",
    },
    {
        title: "Total",
        key: "Total",
        dataIndex: "Total",
    },
    {
        title: "Deposit",
        key: "Deposit",
        dataIndex: "Deposit",
    },
];

const ExchangeRateList = ({ title }: any) => {
    const { data, error } = ExchangeRateSWR();

    return (
        <CustomTable
            columns={columns}
            data={data}
            error={error}
            api={ExchangeRateAPI}
            hasNew={true}
            hasUpdate={true}
            hasDelete={true}
            id="ExchangeRateID"
            listUrl={listUrl}
            modalTitle={title}
            modalContent={<NewEdit />}
            excelName={title}
        />
    );
};

export default ExchangeRateList;
