import { useIntl } from "react-intl";
import {
    AccountListSWR,
    AccountingAPI,
    accountListUrl,
} from "lib/api/accounting";
import CustomTable from "components/common/custom-table";

const AccountingList = ({ title }: any) => {
    const intl = useIntl();
    const columns = [
        {
            title: intl.formatMessage({id:"TextAccountName"}), 
            key: "AccountName",
            dataIndex: "AccountName",
        },
        {
            title: intl.formatMessage({id:"RowHeaderDebitAccount"}), 
            key: "AccountNo",
            dataindex: "AccountNo",
            renderCell: (element: any) =>
                element.row.IsDebit === false ? element.row.IsDebit : "",
        },
        {
            title: intl.formatMessage({id:"RowHeaderCreditAccount"}), 
            key: "Credit account",
            dataIndex: "Credit account",
            renderCell: (element: any) =>
                element.row.IsCredit === false ? element.row.IsCredit : "",
        },
    ];
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
