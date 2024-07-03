import CustomTable from "components/common/custom-table";
import { useIntl } from "react-intl";
import { ExtraChargeListSWR } from "lib/api/extra-charge-list";

const ExtraChargeList = ({ title, search }: any) => {
    const intl = useIntl();
    const columns = [
        { title: "№", key: "Nn", dataindex: "Nn" },
        { title: intl.formatMessage({id:"RowHeaderItemName"}),  key: "RowHeaderItemName", dataindex: "RowHeaderItemName" },
        { title: intl.formatMessage({id:"RowHeaderItemCode"}),key: "RowHeaderItemCode", dataindex: "RowHeaderItemCode" },
        { title: intl.formatMessage({id:"RowHeaderLocation"}), key: "RowHeaderLocation", dataindex: "RowHeaderLocation" },
        { title: intl.formatMessage({id:"DeclaredAccountNumber"}), key: "DeclaredAccountNumber", dataindex: "DeclaredAccountNumber" },
        {title: intl.formatMessage({id:"RowHeaderFolioNo"}), key: "RowHeaderFolioNo", dataindex: "RowHeaderFolioNo" },
        {title: intl.formatMessage({id:"ReportGroupName"}), key: "ReportGroupName", dataindex: "ReportGroupName" },
        { title: intl.formatMessage({id:"RowHeaderQuantity"}),  key: "RowHeaderQuantity", dataindex: "RowHeaderQuantity" },
        {  title: intl.formatMessage({id:"RowHeaderIsService"}),  key: "RowHeaderIsService", dataindex: "RowHeaderIsService" },
        {  title: intl.formatMessage({id:"RowHeaderTotalAmount"}), key: "RowHeaderTotalAmount", dataindex: "RowHeaderTotalAmount" },
        {  title: intl.formatMessage({id:"RowHeaderIsService"}),  key: "RowHeaderIsService", dataindex: "RowHeaderIsService" },
        {  title: intl.formatMessage({id:"RowHeaderDate"}),  key: "RowHeaderDate", dataindex: "RowHeaderDate" },
    ];
    const { data, error } = ExtraChargeListSWR(search);
    return (
        <div>
            {title}
            <CustomTable id="Nn" data={data} error={error} columns={columns} />
        </div>
    );
};
export default ExtraChargeList;
