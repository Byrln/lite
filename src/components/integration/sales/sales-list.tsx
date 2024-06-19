import CustomTable from "components/common/custom-table";
import { SalesListSWR, salestListUrl } from "lib/api/salesList";
const columns = [
    {
        title: "Дансны нэр ",
        key: "AccountName",
        dataIndex: "AccountName",
    },
    {
        title: "Дебит данс ",
        key: "AccountNo",
        dataindex: "AccountNo",
        renderCell: (element: any) =>
            element.row.IsDebit === false ? element.row.IsDebit : "",
    },
    {
        title: "Кредит данс",
        key: "Credit account",
        dataIndex: "",
        renderCell: (element: any) =>
            element.row.IsCredit === false ? element.row.IsCredit : "",
    },
];
const SalesList = ({ title }: any) => {
    const { data, error } = SalesListSWR();
    return (
        <div>
            {title}

            <CustomTable
                id="AccountID"
                columns={columns}
                data={data}
                error={error}
            />
        </div>
    );
};

export default SalesList;
