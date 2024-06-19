import {
    AccountListSWR,
    AccountingAPI,
    accountListUrl,
} from "lib/api/accounting";
import CustomTable from "components/common/custom-table";
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
const AccountingList = ({ title }: any) => {
    const { data, error } = AccountListSWR({});
    return (
        <div>
            {title}

            <CustomTable
                data={data}
                columns={columns}
                error={error}
                api={AccountingAPI}
                id="AccountID"
            />
        </div>
    );
};

export default AccountingList;
